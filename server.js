const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fundRoutes = require('./routes/funds');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 3000;

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