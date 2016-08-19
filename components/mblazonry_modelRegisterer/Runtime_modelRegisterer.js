/* jshint -W030 */ // useless and unnecessary code.
/* jshint -W004 */ // x is already defined.

(function ($, skuid, window, undefined)
{
    'use strict';

    /*var $a = skuid.actions;
    var $c = skuid.component;
    var $e = skuid.events;
    var $m = skuid.model;
    var $u = skuid.utils;*/
    //var console = window.console;

    var Runtime_modelRegisterer = function (element, xmlDefinition, component)
    {
        var target,
            models = xmlDefinition.attr('models').split(',');
        if (xmlDefinition.attr('id-toggle') != 'false') {
            var id = $('.nx-pagetitle').first().attr('id');
            target = skuid.component.getById(id);
        } else {
            target = skuid.component.getById(xmlDefinition.attr('title-id'));
        }

        if (target) {
            for (let m of models) {
                target.editor.registerModel(skuid.$M(m));
            }
        } else {
            component.addProblem('No target page title provided for model registerer.');
        }
    };
    skuid.componentType.register("mblazonry__model_registerer", Runtime_modelRegisterer);
})(window.skuid.$, window.skuid, window);
