// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// index.js 頭部加入
const fs = require('fs');
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });


const path = require('path');
const jwt = require('jsonwebtoken');

app.get('/uploads/:filename', (req, res) => {
  const token =
    (req.headers.authorization || '').replace(/^Bearer\s+/i, '') ||
    req.query.token ||
    '';
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const filename = path.basename(req.params.filename); // prevent path traversal
  const filePath = path.join(__dirname, 'uploads', filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Not found' });
  res.sendFile(filePath);
});

app.use('/api/upload', require('./routes/upload'));

app.use('/api/memories', require('./routes/memories'));
app.use('/api/users', require('./routes/users'));

app.use('/api/auth', require('./routes/auth'));

app.use('/api/proxy', require('./routes/proxy'));

app.use('/api/accounts', require('./routes/accounts'));


app.get('/', (req, res) => {
  res.send('Server is running and healthy!');
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status ?? err.statusCode ?? 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
});

module.exports = app;