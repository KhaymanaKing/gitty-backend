-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS GH_users;
DROP TABLE IF EXISTS posts;

CREATE TABLE GH_users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR NOT NULL,
    email VARCHAR,
    avatar VARCHAR
);

CREATE TABLE posts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    post VARCHAR (255)
);

INSERT INTO posts (
    post
)
VALUES 
('Hey man this is kinda of like twitter or something riGH_t? Like this is just a giant knock off a giant si-')