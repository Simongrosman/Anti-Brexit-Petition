DROP TABLE IF EXISTS signatures;
CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    signature TEXT NOT NULL
);

DROP TABLE IF EXISTS users;
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(100) NOT NULL,
    last VARCHAR(200) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    password VARCHAR(300) NOT NULL
);
