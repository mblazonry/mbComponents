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

	// CardList globals
	const eventTypes = ["card-dropped", "list-dropped"];

	$b.registerBuilder(new $b.Builder(
	{
		id: "mblazonry__card_list",
		name: "Card List",
		icon: "fa-columns",
		description: 'A Card & List view of your Models and their data.<br/><br/>More information: <ul><li><a href="">Original post on the skuid Community</a></li><li><a href="https://github.com/mBlazonry/mBlazonrySupport/tree/master/Components">mB Support Repo - Components</a></li></ul>',
		handleStateEvent: function (state, event, component)
		{
			$bc.handleModelRemove(state, event,
			{
				component: component
			});
			$bc.handleModelIdChange(state, event);
		},
		/**
		 * Valid Property Types are ["autocomplete", "boolean", "color", "condition", "csssize", "custom", "icon",
		 * "filepath", "model", "models", "multipicklist", "numberbox", "picklist", "quicknumber", "sobject"]
		 */
		propertiesRenderer: function (propertiesObj, component)
		{
			propertiesObj.setTitle("Card List Properties");
			var state = component.state,
				allowOrdering = state.attr("allow-ordering"),
				properties = [];

			var basicListPropsList = [
			{
				id: "list-model",
				type: "model",
				label: "Lists Model",
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
				id: "list-title",
				type: "template",
				label: "List Title",
				location: "node",
				helptext: "The text or HTML to display as List Title. Can contain global Merge-Fields, e.g. {{$Model.Contact.data.0.First_Name__c}}, as well as row/model merge fields (e.g. {{Name}}, {{CreatedDate}}) if you have selected a Model. Row merge fields can be easily added using the Merge-Field Picker on the right.",
				onChange: function ()
				{
					component.refreshText();
				}
			},
			{
				id: "allow-title-html",
				type: "boolean",
				label: "Allow List Title HTML",
				defaultValue: false,
				helptext: "Allow HTML content and mustached stuff in a List Title.",
				onChange: componentSaveRefresh
			},
			{
				id: "list-cross-drop",
				type: "boolean",
				label: "Allow Cross-Component Dropping",
				defaultValue: false,
				helptext: "Normally, a List can only be droppped onto the same component it orginated from. This setting allow items of matching SObject to be dropped onto one another. Somehow..."
			}];

			if (state.attr("list-model"))
			{
				basicListPropsList.splice(getObjKeyValueIndex(basicListPropsList, "id", "list-model"), 0,
				{
					id: "allow-list-ordering",
					type: "boolean",
					label: "Allow List Ordering",
					defaultValue: false,
					onChange: componentSaveRefresh
				},
				{
					id: "allow-list-creation",
					type: "boolean",
					label: "Allow List Creation",
					defaultValue: false,
					onChange: componentSaveRefresh
				});
			}

			var basicCardPropsList = [
			{
				id: "card-model",
				type: "model",
				label: "Cards Model",
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
				id: "list-auto-save",
				type: "boolean",
				label: "Auto-save on Drop",
				defaultValue: false,
				helptext: "Normally, row-based template-rendering logic will be applied, so that the specified template will be run for all data rows in the selected Model. If this property is checked, however, the template will only be run once, in a Model context.",
				onChange: componentSaveRefresh
			},
			{
				id: "card-cross-drop",
				type: "boolean",
				label: "Allow Cross-Component Dropping",
				defaultValue: false,
				helptext: "Normally, a Card can only be droppped unto the same component it orginated from. This setting allow items of matching SObject to be dropped onto one another. Somehow..."
			}];

			if (state.attr("card-model"))
			{
				basicCardPropsList.splice(getObjKeyValueIndex(basicCardPropsList, "id", "card-model"), 0,
				{
					id: "allow-card-ordering",
					type: "boolean",
					label: "Allow Card Ordering",
					defaultValue: false,
					onChange: componentSaveRefresh
				},
				{
					id: "allow-card-creation",
					type: "boolean",
					label: "Allow Card Creation",
					defaultValue: false,
					onChange: componentSaveRefresh
				});
			}

			/**
			 * Gets the index of a key in an object by its value.
			 * @param  {Object} ojects The object to search trough its key/value pairs.
			 * @param  {String} key    The key name, as a string, to search for.
			 * @param  {String} value  The key value, as a string, to search for.
			 * @return {Integer}        The position of the requested key/value pair within the object, 0 if not found.
			 */
			function getObjKeyValueIndex(ojects, key, value)
			{
				for (var i = 0, len = ojects.length; i < len; i++)
				{
					if (ojects[i].key == value)
					{
						return i;
					}
				}
			}

			/**
			 * Utility function to avoid repition in builder code.
			 * Not even sure if this should return anything
			 */
			function componentSaveRefresh()
			{
				return component.save().refresh();
			}

			properties.push(
			{
				name: 'List',
				props: basicListPropsList
			});
			properties.push(
			{
				name: 'Card',
				props: basicCardPropsList
			});

			/**
			 * Used to override the default behavior obsvered by the builder
			 * in the manner the Actions Framework tree is built in the builder.
			 * @param {[type]} comp The component instance in its current state.
			 */
			function ChildrenFunction(comp)
			{
				function camelCaseToDashed(str)
				{
					return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
				}

				var myString = this.label;
				var myRegexp = /(\w*):/g;
				var match = myRegexp.exec(myString);

				var invisibleParent = camelCaseToDashed(match[1]);
				return [$bc.getActionTreeNode(
				{
					linkedComponent: component,
					refreshLinkedComponent: false,
					component: comp,
					treeNode:
					{
						indent: 1,
						invisibleParent: invisibleParent,
						invisibleParentLabel: `Actions on ${$.camelCase(event)}:`,
					}
				})]
			}

			// Allow for arbitrary length action types
			// Instanciates Action trees in the builder
			for (var event of eventTypes)
			{
				var actionsTreeRoot = {
					customNodeId: `actions`,
					label: `Actions on ${$.camelCase(event)}:`,
					linkedComponent: component,
					actionsIndent: 2
				};

				var actions = state.children(`actions`).children(event).children("action").length
				var actionsTree = $bc.getActionsTree(actionsTreeRoot);

				/*jshint loopfunc: true */
				actionsTree.childrenFunction = ChildrenFunction;

				properties.push(
				{
					name: `${$.camelCase(event)}` + (actions ? ` (${actions})` : ""),
					tree: [actionsTree]
				});
			}

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
			component.setTitle(component.builder.name);
			// Create some shortcut variables
			var state = component.state,
				cardList = component.body,
				allowHTML = ("true" === state.attr("allowhtml")),
				contents = state.children("contents").first();

			if (!contents.length)
			{
				contents = $xml("<contents/>");

				var text = state.text();
				if (text)
				{
					contents.text(text);
				}
				state.empty().append(contents);

				component.save();
			}

			cardList.addClass("mblazonry-cardList");

			//////////////////////////
			// FOR LISTS TITLE ONLY //
			//////////////////////////
			component.refreshText = refreshText;

			function refreshText()
			{
				var text = contents.text();
				if (allowHTML)
				{
					cardList.addClass("allowHTML");

					var e = $("<div>").html(text);
					$("iframe", e).replaceWith($('<div class="sk-iframe-placeholder">'));
					$("script", e).replaceWith($('<div class="sk-script-placeholder">'));
					$("style", e).replaceWith($('<div class="sk-style-placeholder">'));

					// replace what's in the template
					cardList.empty().append(e);
				}
				else
				{
					//get the contents and convert newlines to <br> tags
					cardList.html($u.nl2br($("<div>").text(text).html()));
				}
			}
			refreshText();
		},

		defaultStateGenerator: function ()
		{
			var cardListXML = $xml('<mblazonry__card_list/>');
			cardListXML.attr(
			{
				multiple: false,
				cssclass: "",
				uniqueid: "",
			});

			cardListXML.append($xml("<contents/>"));

			var actions = $xml("<actions/>");
			for (var event of eventTypes)
			{
				actions.append($xml(`<${event}/>`).append($xml(`<action/>`)));
			}
			cardListXML.append(actions);

			return cardListXML;
		}
	}));
})(window.skuid.$, window.skuid);
