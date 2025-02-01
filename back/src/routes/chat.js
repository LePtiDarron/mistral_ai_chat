const axios = require('axios');
const express = require('express');
const router = express.Router();
require('dotenv').config();
const { findConversationById, createConversation, addMessageToConversation } = require('../models/conversation');
const { findUserByEmail } = require('../models/user');
const sessionToken = require('../middlewares/sessionToken');

router.use(sessionToken);

router.post('/', async (req, res) => {
  const { content, model } = req.body;

  if (!content) {
    return res.status(430).json({ error: "Missing field(s)." });
  }

  const allowedModels = ["codestral-2405", "codestral-latest"];
  if (!allowedModels.includes(model)) {
    return res.status(400).json({ error: "Invalid model specified." });
  }

  try {
    const user = await findUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    const randomSeed = Math.floor(Math.random() * 1000000);

    const response = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: model,
        temperature: 0.7,
        max_tokens: 500,
        random_seed: randomSeed,
        messages: [
          {
            role: "user",
            content: content,
          },
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const answer = response.data.choices[0]?.message?.content;
    if (!answer) {
      return res.status(410).json({ error: "Empty response." });
    }

    const title = content.length > 20 ? content.slice(0, 17) + '...' : content;
    const conversation = await createConversation(title, user.id, [{ content: content, role: "user" }, { content: answer, role: "assistant" }]);

    res.status(200).json({conversation});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.post('/:id', async (req, res) => {
  const { content, model } = req.body;

  if (!content) {
    return res.status(430).json({ error: "Missing field(s)." });
  }

  const allowedModels = ["codestral-2405", "codestral-latest"];
  if (!allowedModels.includes(model)) {
    return res.status(400).json({ error: "Invalid model specified." });
  }

  try {
    const user = await findUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const conversation = await findConversationById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    if (conversation.user_id !== user.id) {
      return res.status(403).json({ error: "You don't have permission to access this conversation." });
    }

    const conversationMessages = conversation.messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    conversationMessages.push({
      role: 'user',
      content: content,
    });

    const randomSeed = Math.floor(Math.random() * 1000000);

    const response = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: model,
        temperature: 0.7,
        max_tokens: 500,
        random_seed: randomSeed,
        messages: conversationMessages,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const answer = response.data.choices[0]?.message?.content;
    if (!answer) {
      return res.status(410).json({ error: "Empty response." });
    }

    const updatedConversation = await addMessageToConversation(conversation.id, content, 'user');
    const updatedAnswer = await addMessageToConversation(conversation.id, answer, 'assistant');

    res.status(200).json({conversation: updatedAnswer});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;
