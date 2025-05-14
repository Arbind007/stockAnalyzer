const express = require('express');
const router = express.Router();

const userFunds = {}; // { username: [{ name, amount, topTierRange }] }

function requireLogin(req, res, next) {
  if (!req.session.username) return res.status(401).json({ error: 'Login required' });
  next();
}

router.use(requireLogin);

router.get('/', (req, res) => {
  const funds = userFunds[req.session.username] || [];
  res.json({ funds });
});

router.post('/add', (req, res) => {
  const { name, amount, topTierRange } = req.body;
  const fund = { name, amount, topTierRange };
  if (!userFunds[req.session.username]) userFunds[req.session.username] = [];
  userFunds[req.session.username].push(fund);
  res.json({ message: 'Fund added' });
});

router.delete('/delete', (req, res) => {
  const { name } = req.body;
  userFunds[req.session.username] = (userFunds[req.session.username] || []).filter(f => f.name !== name);
  res.json({ message: 'Fund deleted' });
});

router.post('/updateAmount', (req, res) => {
  const { name, amountChange, action } = req.body;
  const funds = userFunds[req.session.username] || [];
  const fund = funds.find(f => f.name === name);
  if (!fund) return res.status(404).json({ error: 'Fund not found' });

  if (action === 'add') {
    fund.amount += amountChange;
  } else if (action === 'subtract') {
    fund.amount -= amountChange;
  } else {
    return res.status(400).json({ error: 'Invalid action. Use "add" or "subtract".' });
  }

  res.json({ message: 'Amount updated', fund });
});

module.exports = router;


module.exports = router;