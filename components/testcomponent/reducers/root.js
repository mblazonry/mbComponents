const Redux = require('redux'),
  CompReducers = require('./compReducers.js'),
  DataReducers = require('./dataReducers.js');

module.exports = Redux.combineReducers({
  display: CompReducers,
  data: DataReducers
});
