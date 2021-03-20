const Token = artifacts.require('../contracts/Token.sol');

const {
  totalSupply,
  name,
  symbol,
  decimal,
  price,
  initialTransferToTokenSale
} = require('../tokenConfig.js');

contract('Token tests', async (accounts) => {

  let instance;
  let [first, second, third] = accounts;
  beforeEach(async () => {
    instance = await Token.deployed();
  })

  it('sets name on deployment', async () => {
    // let instance = await Token.deployed();
    let name = await instance.name.call();
    expect(name).to.equal(name);
  }) 

  it('sets symbol and version on deployment', async () => {
    let symbol = await instance.symbol.call();
    let version = await instance.version.call();
    expect(symbol).to.equal(symbol);
    expect(version).to.equal('v1.0.0');
  })

  it('sets total supply to 1000000 on deployment', async () => {
    let supply = await instance.totalSupply.call();
    expect(supply.toNumber()).to.equal(1000000);
  });

  it('sets decimal on deployment', async () => {
    let decimal = await instance.decimal.call();
    expect(decimal.toNumber()).to.equal(0);
  })

  it('allocates totalSupply to owner', async () => {
    let adminBalance = await instance.balanceOf.call(accounts[0]);
    let totalSupply = await instance.totalSupply.call();
    expect(adminBalance.toNumber()).to.equal(totalSupply - initialTransferToTokenSale);
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

  it('approves spender and emits event to logs', async () => {
    let _value = 10000;
    let { logs: { '0': { args } }} = await instance.approve(third, _value, { from: first });
    expect(args._from).to.equal(first);
    expect(args._to).to.equal(third);
    expect(args.value.toNumber()).to.equal(_value);

    let balance = (await instance.allowance.call(first, third)).toNumber();
    expect(balance).to.equal(_value);
  })

  it('delegated transfer does not allow more than allowance', async () => {
    let send = 100000;
    let err;
    try {
      let tx = await instance.transferFrom(third, second, send);
    } catch (error) {
      err = error;
    }
    expect(err.reason).to.equal('Insufficient funds');
  })

  it ('transferFunds delegates transfer funds', async () => {
    let _value = 10000;
    try {
      await instance.transferFrom(first, third, _value, { from: third });
      let balance = (await instance.balanceOf.call(third)).toNumber();
      expect(balance).to.equal(_value);
    } catch (error) {
      console.log(error)
    }
  })

});