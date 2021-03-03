const Token = artifacts.require('../contracts/Token.sol');

contract('Token tests', (accounts) => {
  it('sets total supply to 1000000 on deployment', async () => {
    let instance = await Token.deployed();
    let supply = await instance.totalSupply.call();
    expect(supply.toNumber()).to.equal(1000000);
  });
});