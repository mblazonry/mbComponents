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

    var Runtime_modelRefresher = function (element, xmlDefinition, component)
    {
        var model,
            models = xmlDefinition.attr('models').split(','),
            interval = xmlDefinition.attr('interval');

        function refreshModel() {
            var temp = skuid.$M(model);

            if (Object.keys(temp.changes).length <= 0) {
                temp.updateData();
            }
        }

        if (interval !== '') {
            for (let m of models) {
                model = m;
                setInterval(refreshModel, interval * 1000);
            }
        } else {
            component.addProblem('No refresh interval provided to model refresher.');
        }
    }
    skuid.componentType.register("mblazonry__model_refresher", Runtime_modelRefresher);
})(window.skuid.$, window.skuid, window);
