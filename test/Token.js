const Token = artifacts.require('../contracts/Token.sol');

contract('Token tests', async (accounts) => {

  let instance;
  let [first, second, third] = accounts;
  beforeEach(async () => {
    instance = await Token.deployed();
  })

  it('sets name on deployment', async () => {
    // let instance = await Token.deployed();
    let name = await instance.name.call();
    expect(name).to.equal('Test Token');
  }) 

  it('sets symbol and version on deployment', async () => {
    let symbol = await instance.symbol.call();
    let version = await instance.version.call();
    expect(symbol).to.equal('TST');
    expect(version).to.equal('v1.0.0');
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

  it('does not overdraft a given balance', async () => {
    let err;
    try {
      await instance.transfer(accounts[1], 2000000, { from: accounts[1]});
    } catch (error) {
      err = error.message;
    }

    expect(err).to.exist;
  })

  it('transfers amount from owner to other address and emits event', async () => {
    let send = 20000;
    let startingBalanceSender = (await instance.balanceOf.call(first)).toNumber();
    let tx = await instance.transfer(second, send);

    expect(tx.logs[0].args._from).to.equal(first);
    expect(tx.logs[0].args._to).to.equal(second);
    expect(tx.logs[0].args.value.toNumber()).to.equal(send);

    let endingBalanceSender = (await instance.balanceOf.call(first)).toNumber();
    let receiptBalance = (await instance.balanceOf.call(second)).toNumber();

    expect(endingBalanceSender).to.equal(startingBalanceSender - send);
    expect(receiptBalance).to.equal(send);
  });

});