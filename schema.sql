CREATE DATABASE shopusersDB;
USE shopusersDB;

CREATE TABLE users (
    id integer PRIMARY KEY AUTO_INCRIMENT,
    email VARCHAR(255) NOT NULL,
    pass VARCHAR(255) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO users (email, pass)
VALUES
(p.tomas14@gmail.com, Helloworld);