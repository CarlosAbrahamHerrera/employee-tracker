-- First, add departments
INSERT INTO department (name)
VALUES 
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

-- Then add roles
INSERT INTO role (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);

-- Insert employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL),
  ('Mike', 'Chan', 2, 1),
  ('Ashley', 'Rodriguez', 3, NULL),
  ('Kevin', 'Tupik', 4, 3),
  ('Kunal', 'Singh', 5, NULL),
  ('Sarah', 'Lourd', 6, NULL),
  ('Tom', 'Allen', 7, 6); 