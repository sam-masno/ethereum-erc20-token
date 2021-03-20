// install web3, link html to node_modules/web3/dist/web3.min.js using express.static
// do not try to import and bundle web3
// connect web3 to a provider
import axios from 'axios';

let web3;
let tokenSaleContract;
let tokenContract;
let currentAccount;

// get passed contracts from client, set up contract instances
export const setupAPI = async (data) => {
  try {
    const { data } = await axios.get('/contracts');
    if(window.ethereum) {

      web3 = new window.Web3(window.ethereum);
      window.ethereum.enable();
      // get current account
      [currentAccount] = await web3.eth.getAccounts();
      console.log(currentAccount);
      //handle account change
      window.ethereum.on('accountsChanged', async function () {
        [currentAccount] = await web3.eth.getAccounts();
        console.log(currentAccount);
      });
  
      if(currentAccount === undefined) return false;
    } else return false;
    //create contracts
    tokenSaleContract = new web3.eth.Contract(data.TokenSaleABI, data.addresses.tokenSale);
    tokenContract = new web3.eth.Contract(data.TokenABI, data.addresses.token);
    // return true when contracts are setup
    return true;

  } catch (error) {
    console.log(error.message)
    return false;
  }
  
};

// get balance supply piece and symbol from the token contract and return to client
// all items needed or 
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
    return { sold, price};
  } catch (error) {
    console.log(error);
    return false;
  }
};