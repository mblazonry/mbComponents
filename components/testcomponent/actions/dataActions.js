function updateState(model) {
  return {
    type: 'UPDATE_STATE',
    model: model
  };
}

module.exports = {
  updateState: updateState
};
