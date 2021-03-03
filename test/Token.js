const Token = artifacts.require('../contracts/Token.sol');

contract('Token tests', async (accounts) => {
  let instance;
  beforeEach(async () => {
    instance = await Token.deployed();
  })

  it('sets name on deployment', async () => {
    // let instance = await Token.deployed();
    let name = await instance.name.call();
    expect(name).to.equal('Test Token');
  }) 

  it('sets symbol on deployment', async () => {
    let symbol = await instance.symbol.call();
    expect(symbol).to.equal('TST');
  })

  it('sets total supply to 1000000 on deployment', async () => {
    let supply = await instance.totalSupply.call();
    expect(supply.toNumber()).to.equal(1500000);
  });

  it('sets decimal on deployment', async () => {
    let decimal = await instance.decimal.call();
    expect(decimal.toNumber()).to.equal(0);
  })

  it('allocates totalSupply to owner', async () => {
    let adminBalance = await instance.balanceOf.call(accounts[0]);
    let totalSupply = await instance.totalSupply.call();
    expect(adminBalance.toNumber()).to.equal(totalSupply.toNumber());
  })

});