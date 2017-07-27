DROP TABLE IF EXISTS movie_users;
CREATE TABLE movie_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(40) UNIQUE,
  password VARCHAR(150)
);

DROP TABLE IF EXISTS search_history;
CREATE TABLE search_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES movie_users(id),
  search_term VARCHAR(150)
);
