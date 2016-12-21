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
    var keyLeft = galleryOverlay.querySelector('.overlay-gallery-control-left');
    var keyRight = galleryOverlay.querySelector('.overlay-gallery-control-right');
    var placeForPhoto = galleryOverlay.querySelector('.overlay-gallery-preview');
    var currentPhotoNumberLabel = galleryOverlay.querySelector('.preview-number-current');

    var Gallery = function() {

        this._photos = [];
        this._currentPhoto = null;

        this.setPhotos = function(photos) {
          this._photos = [].map.call(photos, function(photo) {
              return photo.childNodes[0].src;
          })
        };

        this.setCurrentPhoto = function(index) {
            this._currentPhoto = index;
            currentPhotoNumberLabel.textContent = index + 1;
            this.show(index);
        };

        this.show = function(index) {
            var newImage = document.createElement('img');
            newImage.width = 300;
            newImage.height = 300;
            newImage.src = this._photos[index];

            var currentImage = placeForPhoto.querySelector('img');
            if (currentImage !== null) {
                placeForPhoto.replaceChild(newImage, currentImage);
            } else {
                placeForPhoto.appendChild(newImage);
            }
        };

        this.hide = function() {
            window.removeEventListener('keyup', keyHandlers);
            galleryCloseBtn.removeEventListener('click', closeBtnHandler);
            keyLeft.removeEventListener('click', btnLeftKeyHandler);
            keyRight.removeEventListener('click', btnRightKeyHandler);
        };


    };

    var photoGallery = null;
    galleryContainer.addEventListener('click', function(event) {
        event.preventDefault();

        var element = event.target;

        while (element) {
            if (element.classList.contains('photogallery-image')) {
                if (photoGallery === null) {
                    var photos = document.querySelectorAll('.photogallery-image');
                    photoGallery = new Gallery();
                    photoGallery.setPhotos(photos);
                }

                var imageSrc = element.childNodes[0].src;
                var index = imageSrc.slice(imageSrc.length - 5, imageSrc.length - 4);
                photoGallery.setCurrentPhoto(index - 1);
                showGalleryOverlay();
                setBtnKeyHandlers();
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

    function setBtnKeyHandlers() {
        keyLeft.addEventListener('click', btnLeftKeyHandler);
        keyRight.addEventListener('click', btnRightKeyHandler);
    }

    var btnRightKeyHandler = function() {
        if (photoGallery._currentPhoto < photoGallery._photos.length-1) {
            photoGallery._currentPhoto++;
        }
        photoGallery.setCurrentPhoto(photoGallery._currentPhoto);
    };

    var btnLeftKeyHandler = function() {
        if (photoGallery._currentPhoto > 0) {
            photoGallery._currentPhoto--;
        }
        photoGallery.setCurrentPhoto(photoGallery._currentPhoto);
    };

    function setKeyHandlers() {
        window.addEventListener('keyup', keyHandlers);
    }

    var keyHandlers = function() {
        switch (event.keyCode) {
            case KEY_CODE.ESC:
                galleryOverlay.classList.add('invisible');
                break;
            case KEY_CODE.BUTTON_LEFT:
                if(photoGallery._currentPhoto > 0){
                    photoGallery._currentPhoto--;
                }
                photoGallery.setCurrentPhoto(photoGallery._currentPhoto);
                break;
            case KEY_CODE.BUTTON_RIGHT:
                if(photoGallery._currentPhoto < photoGallery._photos.length-1){
                    photoGallery._currentPhoto++;
                }
                photoGallery.setCurrentPhoto(photoGallery._currentPhoto);
                break;
            default:
                break;
        }
    };

    function setCloseBtnHandler() {
        galleryCloseBtn.addEventListener('click', closeBtnHandler);
    }

    var closeBtnHandler = function() {
        galleryOverlay.classList.add('invisible');
        photoGallery.hide();
    };

    window.Gallery = Gallery;
}());
