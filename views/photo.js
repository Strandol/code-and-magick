'use strict';

(function() {
    var IMAGE_WIDTH = 300;
    var IMAGE_HEIGHT = 300;

    var PhotoView = Backbone.View.extend({
        tagName: 'img',

        render: function() {
            this.el.width = IMAGE_WIDTH;
            this.el.height = IMAGE_HEIGHT;
            this.el.src = photoGallery._photosCollection.models[photoGallery._currentPhoto].get('url');

            var currentImage = photoGallery.photoReview.querySelector('img');

            currentImage !== null
                ? photoGallery.photoReview.replaceChild(this.el, currentImage)
                : photoGallery.photoReview.appendChild(this.el);
        }
    });

    window.PhotoView = PhotoView;
})();
