CREATE DATABASE shopusersDB;
USE shopusersDB;

CREATE TABLE users (
    id integer PRIMARY KEY AUTO_INCRIMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO users (name, email, password)
VALUES
("Patrick Tomas", "p.tomas14@gmail.com", "Helloworld");