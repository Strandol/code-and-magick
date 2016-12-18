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

    var Gallery = new function () {
        this.setPhotos = function () {

        };

        this.setCurrentPhoto = function () {

        };

        this.show = function () {

        };

        this.hide = function () {

        };


    };

    galleryContainer.addEventListener('click', function(event) {
        event.preventDefault();
        var element = event.target;
        while(element){
            if (element.classList.contains('photogallery-image')) {
                showGalleryOverlay();
                setCloseBtnHandler();
                setKeyHandlers();
                return;
            }

            element = element.parentElement;
        }
    });

    function showGalleryOverlay() {
        galleryOverlay.classList.remove('invisible');
    }
    function setKeyHandlers() {
        window.addEventListener('keyup', keyHandlers);
    }
    
    function setCloseBtnHandler() {
        galleryCloseBtn.addEventListener('click', function(event) {
            event.preventDefault();
            galleryOverlay.classList.add('invisible');
            window.removeEventListener('keyup', keyHandlers);
        })
    }

    function keyHandlers(event) {
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
