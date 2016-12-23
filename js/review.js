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

    var Review = function(data) {
        this._data = data;
    };

    var reviewTemplate = document.getElementById('review-template');

    Review.prototype.render = function(reviewsFragment) {
        this.newReview = reviewTemplate.content.children[0].cloneNode(true);
        var rating = this.newReview.querySelector('.review-rating');
        var comment = this.newReview.querySelector('.review-text');
        var avatarStub = this.newReview.querySelector('.review-author');

        rating.classList.add(ratingStructure[this._data.rating]);
        comment.textContent = this._data.description;

        reviewsFragment.appendChild(this.newReview);

        if (this._data.author.picture) {
            loadPicture.call(this, avatarStub);
        }
    };

    function loadPicture(avatarStub) {
        var review = this.newReview;

        this.avatar = new Image();
        this.avatar.classList.add('review-author');
        this.avatar.src = this._data.author.picture;

        var imageLoadTimeout = setTimeout(function() {
            review.classList.add('review-load-failure');
        }, REQUEST_FAILURE_TIMEOUT);

        Gallery.prototype.loadFailure = function() {
            review.classList.add('review-load-failure');
        };

        this.avatar.addEventListener('error', Gallery.prototype.loadFailure);


        var reviewAvatar = this.avatar;

        Gallery.prototype.replaceImage = function() {
            reviewAvatar.style.backgroundSize = '124px 124px';
            review.replaceChild(reviewAvatar, avatarStub);
            clearTimeout(imageLoadTimeout);
        };

        this.avatar.addEventListener('load', Gallery.prototype.replaceImage);
    }

    Gallery.prototype.loadFailure = function() {
        review.classList.add('review-load-failure');
    };

    Review.prototype.unrender = function(reviewsList, index) {
        reviewsList.splice(index, 1);
        if(this.avatar !== undefined){
            this.avatar.removeEventListener('error', Gallery.prototype.loadFailure);
            this.avatar.removeEventListener('load', Gallery.prototype.replaceImage);
        }
    };

    window.Review = Review;
})();
