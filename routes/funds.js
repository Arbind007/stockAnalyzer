const express = require('express');
const router = express.Router();
const UserFund = require('../models/UserFund');

router.get('/', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(401).json({ error: 'User ID required' });
  const funds = await UserFund.find({ userId });
  res.json({ funds });
});

router.post('/add', async (req, res) => {
  const { userId, name, amount, units, topTierRange } = req.body;
  const fund = new UserFund({
    userId,
    name,
    amount,
    units,
    topTierRange,
    transactions: [{ action: 'add', amount, units }]
  });
  await fund.save();
  res.json({ message: 'Fund added', fund });
});

router.delete('/delete', async (req, res) => {
  const { userId, name } = req.body;
  await UserFund.deleteOne({ userId, name });
  res.json({ message: 'Fund deleted' });
});

router.post('/updateAmount', async (req, res) => {
  const { userId, name, amountChange, unitsChange, action } = req.body;
  const fund = await UserFund.findOne({ userId, name });
  if (!fund) return res.status(404).json({ error: 'Fund not found' });

  if (action === 'add') {
    fund.amount += amountChange;
    fund.units += unitsChange;
  } else if (action === 'subtract') {
    fund.amount -= amountChange;
    fund.units -= unitsChange;
  } else {
    return res.status(400).json({ error: 'Invalid action. Use "add" or "subtract".' });
  }

  fund.transactions.push({ action, amount: amountChange, units: unitsChange });
  await fund.save();
  res.json({ message: 'Amount updated', fund });
});

router.post('/editTransaction', async (req, res) => {
  const { userId, name, transactionId, newAmount, newUnits } = req.body;
  const fund = await UserFund.findOne({ userId, name });
  if (!fund) return res.status(404).json({ error: 'Fund not found' });

  const txn = fund.transactions.id(transactionId);
  if (!txn) return res.status(404).json({ error: 'Transaction not found' });

  fund.amount += (newAmount - txn.amount);
  fund.units += (newUnits - txn.units);
  txn.amount = newAmount;
  txn.units = newUnits;
  await fund.save();

  res.json({ message: 'Transaction updated', fund });
});

router.delete('/deleteTransaction', async (req, res) => {
  const { userId, name, transactionId } = req.body;  // Make sure to get userId, name, and transactionId from the request body
  
  const fund = await UserFund.findOne({ userId, name });
  if (!fund) return res.status(404).json({ error: 'Fund not found' });

  const txnIndex = fund.transactions.findIndex(txn => txn._id.toString() === transactionId);
  if (txnIndex === -1) return res.status(404).json({ error: 'Transaction not found' });

  // Subtract the amount and units from the fund before removing the transaction
  const txn = fund.transactions[txnIndex];
  fund.amount -= txn.amount;
  fund.units -= txn.units;

  // Remove the transaction using the pull method
  fund.transactions.pull({ _id: transactionId });

  await fund.save();

  res.json({ message: 'Transaction deleted', fund });
});

router.post('/addTransaction', async (req, res) => {
  const { userId, name, amount, units, action } = req.body;
  const fund = await UserFund.findOne({ userId, name });
  if (!fund) return res.status(404).json({ error: 'Fund not found' });

  if (action === 'add') {
    fund.amount += amount;
    fund.units += units;
  } else if (action === 'subtract') {
    fund.amount -= amount;
    fund.units -= units;
  } else {
    return res.status(400).json({ error: 'Invalid action. Use "add" or "subtract".' });
  }

  fund.transactions.push({ action, amount, units });
  await fund.save();
  res.json({ message: 'Transaction added', fund });
});

module.exports = router;
