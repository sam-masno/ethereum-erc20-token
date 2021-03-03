pragma solidity >=0.4.22 <0.9.0;

contract Token {
  uint public totalSupply;
  string public name;
  uint public decimal;
  string public symbol;
  address public wallet;
  mapping (address => uint) balance;
  constructor(string memory _name, string memory _symbol, uint _totalSupply,  uint _decimal) public {
    wallet = msg.sender;
    name = _name;
    symbol = _symbol;
    totalSupply = _totalSupply;
    decimal = _decimal;
    balance[wallet] = totalSupply;
  }

  function balanceOf(address _owner) public returns(uint) {
    return balance[_owner];
  }

}