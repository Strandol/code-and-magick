/* global Backbone: true ReviewModel: true*/

'use strict';

(function() {
    var reviewsCollection = Backbone.Collection.extend({
        model: ReviewModel,
        url: 'data/reviews.json'
    })
})();
