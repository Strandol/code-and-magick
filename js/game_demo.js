'use strict';

(function() {
    var clouds = document.querySelector('.header-clouds');
    var cloudsTimeout = 0;
    var visibility = true;

    var hideEvent = new Event('hide');

    clouds.addEventListener('hide', function () {
        if (clouds.getBoundingClientRect().top < -clouds.offsetHeight) {
            return false;
        }
        return true;
    });

    window.addEventListener('scroll', function(event) {
        clearTimeout(cloudsTimeout);
        cloudsTimeout = setTimeout(function() {
            visibility = clouds.dispatchEvent(hideEvent);
        }, 100);

        if (visibility != false) {
            clouds.style.backgroundPosition = (clouds.getBoundingClientRect().top - clouds.offsetWidth*2 - document.documentElement.clientWidth) + 'px 0px';
        }
    });
}());
