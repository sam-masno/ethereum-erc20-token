const express = require('express');
const app = express();
const path = require('path');

const data = require('./utils.js');

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/web3', express.static(path.join(__dirname, 'node_modules', 'web3', 'dist', 'web3.min.js')));

//supply contract abi's and addresses to client
app.get('/contracts', (req, res, next) => {
  res.status(200).json(data);
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('App works'));