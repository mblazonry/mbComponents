(function (window, $, $S, undefined)
{
	'use strict';
	/* jslint unused:false */

	$S.componentType.register('mblazonry__popupcontroller', function (domElement, xmlConfig, component)
	{
		// obtain component properties
		var self = domElement,
			oncreate = xmlConfig.attr('oncreate'),
			onopen = xmlConfig.attr('onopen'),
			onbeforeclose = xmlConfig.attr('onbeforeclose'),
			onclose = xmlConfig.attr('onclose'),
			hideclose = 'true' === xmlConfig.attr('hideclose'),
			disableescape = 'true' === xmlConfig.attr('disableescape');

		// helper variables to identify things we need or might want to use
		var stateKey = '__mblazonrypopupstate__',
			context = component.context,
			model = context && context.model,
			row = context && context.row,
			rowId = row && row.Id,
			popup = context && context.popup,
			state = popup && $(popup).data(stateKey);

		// if we cannot find the popup, we'll bail since something unxpected has occurred
		if (!popup)
		{
			throw 'No popup was detected!!';
		}

		// if we have not established our state on the popup
		// we only want to hook events once
		if (!state)
		{
			// hook dialogcreate event
			$(popup).on('dialogcreate', function (event, ui)
			{
				// if onCreate snippet is specified
				if (oncreate)
				{
					// get the snippet
					var snippet = $S.snippet.getSnippet(oncreate);
					// if we have the snippet, call it else log warning
					if (snippet)
					{
						snippet();
					}
					else
					{
						window.console.warn('Snippet \'' + oncreate + '\' was specified for onCreate but was not found.');
					}
				}
			});

			// hook dialogopen event
			$(popup).on('dialogopen', function (event, ui)
			{
				// if hiding the 'X'
				if (hideclose)
				{
					$(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close').hide();

					// Hide header if no title is provided
					if ($(this).closest('.ui-dialog').find('.ui-dialog-title').is(':empty'))
					{
						$(this).closest('.ui-dialog').find('.ui-dialog-titlebar').hide();
					}
				}

				// if disabling the escape key from closing the dialog
				if (disableescape)
				{
					$(this).dialog('option', 'closeOnEscape', false);
				}

				// if onOpen snippet is specified
				if (onopen)
				{
					var snippet = $S.snippet.getSnippet(onopen);
					// if we have the snippet, call it else log warning
					if (snippet)
					{
						snippet();
					}
					else
					{
						window.console.warn('Snippet \'' + onopen + '\' was specified for onOpen but was not found.');
					}
				}
			});

			// hook dialogbeforeclose event
			$(popup).on('dialogbeforeclose', function (event, ui)
			{
				// if onBeforeClose snippet is specified
				if (onbeforeclose)
				{
					var snippet = $S.snippet.getSnippet(onbeforeclose);
					// if we have the snippet, call it else log warning
					if (snippet)
					{
						// determine if it was titlebar close icon or the escape key that initiated the close
						var originalEventTarget = event.originalEvent && event.originalEvent.currentTarget,
							wasXButton = (originalEventTarget && $(originalEventTarget).hasClass('ui-dialog-titlebar-close')) || false,
							wasEscapeKey = event.keyCode === $.ui.keyCode.ESCAPE;

						// execute the snippet passing in arguments indicating whether it was
						// the 'X' or the escape key (they both could be false)
						// return the value returned from snippet to allow for stopping the dialog from closing
						// if the snippet returns false
						return snippet(
						{
							wasXButton: wasXButton,
							wasEscapeKey: wasEscapeKey
						});
					}
					else
					{
						window.console.warn('Snippet \'' + onbeforeclose + '\' was specified for onBeforeClose but was not found.');
					}
				}
			});

			$(popup).on('dialogclose', function (event, ui)
			{
				// if onClose snippet is specified
				if (onclose)
				{
					// if we have the snippet, call it else log warning
					var snippet = $S.snippet.getSnippet(onclose);
					if (snippet)
					{
						snippet();
					}
					else
					{
						window.console.warn('Snippet \'' + onclose + '\' was specified for onClose but was not found.');
					}
				}
			});

			// set our own data on the popup element
			state = {};
			$(popup).data(stateKey, state);
			// add a class to dialog in case we want styling
			$(popup).addClass('mblazonry-popup');
		}
	});
})(window, window.skuid.$, window.skuid);
