CREATE DATABASE IF NOT EXISTS usof;

USE usof;

ALTER TABLE users DROP FOREIGN KEY fk_users_roles_role_id;
ALTER TABLE posts DROP FOREIGN KEY fk_posts_users_author_id;

DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS categories;

CREATE TABLE IF NOT EXISTS users(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    profile_picture VARCHAR(255) NOT NULL DEFAULT 'avatar.png',
    rating VARCHAR(255) NOT NULL,
    role_id INT
);

CREATE TABLE IF NOT EXISTS roles(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS posts(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    author_id INT,
    title VARCHAR(255) NOT NULL,
    publish_date DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    status BOOLEAN NOT NULL,
    content VARCHAR(255) NOT NULL,
    categories
);

CREATE TABLE IF NOT EXISTS category(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,

)

-- fk_[referencing table name]_[referenced table name]_[referencing field name]
ALTER TABLE users ADD CONSTRAINT fk_users_roles_role_id FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE posts ADD CONSTRAINT fk_posts_users_author_id FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE;
