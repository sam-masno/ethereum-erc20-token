// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Token.sol";

contract TokenSale {
  uint public price;
  address payable private admin;
  Token public token;
  uint public sold;


  constructor(Token _token, uint _price) public {
    token = _token;
    admin = msg.sender;
    price = _price;
  }

  event Sale(address _buyer, uint _amount, uint _value);
  event EndSale(address _contract, uint _totalSold);

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
    // use safe math to get total
    uint total = multiply(_numOfTokens, price);
    // assert value is adequate
    require(msg.value >= total, "Insufficient payment");
    require(msg.value == total, "Must pay exact amount");
    //ensure contract has balance to support sale
    require(token.balanceOf(address(this)) >= _numOfTokens, "Not enough tokens left");

    // track sold tokens
    sold += _numOfTokens;

    //init transfer and emit event
    token.transfer(address(msg.sender), _numOfTokens);
    emit Sale(address(msg.sender), _numOfTokens, msg.value);
  }

  function endSale() public {
    require(address(msg.sender) == admin, "Must be admin");
    //transfer remaining tokens to admin
    require(token.transfer(admin, token.balanceOf(address(this))));
    //destroy contract
    emit EndSale(address(this), sold);
    selfdestruct(admin);
  }
}
