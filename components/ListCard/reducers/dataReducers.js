module.exports = (state = {}, action) => {
  switch(action.type) {
  case 'UPDATE_STATE': {
    var o = {...state};
    o[action.model] = [...skuid.$M(action.model).data];
    console.log(o);
    return o;
  }
  default: {
    return state;
  }
  }
};
