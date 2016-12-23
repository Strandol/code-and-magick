'use strict';

(function() {

    var IMAGE_WIDTH = 300;
    var IMAGE_HEIGHT = 300;
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
    var photoReview = galleryOverlay.querySelector('.overlay-gallery-preview');
    var currentPhotoNumberLabel = galleryOverlay.querySelector('.preview-number-current');

    var photoGallery = null;

    var Gallery = function() {
        this._photos = [];
        this._currentPhoto = 0;
    };

    Gallery.prototype.setPhotos = function(photos) {
        this._photos = [].map.call(photos, function(photo) {
            return photo.childNodes[0].src;
        });
    };

    Gallery.prototype.setCurrentPhoto = function(index) {
        this._currentPhoto = index;
        currentPhotoNumberLabel.textContent = index + 1;
        this.show(index);
    };

    Gallery.prototype.show = function(index) {
        var newImage = document.createElement('img');
        newImage.width = IMAGE_WIDTH;
        newImage.height = IMAGE_HEIGHT;
        newImage.src = this._photos[index];

        var currentImage = photoReview.querySelector('img');
        currentImage !== null
            ? photoReview.replaceChild(newImage, currentImage)
            : photoReview.appendChild(newImage);
    };

    Gallery.prototype.hide = function() {
        window.removeEventListener('keyup', this.keyHandlers);
        galleryCloseBtn.removeEventListener('click', this.closeBtnHandler);
        keyLeft.removeEventListener('click', this.btnLeftKeyHandler);
        keyRight.removeEventListener('click', this.btnRightKeyHandler);
    };

    galleryContainer.addEventListener('click', function(event) {
        event.preventDefault();

        var element = event.target;

        if(Gallery.prototype.doesHaveParent(element)) {
            if (photoGallery === null) {
                Gallery.prototype.createGallery();
            }

            var imageSrc = element.src;
            var index = imageSrc.slice(imageSrc.length - 5, imageSrc.length - 4);
            photoGallery.setCurrentPhoto(index - 1);
            Gallery.prototype.setHandlers();
        }
    });

    Gallery.prototype.doesHaveParent = function(element) {
        do {
            if (element.classList.contains('photogallery-image')) {
                return true;
            }
            element = element.parentElement;
        } while (element);
        return false;
    };

    Gallery.prototype.createGallery = function() {
        var photos = document.querySelectorAll('.photogallery-image');
        photoGallery = new Gallery();
        photoGallery.setPhotos(photos);
    };

    Gallery.prototype.setHandlers = function() {
        Gallery.prototype.showGalleryOverlay();
        Gallery.prototype.setBtnKeyHandlers();
        Gallery.prototype.setCloseBtnHandler();
        Gallery.prototype.setKeyHandlers();
    };

    Gallery.prototype.showGalleryOverlay = function() {
        galleryOverlay.classList.remove('invisible');
    };

    Gallery.prototype.setBtnKeyHandlers = function() {
        keyLeft.addEventListener('click', Gallery.prototype.btnLeftKeyHandler);
        keyRight.addEventListener('click', Gallery.prototype.btnRightKeyHandler);
    };

    Gallery.prototype.setKeyHandlers = function() {
        window.addEventListener('keyup', this.keyHandlers);
    };

    Gallery.prototype.keyHandlers = function() {
        switch (event.keyCode) {
            case KEY_CODE.ESC:
                galleryOverlay.classList.add('invisible');
                break;
            case KEY_CODE.BUTTON_LEFT:
                Gallery.prototype.btnLeftKeyHandler();
                break;
            case KEY_CODE.BUTTON_RIGHT:
                Gallery.prototype.btnRightKeyHandler();
                break;
            default:
                break;
        }
    };

    Gallery.prototype.btnRightKeyHandler = function() {
        if (photoGallery._currentPhoto === photoGallery._photos.length - 1) {
            photoGallery._currentPhoto = -1;
        }

        if (photoGallery._currentPhoto < photoGallery._photos.length - 1) {
            photoGallery._currentPhoto++;
        }

        photoGallery.setCurrentPhoto(photoGallery._currentPhoto);
    };

    Gallery.prototype.btnLeftKeyHandler = function() {
        if (photoGallery._currentPhoto === 0) {
            photoGallery._currentPhoto = photoGallery._photos.length;
        }

        if (photoGallery._currentPhoto > 0) {
            photoGallery._currentPhoto--;
        }

        photoGallery.setCurrentPhoto(photoGallery._currentPhoto);
    };

    Gallery.prototype.setCloseBtnHandler = function() {
        galleryCloseBtn.addEventListener('click', Gallery.prototype.closeBtnHandler);
    };

    Gallery.prototype.closeBtnHandler = function() {
        galleryOverlay.classList.add('invisible');
        photoGallery.hide();
    };

    window.Gallery = Gallery;
}());
