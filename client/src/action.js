// install web3, link html to node_modules/web3/dist/web3.min.js using express.static
// do not try to import and bundle web3
// connect web3 to a provider
import axios from 'axios';

let web3;
let tokenSaleContract;
let tokenContract;
let currentAccount;
let address;

// get passed contracts from client, set up contract instances
export const setupAPI = async () => {
  try {
    const { data } = await axios.get('/contracts');
    if(window.ethereum) {

      web3 = new window.Web3(window.ethereum);
      window.ethereum.enable();
      // get current account
      [currentAccount] = await web3.eth.getAccounts();
      //handle account change
      window.ethereum.on('accountsChanged', async function () {
        [currentAccount] = await web3.eth.getAccounts();
      });
  
      if(currentAccount === undefined) return false;
    } else return false;
    //create contracts instances for API
    tokenSaleContract = new web3.eth.Contract(data.TokenSaleABI, data.addresses.tokenSale);
    tokenContract = new web3.eth.Contract(data.TokenABI, data.addresses.token);
    address = data.addresses.token;
    // return true when contracts are setup so client can render
    return true;

  } catch (error) {
    console.log(error.message)
    return false;
  }
  
};

export const getAddress = () => address;

// get balance supply piece and symbol from the token contract and return to client
// error will render in client if a single request is failed
export const getTokenInfo = async () => {
  try {
    const name = await tokenContract.methods.name().call();
    const balance = await tokenContract.methods.balanceOf(currentAccount).call();
    const symbol = await tokenContract.methods.symbol().call();
    const supply = await tokenContract.methods.totalSupply().call();
    return {
      balance, symbol, supply, name
    };
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getSaleInfo = async () => {
  try {
    const sold = await tokenSaleContract.methods.sold().call();
    const price = await tokenSaleContract.methods.price().call();
    const ethPrice = await fromWei(price);
    return { sold, price, ethPrice };
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const fromWei = async (price, amount = 1) => {
  let res = await web3.utils.fromWei((price * amount).toString(), 'ether')
  return res;
}

// buy tokens from tokenSale contract
export const buyTokens = async (amount, total) => {
  try {
    console.log('buying', amount, total)
    const success = await tokenSaleContract.methods.buyTokens(amount).send({from: currentAccount, value: total});
    console.log(success);
    return true;
  } catch (error) {
    console.log(error)
    return error
  }
}