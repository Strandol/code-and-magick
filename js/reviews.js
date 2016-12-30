'use strict';

(function() {
    var PAGE_SIZE = 3;
    var REQUEST_FAILURE_TIMEOUT = 10000;
    var PADDING_BOTTOM = 0;

    var reviewsFilter = document.querySelector('.reviews-filter');
    var reviewsContainer = document.querySelector('.reviews-list');
    var reviewsList = document.querySelector('.reviews');

    var reviewsFragment = document.createDocumentFragment();

    var filteredReviews = [];
    var renderedViews = [];
    var loadedReviews;

    var reviewsCollection = new ReviewsCollection();

    var footerElement = document.querySelector('footer');
    var moreReviewsButton = document.querySelector('.reviews-controls-more');

    var photoGallery = null;
    var currentPage = 0;

    function initFilters() {
        reviewsFilter.addEventListener('click', function(event) {
            if (event.target.classList.contains('reviews-filter-item')) {
                setActiveFilter(event.target.htmlFor);
            }
        });
    }

    function setActiveFilter(filter) {
        currentPage = 0;
        getFilteredReviews(filter);
        var btn = document.getElementById(filter);
        btn.checked = true;
        renderReviews(currentPage, true);
    }

    reviewsCollection
        .fetch({ timeout: REQUEST_FAILURE_TIMEOUT })
        .success(function(loaded, state, jqXHR) {
            var filter = localStorage.getItem('filter') || 'reviews-all';

            loadedReviews = jqXHR.responseJSON;

            initFilters();
            setScrollEnabled();
            setActiveFilter(filter);
        })
        .fail(function() {
            showFailure();
        });

    function renderReviews(page, replace) {
        setMoreRevBtnEnabled();

        if (replace && reviewsContainer.children.length) {
            while (renderedViews.length) {
                var reviewToRemove = renderedViews.shift();
                reviewsContainer.removeChild(reviewToRemove.el);
                reviewToRemove.remove();
            }
        }

        var from = page * PAGE_SIZE;
        var to = from + PAGE_SIZE;

        reviewsCollection.slice(from, to).forEach(function(model) {
            var view = new ReviewView({ model: model });
            view.render(reviewsFragment);

            renderedViews.push(view);
        });

        reviewsContainer.appendChild(reviewsFragment);
    }

    function getFilteredReviews(filter) {
        filteredReviews = loadedReviews.slice(0);
        filteredReviews = filteredReviews.map(function(data) {
            return new ReviewModel(data);
        });

        switch (filter) {
            case 'reviews-recent':
                filteredReviews.sort(function(rev1, rev2) {
                    var date1 = new Date(rev1.get('date'));
                    var date2 = new Date(rev2.get('date'));
                    return compareElements(date2, date1);
                });
                break;
            case 'reviews-good':
                for (var i = 0; i < filteredReviews.length; i++) {
                    if (filteredReviews[i].get('rating') < 3) {
                        filteredReviews.splice(i, 1);
                        i--;
                    }
                }

                filteredReviews = filteredReviews.sort(function(rev1, rev2) {
                    return compareElements(rev2.get('rating'), rev1.get('rating'));
                });

                break;
            case 'reviews-bad':
                for (i = 0; i < filteredReviews.length; i++) {
                    if (filteredReviews[i].get('rating') > 2) {
                        filteredReviews.splice(i, 1);
                        i--;
                    }
                }

                filteredReviews = filteredReviews.sort(function(rev1, rev2) {
                    return compareElements(rev1.get('rating'), rev2.get('rating'));
                });

                break;
            case 'reviews-popular':
                filteredReviews = filteredReviews
                  .sort(function(rev1, rev2) {
                      return compareElements(rev2.get('review-rating'), rev1.get('review-rating'));
                  })
                break;
            default:
                break;
        }

        reviewsCollection.reset(filteredReviews);
        localStorage.setItem('filter', filter);
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
                if (isBottomReached() && isNextPageAvaliable(filteredReviews, currentPage + 1, PAGE_SIZE)) {
                    currentPage++;
                    renderReviews(currentPage);
                }

                if (!isNextPageAvaliable(filteredReviews, currentPage + 1, PAGE_SIZE)) {
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
        if (isNextPageAvaliable(filteredReviews, currentPage + 1, PAGE_SIZE)) {
            currentPage++;
            renderReviews(currentPage);
        } else {
            setMoreRevBtnDisabled();
        }
    }

    window.photoGallery = photoGallery;
}());
