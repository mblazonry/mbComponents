testcomponentOptions = {
  propertiesRenderer: function(propertiesObj, component) {
    propertiesObj.setTitle('Model Registerer Properties');

    propertiesObj.applyPropsWithCategories([
      {
        name: 'Basic',
        props: [
          {
            id: 'model',
            type: 'multipicklist',
            label: 'Models to register:'
          }
        ]
      }
    ],
    component.state);
  }
};
