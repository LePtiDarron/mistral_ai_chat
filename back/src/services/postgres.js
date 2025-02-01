const { Client } = require('pg');
require('dotenv').config();

const connect = async () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('No database URL found in .env');
  }

  const client = new Client({
    connectionString: connectionString
  });

  try {
    await client.connect();
  } catch (error) {
    console.error('Error connecting to PostgreSQL', error);
  }

  return client;
};

module.exports = { connect };
