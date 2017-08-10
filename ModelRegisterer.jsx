const React = require('react'),
  ReactDOM = require('react-dom'),
  ReactRedux = require('react-redux'),
  Redux = require('redux'),
  RootReducer = require('./reducers/root.js');

// Component import
const ModelRegisterer = require('./components/ModelRegisterer');

// Store configuration
const store = Redux.createStore(RootReducer);

// Stylesheet imports
require('./stylesheets/main.scss');

// Root app render
ReactDOM.render(
  <ReactRedux.Provider store={store}>
  <ModelRegisterer/>
</ReactRedux.Provider>, element[0]);
