'use strict';

(function() {
    var PhotoModel = Backbone.Model.extend({
        initialize: function(imageUrl, index) {
            this.set('url', imageUrl);
            this.set('id', index);
        }
    });

    window.PhotoModel = PhotoModel;
})();
