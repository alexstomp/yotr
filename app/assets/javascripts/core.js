(function(module) {

    /*
    * Backbone.CollectionView
    */

    /* full list of options for all views */
    var view_options = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];
    var collection_view_options = ['model_class', 'view'];
    var all_options = view_options.concat(collection_view_options);


    var BaseView = Backbone.BaseView = Backbone.View.extend({
        transience: false,
        constructor: function(options) {
            Backbone.View.apply(this, arguments);

            this.initialize_(options);
        },
        initialize_: function(options) {
            /* if this view has been marked as transient */
            if (this.transience) {
                yotr.app.on('AppView:navigate', this.remove_);
            }
        },
        remove_: function() {
            /* actually remove the view */
            this.remove();

            /* trigger the close event so we can react to a view getting removed on navigation */
            this.trigger('remove');
        }
    });

    var CollectionView = Backbone.CollectionView = BaseView.extend({
        transcience: true,
        constructor: function(options) {
            this.views = [];

            Backbone.View.apply(this, arguments);

            this.initialize_(options);
            this.initial_events();
        },
        initialize_: function(options) {
            _.defaults(options, {
                'include_html': false,
                'include_class': '',
                'model_class': this.collection.model
            });

            /* Vars */
            _.extend(this, _.pick(options, collection_view_options));
            this.options = _.omit(options, all_options);

            /* Cached Elements */
            this.els = this.$el.children('li' + options.include_class);

            /* check to see if we're going to retrieve data from the DOM by checking
               for the existence of the data-id attribute on the first child */
            if (this.els.first().data('id')) {
                var models_array = [];
                _.each(this.els, function(el) {
                    var $el = $(el);

                    /* create the model for this element */
                    var model = this.model_class.find_or_create($el.data());
                    models_array.push(model);

                    /* implant the html if we specified that we need to */
                    if (this.options.include_html) {
                        model.set('html', $el.prop('outerHTML'));
                    }

                    /* mixin with the options we received for the collection */
                    var attrs = {
                        'el': el,
                        'model': model
                    };
                    var options = _.extend(attrs, this.options);
                    var view = new this.view(options);

                    /* add to our local array of views */
                    this.views.push(view);
                }, this);
                this.collection.reset(models_array);
            }
            else {
                /* pre-populate the collection with the current models */
                this.collection.each(function(model, i) {
                    var el = this.els[i];
                    var $el = $(el);

                    /* implant the html if we specified that we need to */
                    if (this.options.include_html && !model.has('html')) {
                        model.set('html', $el.prop('outerHTML'));
                    }

                    /* mixin with the options we received for the collection */
                    var attrs = {
                        'el': el,
                        'model': model
                    };
                    var options = _.extend(attrs, this.options);
                    var view = new this.view(options);

                    /* add to our local array of views */
                    this.views.push(view);
                }, this);
            }

            /* if this view is marked as transient */
            if (this.transience) {
                yotr.app.on('BaseView:close', this.close);
            }
        },
        initial_events: function() {
            /* Events */
            this.listenTo(this.collection, 'add', this.add_view);
            this.listenTo(this.collection, 'change:modified', this.edit_view);
            this.listenTo(this.collection, 'remove', this.remove_view);
            this.listenTo(this.collection, 'reset', this.add_all_views);
        },
        add_all_views: function(collection) {
            /* clear out the list element */
            this.$el.children('li' + this.options.include_class).remove();

            /* add all of the views to this list element */
            collection.each(this.add_view);
        },
        add_view: function(model) {
            var attrs = {
                'model': model,
                'el': model.get('html')
            };
            /* mixin with the options we received for the collection */
            var options = _.extend(attrs, this.options);
            var view = new this.view(options);

            /* find the index of the model in the collection, and also its
               previous index */
            var i = this.collection.indexOf(model);
            var prev_i = i - 1;

            /* put the view in our local array of views */
            this.views.splice(i, 0, view);

            /* refresh the elements */
            this.els = this.$el.children('li' + this.options.include_class);

            /* put the post at the correct location in the DOM */
            if (prev_i > -1) {
                $(this.els[prev_i]).after(view.el);
            }
            else {
                this.$el.prepend(view.el);
            }

            /* call the add event on the view itself */
            view.trigger('add');

            /* call the add_view event */
            this.trigger('add_view', view);
        },
        edit_view: function(model) {
            var attrs = {
                'model': model,
                'el': model.get('html')
            };
            /* mixin with the options we received for the collection */
            var options = _.extend(attrs, this.options);
            var view = new this.view(options);

            /* get the current view that we're replacing */
            var curr_view = this.get(model);

            /* replace the view in our array */
            var index = this.collection.indexOf(model);
            this.views[index] = view;

            /* replace the old view with the new one */
            curr_view.$el.replaceWith(view.el);

            /* trigger the edit event */
            this.trigger('edit_view', view);

            /* remove the current view */
            curr_view.remove();
        },
        remove_view: function(model) {
            _.every(this.views, function(view, index) {
                /* use cid b/c we won't always have the id for unsynced models */
                if (view.model.cid === model.cid) {
                    /* remove the view from the DOM */
                    view.remove();

                    /* remove from our list of views */
                    this.views.splice(index, 1);

                    /* call the remove event on the view itself */
                    view.trigger('remove');

                    /* call the add_view event */
                    this.trigger('remove_view', view);

                    return false;
                }

                /* _.every loop breaks on false, so to counter the offset model id, return true in else fork */
                return true;
            }, this);
        },

        /*
        * Utility
        */

        get: function(model) {
            return _.find(this.views, function(view, index) {
                /* use cid b/c we won't always have the id for unsynced models */
                if (view.model.cid === model.cid) {
                    return true;
                }
                return false;
            }, this);
        }
    });

    /*
    * Backbone.ModelView
    */

    var ModelView = Backbone.ModelView = BaseView.extend({
        transcience: true,
        constructor: function() {
            Backbone.View.apply(this, arguments);
        }
    });

})(yotr.module('modules.core'));
