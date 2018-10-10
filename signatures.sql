DROP TABLE IF EXISTS users;
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(100) NOT NULL,
    last VARCHAR(200) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    password VARCHAR(300) NOT NULL
);

 DROP TABLE IF EXISTS user_profiles;
CREATE TABLE user_profiles (
   id SERIAL PRIMARY KEY,
   age INT,
   city VARCHAR,
   url VARCHAR(300),
   user_id INT NOT NULL UNIQUE
);


DROP TABLE IF EXISTS signatures;
CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    signature TEXT NOT NULL,
    user_id INT NOT NULL UNIQUE
);
