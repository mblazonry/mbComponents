/* jshint -W098 */ // x is unused.
/* jshint -W030 */ // useless and unnecessary code.
/* jshint -W004 */ // x is already defined.


(function ($, skuid, undefined)
{
	'use strict';

	var $S = skuid;
	var $b = $S.builder;
	var $bc = $b.core;
	var $u = $S.utils;
	var $xml = $u.makeXMLDoc;
	var $j = $.noConflict();
	var console = window.console;

	function getModelIds(xml) {
		var entries = [];
		for (let model of xml.getElementsByTagName('model')) {
			entries.push({
				label: model.getAttribute('id'),
				value: model.getAttribute('id')
			});
		}

		return entries;
	}

	$b.registerBuilder(new $b.Builder(
	{
		id: "mblazonry__model_registerer",
		name: "Model Registerer",
		icon: "fa-chain",
		description: 'TODO',
		propertiesRenderer: function(propertiesObj, component) {
			propertiesObj.setTitle('Model Registerer Properties');
			var state = component.state,
				properties = [];

			var basicPropsList = [{
				id: 'models',
				type: 'multipicklist',
				label: 'Models to register:',
				picklistEntries: getModelIds(skuid.builder.core.getPageModels()[0])
			},
			{
				id: 'id-toggle',
				type: 'boolean',
				defaultValue: true,
				label: 'Use first page title:',
				onChange: function(src) {
					component.save().refresh().rebuildProps();
				}
			}];

			if (state.attr('id-toggle') == 'false') {
				basicPropsList.push({
					id: 'title-id',
					type: 'string',
					label: 'Unique id:'
				});
			}

			properties.push({
				name: 'Basic',
				props: basicPropsList
			});
			propertiesObj.applyPropsWithCategories(properties, state);
		},
		componentRenderer: function(component) {
			component.setTitle(component.builder.name);
		} 
	}));
})(window.skuid.$, window.skuid);
