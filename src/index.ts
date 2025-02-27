import inquirer from 'inquirer';
import { queries } from './db/queries.js';
import { connectToDb } from './connection';
import { console as consoleTable } from 'console';

async function mainMenu() {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'Add Employee',
        'Update Employee Role',
        'Update Employee Manager',
        'View Employees by Manager',
        'View Employees by Department',
        'View All Roles',
        'Add Role',
        'Delete Role',
        'View All Departments',
        'Add Department',
        'Delete Department',
        'View Department Budget',
        'Exit'
      ]
    }
  ]);

  switch (choice) {
    case 'View All Employees':
      const employees = await queries.viewAllEmployees();
      console.table(employees);
      break;

      case 'Add Employee':
        const roles = await queries.viewAllRoles();
        const managers = await queries.viewAllEmployees();
        
        const employeeData = await inquirer.prompt([
          {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?"
          },
          {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?"
          },
          {
            type: 'list',
            name: 'roleId',
            message: "What is the employee's role?",
            choices: roles.map(role => ({
              name: role.title,
              value: role.id
            }))
          },
          {
            type: 'list',
            name: 'managerId',
            message: "Who is the employee's manager?",
            choices: [
              { name: 'None', value: null },
              ...managers.map(manager => ({
                name: `${manager.first_name} ${manager.last_name}`,
                value: manager.id
              }))
            ]
          }
        ]);
  
        await queries.addEmployee(employeeData);
        console.log('Employee added successfully!');
        break;

    case 'Update Employee Role':
      const currentEmployees = await queries.viewAllEmployees();
      const availableRoles = await queries.viewAllRoles();
      
      const { employeeId, newRoleId } = await inquirer.prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Which employee\'s role do you want to update?',
          choices: currentEmployees.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
          }))
        },
        {
          type: 'list',
          name: 'newRoleId',
          message: 'Which role do you want to assign to the selected employee?',
          choices: availableRoles.map(role => ({
            name: role.title,
            value: role.id
          }))
        }
      ]);
      await queries.updateEmployeeRole(employeeId, newRoleId);
      console.log('Employee role updated successfully!');
      break;

    case 'Update Employee Manager':
      const { employeeId: managerEmployeeId, newManagerId } = await inquirer.prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Which employee\'s manager do you want to update?',
          choices: currentEmployees.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
          }))
        },
        {
          type: 'list',
          name: 'newManagerId',
          message: 'Which employee should be the new manager?',
          choices: currentEmployees.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
          }))
        }
      ]);
      await queries.updateEmployeeManager(managerEmployeeId, newManagerId);
      console.log('Employee manager updated successfully!');
      break;

    case 'View Employees by Manager':
      const { managerId } = await inquirer.prompt([
        {
          type: 'list',
          name: 'managerId',
          message: 'Which manager would you like to view employees for?',
          choices: currentEmployees.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
          }))
        }
      ]);
      const employeesByManager = await queries.viewEmployeesByManager(managerId);
      console.table(employeesByManager);
      break;

    case 'View Employees by Department':
      const departments = await queries.viewAllDepartments();
      const { departmentId: viewDeptId } = await inquirer.prompt([
        {
          type: 'list',
          name: 'departmentId',
          message: 'Which department would you like to view employees for?',
          choices: departments.map(dept => ({
            name: dept.name,
            value: dept.id
          }))
        }
      ]);
      const employeesByDepartment = await queries.viewEmployeesByDepartment(viewDeptId);
      console.table(employeesByDepartment);
      break;

    case 'View All Roles':
      const rolesList = await queries.viewAllRoles();
      console.table(rolesList);
      break;

    case 'Add Role':
      const deptList = await queries.viewAllDepartments();
      const { title, salary } = await inquirer.prompt([
        {
          type: 'input',
          name: 'title',
          message: 'What is the title of the role?'
        },
        {
          type: 'number',
          name: 'salary',
          message: 'What is the salary for this role?'
        }
      ]);
      await queries.addRole(title, salary);
      console.log('Role added successfully!');
      break;

    case 'Delete Role':
      const { roleId } = await inquirer.prompt([
        {
          type: 'list',
          name: 'roleId',
          message: 'Which role would you like to delete?',
          choices: rolesList.map(role => ({
            name: role.title,
            value: role.id
          }))
        }
      ]);
      await queries.deleteRole(roleId);
      console.log('Role deleted successfully!');
      break;

    case 'View All Departments':
      const departmentsList = await queries.viewAllDepartments();
      console.table(departmentsList);
      break;

    case 'Add Department':
      const { departmentName } = await inquirer.prompt([
        {
          type: 'input',
          name: 'departmentName',
          message: 'What is the name of the department?'
        }
      ]);
      await queries.addDepartment(departmentName);
      console.log('Department added successfully!');
      break;

    case 'Delete Department':
      const { departmentId: deleteDeptId } = await inquirer.prompt([
        {
          type: 'list',
          name: 'departmentId',
          message: 'Which department would you like to delete?',
          choices: departmentsList.map(dept => ({
            name: dept.name,
            value: dept.id
          }))
        }
      ]);
      await queries.deleteDepartment(deleteDeptId);
      console.log('Department deleted successfully!');
      break;

    case 'View Department Budget':
      const { departmentId: budgetDeptId } = await inquirer.prompt([
        {
          type: 'list',
          name: 'departmentId',
          message: 'Which department would you like to view the budget for?',
          choices: departmentsList.map(dept => ({
            name: dept.name,
            value: dept.id
          }))
        }
      ]);
      const budget = await queries.viewDepartmentBudget(budgetDeptId);
      console.log(`The budget for the selected department is: $${budget}`);
      break;

    case 'Exit':
      console.log('Goodbye!');
      process.exit();
  }

  // Return to main menu unless user selected Exit
  if (choice !== 'Exit') {
    await mainMenu();
  }
}

// Start the application
const init = async () => {
  try {
    await connectToDb();
    console.log('Welcome to Employee Tracker!');
    await mainMenu();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

init(); 