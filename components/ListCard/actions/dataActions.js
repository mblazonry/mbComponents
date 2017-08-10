function updateState() {
  return {
    type: 'UPDATE_',
    model: model
  };
}

module.exports = {
  updateState: updateState
};
