'use strict';

(function() {
    var doesHaveParent = function(selector, element) {
        do {
            if (element.classList.contains(selector)) {
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
