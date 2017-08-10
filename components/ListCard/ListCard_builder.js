ListCardOptions = {
  propertiesRenderer: function(propertiesObj, component) {
    propertiesObj.setTitle('List and Card Properties');

    propertiesObj.applyPropsWithCategories([
      {
        name: 'Basic',
        props: [
          {
            id: 'list_model',
            type: 'model',
            label: 'List model: '
          },
          {
            id: 'card_model',
            type: 'model',
            label: 'Card model: '
          },
          {
            id: 'relationship_field',
            type: 'text',
            label: 'Relationship field (on the card object): '
          }
        ]
      }
    ],
    component.state);
  }
};
