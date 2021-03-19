import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { setupAPI, getSaleInfo, getTokenInfo } from './action.js';

const App = () => {
  // need to retrieve contract abis and addresses to setup api
  const [contracts, setContracts] = useState(null);
  const [balance, setBalance] = useState(null);
  const [token, setToken] = useState(null);
  const [sale, setSale] = useState(null);
  const [amount, setAmount] = useState(0);
  // when api is set up, need to retrieve user and token information below

  const update = () => {
    
  }

  useEffect(async () => {
    const res = await setupAPI();
    setContracts(res);
  }, []);

  useEffect(async () => {
    if(contracts) {
      console.log('getting balance');
      const saleInfo = await getSaleInfo();
      const {balance, ...tokenInfo} = await getTokenInfo();
      setSale(saleInfo);
      setToken(tokenInfo);
      setBalance(balance);
      console.log(saleInfo, tokenInfo);
    }
  }, [contracts]);

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

  const { price, sold } = sale;
  const { supply, symbol, name } = token;
   
  const handleChangeAmount = (e) => {
    setAmount(e.target.value);
  }

  return (
    <div className="row py-5">
    <div className="col-12">
      <h1 className="text-center"> { name } Sale</h1>
    </div>
    <div className="col-12 col-md-6 mx-auto">
      <hr/>
      <p>Buy { symbol } tokens. Price per token is { price } eth. 
        <br/>
        Your current balance: <span id="balance">{ balance }</span>
      </p>
      <p>total: { price * amount } wei</p>
      <div className="input-group">
        <input type="number" className="form-control" name="amount" value={amount} onChange={handleChangeAmount} min={0} pattern="[0-9]"/>
        <button className="btn btn-primary input-group-append w-25" style={{display: "table-cell"}}>Buy Tokens</button>
      </div>
      <br/>
      <h4 className="text-center">Tokens sold { sold } / { supply }</h4>
      <div className="progress">
        <div className="progress-bar" role="progressbar" style={{width: `${ Math.floor(sold / supply) || 0}%` }}aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>
  </div>
  );
};

ReactDOM.render(<App/>, document.getElementById('app'));