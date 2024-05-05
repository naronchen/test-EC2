require('dotenv').config();
const express = require('express');
const path = require('path');

const indexRouter = require('./routes/index');
const authRouter = require('./config/authConfig');

const app = express();
const port = process.env.PORT || 3000;

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(authRouter());
app.use('/', indexRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


