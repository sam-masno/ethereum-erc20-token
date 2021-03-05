pragma solidity >=0.4.22 <0.9.0;

contract Token {
  uint public totalSupply;
  string public name;
  uint public decimal;
  string public symbol;
  string public version = "v1.0.0";
  mapping (address => uint) balance;
  constructor(string memory _name, string memory _symbol, uint _totalSupply,  uint _decimal) public {
    name = _name;
    symbol = _symbol;
    totalSupply = _totalSupply;
    decimal = _decimal;
    balance[msg.sender] = totalSupply;
  }

  function balanceOf(address _owner) public returns(uint) {
    return balance[_owner];
  }

  event Transfer(address indexed _from, address indexed _to, uint value);

  function transfer(address _to, uint _value) public returns(bool){
    require(balance[msg.sender] >= _value, 'Insufficient balance');
    require(balance[msg.sender] - _value < balance[msg.sender], 'Insufficient balance');
    require(balance[_to] + _value > balance[_to], 'Balance exceeds limit, open new account');
    balance[msg.sender] -= _value;
    balance[_to] += _value;
    emit Transfer (address(msg.sender), _to, _value);
    return true;
  }

}