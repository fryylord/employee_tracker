const mysql = require('mysql');
const inquirer = require('inquirer');
const init = require('init');
require('console.table');
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    port: 8001,
    user: 'process.env.username',
    password: 'process.env.password',
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

                case promptMessages.exit:
                    connection.end();
                    break;
            }
        });
}