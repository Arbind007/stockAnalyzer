const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const fundRoutes = require('./routes/funds');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
const PORT = 3000;

mongoose.connect(process.env.MONGODB_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(bodyParser.json());
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/funds', fundRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});