DROP TABLE IF EXISTS movie_users;
CREATE TABLE movie_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(40) UNIQUE,
  password VARCHAR(150)
);
