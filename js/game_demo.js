'use strict';

(function() {
    var clouds = document.querySelector('.header-clouds');


    var moveClouds = new CustomEvent('move');

    clouds.addEventListener('move', move);

    function move() {
        clouds.style.backgroundPosition = clouds.getBoundingClientRect().top + (document.documentElement.clientWidth / 4) + 'px 0px';
        console.log('move');
    }

    window.addEventListener('scroll', function() {
        var timerId = setTimeout(function() {
            clouds.getBoundingClientRect().bottom < 0
          ? clouds.removeEventListener('move', move)
          : clouds.addEventListener('move', move);
            clearTimeout(timerId);
        }, 100);

        clouds.dispatchEvent(moveClouds);
    });
}());
