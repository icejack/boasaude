var HorarioController = function() {};

HorarioController.prototype = {
    initialize: function() {

    },
    destroy: function() {
        // unset events
        // stop ajax
        // destroy components
        PageLoad.ajxHandle = null;
        alert("Foi destruido!");
    }
};