/* jshint -W098 */ // x is unused.
/* jshint -W030 */ // useless and unnecessary code.
/* jshint -W004 */ // x is already defined.
/* jslint browser:true, lastsemic:true, esnext:true */

(function ($, skuid, undefined)
{
	var $S = skuid;
	var $b = $S.builder;
	var $bc = $b.core;
	var $u = $S.utils;
	var $xml = $u.makeXMLDoc;
	var $j = $.noConflict();

	$b.registerBuilder(new $b.Builder(
	{
		id: "mblazonry__template",
		name: "Template",
		icon: "sk-bi-template",
		description: 'A Merge-Field area.<br/><br/>More information: <ul><li><a href="http://help.skuidify.com/s/tutorials/m/components/l/102558-template" target="SkuidBuilderHelp">Template Component Tutorial</a> </li><li><a href="http://help.skuidify.com/s/tutorials/m/models-conditions-filters/l/108687-template-fields" target="SkuidBuilderHelp">Create Template Fields</a> </li><li><a href="http://help.skuidify.com/s/tutorials/m/supercharge-your-ui/l/153540-highlighting-critical-data-using-templates-and-custom-components" target="SkuidBuilderHelp">Highlighting Critical Data using Templates and Custom Components</a></li></ul>',
		hideFromComponentsList: false,
		isJSCreateable: true,
		isTransparent: true,
		handleStateEvent: function (a, event, component)
		{
			$bc.handleModelRemove(a, event,
			{
				component: component
			});
			$bc.handleModelIdChange(a, event);
		},
		propertiesRenderer: function (propertiesObj, component)
		{
			propertiesObj.setTitle("Template Properties");
			var state = component.state;
			var properties = [];

			var basicPropsList = [
			{
				id: "model",
				type: "model",
				label: "Model",
				required: false,
				onChange: function ()
				{
					if (component.updateAutoCreatedEditorCondition)
					{
						component.updateAutoCreatedEditorCondition();
					}
					component.save().rebuildProps();
				}
			},
			{
				id: "contents",
				type: "template",
				label: "Template",
				location: "node",
				helptext: "The text or HTML to display in this area. Can contain global Merge-Fields, e.g. {{$Model.Contact.data.0.First_Name__c}}, as well as row/model merge fields (e.g. {{Name}}, {{CreatedDate}}) if you have selected a Model. Row merge fields can be easily added using the Merge-Field Picker on the right.",
				onChange: function ()
				{
					component.refreshText();
				}
			},
			{
				id: "allowhtml",
				type: "boolean",
				label: "Allow HTML",
				defaultValue: false,
				onChange: function ()
				{
					component.refreshText();
				}
			}];

			if (state.attr("model"))
			{
				basicPropsList.push(
				{
					id: "multiple",
					type: "boolean",
					label: "Do not run template on each row",
					defaultValue: false,
					helptext: "Normally, row-based template-rendering logic will be applied, so that the specified template will be run for all data rows in the selected Model. If this property is checked, however, the template will only be run once, in a Model context."
				});
			}

			var actionsTree = [
				$b.core.getActionsTree(
				{
					customNodeId: "actions",
					label: "Actions:",
					linkedComponent: component,
					actionsIndent: 1,
					props: [
					{
						type: "helptext",
						html: "Actions here are triggered by a click in the template area."
					},
					{
						id: "event",
						type: "picklist",
						label: "Event Type",
						defaultValue: "multi",
						picklistEntries: [
						{
							label: "On Mouse Click",
							value: "click"
						}]
						// ,
						// onChange: function (oldVal, newVal)
						// {
						// 	component.save().refresh().rebuildProps();
						// }
					}]
				})
			];

			var advancedPropsList = [
				$bc.coreProps.uniqueIdProp(
				{
					component: component
				}),
				$b.cssClassProp
			];

			// Properties
			properties.push(
				{
					name: 'Basic',
					props: basicPropsList
				},
				{
					name: "Actions",
					tree: actionsTree
				},
				{
					name: 'Advanced',
					props: advancedPropsList
				},
				$bc.getRenderingCategory(
				{
					component: component,
					model: null,
					propViewer: propertiesObj
				})
			);
			propertiesObj.applyPropsWithCategories(properties, state);
		},
		componentRenderer: function (component)
		{
			var state = component.state,
				allowHTML = ("true" === state.attr("allowhtml")),
				contents = state.children("contents").first();

			if (!contents.length)
			{
				var text = state.text();
				contents = $xml("<contents/>");
				if (text)
				{
					contents.text(text);
				}
				state.empty().append(contents);
				component.save();
			}

			var template = $("<div>").css(
			{
				padding: "0.5em"
			}).appendTo(component.body);

			component.setTitle(component.builder.name);
			component.element.css(
			{
				background: "none"
			});
			component.body.css(
			{
				padding: "0"
			});
			component.refreshText = refreshText;
			refreshText();

			function refreshText()
			{
				var text = contents.text();
				if (allowHTML)
				{
					var e = $("<div>").html(text);
					$("iframe", e).replaceWith($('<div class="sk-iframe-placeholder">'));
					$("script", e).replaceWith($('<div class="sk-script-placeholder">'));
					$("style", e).replaceWith($('<div class="sk-style-placeholder">'));

					// replace what's in the template
					template.empty().append(e);
				}
				else
				{
					//get the contents and convert newlines to <br> tags
					template.html($u.nl2br($("<div>").text(text).html()));
				}
			}
		},

		defaultStateGenerator: function ()
		{
			/*jshint -W030 */

			var templateXML = $xml('<mblazonry__template/>');
			templateXML.attr(
			{
				multiple: false,
				cssclass: "mblazonry-template",
				uniqueid: "",
			});

			templateXML.append($xml("<contents/>"));

			var actions = $xml("<actions/>"),
				action = $xml("<action/>");

			action.attr(
			{
				type: 'redirect',
				window: 'self'
			});

			actions.append(action);
			templateXML.append(actions);

			return templateXML;
		}
	}));
})(window.skuid.$, window.skuid);
