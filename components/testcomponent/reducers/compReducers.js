module.exports = (state = {}, action) => {
  switch(action.type) {
  case 'DISPLAY': {
    return {...state, text: action.text};
  }
  default:
    return state;
  }
};
