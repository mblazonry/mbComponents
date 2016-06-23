(function ($, $S, undefined)
{
	'use strict';
	/* jslint unused:false */

	$S.builder.registerBuilder(new $S.builder.Builder(
	{
		id: 'mblazonry__popupcontroller',
		name: 'Popup Controller',
		icon: 'sk-icon-popup',
		description: 'This component provides hooks for popup dialog events.',
		isJSCreateable: true, // required so that component can be added to popup, drawer, etc.
		componentRenderer: function (component)
		{
			// var self = component;
			component.header.html(component.builder.name);

		},
		propertiesRenderer: function (propertiesObj, component)
		{
			propertiesObj.clear();
			propertiesObj.setHeaderText('Popup Controller Properties');
			var basicPropsList = [
			{
				id: 'oncreate',
				type: 'string',
				label: 'OnCreate Snippet',
				helptext: 'Called when dialog is created',
				defaultValue: '',
				required: false
			},
			{
				id: 'onopen',
				type: 'string',
				label: 'OnOpen Snippet',
				helptext: 'Called when dialog has opened',
				defaultValue: '',
				required: false
			},
			{
				id: 'onbeforeclose',
				type: 'string',
				label: 'OnBeforeClose Snippet',
				helptext: 'Called when dialog preparing to close',
				defaultValue: '',
				required: false
			},
			{
				id: 'onclose',
				type: 'string',
				label: 'OnClose Snippet',
				helptext: 'Called when dialog has closed',
				defaultValue: '',
				required: false
			},
			{
				id: 'hideclose',
				type: 'boolean',
				label: 'Hide Close',
				helptext: 'Hides the "X" in the dialog prohibiting close',
				defaultValue: false,
				required: false
			},
			{
				id: 'disableescape',
				type: 'boolean',
				label: 'Disable Escape',
				helptext: 'Disables the escape key from closing the dialog when it has focus',
				defaultValue: false,
				required: false
			}];

			var advancedPropsList = [
				$S.builder.core.coreProps.uniqueIdProp(
				{
					component: this
				}),
				$S.builder.core.coreProps.cssClassProp()
			];

			propertiesObj.applyPropsWithCategories([
			{
				name: 'Basic',
				props: basicPropsList
			},
			{
				name: 'Advanced',
				props: advancedPropsList
			},
			{
				id: 'hideheader',
				type: 'boolean',
				label: 'Hide Header',
				helptext: 'Hides the dialog header if the \'Hide Close\' option is checked and the title is empty.',
				defaultValue: false,
				required: false
			}], component.state);
		},
		defaultStateGenerator: function ()
		{
			return $S.utils.makeXMLDoc('<mblazonry__popupcontroller />');
		}
	}));
})(window.skuid.$, window.skuid);
