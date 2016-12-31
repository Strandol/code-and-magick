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

        this._photosCollection;
        this._currentPhoto = 0;

        this._onCloseButtonClick = this._onCloseButtonClick.bind(this);

        this._onRightArrowClick = this._onRightArrowClick.bind(this);

        this._onLeftArrowClick = this._onLeftArrowClick.bind(this);

        this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    };

    Gallery.prototype._onDocumentKeyDown = function() {
        switch (event.keyCode) {
            case KEY_CODE.ESC:
                this.galleryOverlay.classList.add('invisible');
                break;
            case KEY_CODE.BUTTON_LEFT:
                this._onLeftArrowClick();
                break;
            case KEY_CODE.BUTTON_RIGHT:
                this._onRightArrowClick();
                break;
            default:
                break;
        }
    };

    Gallery.prototype._onLeftArrowClick = function() {
        this._currentPhoto = this._currentPhoto > 0
          ? this._currentPhoto - 1
          : this._photosCollection.models.length - 1;

        this.setCurrentPhoto(this._currentPhoto);
    };

    Gallery.prototype._onRightArrowClick = function() {
        this._currentPhoto = this._currentPhoto < this._photosCollection.models.length - 1
          ? this._currentPhoto + 1
          : 0;

        this.setCurrentPhoto(this._currentPhoto);
    };

    Gallery.prototype._onCloseButtonClick = function() {
        this.galleryOverlay.classList.add('invisible');
        this.hide();
    };

    Gallery.prototype.setCurrentPhoto = function(index) {
        this._currentPhoto = index;
        this.currentPhotoNumberLabel.textContent = index + 1;
        this.show();
    };

    Gallery.prototype.setPhotos = function(photos) {
        [].forEach.call(photos, function(photo, i) {
            var photoUrl = photo.childNodes[0].src;
            var videoUrl = photo.dataset.replacementVideo;
            photo = new PhotoModel(photoUrl, videoUrl, i.toString());
            photoGallery._photosCollection.models.push(photo);
            return;
        });
    };

    Gallery.prototype.show = function() {
        var videoOfElement = photoGallery._photosCollection.models[photoGallery._currentPhoto].get('url');

        if (videoOfElement.toString() !== '[object Object]') {
            var videoToShow = new VideoView();
            videoToShow.render();
        } else {
            var imageToShow = new PhotoView();
            imageToShow.render();
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
        this._photosCollection = new PhotosCollection();

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

        if (!utils.doesHaveParent('photogallery-image', element)) {
            return;
        }

        if (!window.photoGallery) {
            Gallery.prototype.createGallery();
        }

        var imageSrc = element.src;
        var currentPhoto = photoGallery._photosCollection.where({preview: imageSrc});
        var index = currentPhoto[0].get('id');

        photoGallery.setCurrentPhoto(index);
        photoGallery.setHandlers();
    });
}());
