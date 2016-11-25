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
  var reviewsTemplate = document.getElementById('review-template');
  var reviewsList = document.querySelector('.reviews-list');

  reviewsFilter.classList.add('invisible');

  var reviewsFragment = document.createDocumentFragment();

  reviews.forEach(function (review) {
    var newReview = reviewsTemplate.content.children[0].cloneNode(true);

    newReview.querySelector('.review-rating').classList.add(ratingStructure[review['rating']]);
    newReview.querySelector('.review-text').textContent = review["description"];

    var oldImage = newReview.querySelector('.review-author');

    reviewsFragment.appendChild(newReview);

    if(review["author"]["picture"]){
      var authorImage = new Image();
      authorImage.classList.add('review-author');
      authorImage.src = review["author"]["picture"];

      var imageLoadTimeout = setTimeout(function () {
        newReview.classList.add('review-load-failure');
      }, IMAGE_FAILURE_TIMEOUT);

      authorImage.onerror = function () {
        newReview.classList.add('review-load-failure');
      };

      authorImage.onload = function () {
        authorImage.style.backgroundSize = '124px 124px';
        newReview.replaceChild(authorImage, oldImage);
        clearTimeout(imageLoadTimeout);
      }
    }
  });

  reviewsList.appendChild(reviewsFragment);
})();

