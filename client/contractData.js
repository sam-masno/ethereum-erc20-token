const fs = require('fs');
const path = require('path')

const TokenSaleABI = (JSON.parse(fs.readFileSync(path.join(__dirname, '../', 'build', 'contracts', 'TokenSale.json')))).abi;
const TokenABI = (JSON.parse(fs.readFileSync(path.join(__dirname, '../', 'build', 'contracts', 'Token.json' )))).abi;
const addresses = JSON.parse(fs.readFileSync(path.join(__dirname, 'addresses.json')));

module.exports = {
  TokenSaleABI,
  TokenABI,
  addresses
};