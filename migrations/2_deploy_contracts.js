const Token = artifacts.require('../contracts/Token.sol');
const TokenSale = artifacts.require('../contract/TokenSale.sol');

module.exports = async (deployer) => {
  const [wallet] = await web3.eth.getAccounts();
  const token = await deployer.deploy(Token, 'Test Token', 'TST',  1500000, 0);
  await deployer.deploy(TokenSale, token.address, 1000);
}