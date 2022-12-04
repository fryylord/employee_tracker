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

