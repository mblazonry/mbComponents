/* jshint -W030 */ // useless and unnecessary code.
/* jshint -W004 */ // x is already defined.

(function ($, skuid, window, undefined)
{
    'use strict';

    var $a = skuid.actions;
    var $c = skuid.component;
    var $e = skuid.events;
    var $m = skuid.model;
    var $u = skuid.utils;
    var console = window.console;

    var Runtime_template = function (element, xmlDefinition, component)
    {
        /////////////////////
        // Setting up vars //
        /////////////////////
        var context = (component ? component.context : null),
            model = $m.getModel(xmlDefinition.attr("model")),
            contents = xmlDefinition.children("contents").first(),
            actions = xmlDefinition.children("actions"),
            eventType = actions.attr("event"),
            isClickEvent = (eventType === "click"),
            eventName = actions.attr("eventname");

        contents = contents.length ? contents[0] : xmlDefinition[0];

        if (!model && !xmlDefinition.attr("model") && context && context.model)
        {
            model = context.model;
        }

        var text = contents.textContent || contents.text,
            conditions = component.createConditionsFromXml(xmlDefinition),
            multiple = xmlDefinition.attr("multiple"),
            isMultiRow = multiple && multiple === "true",
            allowHTML = "true" === xmlDefinition.attr("allowhtml"),
            isHidden = "true" === xmlDefinition.attr("hidden"),
            uniqueId = xmlDefinition.attr("uniqueid");

        ///////////////////////////
        // Creating the template //
        ///////////////////////////
        var templateComponent = new $u.TemplateComponent(element,
        {
            model: model,
            allowHTML: allowHTML,
            templateBody: text,
            isMultiRow: isMultiRow,
            context: context,
            conditions: conditions
        });

        if (component)
        {
            component.unregister = function ()
            {
                $c.Component.prototype.unregister.call(component);
                templateComponent.unregister();
            };
        }

        /////////////////////////////////////
        // Top-level || mblazonry-template //
        /////////////////////////////////////
        var template = element;

        template.addClass("mblazonry-template");

        if (allowHTML)
        {
            template.addClass("allowHMTL");
        }

        if (isHidden)
        {
            template.addClass("hidden");
        }

        // only make clickable if we have
        // click enbaled and actions to run.
        if (isClickEvent && actions.children().length)
        {
            eventName = eventType;
            template.addClass("clickable");
        }

        // ################################################################
        // document.ready. event hook
        //
        $(document).ready(function ()
        {
            if (isClickEvent)
            {
                $(`#${uniqueId}`).on(eventName, handle);
            }
            else
            {
                $e.subscribe(eventName, handle);
            }

            function handle(event)
            {
                // Run action framework actions if any
                if (actions)
                {
                    runActions(actions);
                }
            }

            /**
             * Takes an XML top-level action node and runs all of its child actions.
             * @param  {Object} actionsNode the XML top-level action node
             */
            function runActions(actionsNode)
            {
                if (actionsNode && actionsNode.length)
                {
                    var msg = `Event ${eventType} on ${uniqueId} `;

                    $a.runActionsNode(actionsNode, component, component.context ||
                    {}).then(() =>
                    {
                        console.log(msg + "succeded!");
                    }, () =>
                    {
                        console.log(msg + "errored :(");
                    });
                }
            }
        });
    };
    skuid.componentType.register("mblazonry__template", Runtime_template);
    $u.registerPlugin("template",
    {
        init: (xmlDefinition, component) =>
        {
            return new Runtime_template(this, xmlDefinition, component), this.data("object", this), this;
        }
    });
})(window.skuid.$, window.skuid, window);
