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
		id: "mblazonry__model_refresher",
		name: "Model Refresher",
		icon: "fa-repeat",
		description: 'TODO',
		propertiesRenderer: function(propertiesObj, component) {
			propertiesObj.setTitle('Model Refresher Properties');
			var state = component.state,
				properties = [];

			var basicPropsList = [{
				id: 'models',
				type: 'multipicklist',
				label: 'Models to refresh:',
				picklistEntries: getModelIds(skuid.builder.core.getPageModels()[0])
			}, {
				id: 'interval',
				type: 'number',
				label: 'Interval (in seconds):'
			}];

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
