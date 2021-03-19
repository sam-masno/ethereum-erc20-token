const fs = require('fs');
const path = require('path');

const Token = artifacts.require('../contracts/Token.sol');
const TokenSale = artifacts.require('../contract/TokenSale.sol');

module.exports = async (deployer) => {
  // get admin wallet
  const [admin] = await web3.eth.getAccounts();

  //deploy contracts, 
  const token = await deployer.deploy(Token, 'Test Token', 'TEST',  1000000, 0);
  const tokenSale = await deployer.deploy(TokenSale, token.address, 1000);
  token.transfer(tokenSale.address, 500000, { from: admin });

  //write addresses to node app folder so they can be supplied to client
  const address = {
    tokenSale: tokenSale.address, 
    token: token.address
  };
  fs.writeFileSync(path.join(__dirname, '../', 'client', 'addresses.json'), JSON.stringify(address));
  console.log('addresses written to client/addresses.json');
}