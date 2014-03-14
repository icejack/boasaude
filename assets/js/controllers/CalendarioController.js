var CalendarioController = function() {};

CalendarioController.prototype = {
    initialize: function() {

    },
    destroy: function() {
        // unset events
        // stop ajax
        PageLoad.ajxHandle = null;
    }
};