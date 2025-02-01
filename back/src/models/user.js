const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const { connect } = require('../services/postgres');

const createUserTable = async () => {
  const client = await connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(100) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      username TEXT NOT NULL
    );
  `);
};

const createUser = async (email, password, username) => {
  const client = await connect();
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `
    INSERT INTO users (email, password, username) 
    VALUES ($1, $2, $3) 
    RETURNING *;
  `;
  const values = [email, hashedPassword, username];
  const result = await client.query(query, values);
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const client = await connect();
  const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const deleteUserById = async (id) => {
  const client = await connect();
  const query = 'DELETE FROM users WHERE id = $1 RETURNING *;';
  const values = [id];
  const result = await client.query(query, values);
  return result.rows[0];
};

const findUserById = async (id) => {
  const client = await connect();
  const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

module.exports = {
  findUserByEmail,
  findUserById,
  deleteUserById,
  createUser,
  createUserTable
};