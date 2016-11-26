'use strict';

(function() {
  var MY_BIRTHDAY = new Date(1997, 12, 23);

  var form = document.querySelector('.review-form');
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');
  var formName = document.querySelector('#review-name');
  var formReview = document.querySelector('#review-text');
  var formNameLabel = document.querySelector('.review-fields-name');
  var formReviewLabel = document.querySelector('.review-fields-text');

  CheckCookie(formName);
  CheckCookie(formReview);

  formOpenButton.onclick = function(event) {
    event.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(event) {
    event.preventDefault();
    formContainer.classList.add('invisible');
  };

  formName.oninput = function (event) {
    event.preventDefault();
    CheckValue(formName, formNameLabel);
  };

  formReview.oninput = function (event) {
    event.preventDefault();
    CheckValue(formReview, formReviewLabel);
  };

  form.onsubmit = function (event) {
    event.preventDefault();

    docCookies.setItem(formName.name, formName.value, new Date(Date.now() + (Date.now() - MY_BIRTHDAY.getTime())));
    docCookies.setItem(formReview.name, formReview.value, new Date(Date.now() + (Date.now() - MY_BIRTHDAY.getTime())));

    this.submit();
  };

  function CheckCookie(formElement) {
    if(docCookies.hasItem(formElement.name)){
      formElement.value = docCookies.getItem(formElement.name);
    }
  }

  function CheckValue(formElement, elementLabel) {
    formElement.value === '' ? elementLabel.classList.remove('invisible') : elementLabel.classList.add('invisible');
  }

})();
