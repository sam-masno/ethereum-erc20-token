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

  it("should have a balance of half 500000 tokens", async () => {
    const tokenInstance = await Token.deployed();
    const tokenSaleInstance = await TokenSale.deployed();
    const balance = await tokenInstance.balanceOf.call(tokenSaleInstance.address);
    expect(balance.toNumber()).to.equal(500000);
  })

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
    expect(args._value.toNumber()).to.equal(value);

    //check wallet balances 
    const balance = (await token.balanceOf.call(user1)).toNumber();
    const saleBalance = (await token.balanceOf.call(tokenSaleInstance.address)).toNumber();

    expect(balance).to.equal(numOfTokens);
    expect(saleBalance).to.equal(500000 - numOfTokens);
  });

  it("should prevent non admin from ending sale", async () => {
    // send end from non admin
    // expect error
    const tokenSaleInstance = await TokenSale.deployed();
    const err = await tokenSaleInstance.endSale({from: user1}).catch(err => err);
    expect(err.reason).to.equal("Must be admin")
  });

  it("allows admin to destroy contract, transfers balances", async () => {
    const token = await Token.deployed();
    const tokenSale = await TokenSale.deployed();

    //token balances
    const adminTokenBalance = (await token.balanceOf.call(admin)).toNumber();
    const salesTokenBalance = (await token.balanceOf.call(tokenSale.address)).toNumber();

    //eth balances
    // const adminEthBalance = parseInt(await web3.eth.getBalance(admin));
    // const salesEthBalance = parseInt(await web3.eth.getBalance(tokenSale.address));

    // end sale and check logs
    const { logs: { '0': { args } } } = await tokenSale.endSale({ from: admin });

    //get after balances
    // const adminEthEndBalance = parseInt(await web3.eth.getBalance(admin));
    const adminTokenEndBalance = (await token.balanceOf.call(admin)).toNumber();

    expect(args._totalSold.toNumber()).to.equal(100);
    expect(args._contract).to.equal(tokenSale.address);
    expect(adminTokenEndBalance).to.be.above(adminTokenBalance);

  })
});
