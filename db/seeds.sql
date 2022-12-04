USE employees;

INSERT INTO department (name)
VALUES ("Customer Service");
INSERT INTO department (name)
VALUES ("Manufacturing");
INSERT INTO department (name)
VALUES ("Accounting");
INSERT INTO department (name)
VALUES ("Administration");

INSERT INTO role (title, salary, department_id)
VALUES ("Call Center Operator", 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Floor Manager", 125000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Assistant", 100000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 125000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("President", 200000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Kefka", "Palazzo", 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Terra", "Branford", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Celes", "Chere", 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Edgar", "Figaro", 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Cyan", "Garamonde", 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Setzer", "Gabbiani", 2, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sabin", "Figaro", 4, 7);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Strago", "Magus", 1, 2);