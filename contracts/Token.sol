pragma solidity >=0.4.22 <0.9.0;

contract Token {
  uint256 public totalSupply;
  string public name;
  uint256 public decimal;
  string public symbol;
  string public version = "v1.0.0";
  mapping (address => uint256) balance;
  mapping (address => mapping (address => uint256)) allowances;

  constructor(string memory _name, string memory _symbol, uint256 _totalSupply,  uint256 _decimal) public {
    name = _name;
    symbol = _symbol;
    totalSupply = _totalSupply;
    decimal = _decimal;
    balance[msg.sender] = totalSupply;
  }

  function balanceOf(address _owner) public  returns(uint256) {
    return balance[_owner];
  }

  // emit on any successful transfer
  event Transfer(address indexed _from, address indexed _to, uint256 value);
  event Approval(address indexed _from, address indexed _to, uint256 value);

  function transfer(address _to, uint256 _value) public returns(bool){
    require(balance[msg.sender] >= _value, 'Insufficient balance');
    require(balance[msg.sender] - _value < balance[msg.sender], 'Insufficient balance');
    require(balance[_to] + _value > balance[_to], 'Balance exceeds limit, open new account');
    balance[msg.sender] -= _value;
    balance[_to] += _value;
    emit Transfer (address(msg.sender), _to, _value);
    return true;
  }

  //approve - delegates an allowance from sender to _spender
  function approve(address _spender, uint256 _value) public returns(bool success) {
    require(balance[msg.sender] >= _value, 'Insufficient funds');
    allowances[msg.sender][_spender] = _value;
    emit Approval(address(msg.sender), _spender, _value);
    return true;
  }

  //allowance
  function allowance(address _owner, address _spender) public returns(uint256){
    return allowances[_owner][_spender];
  }
  //delegated transfer
  function transferFrom(address _from, address _to, uint256 _value) public returns(bool) {
    require(balanceOf(_from) >= _value, 'Insufficient funds');
    require(allowances[_from][_to] >= _value, 'Insufficient allowance');
    require(balanceOf(_to) + _value >= balanceOf(_to), 'There was an error');

    balance[_from] -= _value;
    allowances[_from][_to] -= _value;
    balance[_to] += _value;

    emit Transfer(_from, _to, _value);

    return true;
  }
}