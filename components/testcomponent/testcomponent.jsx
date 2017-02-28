var React = require('react');
var ReactDOM = require('react-dom');

// Component imports
var TestComponent = require('./components/TestComponent');
var Field = require('./components/Field');

// Stylesheet imports
require('./stylesheets/main.scss')

// Root app render
ReactDOM.render(
    <TestComponent/>, element);
