const express = require('express');
const app = express();
const path = require('path');

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/app', express.static(path.join(__dirname, 'public')));
app.use('/web3', express.static(path.join(__dirname, 'node_modules', 'web3', 'dist', 'web3.min.js')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('App works'))