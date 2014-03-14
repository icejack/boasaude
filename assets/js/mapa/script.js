  $(function(){
      var map,
        search_query,
        infowindow,
        markers = [],
        min = 3000,
        geoposition,
        nearest = {name:"",marker:""},
        directionsDisplay = new google.maps.DirectionsRenderer(),
        infowindow = new google.maps.InfoWindow();

      function initialize()
      {
        if (navigator.geolocation) 
        {  
          navigator.geolocation.getCurrentPosition(function(position) {

          var pyrmont = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          lat = position.coords.latitude;
          lng = position.coords.longitude;

          // var resp = checkForHome(position.coords.latitude, position.coords.longitude); // checking to see if the user is at home or not

          map = new google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            panControl: false,
            zoomControl: false,
            mapTypeControl: true,
            mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
            },
            center: pyrmont
          });

          var marker = new google.maps.Marker({
            map: map,
            position: pyrmont,
            icon : '../img/voce.png',
            animation: google.maps.Animation.BOUNCE
          });

          var infowindow = new google.maps.InfoWindow();
          google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent("Voce!");
            infowindow.open(map, this);
          });

        //Clicar para aparecer as farmacias
         // $('#saude').live('click',function(){
         //    clearMarkers();
         //    var request = {
         //         location: pyrmont,
         //          radius: 5000,
         //        types: ['Farmácia','pharmacy']
         //    };
         //    var places_service = new google.maps.places.PlacesService(map);
         //    places_service.search(request,loadPlacesSaude);
         //  });

      
          $('#search_query').live('keyup',function(){
        clearMarkers();
        var request = {
            location: pyrmont,
            radius: 5000,
            name: $(this).val()
        };
        var places_service = new google.maps.places.PlacesService(map);
        places_service.search(request,loadPlacesSearch);
    });

        var autocomplete = new google.maps.places.Autocomplete(document.getElementById('search_query'));
        google.maps.event.addListener(autocomplete,function(){
       clearMarkers();
        var place = autocomplete.getPlace();
        if(place.geometry.viewport){
            map.fitBounds(place.geometry.viewport);
        }else{
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }
         var image = new google.maps.MarkerImage(
            place.icon, new google.maps.Size(71,71),
            new google.maps.Point(0,0), new google.maps.Point(17,34),
            new google.maps.Size(35,35));
        var marker = new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            image: image,
            animation: google.maps.Animation.DROP,
            title: place.name
        });
        marker.setIcon(image);
        marker.setPosition(place.geometry.location);
        
        infowindow = new google.maps.InfoWindow();
        infowindow.setContent(place.name);
        infowindow.open(map,marker);
        
        // Load directions
        var start = new google.maps.LatLng(lat, lng);
        var end = place.geometry.location;
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function(result, status){
            if(status == google.maps.DirectionsStatus.OK){
                directionsDisplay.setDirections(result);   
            }
        });
    });

   $('tbody').find('tr').live('click',function(){
        var place_id = $(this).attr('id');
        console.log(place_id);
    });

    //Iniciar com Market Places de Farmacias ja posicinados ao fim do carregamento do MAPA
        var request = {
            location: pyrmont,
            radius: 5000,
            types: ['Farmácia','pharmacy']
        };
          var service = new google.maps.places.PlacesService(map);
           service.search(request, callback);
          
              }); 

            } else {  
              alert("Seu dispositivo nao suporte geolocalizacao, desculpe! ");
            }  
      }

      google.maps.event.addDomListener(window, 'load', initialize);
      showFavPlaces('p.favplaces'); // display the fav places from the localstorage


///////////////////////////////

function loadPlacesSearch(results, status){
    if(status == google.maps.places.PlacesServiceStatus.OK){
        $('table').find('tbody').html('');
        $.each(results,function(i, place){
            createMarkerSearch(place);
            addTableRow(place);
        });   
    }
}
function loadPlacesSaude(results, status){
    if(status == google.maps.places.PlacesServiceStatus.OK){
        $('table').find('tbody').html('');
        $.each(results,function(i, place){
            createMarkerSaude(place);
            addTableRow(place);
        });   
    }
}

function addTableRow(place){
    var html = '<tr id="'+place.id+'"><td>'+place.name+'</td><td>'+ place.vicinity+'</td><td>';
    $.each(place.types,function(i,type){
        html += type;
        if((i + 1) != place.types.length){
            html += ', ';
        }
    });
    $('table').find('tbody').append(html);
}
///////////////////////////////

      function checkForHome(lat, lng) {
        if(localStorage && localStorage.getItem('home')) {
          
          var home = JSON.parse(localStorage.getItem('home'));
          var accuracy = geolib.getDistance({latitude: home[0], longitude: home[1]}, {latitude: lat, longitude: lng });
          if(accuracy <= 50) {
            return 1;
          }
        }
        else return 0;
      }

      function callback(results, status) {

        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0, max = results.length; i < max; i++) {
            createMarkerSaude(results[i]);
          }
        }
      }


/////////////
//search_query
////////////

      function createMarkerSearch(place) {
        var image = '../img/voce.png';
        var placeLoc = place.geometry.location;
        var favs = JSON.parse(localStorage.getItem('favs'));     
        var marker = new google.maps.Marker({
          map: map,
          icon: image,
          title: place.name,
          animation: google.maps.Animation.DROP,
          position: place.geometry.location
        });

        var placeLat, placeLng; // i noticed that the methods in the api have changed the name so this is just a precaution

        for(var key in place.geometry.location) 
        {
          if(!placeLat && place.geometry.location.hasOwnProperty(key)) placeLat = place.geometry.location[key];
          else if(place.geometry.location.hasOwnProperty(key)) placeLng = place.geometry.location[key];
        }

        var distance = geolib.getDistance({latitude: lat, longitude: lng}, {latitude: placeLat, longitude: placeLng});

        if(distance < min) 
        {
            min = distance;
            $("#info p.result").text("A farmácia mais próxima é: " + place.name);
            nearest.marker = marker;
            nearest.name = place.name;
        }

        google.maps.event.addListener(marker, 'click', function(event) {
        infowindow.close();
        infowindow.setContent('<span>' + place.name + "</span> <br> <a href='#' class='makeFav'>Adicionar</a><br>");
        infowindow.open(map, this);
////////////////////////
          $('a.makeFav').live('click', function(e){
             if(localStorage)
              {
                if(localStorage.getItem('favs'))
                {
                  var favs = JSON.parse(localStorage.getItem('favs'));
                  favs[place.name] = place.geometry.location;
                  localStorage.setItem('favs',JSON.stringify(favs));
                }
                else
                {
                  var favs = {};
                  favs[place.name] = place.geometry.location;
                  localStorage.setItem('favs',JSON.stringify(favs));
                }
              }
              $(this).hide().text("Adicionado! Verifique \"todos os favoritos\" no menu ").fadeIn(800);

          })
///////////////////////
        var directionsService = new google.maps.DirectionsService();
        
        var start = new google.maps.LatLng(lat, lng);
        var end = place.geometry.location;

        var request = {
            origin:start,
            destination:end,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };

        directionsDisplay.setMap(null);
        directionsDisplay.setPanel(null);
        directionsDisplay = new google.maps.DirectionsRenderer();

        directionsService.route(request, function(response, status) {

          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay = new google.maps.DirectionsRenderer({
                'map': map,
                'preserveViewport': true,
                'draggable': true
            });

            directionsDisplay.setDirections(response);
            directionsDisplay.setPanel(document.getElementById("directions"));
          }
          else {
            $("#directions").text("<p>Desculpe, aconteceu algum problema.</p>");
          }

        });
////////////////////////
        });

        markers.push(marker);
      }//fimplacesearch

/////////////
//FIM search_query
////////////


      function createMarkerSaude(place) {
        var image = '../img/voce.png';
        var placeLoc = place.geometry.location;
        var favs = JSON.parse(localStorage.getItem('favs'));     
        var marker = new google.maps.Marker({
          map: map,
          icon: image,
          title: place.name,
          animation: google.maps.Animation.DROP,
          position: place.geometry.location
        });

        var placeLat, placeLng; // i noticed that the methods in the api have changed the name so this is just a precaution

        for(var key in place.geometry.location) 
        {
          if(!placeLat && place.geometry.location.hasOwnProperty(key)) placeLat = place.geometry.location[key];
          else if(place.geometry.location.hasOwnProperty(key)) placeLng = place.geometry.location[key];
        }

        var distance = geolib.getDistance({latitude: lat, longitude: lng}, {latitude: placeLat, longitude: placeLng});

        if(distance < min) 
        {
            min = distance;
            $("#info p.result").text("A farmácia mais próxima é: " + place.name);
            nearest.marker = marker;
            nearest.name = place.name;
        }

        google.maps.event.addListener(marker, 'click', function(event) {
        infowindow.close();
        infowindow.setContent('<span>' + place.name + "</span> <br> <a href='#' class='makeFav'>Adicionar</a><br>");
        infowindow.open(map, this);
////////////////////////
          $('a.makeFav').live('click', function(e){
             if(localStorage)
              {
                if(localStorage.getItem('favs'))
                {
                  var favs = JSON.parse(localStorage.getItem('favs'));
                  favs[place.name] = place.geometry.location;
                  localStorage.setItem('favs',JSON.stringify(favs));
                }
                else
                {
                  var favs = {};
                  favs[place.name] = place.geometry.location;
                  localStorage.setItem('favs',JSON.stringify(favs));
                }
              }
              $(this).hide().text("Adicionado! Verifique \"todos os favoritos\" no menu ").fadeIn(800);

          })
///////////////////////
        var directionsService = new google.maps.DirectionsService();
        
        var start = new google.maps.LatLng(lat, lng);
        var end = place.geometry.location;

        var request = {
            origin:start,
            destination:end,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };

        directionsDisplay.setMap(null);
        directionsDisplay.setPanel(null);
        directionsDisplay = new google.maps.DirectionsRenderer();

        directionsService.route(request, function(response, status) {

          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay = new google.maps.DirectionsRenderer({
                'map': map,
                'preserveViewport': true,
                'draggable': true
            });

            directionsDisplay.setDirections(response);
            directionsDisplay.setPanel(document.getElementById("directions"));
          }
          else {
            $("#directions").text("<p>Desculpe, aconteceu algum problema.</p>");
          }

        });
////////////////////////
        });

        markers.push(marker);
      }//fimplacesaude

      function clearMarkers() 
      {
        for (var i = markers.length - 1; i >= 0; i--) {
          markers[i].setVisible(false);
        };
        min = 5000;
      }

    $('#limpar').live('click',function(){
            clearMarkers();
         var type = $(this).val().trim();
         if(type == 'favs'){
           placeFavourites();
           return 0;
         } 

         clearMarkers();
         var pyrmont = new google.maps.LatLng(lat, lng);
         var request = {
          location: pyrmont,
          radius: parseInt($('click').val()*5000),
          types: [type]
        }

        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);

        // service.search(request, callback);
        
      });

      function showFavPlaces($selector)
      {
        if(localStorage && localStorage.getItem('favs'))
        {
          var favs = JSON.parse(localStorage.getItem('favs'));
          $(favs).each(function(idx, el){
            for(i in el)
            {
              $($selector).append(i + ', ');
            }

          })
        }
        else $($selector).text("Voce ainda nao tem favoritos. Clique nos 'markers' e adicione agora!");
      }

      function placeFavourites()
      {
        if(localStorage.getItem('favs'))
        {
          clearMarkers();
          var favs = JSON.parse(localStorage.getItem('favs'));
          $(favs).each(function(idx, el){
            for(i in el)
            {
              var marker = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(el[i].Ja, el[i].Ka),
                icon : 'img/fav.png'
              });
////////////////////
        google.maps.event.addListener(marker, 'click', function(event) {
        var directionsService = new google.maps.DirectionsService();
        
        var start = new google.maps.LatLng(lat, lng);
        var end = new google.maps.LatLng(event.latLng.Ja, event.latLng.Ka);

        var request = {
            origin:start,
            destination:end,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };

        directionsDisplay.setMap(null);
        directionsDisplay.setPanel(null);
        directionsDisplay = new google.maps.DirectionsRenderer();

        directionsService.route(request, function(response, status) {

          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay = new google.maps.DirectionsRenderer({
                'map': map,
                'preserveViewport': true,
                'draggable': true
            });

            directionsDisplay.setDirections(response);
            directionsDisplay.setPanel(document.getElementById("directions"));
          }
          else {
            $("#directions").text("<p>Desculpe, aconteceu um erro inesperado :(</p>");
          }

        });
      });
////////////////////
            }
          })
        }
        else alert("You have no favourite places.Click on the markers add some!");
      }

      $('#info a[rel=markhome]').live('click', function(){
        
        var coords = [];
        var latLng = $(this).data();
        coords.push(latLng.lat);
        coords.push(latLng.lng);
        localStorage.setItem('home',JSON.stringify(coords));
        $(this).text("Location saved! Refresh the page to see the changes");

      });

});