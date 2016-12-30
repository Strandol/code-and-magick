'use strict';

(function() {
    var REQUEST_FAILURE_TIMEOUT = 10000;

    var ratingStructure = {
        '1': 'review-rating-one',
        '2': 'review-rating-two',
        '3': 'review-rating-three',
        '4': 'review-rating-four',
        '5': 'review-rating-five'
    };

    var reviewTemplate = document.getElementById('review-template');

    var ReviewView = Backbone.View.extend({
        initialize: function() {
            this._onClick = this._onClick.bind(this);
            this.replaceImage = this.replaceImage.bind(this);
            this.loadFailure = this.loadFailure.bind(this);
        },

        events: {
            'click': '_onClick'
        },

        tagName: 'article',

        className: 'review',

        render: function(reviewsFragment) {
            this.el.appendChild(reviewTemplate.content.cloneNode(true));
            var rating = this.el.querySelector('.review-rating');
            var comment = this.el.querySelector('.review-text');
            var avatarStub = this.el.querySelector('.review-author');

            rating.classList.add(ratingStructure[this.model.get('rating')]);
            comment.textContent = this.model.get('description');

            reviewsFragment.appendChild(this.el);

            if (this.model.attributes.author.picture) {
                this.loadPicture(avatarStub);
            }
        },

        loadPicture: function(avatarStub) {
            this.avatarStub = avatarStub;
            this.avatar = new Image();
            this.avatar.classList.add('review-author');
            this.avatar.src = this.model.attributes.author.picture;

            this.imageLoadTimeout = setTimeout(function() {
                this.el.classList.add('review-load-failure');
            }.bind(this), REQUEST_FAILURE_TIMEOUT);

            this.avatar.addEventListener('error', this.loadFailure);

            this.avatar.addEventListener('load', this.replaceImage);
        },

        replaceImage: function() {
            var avatarStub = this.el.querySelector('.review-author');
            this.avatar.style.backgroundSize = '124px 124px';
            this.el.replaceChild(this.avatar, avatarStub);
            clearTimeout(this.imageLoadTimeout);
        },

        loadFailure: function() {
            this.el.classList.add('review-load-failure');
        },

        _onClick: function(event) {
            event.preventDefault();

            var element = event.target;

            if (!utils.doesHaveParent('review-quiz-answer', element)) {
                return;
            }

            element.textContent === 'Да'
              ? this.model.like()
              : this.model.dislike();
        }
    });

    window.ReviewView = ReviewView;
})();
