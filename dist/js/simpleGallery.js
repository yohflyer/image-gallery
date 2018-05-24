'use strict';var simpleGallery = function () {
  var autoplay = void 0;
  var imageCount = void 0;
  var currentImage = void 0;
  var currentSlide = 1;
  var userControl = true;
  var renderedImage = [];
  var galleryFrame = document.querySelector('.js-gallery-frame'); // Markup container
  var gallery = document.querySelector('.js-gallery'); // Images

  // Initialise
  var init = function init(config) {
    switch (true) {
      // No Settings
      case typeof config.images !== 'undefined' && typeof config.settings === 'undefined':
        _createGallery(_configureSettings({}), config.images);
        break;
      // With Settings
      case typeof config.images !== 'undefined' && typeof config.settings !== 'undefined':
        _createGallery(_configureSettings(config.settings), config.images);
        break;
      // No image fail
      default:
        var errorMessage = document.createElement('span');
        errorMessage.textContent = 'ERROR: No images';
        errorMessage.classList.add('simple-gallery__error');
        galleryFrame.appendChild(errorMessage);
        return;}


    // Add listeners
    _eventListeners(config.images);

    // Check image count
    imageCount = config.images.length;

    // Set autoplay
    autoplay = typeof config.settings !== 'undefined' && typeof config.settings.autoplay !== 'undefined' ? config.settings.autoplay : true;
  };

  // Settings constructor
  function Settings() {
    // Default settings
    this.speed = 5000,
    this.arrows = true,
    this.autoplay = true;
  }

  var _configureSettings = function _configureSettings(userSettings) {
    // Create settings from defaults
    var gallerySettings = new Settings();

    // Overwrite default settings
    for (var key in gallerySettings) {
      if (!gallerySettings.hasOwnProperty(key)) continue;
      if (key in userSettings) {
        gallerySettings[key] = userSettings[key];
      }
    }

    return gallerySettings;
  };

  var _eventListeners = function _eventListeners(images) {
    // Page resize maths
    window.addEventListener('resize', function () {
      images.forEach(_setImages);
    });

    // Cycles gallery manually on arrow key press
    window.addEventListener('keydown', function (e) {
      var event = window.event ? window.event : e;

      if (event.keyCode === 39 || event.keyCode === 37) {
        // Stops autoplay when arrow key
        _stopGallery();

        var direction = event.keyCode === 39 ? 'right' : 'left';
        _cycleGallery(direction);
      }
    });

    if (userControl === true) {
      // Left button press
      document.querySelector('.js-gallery-left').addEventListener('click', function () {
        _stopGallery();
        _cycleGallery('left');
      });

      // Right button press
      document.querySelector('.js-gallery-right').addEventListener('click', function () {
        _stopGallery();
        _cycleGallery('right');
      });
    }
  };

  // Creates the gallery
  var _createGallery = function _createGallery(settings, images) {

    // Removes buttons
    var buttons = document.querySelector('.js-gallery-buttons');
    if (settings.arrows === false) {
      buttons.parentNode.removeChild(buttons);
      userControl = false;
    }

    // Sets up gallery
    images.forEach(_setImages);
    // Starts the gallery
    _startGallery(settings);
  };

  // Constructor function for creating new slides in the gallery
  function ImageMarkup() {var _this = this;
    this.imgId;
    this.imgSrc;
    this.imgAlt;
    this.imgDesc;
    this.imgExists = function () {
      if (document.querySelector('.js-slide-' + _this.imgId)) {
        return true;
      }
      return false;
    };
    this.renderImg = function () {
      // Ensures the element doesn't exist before adding it
      if (!_this.imgExists()) {
        // Create a new image
        var imgContainer = document.createElement('div');
        imgContainer.classList.add('js-slide-' +
        _this.imgId, 'js-gallery-image', 'simple-gallery__images__container');




        var img = document.createElement('img');
        img.classList.add('js-image-' +
        _this.imgId, 'simple-gallery__images__image');


        img.src = _this.imgSrc;
        img.alt = _this.imgAlt;
        imgContainer.appendChild(img);

        // Add description if exists
        if (_this.imgDesc !== undefined) {
          var span = document.createElement('span');
          span.textContent = _this.imgDesc;
          imgContainer.appendChild(span);
        }
        // Adds the image to rendered image array
        renderedImage.push(imgContainer);
        // Renders the image
        gallery.appendChild(imgContainer);
      }
    };
    // Identifying class using ID
    this.imgIdentifyingClass = function () {
      return '.js-image-' + _this.imgId;
    };
  }

  // Inserts images into gallery and resizes
  var _setImages = function _setImages(image, index, array) {
    // Create new image
    var newImage = new ImageMarkup();

    // Set attributes
    newImage.imgId = index + 1;
    newImage.imgSrc = image['url'];
    newImage.imgAlt = image['alt'];
    newImage.imgDesc = image['desc'];

    // Render image
    newImage.renderImg();

    // Target image
    currentImage = document.querySelector(newImage.imgIdentifyingClass());

    // Aspect Ratio Calculator Run
    var calculateAspectRatio = function calculateAspectRatio(srcWidth, srcHeight, maxWidth, maxHeight) {
      return Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    };

    var aspectRatio = calculateAspectRatio(
    currentImage.width,
    currentImage.height,
    gallery.offsetWidth,
    gallery.offsetHeight);


    // Aspect Ratio Calculator
    if (currentImage.height > currentImage.width) {
      currentImage.style.width = gallery.offsetWidth + 'px';
      currentImage.style.height = currentImage.height * aspectRatio + 'px !important';
    } else {
      currentImage.style.height = gallery.offsetHeight + 'px';
      currentImage.style.width = gallery.offsetWidth * aspectRatio + 'px !important';
    }
  };

  var _startGallery = function _startGallery(settings) {
    // Autoplay
    window.setInterval(function () {
      if (autoplay === true) {
        _cycleGallery('right');
      }
    }, settings.speed);
  };

  var _stopGallery = function _stopGallery() {
    return autoplay = false;
  };

  // Cycles gallery in set direction
  var _cycleGallery = function _cycleGallery(direction) {
    if (direction === 'left') {
      currentSlide--;

      if (currentSlide <= 0) {
        currentSlide = imageCount;
      }
    } else if (direction === 'right') {
      currentSlide++;

      if (currentSlide > imageCount) {
        currentSlide = 1;
      }
    }

    for (var i = 0; i < imageCount; i++) {
      // Hides all images
      renderedImage[i].classList.add('hide');
    }

    // New image
    currentImage = document.querySelector('.js-slide-' + currentSlide);
    currentImage.classList.remove('hide');
  };

  return { init: init };
}();