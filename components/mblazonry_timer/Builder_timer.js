(function ($, skuid, undefined)
{
	'use strict';
	/*jshint -W030 */
	/*jslint browser:true, lastsemic:true, unused:false */

	// Create some shortcut variables
	$ = skuid.$; // should equiv skuid.jquery
	var bc = skuid.builder.core;
	var $xml = skuid.utils.makeXMLDoc;
	var $j = $.noConflict();
	var $S = skuid;

	skuid.builder.registerBuilder(new skuid.builder.Builder(
	{
		id: 'mblazonry__timer',
		name: 'Timer',
		icon: 'sk-icon-versions', // looks like a clock
		description: 'Records and displays elapsed time.',
		handleStateEvent: function (c, event, f)
		{
			var changeEvent = "model.idChange" === event.type,
				removeEvent = "model.remove" === event.type,
				update = false;
			removeEvent && skuid.builder.core.handleModelRemove(c, event,
			{
				component: f
			}),
			changeEvent && skuid.builder.core.handleModelIdChange(c, event), (removeEvent || changeEvent) && c.children("actions").first().children('action[type="savecancel"]').each(function ()
			{
				$(this).children("models").first().children("model").each(function ()
				{
					var a = $(this).text();
					removeEvent && a === event.modelId ? ($(this).remove(), update = true) : changeEvent && a === event.oldId && ($(this).text(event.newId), update = true);
				});
			}),
			update && skuid.events.publish("skuidBuilderNeedSave");
		},
		propertiesRenderer: function (propertiesObj, component)
		{
			propertiesObj.setHeaderText("Timer Properties");
			var state = component.state;
			var properties = [];

			var basicPropsList = [
				{
					label: "Setup:",
				}, // spacer. to make the properties align properly in the builder window.
				{
					id: 'model',
					type: 'model',
					label: 'CurrentUser Model',
					required: true,
					onChange: function ()
					{
						component.updateAutoCreatedEditorCondition && component.updateAutoCreatedEditorCondition(),
						component.save().rebuildProps().refresh();
					}
				},
				{
					id: "userId",
					type: "integer",
					location: "attribute",
					label: "CurrentUser Id"
				},
				{ // spacer.
					label: "IMPORTANT! fire the events to the right->",
					value: "What!"
				},
				{ // spacer.
					label: "Timer Events:",
				},
				{
					id: 'onTimerStartedEvent',
					type: 'string',
					label: 'Timer Start Event',
					helptext: 'Event to fire when the timer is started',
					placeholder: "none",
					onChange: function ()
					{
						component.refresh();
					},
					required: false
				},
				{
					id: 'onTimerDoneEvent',
					type: 'string',
					label: 'Timer Done Event',
					helptext: 'Event to fire when the timer is done',
					placeholder: "none",
					onChange: function ()
					{
						component.refresh();
					},
					required: false
				},
				{
					id: "pendingTimerActions",
					type: "template",
					helptext: "This is true if timer has a pending event",
					location: "attribute",
					label: "Pending Actions Field",
					onChange: function ()
					{
						component.refresh();
					},
					required: true
				},
			];
			var fieldsList =
				[
				{ // spacer.
					label: "Destination Fields on 'user' Model :"
				},
				{
					id: "startTimeDestField",
					type: "template",
					helptext: "Field to store our Start time to. The value type is Datetime.",
					location: "attribute",
					label: "Start Time destination field",
					onChange: function ()
					{
						component.refresh();
					},
					required: true
				},
				{
					id: "endTimeDestination",
					type: "template",
					helptext: "Field to store the Timer Stop time to. The value type is Datetime.",
					location: "attribute",
					label: "End Time destination field",
					onChange: function ()
					{
						component.refresh();
					},
					required: true
				},
				{ // spacer.
					label: "UI-Only and Notes Field :"
				},
				{
					id: "startTimeTempField",
					type: "template",
					helptext: "Field to temporarily store the Timer Start time to. We reccomend storing this value to the 'CurrenUser' model as (UI-Only). Value is of type Datetime.",
					location: "attribute",
					label: "Start Time Temp Field",
					onChange: function ()
					{
						component.refresh();
					},
					required: true
				},
				{
					id: "timerNotes",
					type: "template",
					helptext: "Field to store Timer task notes to. Value is a richText field.",
					location: "attribute",
					label: "Timer Notes destination",
					onChange: function ()
					{
						component.refresh();
					}
				}];
			var actionsTree = [
				$S.builder.core.getActionsTree(
				{
					customNodeId: "onstartactions",
					label: "Timer Started:",
					linkedComponent: component,
					actionsIndent: 1,
					props: [
					{
						type: "helptext",
						html: "'Timer Started' actions will be run when the timer is started."
					}]
				}),
				$S.builder.core.getActionsTree(
				{
					customNodeId: "ondoneactions",
					label: "Timer Done:",
					linkedComponent: component,
					actionsIndent: 1,
					props: [
					{
						type: "helptext",
						html: "'Timer Done' actions will be run when the timer is stopped."
					}]
				})
			];
			var advancedPropsList = [
				{
					id: 'counterStartLabel',
					type: 'string',
					label: 'Start label for button',
					helptext: 'Timer Start label for button.',
					onChange: function (label)
					{
						component.body.find(".mblazonry-timer-button > .ui-button-text").text(label);
					},
					required: true
				},
				{
					id: 'counterStopLabel',
					type: 'string',
					label: 'Stop label for button',
					helptext: 'Timer Stop label for button.',
					required: true
				},
				{
					id: 'timerIcon',
					type: 'icon',
					label: 'Timer Icon',
					helptext: 'Icon for timer.',
					defaultValue: 'sk-icon-opportunities',
					onChange: function ()
					{
						component.refresh();
					},
					required: true
				},
				{
					id: "recColor",
					type: "color",
					label: "Recording Color",
					defaultValue: "red",
					placeholder: "default",
					onChange: function ()
					{
						component.refresh();
					},
					required: true
				},
				{
					id: "pollInterval",
					type: "string",
					label: "Poll Interval",
					helptext: "Number of minutes between timer polls. Should be no less than 2 minutes.",
					defaultValue: "2",
					placeholder: "poll every x minutes",
					onChange: function ()
					{
						component.refresh();
					},
					required: true
				},
				skuid.builder.core.coreProps.cssClassProp(),
				skuid.builder.core.coreProps.uniqueIdProp(
				{
					component: this,
					onChange: function ()
					{
						component.refresh();
					}
				}),
				{}, // spacer.
			];

			// Properties
			properties.push(
			{
				name: 'Basic',
				props: basicPropsList
			},
			{
				name: "Fields",
				props: fieldsList
			},
			{
				name: "Actions",
				tree: actionsTree
			},
			{
				name: 'Advanced',
				props: advancedPropsList
			});
			propertiesObj.applyPropsWithCategories(properties, state);
		},
		componentRenderer: function (component)
		{
			component.setTitle(component.builder.name);
			// Create some shortcut variables
			var timerState = component.state,
				timer = component.body;
			timer.addClass("mblazonry-timer");

			$(document).ready(function ()
			{
				$('.nx-pagebuilder-workspace > .nx-pagebuilder-component > .nx-pagebuilder-component-body > .nx-pagebuilder-header-component .nx-pagebuilder-component:has(> .mblazonry-timer)').css('background', 'inherit');
				$('.nx-pagebuilder-workspace > .nx-pagebuilder-component > .nx-pagebuilder-component-body > .nx-pagebuilder-header-component .nx-pagebuilder-component:has(> .mblazonry-timer)').addClass('nx-pagebuilder-component-transparent-darkbg');
				$('.nx-pagebuilder-workspace > .nx-pagebuilder-component > .nx-pagebuilder-component-body > .nx-pagebuilder-acceptor .nx-pagebuilder-component:has(> .mblazonry-timer)').removeClass('nx-pagebuilder-component-transparent-darkbg');
			});


			var button = $("<div>").addClass("mblazonry-timer-button"),
				counterStartLabel = timerState.attr("counterStartLabel") || "Start",
				counterStopLabel = timerState.attr("counterStopLabel") || "Stop",
				timerIcon = timerState.attr("timerIcon"),
				recColor = timerState.attr("recColor");

			button.text(counterStartLabel).skooButton(
			{
				icon: timerIcon
			});

			$(".mblazonry-timer-button .ui-icon").css(
			{
				"color": recColor || "#45A840"
			});
			timer.append(button);

			// mblazonry-timer-counter
			var counter = $('<span id="counter">').addClass('counter counter-analog3'),
				label = "\t[HH:MM]";

			counter.text(label).addClass("sk-navigation-item-iconlabel");
			timer.append(counter);
		},
		/**
		 * This emthod is called by the skuid page builder when a component is first placed
		 * onto a page to generate its initial XML tree structure and field values.
		 * These are then read by the builder editor when displaying component attributes.
		 * @return {String} the default XML tree layout and configurations for this component
		 */
		defaultStateGenerator: function ()
		{
			/*jshint -W030 */

			// Some component defaults;
			var TIMER_STARTED_EVENT = 'mblazonryTimerStartedEvent';
			var TIMER_DONE_EVENT = 'mblazonryTimerDoneEvent';

			// Almost useless to have this
			var lastModel = skuid.builder.core.getLastSelectedModelComponent(),
				model = lastModel && lastModel.state ? lastModel.state.attr("id") : null;

			var timerXML = $xml('<mblazonry__timer/>');
			timerXML.attr(
			{
				model: model || "master_CurrentUser",
				userId: "",
				onTimerStartedEvent: TIMER_STARTED_EVENT,
				onTimerDoneEvent: TIMER_DONE_EVENT,
				pendingTimerActions: "",
				startTimeTempField: "",
				startTimeDestField: "",
				endTimeDestination: "",
				counterStartLabel: "Start",
				counterStopLabel: "Stop",
				timerIcon: "sk-icon-opportunities",
				recColor: "red",
				pollInterval: "2",
				timerNotes: "",
				cssclass: "",
				uniqueid: "",
			});
			var onStartActions = $xml("<onstartactions/>"),
				onStartAction = $xml("<action/>"),
				onDoneActions = $xml("<ondoneactions/>"),
				onDoneAction = $xml("<action/>");

			onStartAction.attr(
			{
				type: 'showPopup',
			});
			onDoneAction.attr(
			{
				type: 'showPopup',
			});

			onStartActions.append(onStartAction);
			onDoneActions.append(onDoneAction);
			timerXML.append(onStartActions);
			timerXML.append(onDoneActions);
			return timerXML;
		}
	}));
})(window.skuid.$, window.skuid);
