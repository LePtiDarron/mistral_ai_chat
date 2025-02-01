const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const charRoute = require('./routes/chat');
const authRoute = require('./routes/auth');
const profileRoute = require('./routes/profile');
const conversationRoute = require('./routes/conversation');
const { connect } = require('./services/postgres');
const { createUserTable } = require('./models/user');
const { createConversationTable } = require('./models/conversation');

const app = express();
const port = 8000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());
app.use('/chat', charRoute);
app.use('/auth', authRoute);
app.use('/profile', profileRoute);
app.use('/conversation', conversationRoute);

let server;

const startServer = async () => {
  try {
    await connect()
      .then(() => {
        createUserTable();
        createConversationTable();
      })
      .catch((err) => console.error('Conexion to PostgreSQL failed', err));

    server = app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

    return server;
  } catch (error) {
    console.error('Error during server start:', error);
  }
};

const stopServer = () => {
  if (server) {
    server.close(() => {
      console.log('Server stopped');
    });
  } else {
    console.error('Server was not started');
  }
};

module.exports = { app, startServer, stopServer };
