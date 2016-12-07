'use strict';

(function() {
    var KEY_CODE = {
        'ESC': 27,
        'BUTTON_RIGHT': 39,
        'BUTTON_LEFT': 37
    };

    var galleryContainer = document.querySelector('.photogallery');
    var galleryOverlay = document.querySelector('.overlay-gallery');
    var galleryCloseBtn = document.querySelector('.overlay-gallery-close');

    galleryContainer.addEventListener('click', function(event) {
        event.preventDefault();

        if(event.target.parentNode.classList.contains('photogallery-image')) {
            galleryOverlay.classList.remove('invisible');
            setCloseBtnEnabled();
            keyHandler();
        }
    });
    
    function keyHandler() {
        window.addEventListener('keyup', keyPress);
    }
    
    function setCloseBtnEnabled() {
        galleryCloseBtn.addEventListener('click', function(event) {
            event.preventDefault();
            galleryOverlay.classList.add('invisible');
            window.removeEventListener('keyup', keyPress);
        })
    }

    function keyPress(event) {
        event.preventDefault();

        switch (event.keyCode) {
            case KEY_CODE.ESC:
                galleryOverlay.classList.add('invisible');
                break;
            case KEY_CODE.BUTTON_LEFT:
                console.log('LEFT');
                break;
            case KEY_CODE.BUTTON_RIGHT:
                console.log('RIGHT');
                break;
            default:
                break;
        }
    }
}());