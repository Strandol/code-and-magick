/* global Backbone: true ReviewModel: true*/

'use strict';

(function() {
    var ReviewsCollection = Backbone.Collection.extend({
        model: ReviewModel,
        url: 'data/reviews.json'
    })
})();
