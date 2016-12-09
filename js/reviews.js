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

  var PAGE_SIZE = 3;
  var REQUEST_FAILURE_TIMEOUT = 10000;
  var REVIEWS_DATA_PATH = 'data/reviews.json';
  var PADDING_BOTTOM = 0;

  var reviewsFilter = document.querySelector('.reviews-filter');
  var reviewsContainer = document.querySelector('.reviews-list');
  var reviewsList = document.querySelector('.reviews');
  var reviewTemplate = document.getElementById('review-template');
  var reviewsFragment = document.createDocumentFragment();

  var filteredReviews = [];
  var notFilteredReviews = [];

  var scrollTimeout;
  var footerElement = document.querySelector('footer');
  var moreReviewsButton = document.querySelector('.reviews-controls-more');

  var currentPage = 0;

  loadReviewsList();

  function loadReviewsList() {
      initFilters();
      setScrollEnabled();
      loadReviews(loadData);
      renderReviews(filteredReviews, 0);
  }

  function initFilters() {
      reviewsFilter.addEventListener('click', function (event) {
          if(event.target.classList.contains('reviews-filter-item')){
              setActiveFilter(event.target.htmlFor);
          }
      });
  }

  function setActiveFilter(filter) {
      currentPage = 0;
      filteredReviews = getFilteredReviews(filteredReviews, filter);
      renderReviews(filteredReviews, currentPage, true);
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
      filteredReviews = loadedReviews;
      notFilteredReviews = filteredReviews.slice(0);
      var filter = localStorage.getItem('filter') || 'reviews-all';
      setActiveFilter(filter);
      var btn = document.getElementById(filter);
      btn.checked = true;
      renderReviews(filteredReviews);
  }
  
  function renderReviews(reviews, page, replace) {
      setMoreRevBtnEnabled();

      if(replace){
          reviewsContainer.innerHTML = '';
      }

      var from = page * PAGE_SIZE;
      var to = from + PAGE_SIZE;

      reviews.slice(from,to).forEach(function(review) {
        //review = new Review(review);
        reviewsFragment.appendChild(review.render());
      });

      reviewsContainer.appendChild(reviewsFragment);
  }

  function getFilteredReviews(reviews, filter) {
      switch (filter) {
          case 'reviews-recent':
              reviews.sort(function(rev1, rev2) {
                  var date1 = new Date(rev1.date);
                  var date2 = new Date(rev2.date);
                  return compareElements(date2, date1);
              });
              break;
          case 'reviews-good':
              for(var i = 0; i < reviews.length; i++){
                  reviews[i] = new Review(reviews[i]);
                  if(reviews[i]._data.rating < 3){
                      reviews[i].unrender(reviews, i);
                      i--;
                  }
              }
              reviews.sort(function (rev1, rev2) {
                  rev1 = new Review(rev1);
                  rev2  = new Review(rev2);
                  return compareElements(rev2._data.rating,rev1._data.rating);
              });
              break;
          case 'reviews-bad':
              for(i = 0; i < reviews.length; i++){
                  if(reviews[i]._data.rating > 2){
                      reviews[i].unrender(reviews, i);
                      i--;
                  }
              }
              reviews.sort(function(rev1, rev2) {
                  rev1 = new Review(rev1);
                  rev2 = new Review(rev2);
                  return compareElements(rev1._data.rating, rev2._data.rating);
              });
              break;
          case 'reviews-popular':
              reviews.sort(function(rev1, rev2) {
                  return compareElements(rev2['review-rating'], rev1['review-rating']);
              });
              break;
          default:
              reviews = notFilteredReviews.slice(0);
      }

      localStorage.setItem('filter',filter);
      return reviews;
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
  
  function setScrollEnabled() {
      window.addEventListener('scroll', function (event) {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(function() {

              if(!isNextPageAvaliable(filteredReviews, currentPage, PAGE_SIZE)){
                  setMoreRevBtnDisabled();
              }

              if(isBottomReached() && isNextPageAvaliable(filteredReviews, currentPage, PAGE_SIZE)){
                  currentPage++;
                  renderReviews(filteredReviews, currentPage);
              }
          }, 100);
      })
  }

  function isBottomReached() {
      var footerPosition = footerElement.getBoundingClientRect();
      return footerPosition.top - window.innerHeight - PADDING_BOTTOM <= 0;
  }

  function isNextPageAvaliable(reviews, currentPage, pageSize) {
      return currentPage < Math.ceil(reviews.length / pageSize);
  }

  function setMoreRevBtnEnabled() {
      moreReviewsButton.addEventListener('click', displayMoreReviews);
      moreReviewsButton.classList.remove('invisible');
  }

  function setMoreRevBtnDisabled() {
      moreReviewsButton.removeEventListener('click', displayMoreReviews);
      moreReviewsButton.classList.add('invisible');
  }

  function displayMoreReviews() {
      currentPage++;
      renderReviews(filteredReviews, currentPage);
  }
}());
