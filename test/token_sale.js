const Token = artifacts.require("../contracts/Token.sol");
const TokenSale = artifacts.require("../contracts/TokenSale.sol");
const { log } = console;

const {
  totalSupply,
  name,
  symbol,
  decimal,
  price,
  initialTransferToTokenSale
} = require('../tokenConfig.js');

contract("TokenSale", function (accounts) {
  let [admin, user1, user2] = accounts;
  it("should assert true", async function () {
    await TokenSale.deployed();
    return assert.isTrue(true);
  });

  it(`should have a balance of initialTransferToTokenSale from tokenConfig.js`, async () => {
    const tokenInstance = await Token.deployed();
    const tokenSaleInstance = await TokenSale.deployed();
    const balance = await tokenInstance.balanceOf.call(tokenSaleInstance.address);
    expect(balance.toNumber()).to.equal(initialTransferToTokenSale);
  })

  it("should have an admin equal to source wallet", async () => {
    const tokenSale = await TokenSale.deployed();
    const tokenInstance = await Token.deployed();
    const tokenAddress = await tokenSale.token.call();

    expect(tokenAddress).to.equal(tokenInstance.address)
  });

  it("should have a price set to tokenConfig.js", async() => {
    const tokenSale = await TokenSale.deployed();
    const tokenPrice = await tokenSale.price.call();

    expect(tokenPrice.toNumber()).to.equal(price);
  });

  it("should set admin wallet to appropriate address", async () => {
    const tokenSale = await TokenSale.deployed();
    const isAdmin = await tokenSale.isAdmin.call({from: admin});
    expect(isAdmin).to.equal(true);
  });

  it("prevents underpayment for a token", async () => {
      const tokenSaleInstance = await TokenSale.deployed();
      const err = await tokenSaleInstance.buyTokens(100, {from: user1, value: price - 10}).catch(err => err);
      expect(err.reason).to.equal('Insufficient payment')
  });

  it("enforces exact payment", async () => {
    const tokenSaleInstance = await TokenSale.deployed();
    const err = await tokenSaleInstance.buyTokens(1, {from: user1, value: price * 2}).catch(err => err);
    expect(err.reason).to.equal('Must pay exact amount');
  });

  
  it("allows user to buy token", async () => {
    //get instances
    const numOfTokens = Math.floor(initialTransferToTokenSale / 2);
    const value = price * numOfTokens;
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
    expect(saleBalance).to.equal(initialTransferToTokenSale - numOfTokens);
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
    expect(args._totalSold.toNumber()).to.equal(Math.floor(initialTransferToTokenSale / 2));
    expect(args._contract).to.equal(tokenSale.address);
    expect(adminTokenEndBalance).to.be.above(adminTokenBalance);

  })
});
