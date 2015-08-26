(function(module) {

    /*
    * Dependencies
    */

    var PageViews = yotr.module('views.page');

    /*
    * Views
    */

    module.AppView = Backbone.BaseView.extend({
        initialize: function() {
            _.bindObj(this);

            /* Vars */
            this.original_title = document.title;

            /* Cached Elements */
            this.header_el = this.$el.find('.js-header');

            /* Subviews */
            this.header_view = new PageViews.HeaderView({
                'el': this.header_el
            });
        }
    });

})(yotr.module('views.app'));
