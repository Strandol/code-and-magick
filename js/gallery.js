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

    var Gallery = function() {
        this.galleryOverlay = document.querySelector('.overlay-gallery');
        this.galleryCloseBtn = document.querySelector('.overlay-gallery-close');
        this.keyLeft = this.galleryOverlay.querySelector('.overlay-gallery-control-left');
        this.keyRight = this.galleryOverlay.querySelector('.overlay-gallery-control-right');
        this.photoReview = this.galleryOverlay.querySelector('.overlay-gallery-preview');
        this.currentPhotoNumberLabel = this.galleryOverlay.querySelector('.preview-number-current');

        this._photos = [];
        this._currentPhoto = 0;

        this._onCloseButtonClick = function() {
            photoGallery.galleryOverlay.classList.add('invisible');
            photoGallery.hide();
        };

        this._onRightArrowClick = function() {
            photoGallery._currentPhoto = photoGallery._currentPhoto < photoGallery._photos.length - 1
              ? photoGallery._currentPhoto + 1
              : 0;

            photoGallery.setCurrentPhoto(photoGallery._currentPhoto);
        };

        this._onLeftArrowClick = function() {
            photoGallery._currentPhoto = photoGallery._currentPhoto > 0
              ? photoGallery._currentPhoto - 1
              : photoGallery._photos.length - 1;

            photoGallery.setCurrentPhoto(photoGallery._currentPhoto);
        };

        this._onDocumentKeyDown = function() {
            switch (event.keyCode) {
                case KEY_CODE.ESC:
                    photoGallery.galleryOverlay.classList.add('invisible');
                    break;
                case KEY_CODE.BUTTON_LEFT:
                    photoGallery._onLeftArrowClick();
                    break;
                case KEY_CODE.BUTTON_RIGHT:
                    photoGallery._onRightArrowClick();
                    break;
                default:
                    break;
            }
        };
    };


    Gallery.prototype.setCurrentPhoto = function(index) {
        this._currentPhoto = index;
        this.currentPhotoNumberLabel.textContent = index + 1;
        this.show(index);
    };

    Gallery.prototype.setPhotos = function(photos) {
        this._photos = [].map.call(photos, function(photo) {
            return photo.childNodes[0].src;
        });
    };

    Gallery.prototype.show = function(index) {
        var newImage = document.createElement('img');
        newImage.width = IMAGE_WIDTH;
        newImage.height = IMAGE_HEIGHT;
        newImage.src = this._photos[index];

        var currentImage = this.photoReview.querySelector('img');
        if(currentImage !== null){
            this.photoReview.replaceChild(newImage, currentImage)
        } else {
            this.photoReview.appendChild(newImage);
        }
    };

    Gallery.prototype.hide = function() {
        window.removeEventListener('keyup', this._onDocumentKeyDown);
        this.galleryCloseBtn.removeEventListener('click', this._onCloseBtnHandler);
        this.keyLeft.removeEventListener('click', this._onLeftArrowClick);
        this.keyRight.removeEventListener('click', this._onRightArrowClick);
    };

    Gallery.prototype.createGallery = function() {
        var photos = document.querySelectorAll('.photogallery-image');
        photoGallery = new Gallery();

        this.setPhotos.call(photoGallery, photos);
    };

    Gallery.prototype.setHandlers = function() {
        this.showGalleryOverlay();
        this.setBtnKeyHandlers();
        this.setCloseBtnHandler();
        this.setKeyHandlers();
    };

    Gallery.prototype.showGalleryOverlay = function() {
        this.galleryOverlay.classList.remove('invisible');
    };

    Gallery.prototype.setBtnKeyHandlers = function() {
        this.keyLeft.addEventListener('click', this._onLeftArrowClick);
        this.keyRight.addEventListener('click', this._onRightArrowClick);
    };

    Gallery.prototype.setKeyHandlers = function() {
        window.addEventListener('keyup', this._onDocumentKeyDown);
    };

    Gallery.prototype.setCloseBtnHandler = function() {
        this.galleryCloseBtn.addEventListener('click', this._onCloseButtonClick);
    };

    galleryContainer.addEventListener('click', function(event) {
        event.preventDefault();

        var element = event.target;

        if (Utils.prototype.doesHaveParent(element)) {
            if (!photoGallery) {
                Gallery.prototype.createGallery();
            }

            var imageSrc = element.src;
            var index = photoGallery._photos.indexOf(imageSrc);

            photoGallery.setCurrentPhoto(index);
            photoGallery.setHandlers();
        }
    });
}());
