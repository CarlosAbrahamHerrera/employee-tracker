# Employee Tracker

## Description
A command-line application to manage a company's employee database, built using Node.js, Inquirer, and PostgreSQL. This application allows business owners to view and manage departments, roles, and employees in their company.

## Features
### Core Features
- View all departments, roles, and employees
- Add departments, roles, and employees
- Update employee roles

### Bonus Features
- Update employee managers
- View employees by manager
- View employees by department
- Delete departments, roles, and employees
- View total utilized budget of a department

## Database Schema
### Department
- id: SERIAL PRIMARY KEY
- name: VARCHAR(30) UNIQUE NOT NULL

### Role
- id: SERIAL PRIMARY KEY
- title: VARCHAR(30) UNIQUE NOT NULL
- salary: DECIMAL NOT NULL
- department_id: INTEGER NOT NULL (Foreign Key)

### Employee
- id: SERIAL PRIMARY KEY
- first_name: VARCHAR(30) NOT NULL
- last_name: VARCHAR(30) NOT NULL
- role_id: INTEGER NOT NULL (Foreign Key)
- manager_id: INTEGER (Foreign Key, can be null)

## Installation & Setup
1. Make sure you have these installed on your computer:
   - Node.js
   - PostgreSQL

2. Set up the database:
   - Open your terminal
   - Type: `psql -U postgres`
   - When it asks for a password, type the one you created during PostgreSQL setup
   - Type: `CREATE DATABASE employee_tracker;`
   - Type: `\q` to exit

3. Configure environment:
   Create a `.env` file with your database credentials:
   ```
   DB_NAME=employee_tracker
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   ```

4. Get the program ready:
   - Open the terminal in the project folder
   - Type: `npm install` (this gets all the stuff the program needs)
   - Run the schema: `psql -U postgres -d employee_tracker -f src/db/schema.sql`
   - Run the seeds: `psql -U postgres -d employee_tracker -f src/db/seeds.sql`
   - Type: `npm start` to run the program

## Usage
- Use arrow keys to navigate the menu
- Press Enter to select an option
- Follow the prompts to:
  - View all departments, roles, or employees
  - Add new departments, roles, or employees
  - Update employee roles and managers
  - View employees by manager or department
  - Delete departments, roles, or employees
  - View department budgets

## Demo Video
https://vimeo.com/1060689230?share=copy

## Technologies Used
- Node.js
- TypeScript
- PostgreSQL
- Inquirer.js
- node-postgres (pg)
- dotenv

## Contributing
Feel free to submit issues and enhancement requests.

## License
This project is licensed under the ISC License.

## Questions
If you have any questions about the repo, open an issue or contact me directly at [your-email@example.com].

