require('dotenv').config({ path: "./newInfo.env"});
const mysql = require('mysql2');
const inquirer = require('inquirer');
const express = require('express');
const init = require('init');
require('console.table');

const PORT = process.env.PORT || 8001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.KEY,
    database: 'employees'
});

connection.connect(err => {
    if (err) throw err;
    mainPrompt();
});

function mainPrompt() {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View all employees',
                'Add employee',
                'Update employee role',
                'View all roles',
                'Add a role',
                'View all departments',
                'Add a department',
                'Quit'
            ]
        })
        .then(answer => {
            console.log('answer', answer);
            switch (answer.action) {
                case 'View all employees':
                    viewAllEmployees();
                    break;

                case 'Add employee':
                    addEmployee();
                    break;

                case 'Update employee role':
                    updateEmployeeRole();
                    break;

                case 'View all roles':
                    viewAllRoles();
                    break;

                case 'Add a role':
                    addRole();
                    break;

                case 'View all departments':
                    viewAllDepartments();
                    break;

                case 'Add a department':
                    addDepartment();
                    break;

                case 'Quit':
                    connection.end();
                    break;
            }
        });
}

const viewAllEmployees = () => {
    let sql =       `SELECT employee.id, 
                    employee.first_name, 
                    employee.last_name, 
                    role.title, 
                    department.name AS 'department', 
                    role.salary
                    FROM employee, role, department 
                    WHERE department.id = role.department_id 
                    AND role.id = employee.role_id
                    ORDER BY employee.id ASC`;
    connection.query(sql, (error, response) => {
      if (error) throw error;
      console.table(response);
      mainPrompt();})};

const addEmployee = () => {
    inquirer.prompt([{
        type: 'input',
        name: 'fistName',
        message: "What is the employee's first name?",
        validate: addFirstName => {
            if (addFirstName) {
                return true;
            } else {
                console.log('Please enter a first name');
                return false;
            }}},
        {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name?",
        validate: addLastName => {
          if (addLastName) {
                return true;
            } else {
                console.log('Please enter a last name');
                return false;
            }}}
        ])
        .then(answer => {
        const crit = [answer.fistName, answer.lastName]
        const roleSql = `SELECT role.id, role.title FROM role`;
        connection.query(roleSql, (error, data) => {
        if (error) throw error; 
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
        inquirer.prompt([
                {
                type: 'list',
                name: 'role',
                message: "What is the employee's role?",
                choices: roles
                }
                ])
                  .then(roleChoice => {
                    const role = roleChoice.role;
                    crit.push(role);
                    const managerSql =  `SELECT * FROM employee`;
                    connection.query(managerSql, (error, data) => {
                      if (error) throw error;
                      const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
                      inquirer.prompt([
                        {
                          type: 'list',
                          name: 'manager',
                          message: "Who is the employee's manager?",
                          choices: managers, 
                        }
                      ])
                        .then(managerChoice => {
                          const manager = managerChoice.manager;
                          crit.push(manager);
                          const sql =   `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                        VALUES (?, ?, ?, ?)`;
                          connection.query(sql, crit, (error) => {
                          if (error) throw error;
                          console.log("Employee has been added!")
                          viewAllEmployees();
                    });
                  });
                });
              });
           });
        });
      };