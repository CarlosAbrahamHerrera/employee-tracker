import { pool } from '../connection';
import { QueryResult } from 'pg';

interface Department {
  id: number;
  name: string;
}

interface Role {
  id: number;
  title: string;
  salary: number;
  department_id: number;
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  role_id: number;
  manager_id: number | null;
}

export const queries = {
  // View all departments
  viewAllDepartments: async (): Promise<Department[]> => {
    const result = await pool.query('SELECT * FROM department ORDER BY id');
    return result.rows;
  },

  // View all roles
  viewAllRoles: async () => {
    const result = await pool.query(`
      SELECT r.id, r.title, r.salary, d.name as department
      FROM role r
      JOIN department d ON r.department_id = d.id
      ORDER BY r.id
    `);
    return result.rows;
  },

  // View all employees
  viewAllEmployees: async () => {
    const result = await pool.query(`
      SELECT 
        e.id,
        e.first_name,
        e.last_name,
        r.title,
        d.name as department,
        r.salary,
        CONCAT(m.first_name, ' ', m.last_name) as manager
      FROM employee e
      LEFT JOIN role r ON e.role_id = r.id
      LEFT JOIN department d ON r.department_id = d.id
      LEFT JOIN employee m ON e.manager_id = m.id
      ORDER BY e.id
    `);
    return result.rows;
  },

  // Add a department
  addDepartment: async (name: string): Promise<Department> => {
    const result = await pool.query(
      'INSERT INTO department (name) VALUES ($1) RETURNING *',
      [name]
    );
    return result.rows[0];
  },

  // Add a role
  addRole: async (title: string, salary: number, departmentId: number): Promise<Role> => {
    const result = await pool.query(
      'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *',
      [title, salary, departmentId]
    );
    return result.rows[0];
  },

  // Add an employee
  addEmployee: async (employeeData: any): Promise<Employee> => {
    const { firstName, lastName, roleId, managerId } = employeeData;
    const result = await pool.query(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [firstName, lastName, roleId, managerId]
    );
    return result.rows[0];
  },

  // Update employee role
  updateEmployeeRole: async (employeeId: number, roleId: number): Promise<Employee> => {
    const result = await pool.query(
      'UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *',
      [roleId, employeeId]
    );
    return result.rows[0];
  },

  // Update employee's manager
  updateEmployeeManager: async (employeeId: number, managerId: number | null): Promise<Employee> => {
    const result = await pool.query(
      'UPDATE employee SET manager_id = $1 WHERE id = $2 RETURNING *',
      [managerId, employeeId]
    );
    return result.rows[0];
  },

  // View employees by manager
  viewEmployeesByManager: async (managerId: number) => {
    const result = await pool.query(`
      SELECT 
        e.id,
        e.first_name,
        e.last_name,
        r.title,
        d.name as department
      FROM employee e
      LEFT JOIN role r ON e.role_id = r.id
      LEFT JOIN department d ON r.department_id = d.id
      WHERE e.manager_id = $1
      ORDER BY e.id
    `, [managerId]);
    return result.rows;
  },

  // View employees by department
  viewEmployeesByDepartment: async (departmentId: number) => {
    const result = await pool.query(`
      SELECT 
        e.id,
        e.first_name,
        e.last_name,
        r.title
      FROM employee e
      JOIN role r ON e.role_id = r.id
      WHERE r.department_id = $1
      ORDER BY e.id
    `, [departmentId]);
    return result.rows;
  },

  // Delete department
  deleteDepartment: async (id: number): Promise<void> => {
    await pool.query('DELETE FROM department WHERE id = $1', [id]);
  },

  // Delete role
  deleteRole: async (id: number): Promise<void> => {
    await pool.query('DELETE FROM role WHERE id = $1', [id]);
  },

  // Delete employee
  deleteEmployee: async (id: number): Promise<void> => {
    await pool.query('DELETE FROM employee WHERE id = $1', [id]);
  },

  // View department budget
  viewDepartmentBudget: async (departmentId: number) => {
    const result = await pool.query(`
      SELECT 
        d.name as department,
        COALESCE(SUM(r.salary), 0) as total_budget
      FROM department d
      LEFT JOIN role r ON d.id = r.department_id
      LEFT JOIN employee e ON r.id = e.role_id
      WHERE d.id = $1
      GROUP BY d.name
    `, [departmentId]);
    return result.rows[0];
  }
}; 