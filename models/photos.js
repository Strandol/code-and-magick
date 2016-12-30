'use strict';

(function() {
    var PhotosCollection = Backbone.Collection.extend({
        model: PhotoModel
    });

    window.PhotosCollection = PhotosCollection;
})();
