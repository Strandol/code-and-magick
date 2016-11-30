'use strict';

(function() {
  var ratingStructure = {
    '1': 'review-rating-one',
    '2': 'review-rating-two',
    '3': 'review-rating-three',
    '4': 'review-rating-four',
    '5': 'review-rating-five'
  };

  var XHR_STATE = {
    'UNSENT' : 0,
    'OPENED' : 1,
    'HEADERS_RECEIVED' : 2,
    'LOADING' : 3,
    'DONE' : 4
  };

  var REQUEST_FAILURE_TIMEOUT = 10000;
  var REVIEWS_DATA_PATH = 'data/reviews.json';

  var reviewsFilter = document.querySelector('.reviews-filter');
  var reviewsContainer = document.querySelector('.reviews-list');
  var reviewsList = document.querySelector('.reviews');
  var reviewTemplate = document.getElementById('review-template');
  var reviewsFragment = document.createDocumentFragment();

  var reviews;

  loadReviewsList();

  function loadReviewsList() {
    initFilters();
    loadReviews(loadData);
    renderReviews(reviews);
  }

  function initFilters() {
    var filters = reviewsFilter.querySelectorAll('.reviews-filter-item');

    filters.forEach(function(filter) {
      filter.onclick = function(event) {
        var activeFilter = event.currentTarget;
        setActiveFilter(activeFilter.htmlFor);
      }
    });
  }

  function setActiveFilter(filter) {
    var filteredReviews = getFilteredReviews(reviews, filter);
    renderReviews(filteredReviews);
  }

  function loadReviews(callback) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = REQUEST_FAILURE_TIMEOUT;
    xhr.open('get', REVIEWS_DATA_PATH);

    xhr.onreadystatechange = function(event) {
      var loadedXhr = event.target;
      switch (loadedXhr.readyState){
        case XHR_STATE.DONE:
          if (loadedXhr.status === 200){
            var reviewsData = loadedXhr.response;
            reviewsList.classList.remove('reviews-list-loading');
            callback(JSON.parse(reviewsData));
          } else {
            showFailure();
          }
          break;
        default:
          reviewsList.classList.add('reviews-list-loading');
          break;
      }
    };

    xhr.ontimeout = function() {
      showFailure();
    };

    xhr.send();
  }

  function loadData(loadedReviews) {
    reviews = loadedReviews;
    setActiveFilter('reviews-all');
    renderReviews(loadedReviews);
  }
  
  function renderReviews(reviews) {
    reviewsContainer.innerHTML = '';

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

    reviewsContainer.appendChild(reviewsFragment);
  }

  function getFilteredReviews(reviews, filter) {
    var filterReviews = reviews.slice(0);

    switch (filter) {
      case 'reviews-recent':
        filterReviews.sort(function(rev1, rev2) {
          var date1 = new Date(rev1.date);
          var date2 = new Date(rev2.date);
          return compareElements(date2, date1);
        });
        break;
      case 'reviews-good':
        filterReviews = filterReviews.filter(function(review) {
          return review.rating >= 3
        })
          .sort(function (rev1, rev2) {
            return compareElements(rev2.rating,rev1.rating);
          });
        break;
      case 'reviews-bad':
        filterReviews = filterReviews.filter(function(review) {
          return review.rating <= 2
        })
          .sort(function(rev1, rev2) {
            return compareElements(rev1.rating, rev2.rating);
          });
        break;
      case 'reviews-popular':
        filterReviews.sort(function(rev1, rev2) {
          return compareElements(rev2['review-rating'], rev1['review-rating']);
        })
    }
    return filterReviews;
  }
  
  function compareElements(elem1,elem2) {
    return elem1 - elem2;
  }

  function showFailure() {
    reviewsList.classList.add('reviews-load-failure');
  }

  function hideElement(elem) {
    elem.classList.add('invisible');
  }

  function loadPicture(review, newReview, avatarStub) {
    var avatar = new Image();
    avatar.classList.add('review-author');
    avatar.src = review.author.picture;

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
}());
