/* global Backbone: true*/

'use strict';

(function() {
    var ReviewModel = Backbone.Model.extend({
        initialize: function() {
            this.set('liked', false);
        },

        like: function() {
            this.set('liked', true);
        },

        dislike: function() {
            this.set('liked', false);
        }
    });

    window.ReviewModel = ReviewModel;
})();
