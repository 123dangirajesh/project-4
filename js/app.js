//  map  script   //

// Initializing Varibales to be used //


var map;
var marker;
var markers = [];


function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 15.2993, lng: 74.1240},
    zoom: 8,
      
    
      
    styles : [
    {
        "featureType": "water",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#b5cbe4"
            }
        ]
    },
    {
        "featureType": "landscape",
        "stylers": [
            {
                "color": "#efefef"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#83a5b0"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#bdcdd3"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e3eed3"
            }
        ]
    },
    {
        "featureType": "administrative",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "darkness": 33
            }
        ]
    },
    {
        "featureType": "road"
    },
    {
        "featureType": "poi.park",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "darkness": 20
            }
        ]
    },
    {
        "featureType": "road",
        "stylers": [
            {
                "darkness": 20
            }
        ]
    }
  ]});

  
  // Initialize info windows and map bounds  //
  
    
  var infoWindow = new google.maps.InfoWindow({
    maxWidth: 100
  });
  var bounds = new google.maps.LatLngBounds();

  
  // Open info window when marker is clicked 'this' = marker  // 
  
   var markerAnimation = function() {
      toggleBounce(this);
      map.panTo(marker.getPosition());
      populateInfoWindow(this, infoWindow);
    };

    function toggleBounce(marker) {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
        marker.setAnimation(null);
      }, 1500);
    }

   
  // infoWindow with marker title & wikipedia API info is shown when marker is clicked //
    
  function populateInfoWindow(marker, infowindow) {

      var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&imlimit=5&format=json&callback=wikiCallback';
      
      
      // Wikipedia AJAX Request to add Wikipedia entry on selected places to infoWindow //
      
        
      $.ajax({
        url: wikiUrl,
        dataType: 'jsonp'
      }).done(function(data) {
        console.log(data);

        var dataUri = data[3][0];
        var dataDescription = data[2][0];

       
        // Error handling  if no article is displayed from Wikipedia API  //
        
        
        if (dataUri === undefined) {
          infowindow.setContent('<div>' + '<h2>' + marker.title + '</h2>' + '<p>' + 'Sorry wikipedia can not able to found.' + '</p>' + '</div>');
          infowindow.open(map, marker);

        } else {

          infowindow.marker = marker;
          infowindow.setContent('<div>' + '<h2>' + marker.title + '</h2>' + '<p>' + dataDescription + '<a href="' + dataUri + '" target="blank">' + '..' + ' Read More' + '</a>' + '</p>' + '</div>');
          infowindow.open(map, marker);
        }

        
        // Error handling for if Wikipedia API call fails //
        
          
      }).fail(function() {
        infowindow.setContent('<div>' + '<h2>' + marker.title + '</h2>'  + '</div>');
        infowindow.open(map, marker);

      });

      
      // Google Maps event listeners: Close info window when user clicks on the A in the infoWindow or anywhere on the map,    //
      
        
      google.maps.event.addListener(map, 'click', function() {
        infowindow.close();
        infowindow.setMarker = null;
      });
      google.maps.event.addListener(infowindow, 'closeclick', function() {
        infowindow.close();
        infowindow.setMarker = null;
      });
    }
    
  
  // markers are added from positions listed in datamodel.js  //
  

  for (i = 0, len = positions.length; i < len; i++) {
    var position = positions[i].position;
    var title = positions[i].title;

    marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
    });
    bounds.extend(marker.position);
    ViewModal.positionList()[i].marker = marker;

    marker.addListener('click', markerAnimation);
    map.fitBounds(bounds);
  }

     
  // Knockout.js is applied for data-binding   //
  
  ko.applyBindings(ViewModal);
}


// handling error using google map api  //


Error = function Error() 
{
    alert('Sorry ,refresh the page and try again');
};


// Navigation is used when width is below 767px  //


// jQuery event for toggling mobile nav in and out  //


$('#nav-icon2').on('click', function() {
  $('.list-box').toggleClass('list-box-open');
  $(this).toggleClass('open');
  var sideHeight = $('.list-box').outerHeight();
  $('#mapDiv').height(sideHeight);
});


// Close mobile nav when list item is clicked  //


$('.list-item').on('click', function() {
  $('list-box').toggleClass('list-box-open');
});