//Dependencies
require('dotenv').config();
const mysql = require('mysql2');
const inquirer = require('inquirer');
const express = require('express');
require('console.table');
const app = express();

// Sets port for listening
const PORT = process.env.PORT || 8001;

//use functions for resource data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//establish connection with database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.KEY,
    database: 'employees'
});
connection.connect(err => {
    if (err) throw err;
    showBanner();
});

//Title banner for app
showBanner = () => {
  console.log("___________________________________")
  console.log("|                                 |")
  console.log("|            EMPLOYEE             |")
  console.log("|                                 |")
  console.log("|            MANAGER              |")
  console.log("|_________________________________|")
  mainPrompt();
};

//Main function for app, displays options for actions to take
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
                'Update manager for employee',
                'View all roles',
                'Add a role',
                'View all departments',
                'Add a department',
                'Delete an employee',
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
                                
                case 'Update manager for employee':
                    updateManager();
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

                case 'Delete an employee':
                    deleteEmployee();
                    break;

                case 'Quit':
                    connection.end();
                    break;
            }
        });
}

//Function for displaying all current employees
const viewAllEmployees = () => {
    let sql =       `SELECT employee.id, 
                    employee.first_name, 
                    employee.last_name, 
                    role.title, 
                    employee.manager_id,
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

//Function for adding a new employee
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

//Function for changing an employees role
updateEmployeeRole = () => {
  const employeeSql = `SELECT * FROM employee`;

  connection.query(employeeSql, (err, data) => {
    if (err) throw err; 

  const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Which employee would you like to update?",
        choices: employees
      }
    ])
      .then(empChoice => {
        const employee = empChoice.name;
        const params = []; 
        params.push(employee);

        const roleSql = `SELECT * FROM role`;

        connection.query(roleSql, (err, data) => {
          if (err) throw err; 

          const roles = data.map(({ id, title }) => ({ name: title, value: id }));
          
            inquirer.prompt([
              {
                type: 'list',
                name: 'role',
                message: "What is the employee's new role?",
                choices: roles
              }
            ])
                .then(roleChoice => {
                const role = roleChoice.role;
                params.push(role); 
                
                let employee = params[0]
                params[0] = role
                params[1] = employee 

                const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                connection.query(sql, params, (err, result) => {
                  if (err) throw err;
                console.log("Employee has been updated!");
              
                viewAllEmployees();
          });
        });
      });
    });
  });
};

//Function for displaying all existing roles
const viewAllRoles = () => {
  let sql = `SELECT * FROM role`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    console.table(response);
    mainPrompt();})};

//Function for creating a new role
addRole = () => {
  inquirer.prompt([
    {
      type: 'input', 
      name: 'role',
      message: "What role do you want to add?",
      validate: addRole => {
        if (addRole) {
            return true;
        } else {
            console.log('Please enter a role');
            return false;
        }
      }
    },
    {
      type: 'input', 
      name: 'salary',
      message: "What is the salary of this role?",
      validate: addSalary => {
        if (isNaN(addSalary)) {
            return false;
        } else {
            return true;
        }
      }
    }
  ])
    .then(answer => {
      const params = [answer.role, answer.salary];
      const roleSql = `SELECT name, id FROM department`; 

      connection.query(roleSql, (err, data) => {
        if (err) throw err; 
    
        const dept = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer.prompt([
        {
          type: 'list', 
          name: 'dept',
          message: "What department is this role in?",
          choices: dept
        }
        ])
          .then(deptChoice => {
            const dept = deptChoice.dept;
            params.push(dept);

            const sql = `INSERT INTO role (title, salary, department_id)
                        VALUES (?, ?, ?)`;

            connection.query(sql, params, (err, result) => {
              if (err) throw err;
              console.log('Added' + answer.role + " to roles!"); 

              viewAllRoles();
       });
     });
   });
 });
};

//Function for viewing all existing departments
const viewAllDepartments = () => {
  let sql = `SELECT * FROM department`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    console.table(response);
    mainPrompt();})
};

//Function for adding a new department
const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: 'newDepartment',
        type: 'input',
        message: 'What is the name of your new Department?',
      }
    ])
    .then((answer) => {
      let sql =     `INSERT INTO department (department.name) VALUES (?)`;
      connection.query(sql, answer.newDepartment, (error, response) => {
        if (error) throw error;
        viewAllDepartments();
      });
    });
};

//Part One of Employee Delete Function
//Gathers potential employees to delete and displays them in a table
function deleteEmployee() {
  console.log("Deleting an employee");

  var query =
    `SELECT e.id, e.first_name, e.last_name
      FROM employee e`

  connection.query(query, function (err, res) {
    if (err) throw err;

    const deleteEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
      value: id, name: `${id} ${first_name} ${last_name}`
    }));

    console.table(res);

    promptDeleteEmployee(deleteEmployeeChoices);
  });
}

//Part Two of Employee Delete Function
//Takes results of part one, offers them a choice 
function promptDeleteEmployee(deleteEmployeeChoices) {

  inquirer
    .prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee do you want to remove?",
        choices: deleteEmployeeChoices
      }
    ])
    .then(function (answer) {

      var query = `DELETE FROM employee WHERE ?`;
      connection.query(query, { id: answer.employeeId }, function (err, res) {
        if (err) {console.log('Employee still assigned as manager');
        mainPrompt()}
        else {console.table(viewAllEmployees());

        mainPrompt();}
      });
    });
}

//Function for changing the existing manager for a current employee
//Necessary so that you can unassign an employee as a manager if you wish to delete that employee
updateManager = () => {
  const employeeSql = `SELECT * FROM employee`;

  connection.query(employeeSql, (err, data) => {
    if (err) throw err; 

  const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Which employee would you like to update?",
        choices: employees
      }
    ])
      .then(empChoice => {
        const employee = empChoice.name;
        const params = []; 
        params.push(employee);

        const managerSql = `SELECT * FROM employee`;

          connection.query(managerSql, (err, data) => {
            if (err) throw err; 

          const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
            
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'manager',
                  message: "Who is the employee's manager?",
                  choices: managers
                }
              ])
                  .then(managerChoice => {
                    const manager = managerChoice.manager;
                    params.push(manager); 
                    
                    let employee = params[0]
                    params[0] = manager
                    params[1] = employee 
                    

                    const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;

                    connection.query(sql, params, (err, result) => {
                      if (err) throw err;
                    console.log("Employee has been updated!");
                  
                    viewAllEmployees();
          });
        });
      });
    });
  });
};