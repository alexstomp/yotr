/* JQuery Extensions */

(function ($, undefined) {
    $.fn.getCursorPosition = function() {
        var el = $(this).get(0);
        var pos = 0;
        if ('selectionStart' in el) {
            pos = el.selectionStart;
        } else if ('selection' in document) {
            el.focus();
            var Sel = document.selection.createRange();
            var SelLength = document.selection.createRange().text.length;
            Sel.moveStart('character', -el.value.length);
            pos = Sel.text.length - SelLength;
        }
        return pos;
    }

    $.fn.selectRange = function(start, end) {
        if(!end) end = start;
        return this.each(function() {
            if (this.setSelectionRange) {
                this.focus();
                this.setSelectionRange(start, end);
            } else if (this.createTextRange) {
                var range = this.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            }
        });
    }
})(jQuery);

/* mixin the make function, removed in 0.9.2 */
_.extend(Backbone.View.prototype, {
    make: function(tagName, attributes, content) {
        var el = document.createElement(tagName);
        if (attributes) $(el).attr(attributes);
        if (content) $(el).html(content);
        return $(el);
    }
});

/* mixin the only function */
_.extend(Backbone.Collection.prototype, {
    only: function() {
        var picks = arguments;
        return this.map(function(file_model) {
            return file_model.pick.apply(file_model, picks);
        });
    }
});

_.mixin({
    /*
        _.move - takes array and moves item at index and moves to another index
    */

    move: function (array, from, to) {
        array.splice(to, 0, array.splice(from, 1)[0]);
        return array;
    },

    /*
        _.interval - calls a function once, and then again after each interval
    */

    interval: function(func, interval) {
        /* initial call */
        func();
        return window.setInterval(func, interval);
    },

    /*
    *  _.bindObj - bind all of an objects functions to a particular context.
    */

    bindObj: function(obj) {
        _.bindAll.apply(_, [obj].concat(_.functions(obj)));
    },

    /*
    *  _.passthrough - allows the first call to pass through, then delays for a certain amount of time
    */

    passthrough: function(func, wait) {
        var previous = new Date();
        var result = null;

        return function() {
            var now = new Date();
            var remaining = wait - (now - previous);
            var context = this;
            var args = arguments;

            if (remaining <= 0) {
                previous = now;
                result = func.apply(context, arguments);
            }

            return result;
        };
    },

    /*
    * _.template - creates a common abstraction for creating templates
    */

    template: function(source_el) {
        /* Templates */
        var template = source_el.html();
        Mustache.parse(template);
        return function(attrs) {
            return Mustache.render(template, attrs);
        };
    },

    /*
    * _.url_params - parses parameters from a given url and returns them as a javascript object
    */

    url_params: function(url) {
        /* defaults */
        url = url || window.location.href;

        /* vars */
        var vars = [], hash;
        var hashes = url.slice(url.indexOf('?') + 1).split('&');

        _.each(hashes, function(hash, i) {
            hash = hash.split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        });

        return vars;
    },

    /*
    * _.cookie - gets a cookie in the request
    */

    cookie: function(name) {
        c = document.cookie.split('; ');
        cookies = {};

        for(i = c.length-1; i >= 0; i--){
           C = c[i].split('=');
           cookies[C[0]] = C[1];
        }

        return cookies[name];
    }
});
