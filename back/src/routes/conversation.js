const express = require('express');
const { findConversationById, findConversationsByUserId, deleteConversationById, renameConversation } = require('../models/conversation');
const { findUserByEmail } = require('../models/user');
const router = express.Router();
const sessionToken = require('../middlewares/sessionToken');

router.use(sessionToken);

router.get('/', async (req, res) => {
  try {
    const user = await findUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    const conversations = await findConversationsByUserId(user.id);
    return res.status(200).json(conversations);
  } catch (error) {
    console.error('Erreur interne:', error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await findUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    const conversation = await findConversationById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    return res.status(200).json(conversation);
  } catch (error) {
    console.error('Erreur interne:', error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await findUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    const conversation = await findConversationById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    if (conversation.user_id === user.id) {
      await deleteConversationById(req.params.id);
      return res.status(200).json({ message: 'Conversation deleted successfully.' });
    } else {
      return res.status(403).json({ error: 'Not authorized.' });
    }
  } catch (error) {
    console.error('Erreur interne:', error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required.' });
    }

    const user = await findUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    const conversation = await findConversationById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    if (conversation.user_id === user.id) {
      const updatedConversation = await renameConversation(req.params.id, title);
      return res.status(200).json(updatedConversation);
    } else {
      return res.status(403).json({ error: 'Not authorized.' });
    }
  } catch (error) {
    console.error('Erreur interne:', error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports = router;
