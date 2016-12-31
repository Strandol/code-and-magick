'use strict';

(function() {
    var PhotoModel = Backbone.Model.extend({
        initialize: function(imageUrl, videoUrl, index) {
            this.set('preview', imageUrl);
            this.set('url', videoUrl);
            this.set('id', parseInt(index, 10));
        }
    });

    window.PhotoModel = PhotoModel;
})();
