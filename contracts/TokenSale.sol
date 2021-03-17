// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Token.sol";

contract TokenSale {
  uint public price;
  address private admin;
  Token public token;
  uint public sold;


  constructor(Token _token, uint _price) public {
    token = _token;
    admin = msg.sender;
    price = _price;
  }

  event Sale(address _buyer, uint _amount, uint _value);

  function isAdmin() public returns(bool) {
    if(address(msg.sender) == admin) {
      return true;
    } else {
      return false;
    }
  }

  function multiply(uint _x, uint _y) internal pure returns(uint z) {
    require((_y == 0) || (z = _x * _y) / _y == _x, "Mulitplication over-flow error");
    return z;
  }
  
  function buyTokens(uint _numOfTokens) public payable {
    //check sufficient payment
    //check balance
    // track tokens sold
    //require transfer successful
    uint total = multiply(_numOfTokens, price);
    require(msg.value >= total, "Insufficient payment");
    require(msg.value == total, "Must pay exact amount");
    require(token.balanceOf(admin) >= _numOfTokens, "Not enough tokens left");
    sold += _numOfTokens;
    emit Sale(address(msg.sender), _numOfTokens, msg.value);
  }
}
