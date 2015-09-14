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
            this.notice_el = this.$el.find('.js-notice');

            /* Subviews */
            this.header_view = new PageViews.HeaderView({
                'el': this.header_el
            });

            this.notice_view = new module.NoticeView({
                'el': this.notice_el
            });
        }
    });

    module.NoticeView = Backbone.BaseView.extend({
        initialize: function(options) {
            _.bindObj(this);

            /* Cached Elements */
            this.el = options.el;
            this.close_link_el = this.$el.find('.js-close');

            /* DOM Events */
            this.close_link_el.click(this.remove_notice);

            _.delay(_(this.remove_notice).bind(this), 3000);
        },
        remove_notice: function() {
            this.el.fadeOut(500);
            _.delay(_(this.el.remove).bind(this), 500);
        }
    });

})(yotr.module('views.app'));
