'use strict';

(function() {
    var VIDEO_WIDTH = 300;
    var VIDEO_HEIGHT = 300;

    var VideoView = Backbone.View.extend({
        initialize: function() {
            this._onClick = this._onClick.bind(this);
        },

        events: {
            'click': '_onClick'
        },

        tagName: 'video',

        render: function() {
            this.el.width = VIDEO_WIDTH;
            this.el.height = VIDEO_HEIGHT;
            this.el.loop = 'loop';
            this.el.playbackRate = 0;
            this.el.poster = photoGallery._photosCollection.models[photoGallery._currentPhoto].get('preview');
            this.el.src = photoGallery._photosCollection.models[photoGallery._currentPhoto].get('url');

            var currentImage = photoGallery.photoReview.querySelector('img') || photoGallery.photoReview.querySelector('video');

            currentImage !== null
                ? photoGallery.photoReview.replaceChild(this.el, currentImage)
                : photoGallery.photoReview.appendChild(this.el);
        },

        _onClick: function(event) {
            event.preventDefault();

            var element = event.target;
            element.poster = '';

            element.paused
                ? element.play()
                : element.pause();
        }
    });

    window.VideoView = VideoView;
})();
