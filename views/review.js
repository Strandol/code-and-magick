'use strict';

(function() {
  var ratingStructure = {
      '1': 'review-rating-one',
      '2': 'review-rating-two',
      '3': 'review-rating-three',
      '4': 'review-rating-four',
      '5': 'review-rating-five'
  };

    var REQUEST_FAILURE_TIMEOUT = 10000;

    var reviewTemplate = document.getElementById('review-template');

    var ReviewView = Backbone.View.extend({
        initialize: function() {

        },

        events: {
            'click': '_onClick'
        },

        tagName: 'article',

        className: 'review',

        render: function() {
            this.el.appendChild(reviewTemplate.content.children[0].cloneNode(true));
            var rating = this.el.querySelector('.review-rating');
            var comment = this.el.querySelector('.review-text');
            var avatarStub = this.el.querySelector('.review-author');

            rating.classList.add(ratingStructure[this.model.get('rating')]);
            comment.textContent = this.model.get('description');

            this.el.appendChild(this.el);

            if (this.model.get('picture')) {
                this.avatar = new Image();
                this.avatar.classList.add('review-author');
                this.avatar.src = this.model.get('picture');

                var imageLoadTimeout = setTimeout(function() {
                    this.el.classList.add('review-load-failure');
                }, REQUEST_FAILURE_TIMEOUT);

                this.loadFailure = function() {
                    this.el.classList.add('review-load-failure');
                };

                this.avatar.addEventListener('error', this.loadFailure);

                var reviewAvatar = this.avatar;

                this.replaceImage = function() {
                    this.avatar.style.backgroundSize = '124px 124px';
                    this.newReview.replaceChild(reviewAvatar, avatarStub);
                    clearTimeout(imageLoadTimeout);
                };

                this.avatar.addEventListener('load', this.replaceImage);
            }
        },

        loadFailure: function() {
            this.el.classList.add('review-load-failure');
        },

        unrender: function(reviewsList, index) {
            reviewsList.splice(index, 1);
            if (this.el.avatar) {
                this.avatar.removeEventListener('error', this.loadFailure);
                this.avatar.removeEventListener('load', this.replaceImage);
            }
        },

        _onClick: function() {
            var targetElement = event.target;

            if (targetElement.classList.contains('review-quiz-answer')) {
                this.model.get('liked')
                    ? this.model.dislike()
                    : this.model.like();
            }
        }
    });
})();
