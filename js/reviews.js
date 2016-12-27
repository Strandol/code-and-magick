'use strict';

(function() {
    var XHR_STATE = {
        'UNSENT': 0,
        'OPENED': 1,
        'HEADERS_RECEIVED': 2,
        'LOADING': 3,
        'DONE': 4
    };

    var PAGE_SIZE = 3;
    var REQUEST_FAILURE_TIMEOUT = 10000;
    var REVIEWS_DATA_PATH = 'data/reviews.json';
    var PADDING_BOTTOM = 0;

    var reviewsFilter = document.querySelector('.reviews-filter');
    var reviewsContainer = document.querySelector('.reviews-list');
    var reviewsList = document.querySelector('.reviews');

    var reviewsFragment = document.createDocumentFragment();
    var filteredReviews = [];

    var footerElement = document.querySelector('footer');
    var moreReviewsButton = document.querySelector('.reviews-controls-more');

    var photoGallery = null;
    var currentPage = 0;
    var reviews;

    loadReviewsList();

    function loadReviewsList() {
        initFilters();
        setScrollEnabled();
        loadReviews(loadData);
    }

    function initFilters() {
        reviewsFilter.addEventListener('click', function(event) {
            if (event.target.classList.contains('reviews-filter-item')) {
                setActiveFilter(event.target.htmlFor);
            }
        });
    }

    function setActiveFilter(filter) {
        currentPage = 0;
        filteredReviews = getFilteredReviews(reviews, filter);
        var btn = document.getElementById(filter);
        btn.checked = true;
        renderReviews(filteredReviews, currentPage, true);
    }

    function loadReviews(callback) {
        var xhr = new XMLHttpRequest();
        xhr.timeout = REQUEST_FAILURE_TIMEOUT;
        xhr.open('get', REVIEWS_DATA_PATH);

        xhr.onreadystatechange = function(event) {
            var loadedXhr = event.target;
            switch (loadedXhr.readyState) {
                case XHR_STATE.DONE:
                    if (loadedXhr.status === 200) {
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
        reviews = reviews.map(function(review) {
            return new Review(review);
        });
        var filter = localStorage.getItem('filter') || 'reviews-all';
        setActiveFilter(filter);
    }

    function renderReviews(reviews, page, replace) {
        setMoreRevBtnEnabled();
        if (replace) {
            while (filteredReviews.length) {
                var reviewToRemove = filteredReviews.shift();
                reviewsContainer.removeChild(reviewToRemove.el);
                reviewToRemove.remove();
            }
        }

        var from = page * PAGE_SIZE;
        var to = from + PAGE_SIZE;

        reviewsCollection.slice(from, to).forEach(function(review) {
            var view = new ReviewView({ model: review});
            view.render(reviewsFragment);
            filteredReviews.push(view);
        });

        reviewsContainer.appendChild(reviewsFragment);
    }

    function getFilteredReviews(reviews, filter) {
        var filterReviews = reviews.slice(0);

        switch (filter) {
            case 'reviews-recent':
                filterReviews.sort(function(rev1, rev2) {
                    var date1 = new Date(rev1._data.date);
                    var date2 = new Date(rev2._data.date);
                    return compareElements(date2, date1);
                });
                break;
            case 'reviews-good':
                for (var i = 0; i < filterReviews.length; i++) {
                    if (filterReviews[i]._data.rating < 3) {
                        filterReviews[i].unrender(filterReviews, i);
                        i--;
                    }
                }

                filterReviews = filterReviews.sort(function(rev1, rev2) {
                    return compareElements(rev2._data.rating, rev1._data.rating);
                });

                break;
            case 'reviews-bad':
                for (i = 0; i < filterReviews.length; i++) {
                    if (filterReviews[i]._data.rating > 2) {
                        filterReviews[i].unrender(filterReviews, i);
                        i--;
                    }
                }

                filterReviews = filterReviews.sort(function(rev1, rev2) {
                    return compareElements(rev1._data.rating, rev2._data.rating);
                });

                break;
            case 'reviews-popular':
                filterReviews = filterReviews
                  .sort(function(rev1, rev2) {
                      return compareElements(rev2._data['review-rating'], rev1._data['review-rating']);
                  })
                  .filter(function(review) {
                      return review._data.rating >= 3;
                  });
                break;
            default:
                break;
        }

        localStorage.setItem('filter', filter);
        return filterReviews;
    }

    function compareElements(elem1, elem2) {
        return elem1 - elem2;
    }

    function showFailure() {
        reviewsList.classList.add('reviews-load-failure');
    }

    function setScrollEnabled() {
        window.addEventListener('scroll', function() {
            setTimeout(function() {
                if (isBottomReached() && isNextPageAvaliable(filteredReviews, currentPage, PAGE_SIZE)) {
                    currentPage++;
                    renderReviews(filteredReviews, currentPage);
                }

                if (!isNextPageAvaliable(filteredReviews, currentPage, PAGE_SIZE)) {
                    setMoreRevBtnDisabled();
                }
            }, 100);
        });
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
        renderReviews(filteredReviews, currentPage);
        currentPage++;
    }

    window.photoGallery = photoGallery;
}());
