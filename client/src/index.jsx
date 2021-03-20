import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { setupAPI, getSaleInfo, getTokenInfo, buyTokens, fromWei, getAddress } from './action.js';

const App = () => {
  // need to retrieve contract abis and addresses to setup api
  const [contracts, setContracts] = useState(null) // serves as loaded indicator
  const [balance, setBalance] = useState(null); // users balance of tokens
  const [token, setToken] = useState(null); // token info
  const [sale, setSale] = useState(null); // sale contract info
  const [amount, setAmount] = useState(0); // (integer) amount to purchase
  const [message, setMessage] = useState(''); // success or error messages
  const [total, setTotal] = useState(0); // price in wei * amount converted with web3.utils.fromWei to eth price
  const [address, setAddress] = useState(null); // contract address

  // when api is set up, need to retrieve user and token information below
  const getDataFromContracts = async () => {
    const saleInfo = await getSaleInfo();
    const {balance, ...tokenInfo} = await getTokenInfo();
    setSale(saleInfo);
    setToken(tokenInfo);
    setBalance(balance);
    setAmount(0);
  };

  // get contract info, construct web3 contracts and enable ethereum
  useEffect(async () => {
    setContracts(await setupAPI());
  }, []);

  // get info and populate page
  useEffect(async () => {
    if(contracts) {
      await getDataFromContracts();
      setAddress(getAddress);
    }
  }, [contracts]);

  //update total when amount is changed
  useEffect(async () => {
    await handleChangeTotal()
  }, [amount]);

  // handle loading and errors
  if(contracts === null) {
    return <div>Loading</div>
  }
  if(contracts === false) {
    return <div><h1>There was an error</h1></div>
  }

  // when contracts have been set up, get user and token info
  //retrieve balance token and sale info
  // if token or balance loading or fails, return fallbacks
  if(token === null || balance === null || sale === null) return <div><h1 className="text-center">loading</h1></div>;
  if(token === false || balance === false || sale === false) return <div><h1 className="text-center">There was an error</h1></div>;

  const { price, sold, ethPrice } = sale;
  const { supply, symbol, name } = token;

  const handleChangeAmount = async(e) => {
    setAmount(e.target.value);
  }

  const handleChangeTotal = async () => {
    let toEth = await fromWei(price * amount);
    setTotal(toEth);
  }

  const handleBuy = async () => {
    const res = await buyTokens(amount, amount * price);
    await getDataFromContracts();
    if (res) {
      setMessage('Your order has been submitted. Make sure to add the new token to your wallet');
    } else {
      setMessage('There was an error, please try again later');
    }
    setTimeout(() => setMessage(''), 6000);
  }
  return (
    <div className="row py-5">
    <div className="col-12">
      <h1 className="text-center"> { name } Sale</h1>
      <h4 className="text-center"> { address }</h4>
    </div>
    <div className="col-12 col-md-6 mx-auto">
      <hr/>
      <p>Buy { symbol } tokens. Price per token is { ethPrice } eth. 
        <br/>
        Your current balance: <span id="balance">{ balance }</span>
      </p>
      <p>total: { total } eth</p>
      <div className="input-group">
        <input type="number" className="form-control" name="amount" value={amount} onChange={handleChangeAmount} min={0} pattern="[0-9]"/>
        <button onClick={handleBuy} className="btn btn-primary input-group-append w-25" style={{display: "table-cell"}}>Buy Tokens</button>
      </div>
      <br/>
      <h4 className="text-center">Tokens sold { sold } / { supply }</h4>
      <div className="progress">
        <div className="progress-bar bg-primary" role="progressbar" style={{width: `${( sold / supply).toFixed(2) * 100 }%` }} aria-valuenow={`${ (sold / supply).toFixed(2) * 100 }`} aria-valuemin="0" aria-valuemax="100"></div>
      </div>
      <h4>{ message }</h4>
    </div>
  </div>
  );
};

ReactDOM.render(<App/>, document.getElementById('app'));