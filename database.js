/* eslint-disable camelcase */
//database functions
const bcrypt = require('bcrypt');

const addUser = function (user, db) {
  return db
    .query(
      `
  INSERT INTO users(email,password) VALUES($1,$2) RETURNING *;
`,
      [`${user.email}`, `${bcrypt.hashSync(user.password, 10)}`]
    )
    .then(data => {
      if (data.rows.length) {
        return data.rows[0];
      }
    });
};
const getUserByEmail = function (email, db) {
  return db.query(
    `
  SELECT * FROM users WHERE email=$1`,
    [`${email}`]
  );
};

// Get User by Id used to show a users email in the header.
const getUserById = function (id, db) {
  return db.query(
    `
  SELECT * FROM users WHERE id=$1`,
    [`${id}`]
  );
};

const getItemsToWatchById = function (user_id, db) {
  return db.query(
    `
    SELECT * FROM movies
    JOIN items
    ON movies.item_id = items.id
    JOIN users
    ON items.user_id = users.id
    WHERE users.id = $1 AND is_active = TRUE
    ORDER BY created_at DESC;
    `,
    [`${user_id}`]
  );
};

const getItemsToReadById = function (user_id, db) {
  return db.query(
    `
    SELECT * FROM books
    JOIN items
    ON books.item_id = items.id
    JOIN users
    ON items.user_id = users.id
    WHERE users.id = $1 AND is_active = TRUE
    ORDER BY created_at DESC;
    `,
    [`${user_id}`]
  );
};

const getItemsToBuyById = function (user_id, db) {
  return db.query(
    `
    SELECT * FROM products
    JOIN items
    ON products.item_id = items.id
    JOIN users
    ON items.user_id = users.id
    WHERE users.id = $1 AND is_active = TRUE
    ORDER BY created_at DESC;
    `,
    [`${user_id}`]
  );
};

const getPlacesToEatById = function (user_id, db) {
  return db.query(
    `
    SELECT * FROM restaurants
    JOIN items
    ON restaurants.item_id = items.id
    JOIN users
    ON items.user_id = users.id
    WHERE users.id = $1 AND is_active = TRUE
    ORDER BY created_at DESC;
    `,
    [`${user_id}`]
  );
};
const getMovieItemById = function (item_id, db) {
  return db.query(
    `
    SELECT * FROM items
    JOIN movies
    ON items.id = item_id
    WHERE item_id = $1;
    `,
    [`${item_id}`]
  );
};
const getRestaurantItemById = function (item_id, db) {
  return db.query(
    `
    SELECT * FROM items
    JOIN restaurants
    ON items.id = item_id
    WHERE item_id = $1;
    `,
    [`${item_id}`]
  );
};
const getBookItemById = function (item_id, db) {
  return db.query(
    `
    SELECT * FROM items
    JOIN books
    ON items.id = item_id
    WHERE item_id = $1;
    `,
    [`${item_id}`]
  );
};
const getProductItemById = function (item_id, db) {
  return db.query(
    `
    SELECT * FROM items
    JOIN products
    ON items.id = item_id
    WHERE item_id = $1;
    `,
    [`${item_id}`]
  );
};

const isDuplicateName = function (category, name, user_id, db) {
  console.log('DUPLICATE')
  return db
    .query(
      `
    SELECT * FROM ${category}
    JOIN items ON ${category}.item_id = items.id
    JOIN users ON items.user_id = users.id
    WHERE name=$1 AND users.id =$2
    `,
      [`${name}`, `${user_id}`]
    )
    .then(res => {
      if (res.rowCount > 0) {
        return true;
      } else {
        return false;
      }
    });
};

const addMovie = function (values, db) {
  return db.query(
    `
    INSERT INTO movies (
      item_id,
      name,
      director,
      rating,
      image,
      actors,
      description,
      duration,
      is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
    `,
    values
  );
};

const addBook = function (values, db) {
  return db.query(
    `
    INSERT INTO books (
      item_id,
      name,
      author,
      pages,
      image,
      publication_year,
      rating,
      description,
      is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
    `,
    values
  );
};

const addRestaurant = function (values, db) {
  return db.query(
    `
    INSERT INTO restaurants (
      item_id,
      name,
      street,
      city,
      province,
      post_code,
      rating,
      image,
      price_range,
      is_active
    )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  `,
    values
  );
};

const addProduct = function (values, db) {
  return db.query(
    `
    INSERT INTO products (
    item_id,
    name,
    link,

    image,
    description,
    is_active
    )
    VALUES($1, $2, $3, $4, $5, $6)
  `,
    values
  );
};

const changeCategory = function (currentCategory, item_id, newCategory, user_id, db) {
  return db.query(
    `
    SELECT name FROM ${newCategory}
    WHERE item_id =${item_id}
    `
  )
    .then(res => {
      if (res.rows[0].name.length > 0) {
        return db.query(
          `
          UPDATE ${currentCategory}
          SET is_active = FALSE
          FROM users
          WHERE item_id=$1 AND users.id=$2
        `,
          [item_id, user_id]
        )
          .then(() => {
            return db.query(
              `

              UPDATE ${newCategory}
              SET is_active = TRUE
              FROM users
              WHERE item_id=$1 AND users.id=$2
              `,
              [item_id, user_id]
            );
          });
      } else {
        return "this an error";
      }
    })
    .catch(error => {
      return new Error(error);
    });
};
const deleteItem = function (itemId, category, db) {

  db.query(`
DELETE FROM ${category}
WHERE item_id = ${itemId};
  `);
};

module.exports = {
  addUser,
  getUserByEmail,
  getUserById,
  getItemsToWatchById,
  getItemsToReadById,
  getItemsToBuyById,
  getPlacesToEatById,
  getMovieItemById,
  getRestaurantItemById,
  getBookItemById,
  getProductItemById,
  isDuplicateName,
  addMovie,
  addBook,
  addRestaurant,
  addProduct,
  changeCategory,
  deleteItem
};
