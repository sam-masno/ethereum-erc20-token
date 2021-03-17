const Token = artifacts.require('../contracts/Token.sol');
const TokenSale = artifacts.require('../contract/TokenSale.sol');

module.exports = async (deployer) => {
  const [admin] = await web3.eth.getAccounts();
  const token = await deployer.deploy(Token, 'Test Token', 'TST',  1000000, 0);
  const tokenSale = await deployer.deploy(TokenSale, token.address, 1000);
  token.transfer(tokenSale.address, 500000, { from: admin })
}