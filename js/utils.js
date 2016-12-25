'use strict';

(function() {
    var Utils = function() {
    };

    Utils.prototype.doesHaveParent = function(element) {
        do {
            if (element.classList.contains('photogallery-image')) {
                return true;
            }
            element = element.parentElement;
        } while (element);
        return false;
    };

    window.Utils = Utils;
})();
