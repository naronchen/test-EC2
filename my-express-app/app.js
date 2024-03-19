require('dotenv').config();
const express = require('express');

const indexRouter = require('./routes/index');

const app = express();
const port = 3000;

const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));


app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/', indexRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
