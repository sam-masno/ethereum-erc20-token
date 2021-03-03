const Token = artifacts.require('../contracts/Token.sol');

module.exports = async (deployer) => {
  const [wallet] = await web3.eth.getAccounts();
  await deployer.deploy(Token);
}