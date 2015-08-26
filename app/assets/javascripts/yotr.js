/* create a noop implementation of window.console,
   so browsers that don't support it won't trip up */
if (!(window.console && console.log)) {
    console = {
        log: function(){},
        debug: function(){},
        info: function(){},
        warn: function(){},
        error: function(){}
    };
}

/*
* Main App
*/

var yotr = {
    app: Backbone.Events,

    /*
    * Backbone Models and Collections
    */

    models: {},
    collections: {},

    /*
    * Module System
    */

    module: function() {
        var modules = {};

        return function(name) {
            if (modules[name]) {
                return modules[name];
            }

            modules[name] = {};
            return modules[name];
        };
    }(),
    log: function(msg) {
        console.log(msg);
    }
};

$(function() {
    var RouterModule = yotr.module('modules.router');

    /* App router */
    yotr.router = new RouterModule.Router();

    /* Start HTML5 history support */
    Backbone.history.start({
        'hashChange': false,
        'root': '/'
    });
});
