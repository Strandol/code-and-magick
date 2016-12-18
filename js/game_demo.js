'use strict';

(function() {
    var clouds = document.querySelector('.header-clouds');

    var timerId = 0;
    var cloudsPositionX = 0;

    var moveClouds = new Event('move');
    
    clouds.addEventListener('move', move);

    function move() {
        cloudsPositionX = clouds.getBoundingClientRect().top;
        clouds.style.backgroundPosition = cloudsPositionX + 'px 0px';
    }

    window.addEventListener('scroll', function(event) {
        timerId = setTimeout(function() {
            if(clouds.getBoundingClientRect().bottom < 0) {
                clouds.removeEventListener('move', move);
            } else {
                clouds.addEventListener('move', move);
            }
        }, 100);

        clouds.dispatchEvent(moveClouds);
    });
}());
