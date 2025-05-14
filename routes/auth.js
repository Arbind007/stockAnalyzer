const express = require('express');
const router = express.Router();

const users = {}; // { username: password }

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users[username]) return res.status(400).json({ error: 'User already exists' });
  users[username] = password;
  res.json({ message: 'User registered' });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] !== password) return res.status(401).json({ error: 'Invalid credentials' });
  req.session.username = username;
  res.json({ message: 'Logged in' });
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
});

module.exports = router;