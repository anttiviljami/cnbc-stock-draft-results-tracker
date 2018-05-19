require("babel-register");

const express = require('express');
const path = require('path');
const app = express();
const morgan = require('morgan');

const port = process.env.PORT || '9000';
const { apiHandler } = require('./src/api');

(async function main() {
  app.use(express.static(path.join(__dirname, 'build')));

  app.use(morgan('combined'));

  app.use('/api', apiHandler);

  app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

  await app.listen(port);
  console.log('App running in port', port);
})();
