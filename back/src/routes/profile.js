const express = require('express');
const { findUserByEmail, deleteUserById } = require('../models/user');
const router = express.Router();
const sessionToken = require('../middlewares/sessionToken');

router.use(sessionToken);

router.get('/', async (req, res) => {
  try {
    const user = await findUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.status(200).json(user.username);
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong.' });
  }
});

router.delete('/', async (req, res) => {
  try {
    const user = await findUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    await deleteUserById(user.id)
    return res.status(200).json({message: "User deleted successfuly."});
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports = router;
