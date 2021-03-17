const Token = artifacts.require("../contracts/Token.sol");
const TokenSale = artifacts.require("../contracts/TokenSale.sol");
const { log } = console;
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("TokenSale", function (accounts) {
  let [admin, user1, user2] = accounts;
  it("should assert true", async function () {
    await TokenSale.deployed();
    return assert.isTrue(true);
  });

  it("should have an admin equal to source wallet", async () => {
    const tokenSale = await TokenSale.deployed();
    const tokenInstance = await Token.deployed();
    const tokenAddress = await tokenSale.token.call();

    expect(tokenAddress).to.equal(tokenInstance.address)
  });

  it("should have a price of 1000", async() => {
    const tokenSale = await TokenSale.deployed();
    const price = await tokenSale.price.call();

    expect(price.toNumber()).to.equal(1000)
  });

  it("should set admin wallet to appropriate address", async () => {
    const tokenSale = await TokenSale.deployed();
    const isAdmin = await tokenSale.isAdmin.call({from: admin});
    expect(isAdmin).to.equal(true);
  });

  it("prevents underpayment for a token", async () => {
      const tokenSaleInstance = await TokenSale.deployed();
      const err = await tokenSaleInstance.buyTokens(100, {from: user1, value: 1}).catch(err => err);
      expect(err.reason).to.equal('Insufficient payment')
  });

  it("enforces exact payment", async () => {
    const tokenSaleInstance = await TokenSale.deployed();
    const err = await tokenSaleInstance.buyTokens(1, {from: user1, value: 300000}).catch(err => err);
    expect(err.reason).to.equal('Must pay exact amount');
  });

  
  it("allows user to buy token", async () => {
    //get instances
    const numOfTokens = 100;
    const value = 100000;
    const tokenSaleInstance = await TokenSale.deployed();
    const token = await Token.deployed();

    // get sold and buy tokens
    const before = (await tokenSaleInstance.sold.call()).toNumber();
    const { logs : { '0': { args } } } = await tokenSaleInstance.buyTokens(numOfTokens, { from: user1, value: value});
    const after = (await tokenSaleInstance.sold.call()).toNumber();

    //compare
    expect(after).to.equal(before + numOfTokens);
    expect(args._buyer).to.equal(user1);
    expect(args._amount.toNumber()).to.equal(numOfTokens);
    expect(args._value.toNumber()).to.equal(value)
  //   const balance = (await token.balanceOf.call(user1)).toNumber();
  //   expect(balance).to.equal(100)
  });



});
