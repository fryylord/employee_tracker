USE employees;

INSERT INTO department (name)
VALUES ("Customer Service");
INSERT INTO department (name)
VALUES ("Manufacturing");
INSERT INTO department (name)
VALUES ("Accounting");
INSERT INTO department (name)
VALUES ("Administration");

INSERT INTO role (title, salary, department)
VALUES ("Call Center Operator", 100000, 1);
INSERT INTO role (title, salary, department)
VALUES ("Floor Manager", 125000, 2);
INSERT INTO role (title, salary, department)
VALUES ("Assistant", 100000, 3);
INSERT INTO role (title, salary, department)
VALUES ("Accountant", 125000, 3);
INSERT INTO role (title, salary, department)
VALUES ("President", 200000, 4);

INSERT INTO employee (first_name, last_name, role, managerId)
VALUES ("Kefka", "Palazzo", 5, null);
INSERT INTO employee (first_name, last_name, role, managerId)
VALUES ("Terra", "Branford", 2, 1);
INSERT INTO employee (first_name, last_name, role, managerId)
VALUES ("Celes", "Chere", 3, null);
INSERT INTO employee (first_name, last_name, role, managerId)
VALUES ("Edgar", "Figaro", 4, 3);
INSERT INTO employee (first_name, last_name, role, managerId)
VALUES ("Cyan", "Garamonde", 5, 5);
INSERT INTO employee (first_name, last_name, role, managerId)
VALUES ("Setzer", "Gabbiani", 2, null);
INSERT INTO employee (first_name, last_name, role, managerId)
VALUES ("Sabin", "Figaro", 4, 7);
INSERT INTO employee (first_name, last_name, role, managerId)
VALUES ("Strago", "Magus", 1, 2);