// total fixed supply of token
exports.totalSupply = 1000000;
// token name
exports.name = 'ERC20 Token';
// token symbol
exports.symbol = 'ERC';
// max decimal places of token
exports.decimal = 0;
// price in wei of token
exports.price = 1000000;
// when migrated, this amount will be sent from token to tokenSale contract
exports.initialTransferToTokenSale = Math.floor(exports.totalSupply / 2);


