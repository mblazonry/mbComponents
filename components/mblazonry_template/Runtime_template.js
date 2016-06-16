/* jshint -W098 */ // x is unused.
/* jshint -W030 */ // useless and unnecessary code.
/* jshint -W004 */ // x is already defined.
/* jslint browser:true, lastsemic:true, esnext:true */

(function ($, skuid, window, undefined)
{
    var $a = skuid.actions;
    var $c = skuid.component;
    var $m = skuid.model;
    var $u = skuid.utils;

    var Runtime_template = function (element, xmlDefinition, component)
    {
        /////////////////////
        // Setting up vars //
        /////////////////////
        var context = (component ? component.context : null),
            model = $m.getModel(xmlDefinition.attr("model")),
            contents = xmlDefinition.children("contents").first(),
            actions = xmlDefinition.children("actions");

        contents = contents.length ? contents[0] : xmlDefinition[0];

        if (!model && !xmlDefinition.attr("model") && context && context.model)
        {
            model = context.model;
        }

        var text = contents.textContent || contents.text,
            conditions = component.createConditionsFromXml(xmlDefinition),
            multiple = xmlDefinition.attr("multiple"),
            isMultiRow = multiple && multiple === "true";

        ///////////////////////////
        // Creating the template //
        ///////////////////////////
        var templateComponent = new $u.TemplateComponent(element,
        {
            model: model,
            allowHTML: "true" === xmlDefinition.attr("allowhtml"),
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

        //////////////////////////////////
        // Top-level || mblazonry-timer //
        //////////////////////////////////
        var template = element;

        template.addClass("mblazonry-template");

        // ################################################################
        // document.ready. event hook
        //
        $(document).ready(function ()
        {
            // Attach a function to the click event
            $('.mblazonry-template').on(
                /**
                 * This event is unique. If a running task is detected there will be no click.
                 * The current user must be on the page and click willingly to fire this event.
                 */
                'click', handleTimerClick);

            function handleTimerClick(event)
            {
                event.stopImmediatePropagation();

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
                    var res = $a.runActionsNode(actionsNode, component, component.context ||
                    {});
                    return res;
                }
            }
        });
    };
    skuid.componentType.register("mblazonry__template", Runtime_template);
    $u.registerPlugin("template",
    {
        init: function (xmlDefinition, component)
        {
            return Runtime_template(this, xmlDefinition, component), this.data("object", this), this;
        }
    });
})(window.skuid.$, window.skuid, window);
