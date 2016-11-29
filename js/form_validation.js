"use strict";

(function () {

  var form = document.forms[1];

  var review_name = form["review-name"];
  var review_text = form["review-text"];
  var review_mark = form['review-mark'];

  var label_form = document.getElementsByClassName('review-fields')[0];
  var label_name = label_form.getElementsByClassName('review-fields-name')[0];
  var label_text = label_form.getElementsByClassName("review-fields-text")[0];

  function check_validation() {
    if (review_name.value !== "") {
      label_name.style.display = "none";
    } else {
      label_name.style.display = "";
    }

    if (review_text.value !== "") {
      label_text.style.display = "none";
    } else {
      label_text.style.display = "";
    }

    if (review_name.value !== "" && review_text.value !== "") {
      label_form.style.display = "none";
      return true;
    }

    label_form.style.display = "";
    return false;
  }

  function update_fields_from_cookies() {
    var mark = docCookies.getItem("mark");
    review_name.value = docCookies.getItem("name");
    review_mark.value = docCookies.getItem("mark");

    check_validation();
  }

  review_name.onchange = function (event) {
    check_validation();
  };

  review_text.onchange = function (event) {
    check_validation();
  };

  form.onsubmit = function (event) {
    event.preventDefault();

    if (check_validation()) {
      var time = new Date().getTime();
      var cookies_age = time + (time - new Date("27 December 1990").getTime());

      docCookies.setItem("name", review_name.value, cookies_age);
      docCookies.setItem("mark", review_mark.value, cookies_age);

      form.submit();
    }

    label_form.style.color = 'red';
  }

  update_fields_from_cookies();

})();
