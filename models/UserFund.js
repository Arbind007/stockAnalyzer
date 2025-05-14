const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  action: String,
  amount: Number,
  units: Number
});

const fundSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  amount: Number,
  units: Number,
  topTierRange: String,
  transactions: [transactionSchema]
});

module.exports = mongoose.model('UserFund', fundSchema);
