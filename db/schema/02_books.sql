DROP TABLE IF EXISTS books CASCADE;

CREATE TABLE books
  (
    id SERIAL PRIMARY KEY NOT NULL,
    item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
    author VARCHAR(255) NOT NULL,
    pages SMALLINT,
    image VARCHAR(500),
    publication_year DATE,
    rating SMALLINT NOT NULL DEFAULT 0,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT FALSE
  );