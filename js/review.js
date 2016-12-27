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

    var Review = function(data) {
        this._data = data;
    };

    Review.prototype.render = function(reviewsFragment) {
        this.newReview = reviewTemplate.content.children[0].cloneNode(true);
        var rating = this.newReview.querySelector('.review-rating');
        var comment = this.newReview.querySelector('.review-text');
        var avatarStub = this.newReview.querySelector('.review-author');

        rating.classList.add(ratingStructure[this._data.rating]);
        comment.textContent = this._data.description;

        reviewsFragment.appendChild(this.el);

        if (this._data.author.picture) {
            this.loadPicture(this, avatarStub);
        }
    };

    Review.prototype.loadPicture = function(review, avatarStub) {
        review.avatar = new Image();
        review.avatar.classList.add('review-author');
        review.avatar.src = review._data.author.picture;

        var imageLoadTimeout = setTimeout(function() {
            review.newReview.classList.add('review-load-failure');
        }, REQUEST_FAILURE_TIMEOUT);

        review.loadFailure = function() {
            review.newReview.classList.add('review-load-failure');
        };

        review.avatar.addEventListener('error', review.loadFailure);

        var reviewAvatar = review.avatar;

        review.replaceImage = function() {
            review.avatar.style.backgroundSize = '124px 124px';
            review.newReview.replaceChild(reviewAvatar, avatarStub);
            clearTimeout(imageLoadTimeout);
        };

        review.avatar.addEventListener('load', review.replaceImage);
    };

    Review.prototype.loadFailure = function() {
        this.classList.add('review-load-failure');
    };

    Review.prototype.unrender = function(reviewsList, index) {
        reviewsList.splice(index, 1);

        if (this.avatar) {
            this.avatar.removeEventListener('error', this.loadFailure);
            this.avatar.removeEventListener('load', this.replaceImage);
        }
    };

    window.Review = Review;
})();
