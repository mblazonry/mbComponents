const display = event => {
  return {
    type: 'DISPLAY',
    text: event.target.value
  };
};

module.exports = {
  display: display
};
