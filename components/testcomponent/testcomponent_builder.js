var testcomponentOptions = {
  propertiesRenderer: function(propertiesObj, component) {
    propertiesObj.setTitle('Model Registerer Properties');
    var state = component.state,
      properties = [];

    var basicPropsList = [{
      id: 'models',
      type: 'multipicklist',
      label: 'Models to register:',
      picklistEntries: getModelIds(skuid.builder.core.getPageModels()[0])
    }];
    if (state.attr('id-toggle') == 'false') {
      basicPropsList.push({id: 'title-id', type: 'string', label: 'Unique id:'});
    }

    properties.push({name: 'Basic', props: basicPropsList});
    propertiesObj.applyPropsWithCategories(properties, state);
  }
};
