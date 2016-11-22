'use strict';

(function() {
  var MY_BIRTHDAY = new Date(1997, 12, 23);

  var form = document.querySelector('.review-form');
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');

  var reviewerName = form.querySelector('.review-form-field-name');
  var reviewerComment = form.querySelector('.review-form-field-text');
  var requiredFieldReviewerName = form.querySelector('.review-fields-name');
  var requiredFieldReviewerComment = form.querySelector('.review-fields-text');

  initEventsHandlers();
  initFieldValues([reviewerName, reviewerComment]);

  function initEventsHandlers() {
    formOpenButton.onclick = function () {
      formContainer.classList.remove('invisible');
    };

    formCloseButton.onclick = function () {
      formContainer.classList.add('invisible');
    };

    reviewerName.onchange = function () {
      changeStateRequiredField(reviewerName.value, requiredFieldReviewerName);
    };

    reviewerComment.onchange = function () {
      changeStateRequiredField(reviewerComment.value, requiredFieldReviewerComment);
    };

    form.onsubmit = function (event) {
      event.preventDefault();
      docCookies.setItem(reviewerName.name, reviewerName.value, new Date(Date.now() + (Date.now() - MY_BIRTHDAY.getTime())));
      docCookies.setItem(reviewerComment.name, reviewerComment.value, new Date(Date.now() + (Date.now() - MY_BIRTHDAY.getTime())));

      this.submit();
    };
  }

  function initFieldValues(elems) {
    elems.forEach(function(elem) {
      if(docCookies.hasItem(elem.name)) {
        elem.value = docCookies.getItem(elem.name);
      }
    })
  }

  function changeStateRequiredField(fieldValue , elementLabel) {
    fieldValue === ''
      ? elementLabel.classList.remove('invisible')
      : elementLabel.classList.add('invisible');
  }

})();
