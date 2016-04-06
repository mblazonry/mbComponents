/**
 * Runtime-side execution of a component
 * @function
 * @inner
 * @name 'Component_runtime'
 * @param  {object} window - A reference to the window object
 * @param  {object} $ - The jQuery selector
 * @param  {object} $S - a reference to the $skuid environment variable
 */
(function (window, $, $S, undefined)
{
	/**
	 * @namespace skuid
	 */
	'use strict';
	/* jshint -W098 */ // x is unused.
	/* jshint -W030 */ // useless and unnecessary code.
	/* jshint -W004 */ // x is already defined.
	/* jslint browser:true, lastsemic:true */
	//var $j = $.noConflict();

	/**
	 *
	 * @memberOf skuid
	 * @namespace skuid.componentType
	 */
	$S.componentType
	/**
	 * Registers a Component Type with the given typeName.
	 * 	A registered Component Type acts like a constructor
	 * 	or initializer for that Component.
	 * @example $S.componentType.register()
	 * @inner
	 * @function
	 * @name register
	 * @memberOf skuid.componentType
	 * @param {string} typeName           The name of the registered Component Type
	 *                                    e.g. "fieldeditor", "barchart", "calendar"
	 * @param {function} typeDefinition   A function that "initializes" or "constructs"
	 *                                    an instance of the Component.
	 *                                    The function has the following signature:
	 *                                    function( element, xmlDefinition, component )
	 */
	.register('mblazonry__timer',
		/**
		 * @author aklef
		 * @function
		 * @example See {@link http://help.skuidify.com/m/11720/l/205435?data-resolve-url=true&data-manual-id=11720|skuid.component.Component}
		 * @name 'Runtime_timer'
		 * @namespace Runtime_timer
		 * @param  {'jQuery-wrapped DOM element'} element
		 *                             The root/parent element for the new Component.
		 *                             (This element may or may not
		 *                             	be attached to the DOM.)
		 * @param  {'jQuery-wrapped JS XMLDoc'} xmlDefinition
		 *                            ???? TODO
		 * @param  {skuid.component.Component} component
		 *         A Component instance for your typeDefinition function to interact with.
		 */
		function (element, xmlDefinition, component)
		{
			/////////////////////////////////
			// Obtain component properties //
			/////////////////////////////////
			var onPageLoad = xmlDefinition.attr('onPageLoad'),
				onStart = xmlDefinition.attr('onStart'),
				onDone = xmlDefinition.attr('onDone'),
				timerLabel = xmlDefinition.attr("timerLabel"),
				recColor = xmlDefinition.attr("recColor"),
				timerIcon = xmlDefinition.attr("timerIcon");

			var msg = 'Snippets found:' +
				'\n\tonPageLoad: \'' + (onPageLoad ? "true" : "false") + '\',' +
				'\n\tonTimerStart: \'' + (onStart ? "true" : "false") + '\',' +
				'\n\tonTimerDone: \'' + (onDone ? "true" : "false") + '\',';
			//window.console.warn(msg);

			msg = 'Configs found:' +
				'\n\ttimerLabel: \'' + (timerLabel ? "true: " + timerLabel : "false") + '\',' +
				'\n\trecColor: \'' + (recColor ? "true: " + recColor : "false") + '\',' +
				'\n\ttimerIcon: \'' + (timerIcon ? "true: " + timerIcon : "false") + '\',' +
				'\n\tjQuery verison \'' + $.fn.jquery + '\'\n';
			window.console.warn(msg);

			// Remove handlebars
			function noStache(stached)
			{
				var noStache = /{{\s*([^}]+)\s*}}/g;

				return noStache.exec(stached)[1];
			}
			// instantiate a model
			//var userModel = $S.model.getModel(xmlDefinition.attr("userModel")),
			var userModel = $S.model.getModel(xmlDefinition.attr("model")),
				row = userModel && userModel.getFirstRow(), // first row is our record
				user_name = row && userModel.getFieldValue(row, 'Name');
			var start_time_field = noStache(xmlDefinition.attr("startTime")),
				timer_Start_Time = row && userModel.getFieldValue(row, start_time_field);

			///////////////////////////
			// Our outer content div //
			///////////////////////////
			// mblazonry-timer
			//var timer = $j('<div>');
			var timer = element;
			timer.addClass("mblazonry-timer");

			// mblazonry-timer-button
			var button = $("<div>").addClass("mblazonry-timer-button");

			button.text(timerLabel).skooButton(
			{
				icon: timerIcon
			});

			timer.append(button);
			//element.append(button);

			$(".mblazonry-timer-button .ui-icon").css(
			{
				"color": recColor
			});

			//////////////////
			// Time section //
			//////////////////
			// mblazonry-timer-counter
			var counter = $('<span id="counter">').addClass('counter counter-analog3').addClass("mblazonry-timer-counter");
			timer.append(counter);

			var info = $("<div>");
			info.append(
				"<ul> " +
				"<li> userId: \'" + noStache(xmlDefinition.attr("userId")) + "\'</li>" +
				"<li> userModel: \'" + userModel + "\'</li>" +
				"<li> timer_Start_Time: \'" + timer_Start_Time + "\'</li>" +
				"<li> user_name: \'" + user_name + "\'</li>" +
				"</ul>"
			); //timer.append(info);

			// ################################################################
			// helper variables to identify things we need or might want to use
			var stateKey = '__mblazonrytimerstate__',
				context = component.context,
				//model = $S.$M, // Timer module?
				timer = context,
				state = timer && $(timer).data(stateKey);
			// if we have not established our state on the timer
			// we only want to hook events once
			if (!state)
			{
				// hook documentready event
				$(document).ready(function ()
				{
					button.on('click ', function ()
					{
						window.alert('Starting coounter!');
						$('.mblazonry-timer-counter').counter(settings);
					});

					// check for onLoad snippet
					if (onPageLoad)
					{
						// get the snippet
						var snippet = $S.snippet.getSnippet(onPageLoad);

						if (snippet) // if we have the snippet, call it, else log warning
						{
							snippet();
						}
						else
						{
							window.console.warn('Snippet \'' + onPageLoad + '\' was specified for onPageLoad but was not found.');
						}
					}
					// debug
					$('.nx-page-region').append(info);

					var settings = {
						initial: '00:00:00',
						direction: 'up',
						format: '23:59:59'
					};

					// if onStart snippet is specified
					if (onStart)
					{
						// get the snippet
						var snippet = $S.snippet.getSnippet(onStart);
						// if we have the snippet, call it else log warning
						(snippet ? snippet() : window.console.warn('Snippet \'' + onStart + '\' was specified for onStart but was not found.'));
					}
					// if onDone snippet is specified
					if (onDone)
					{
						// get the snippet
						var snippet = $S.snippet.getSnippet(onDone);
						// if we have the snippet, call it else log warning
						if (snippet)
						{
							snippet();
						}
						else
						{
							window.console.warn('Snippet \'' + onDone + '\' was specified for onDone but was not found.');
						}
					}
				});

				// set our own data on the timer element
				state = {};
				$(timer).data(stateKey, state);
			}
		});
})(window, window.skuid.$, window.skuid);
