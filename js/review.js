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
        var newReview = reviewTemplate.content.children[0].cloneNode(true);
        var rating = newReview.querySelector('.review-rating');
        var comment = newReview.querySelector('.review-text');
        var avatarStub = newReview.querySelector('.review-author');

        rating.classList.add(ratingStructure[this._data.rating]);
        comment.textContent = this._data.description;

        reviewsFragment.appendChild(newReview);

        if (this._data.author.picture) {
            loadPicture(this, newReview, avatarStub);
        }
    };

    function loadPicture(review, newReview, avatarStub) {
        var avatar = new Image();
        avatar.classList.add('review-author');
        avatar.src = review._data.author.picture;

        var imageLoadTimeout = setTimeout(function() {
            newReview.classList.add('review-load-failure');
        }, REQUEST_FAILURE_TIMEOUT);

        avatar.onerror = function() {
            newReview.classList.add('review-load-failure');
        };

        avatar.onload = function() {
            avatar.style.backgroundSize = '124px 124px';
            newReview.replaceChild(avatar, avatarStub);
            clearTimeout(imageLoadTimeout);
        }
    }
    
    Review.prototype.unrender = function(reviewsList, index) {
        reviewsList.splice(index, 1);
    };

    window.Review = Review;
})();
