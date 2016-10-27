/* jshint -W030 */ // useless and unnecessary code.
/* jshint -W004 */ // x is already defined.
/* jshint -W098 */ // x is unused.

(function ($, skuid, window, undefined)
{
    'use strict';

    var $a = skuid.actions;
    var $c = skuid.component;
    var $e = skuid.events;
    var $m = skuid.model;
    var $u = skuid.utils;
    var console = window.console;

    var Runtime_cardList = function (element, xmlDefinition, component)
    {
        /////////////////////
        // Setting up vars //
        /////////////////////
        var context = (component ? component.context : null),
            model = $m.getModel(xmlDefinition.attr("model"));

        if (!model && !xmlDefinition.attr("model") && context && context.model)
        {
            model = context.model;
        }

        var conditions = component.createConditionsFromXml(xmlDefinition),
            uniqueId = xmlDefinition.attr("uniqueid");

        ///////////////////////////
        // Creating the template //
        ///////////////////////////


        if (component)
        {
            var templateComponent = new $u.TemplateComponent(element,
        {
            model: model,
            context: context,
            conditions: conditions
        });

            component.unregister = function ()
            {
                $c.Component.prototype.unregister.call(component);
                templateComponent.unregister();
            };
        }

        /////////////////////////////////////
        // Top-level || mblazonry-template //
        /////////////////////////////////////
        var cardList = element;

        cardList.addClass("mblazonry-cardList");

        // ################################################################
        // document.ready. event hook
        //
        $(document).ready(function ()
        {

        });
    };
    skuid.componentType.register("mblazonry__card_list", Runtime_cardList);
    $u.registerPlugin("card_list",
    {
        init: (xmlDefinition, component) =>
        {
            return new Runtime_cardList(this, xmlDefinition, component), this.data("object", this), this;
        }
    });
})(window.skuid.$, window.skuid, window);
