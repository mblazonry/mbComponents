const skuiddleware = store => next => action => {
  switch(action.type) {
  case 'CREATE_ROW': {

  }
  case 'UPDATE_ROW': {

  }
  case 'DELETE_ROW': {

  }
  }
  next(action);
};

module.exports = skuiddleware;
