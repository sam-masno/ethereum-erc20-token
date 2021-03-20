# Full Stack Token Sale Smart Contract with ERC20 Token and React
This project is an basic implementation of the ERC20 token standard smart contract, a basic token sale smart contract, and a React application for client interaction. This project is for educational purposes only and is not suitable for production.

## Requirements
Install the following:
Truffle development suite
Ganache (cli or GUI)
Metamask (or other Ethereum wallet in browser)
Node.js

## Setup and Run
Ensure Ganache is installed and running  
In truffleConfig.js make sure `networks.development` matches your Ganache instance (set to defaults)  
In root directory run `truffle migrate --reset`  
Navigate to the directory `client`  
Run `npm install`  
Run `npm run build`  
Run `npm start`  
In browser go to `http://localhost:3000`  
Ensure Metamask is connected to Ganache network.  
When prompted connect metamask account to site.  
(Optional) import a test wallet from Ganache and connect it to site.  
In input box put enter a number of tokens to buy and click `Buy Tokens` button.  
When prompted click `Confirm`  

## Add Token To Wallet
In Metamask at account home screen:   
click `Add token`   
go to `Custom Token`
Paste address under title to `Token Contract Address`   
Click `Next`   
Click `Add Token`
Balance of token should appear on home screen

## Change Token Values
In root directory update config variables and save.   
In root directory run `truffle migrate --reset`   
At this point new token and sale contract will be available on ganache.   
Follow instructions from `Setup and Run` above.   

## Run Tests
In root directory run `truffle test`



