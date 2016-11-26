"use strict";
(function () {

  var rating_classname = {
    1: "review-rating-one",
    2: "review-rating-two",
    3: "review-rating-three",
    4: "review-rating-four",
    5: "review-rating-five"
  };

  var IMAGE_FAILURE_TIMEOUT = 10000;

  var reviews_filter = document.querySelector(".reviews-filter");
  var review_template = document.getElementById("review-template");
  var reviews_container = document.querySelector(".reviews-list");

  var review_fragment = document.createDocumentFragment();

  reviews_filter.classList.add("invisible");

  reviews.forEach(function (review, i) {
    var new_review = review_template.content.children[0].cloneNode(true);

    var original_image = new_review.querySelector(".review-author");

    original_image.title = review["author"]["name"];
    new_review.querySelector(".review-rating").classList.add(rating_classname[review["rating"]]);
    new_review.querySelector(".review-text").textContent = review["description"];

    if (review["author"]["picture"]) {
      var author_image = new Image();

      author_image.src = review["author"]["picture"];

      var image_load_timeout = setTimeout(function () {
        new_review.classList.add("review-load-failure");
      }, IMAGE_FAILURE_TIMEOUT);

      author_image.onload = function () {
        author_image.classList.add('review-author');
        author_image.title = review["author"]["name"];
        author_image.style.width = "124px";
        author_image.style.height = "124px";
        new_review.replaceChild(author_image, original_image);
        clearTimeout(image_load_timeout);
      };

      author_image.onerror = function () {
        new_review.classList.add("review-load-failure");
      };
    }

    review_fragment.appendChild(new_review);
  });

  reviews_container.appendChild(review_fragment);
  reviews_filter.classList.remove("invisible");

})();
