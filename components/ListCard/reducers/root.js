const Redux = require('redux'),
  DataReducers = require('./dataReducers.js');

module.exports = Redux.combineReducers({
  data: DataReducers
});
