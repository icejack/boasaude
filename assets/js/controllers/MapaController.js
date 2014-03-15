var MapaController = function() {};

MapaController.prototype = {
    initialize: function() {
        
   var map;
function initialize() {
  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(-34.397, 150.644)
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);
        
    },
    destroy: function() {
        google.maps.event.removeListener();

        alert("Foi destruido!");

        PageLoad.ajxHandle = null;
    }
};