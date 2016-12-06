'use strict';

(function() {
    var clouds = document.querySelector('.header-clouds');

<<<<<<< 388806ad59ed7d4bc165cc3bd9c784f8a85d56b8
    var timerId = 0;
    var cloudsPositionX = 0;

    var moveClouds = new Event('move');
=======

    var moveClouds = new CustomEvent('move');
>>>>>>> Module4-task1
    
    clouds.addEventListener('move', move);

    function move() {
<<<<<<< 388806ad59ed7d4bc165cc3bd9c784f8a85d56b8
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
=======
        clouds.style.backgroundPosition = clouds.getBoundingClientRect().top  + (document.documentElement.clientWidth / 4) + 'px 0px';
        console.log('move');
    }

    window.addEventListener('scroll', function(event) {
        var timerId = setTimeout(function() {
            clouds.getBoundingClientRect().bottom < 0
                ? clouds.removeEventListener('move', move)
                : clouds.addEventListener('move', move);
            clearTimeout(timerId);
>>>>>>> Module4-task1
        }, 100);

        clouds.dispatchEvent(moveClouds);
    });
}());
