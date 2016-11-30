'use strict';

(function() {
  var ratingStructure = {
    '1': 'review-rating-one',
    '2': 'review-rating-two',
    '3': 'review-rating-three',
    '4': 'review-rating-four',
    '5': 'review-rating-five'
  };

  var ReadyState = {
    'UNSENT' : 0,
    'OPENED' : 1,
    'HEADERS_RECEIVED' : 2,
    'LOADING' : 3,
    'DONE' : 4
  };

  var REQUEST_FAILURE_TIMEOUT = 8000;

  var reviewsFilter = document.querySelector('.reviews-filter');
  var reviewsList = document.querySelector('.reviews-list');
  var reviewsBlock = document.querySelector('.reviews');
  var reviews;
  var reviewTemplate = document.getElementById('review-template');
  var reviewsFragment = document.createDocumentFragment();

  loadReviewsList();

  function loadReviewsList() {
    setupFilters();
    loadReviews();
    refreshReviews(reviews);
  }

  function refreshReviews(reviews) {
    reviewsList.innerHTML = '';

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
  }

  function loadReviews() {
    var xhr = new XMLHttpRequest();
    xhr.timeout = REQUEST_FAILURE_TIMEOUT;
    xhr.open('get', 'data/reviews.json');
    xhr.send();

    xhr.onreadystatechange = function (event) {
      var loadedXhr = event.target;
      switch (loadedXhr.readyState){
        case ReadyState.OPENED:
        case ReadyState.HEADERS_RECEIVED:
        case ReadyState.LOADING:
          reviewsBlock.classList.add('reviews-list-loading');
          break;
        case ReadyState.DONE:
        default:
          if (loadedXhr.status == 200){
            var reviewsData = loadedXhr.response;
            reviewsBlock.classList.remove('reviews-list-loading');
            loadData(JSON.parse(reviewsData));
          }

          if(loadedXhr.status > 400){
            showFailure();
          }
          break;
      }
    };

    xhr.ontimeout = function() {
      showFailure();
    };

    function loadData(loadedReviews) {
      reviews = loadedReviews;
      setupFilter('reviews-all');
      refreshReviews(loadedReviews)
    }
  }

  function showFailure() {
    reviewsBlock.classList.add('reviews-load-failure');
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

  function setupFilter(filter) {
    var filteredReviews = getFilteredReviews(reviews, filter);
    refreshReviews(filteredReviews);
  }

  function setupFilters(){
    var filters = reviewsFilter.querySelectorAll('.reviews-filter-item');
    for(var i = 0; i < filters.length; i++){
      filters[i].onclick = function (event) {
        var activeFilter = event.currentTarget;
        setupFilter(activeFilter.htmlFor);
      }
    }
  }

  function getFilteredReviews(reviews, filter) {
    var filterReviews = reviews.slice(0);

    switch(filter){
      case 'reviews-recent':
        filterReviews.sort(function (rev1, rev2) {
          if(rev1.date < rev2.date){
            return 1;
          }
          if(rev1.date > rev2.date){
            return -1;
          }
          return 0;
        });
            break;
      case 'reviews-good':
        filterReviews = filterReviews.filter(function (review) {
          return review.rating >= 3
        });

        filterReviews.sort(function (rev1, rev2) {
          if(rev1.rating < rev2.rating){
            return 1;
          }
          if(rev1.rating > rev2.rating){
            return -1;
          }
          return 0;
        });
            break;
      case 'reviews-bad':
        filterReviews = filterReviews.filter(function (review) {
          return review.rating <= 2
        });

        filterReviews.sort(function (rev1, rev2) {
          if(rev1.rating > rev2.rating){
            return 1;
          }
          if(rev1.rating < rev2.rating){
            return -1;
          }
          return 0;
        });
        break;
      case 'reviews-popular':
        filterReviews.sort(function (rev1, rev2) {
          if(rev1['review-rating'] < rev2['review-rating']){
            return 1;
          }
          if(rev1['review-rating'] > rev2['review-rating']){
            return -1;
          }
          return 0;
        });
    }

    return filterReviews;
  }
}());
