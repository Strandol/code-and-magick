'use strict';

(function() {
  var ratingStructure = {
    '1': 'review-rating-one',
    '2': 'review-rating-two',
    '3': 'review-rating-three',
    '4': 'review-rating-four',
    '5': 'review-rating-five'
  };

  var IMAGE_FAILURE_TIMEOUT = 8000;

  var reviewsFilter = document.querySelector('.reviews-filter');
  var reviewsList = document.querySelector('.reviews-list');
  var reviewTemplate = document.getElementById('review-template');
  var reviewsFragment = document.createDocumentFragment();

  hideElement(reviewsFilter);

  reviews.forEach(function(review) {
    var newReview = reviewTemplate.content.children[0].cloneNode(true);
    var rating = newReview.querySelector('.review-rating');
    var comment = newReview.querySelector('.review-text');
    var avatarStub = newReview.querySelector('.review-author');

    rating.classList.add(ratingStructure[review.rating]);
    comment.textContent = review.description;

    reviewsFragment.appendChild(newReview);

    if (review.author.picture) {
      loadPicture(review, newReview, avatarStub);
    }
  });

  reviewsList.appendChild(reviewsFragment);

  function hideElement(elem) {
    elem.classList.add('invisible');
  }

  function loadPicture(review, newReview, avatarStub) {
    var avatar = new Image();
    avatar.classList.add('review-author');
    avatar.src = review.author.picture;

    var imageLoadTimeout = setTimeout(function() {
      newReview.classList.add('review-load-failure');
    }, IMAGE_FAILURE_TIMEOUT);

    avatar.onerror = function() {
      newReview.classList.add('review-load-failure');
    };

    avatar.onload = function() {
      avatar.style.backgroundSize = '124px 124px';
      newReview.replaceChild(avatar, avatarStub);
      clearTimeout(imageLoadTimeout);
    }
  }
}());
