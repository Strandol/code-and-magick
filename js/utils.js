'use strict';

(function() {
    var doesHaveParent = function(element) {
        do {
            if (element.classList.contains('photogallery-image')) {
                return true;
            }
            element = element.parentElement;
        } while (element);
        return false;
    };

    window.utils = {
        doesHaveParent: doesHaveParent
    };
})();
