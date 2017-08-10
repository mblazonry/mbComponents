const React = require('react'),
  ReactDOM = require('react-dom'),
  ReactRedux = require('react-redux'),
  Redux = require('redux'),
  RootReducer = require('./reducers/root.js'),
  Skuiddleware = require('./middleware/skuiddleware.js');

// Component import
const ListCard = require('./components/ListCard');

// ABSTRACT OUT -----------------
function injectOptions(xml) {
  var options = {};
  Array.from(xml.get(0).attributes).forEach(attr => {
    options[attr.name] = attr.value;
  });

  return {options: options};
}

// Store configuration
const store = Redux.createStore((state, action) => { return state; },
                Redux.compose(injectOptions(xmlDefinition),
                                Redux.applyMiddleware(Skuiddleware)));

// Stylesheet imports
require('./stylesheets/main.scss');

// Root app render
ReactDOM.render(
  <ReactRedux.Provider store={store}>
  <ListCard/>
</ReactRedux.Provider>, element[0]);
