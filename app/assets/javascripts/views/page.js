(function(module) {

    /*
    * Dependencies
    */

    /*
    * Views
    */

    module.HeaderView = Backbone.BaseView.extend({
        initialize: function() {
            _.bindObj(this);

            /* Cached Elements */
            this.show_menu_link_el = this.$el.find('.js-show-menu');
            this.menu_el = this.$el.find('.js-menu');
            this.close_menu_link_el = this.menu_el.find('.js-close-menu');

            /* DOM Events */
            this.show_menu_link_el.click(this.open_menu);
            this.close_menu_link_el.click(this.close_menu);
        },
        open_menu: function() {
            this.menu_el.animate({
                right: 0
            }, 150);
        },
        close_menu: function() {
            this.menu_el.animate({
                right: '-225px'
            }, 200);
        }
    });

})(yotr.module('views.page'));
