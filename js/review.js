'use strict';

(function () {
    var ratingStructure = {
        '1': 'review-rating-one',
        '2': 'review-rating-two',
        '3': 'review-rating-three',
        '4': 'review-rating-four',
        '5': 'review-rating-five'
    };

    var REQUEST_FAILURE_TIMEOUT = 10000;

    var reviewsContainer = document.querySelector('.reviews-list');
    var reviewTemplate = document.getElementById('review-template');

    var Review = function (data, element) {
        this._data = data;
        this._htmlElement = element;
    };


    Review.prototype.render = function() {
        var reviewFragment = document.createDocumentFragment();

        var newReview = reviewTemplate.content.children[0].cloneNode(true);
        var rating = newReview.querySelector('.review-rating');
        var comment = newReview.querySelector('.review-text');
        var avatarStub = newReview.querySelector('.review-author');

        rating.classList.add(ratingStructure[this._data.rating]);
        comment.textContent = this._data.description;

        reviewFragment.appendChild(newReview);
        this._htmlElement = reviewFragment;

        if (this._data.author.picture) {
            loadPicture(this, newReview, avatarStub);
        }

        return reviewFragment;
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


    Review.prototype.unrender = function(reviews, i) {
        reviews.splice(i,i+1);
    };

    window.Review = Review;
}());