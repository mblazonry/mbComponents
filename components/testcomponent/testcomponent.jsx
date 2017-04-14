const React = require('react'),
  ReactDOM = require('react-dom'),
  ReactRedux = require('react-redux'),
  Redux = require('redux'),
  RootReducer = require('./reducers/root.js'),
  Skuiddleware = require('./middleware/skuiddleware.js');

// Component import
const TestComponent = require('./components/TestComponent');

// Store configuration
const store = Redux.createStore(RootReducer, {
  display: {
    text: ""
  }
}, Redux.applyMiddleware(Skuiddleware));

// Stylesheet imports
require('./stylesheets/main.scss');

// Root app render
ReactDOM.render(
  <ReactRedux.Provider store={store}>
  <TestComponent/>
</ReactRedux.Provider>, element[0]);
