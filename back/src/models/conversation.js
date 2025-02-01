const { connect } = require('../services/postgres');

const createConversationTable = async () => {
  const client = await connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS conversations (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      user_id INTEGER NOT NULL,
      messages JSONB NOT NULL DEFAULT '[]',
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
};

const createConversation = async (title, user_id, messages) => {
  const client = await connect();
  const query = `
    INSERT INTO conversations (title, user_id, messages)
    VALUES ($1, $2, $3) 
    RETURNING *;
  `;
  const values = [title, user_id, JSON.stringify(messages)];
  const result = await client.query(query, values);
  return result.rows[0];
};

const findConversationById = async (id) => {
  const client = await connect();
  const result = await client.query('SELECT * FROM conversations WHERE id = $1', [id]);
  if (result.rows.length > 0) {
    if (typeof result.rows[0].messages === "string") {
      try {
        result.rows[0].messages = JSON.parse(result.rows[0].messages);
      } catch (error) {
        console.error("Invalid JSON in database:", result.rows[0].messages);
        result.rows[0].messages = [];
      }
    }
    return result.rows[0];
  }
  return null;
};

const renameConversation = async (id, newTitle) => {
  const client = await connect();
  const query = 'UPDATE conversations SET title = $1 WHERE id = $2 RETURNING *;';
  const values = [newTitle, id];
  const result = await client.query(query, values);
  return result.rows[0];
};

const deleteConversationById = async (id) => {
  const client = await connect();
  const query = 'DELETE FROM conversations WHERE id = $1 RETURNING *;';
  const values = [id];
  const result = await client.query(query, values);
  return result.rows[0];
};

const findConversationsByUserId = async (user_id) => {
  const client = await connect();
  const result = await client.query('SELECT * FROM conversations WHERE user_id = $1 ORDER BY date DESC', [user_id]);
  result.rows.forEach(row => {
    if (typeof row.messages === "string") {
      try {
        row.messages = JSON.parse(row.messages);
      } catch (error) {
        console.error("Invalid JSON in database:", row.messages);
        row.messages = [];
      }
    }
  });
  return result.rows;
};

const addMessageToConversation = async (conversation_id, content, role) => {
  const client = await connect();
  const message = { content, role };

  const query = `
    UPDATE conversations 
    SET messages = messages || $1, 
        date = CURRENT_TIMESTAMP 
    WHERE id = $2 
    RETURNING *;
  `;
  const values = [JSON.stringify([message]), conversation_id];
  const result = await client.query(query, values);
  if (result.rows.length > 0) {
    if (typeof result.rows[0].messages === "string") {
      try {
        result.rows[0].messages = JSON.parse(result.rows[0].messages);
      } catch (error) {
        console.error("Invalid JSON in database:", result.rows[0].messages);
        result.rows[0].messages = [];
      }
    }
    return result.rows[0];
  }
  return null;
};


module.exports = {
  createConversationTable,
  createConversation,
  findConversationById,
  findConversationsByUserId,
  deleteConversationById,
  renameConversation,
  addMessageToConversation
};
