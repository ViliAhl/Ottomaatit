
var map;
var markerArr = [];
var pos;
var nearestMarker;
 function initMap() {
        console.log("initMap called");
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 60.169054, lng: 24.938074},
          zoom: 15
        });
        
        geocoder = new google.maps.Geocoder();
        loadOttomaatit();
        
        var infoWindow = new google.maps.InfoWindow({map: map});

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
             pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('You are here.');
            map.setCenter(pos);
            
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
        
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      }
      
      function loadOttomaatit() {
      $.ajax({type: 'post',
       url: "/load.php",
       data: {func:"loadOttomaatit"},
       success: function(data) {
            console.log("loadOttomaatit success");
           addMarkers(data);
       }});
}


function loadComments() {
    $.ajax({type: 'post',
        url: "/load.php",
        data: {func:"loadComments"},
        success: function(data) {
            addComments(data);
        }
    });
}

function insertComment(ottomaattiId, name, comment) {
    $.ajax({type: 'post',
        url: "/load.php",
        data: {func: "insertComment", id:ottomaattiId, name:name, comment:comment, timestamp: Date.now()},
        success: function(data) {
            loadComments();
        }
    })
}
// Lisää markkerit kartalle tietokannasta haettujen 
// ottmaattien sijaintien mukaan
function addMarkers(data) {
    console.log(data.length);
    var parsedData = JSON.parse(data);

    for (var i = 0; i < parsedData.length; i++) {
        var maatti = JSON.parse(parsedData[i]);

        if (maatti == null || maatti.latitude == undefined || maatti.longitude == undefined) {
            continue;
        }
        
        var latitude = parseFloat(maatti.latitude);
        var longitude = parseFloat(maatti.longitude);
        
        var address = maatti.address;
        var city = maatti.city;
        var location = maatti.location;
        
        var marker = new google.maps.Marker({
            position: {lat: latitude, lng: longitude},
            title: location + "\n" + address + "\n" + city,
            map: map
        });
        
        marker.ottomaattiId = maatti.id;
        marker.ottomaattiLocation = location;
        marker.ottomaattiAddress = address;
        
        markerArr.push(marker);
    }

}


function findNearestMarker(location) {
    //etsii joko lähimmän ottoautomaatin parametrille annetulle google.maps.LatLng-oliolle tai jos parametrina ei sitä anneta, etsii paikannetun osoitteen lähimmän ottoautomaatin.
    var currentLocation;
    
    if (location == null) {
        currentLocation = new google.maps.LatLng(pos.lat, pos.lng);
    }
    else {
        currentLocation = location;
    }

    nearestMarker = markerArr.reduce(function (prev, curr) {
        var cpos = google.maps.geometry.spherical.computeDistanceBetween(currentLocation, curr.position);
        var ppos = google.maps.geometry.spherical.computeDistanceBetween(currentLocation, prev.position);
        
        return cpos < ppos ? curr : prev;
    });
    
    var infoWindowNearest = new google.maps.InfoWindow({map: map});
    
    infoWindowNearest.setPosition(nearestMarker.position);
    infoWindowNearest.setContent("Nearest Otto.");
}

function addComments(data) {
    var parsedData = JSON.parse(data);
    
    for (var i = 0; i < parsedData.length; i++) {
        var comment = JSON.parse(parsedData[i]);
        
        if(comment == null) {
            continue;
        }
        
        // lisää comment.name, comment.comment ja comment.timestamp johonkin diviin
    }
}

//Hakunappulan hakufunktio
$(".btn-find").click(function(){
    $(".newPostContent").empty();
   // $("#newPostInner").empty();
    
    
    var input = document.getElementById("address").value;
    if (input == ''){
        $(".newPostContent").append("<p>You searched via gps</p>");
        findNearestMarker();
    }else{
        $(".newPostContent").append("<p>Searched for:  </p>" + input);
        codeAddress();
    }
    
   // $("#newPostInner").append("<p> Closest one: </p>");
    
  });
// Hakunappulaan click() -funktio myös enter-painikkeeesta
$("#address").keypress(function (e) {
 var key = e.which;
 if(key == 13)  // enter keykode 
  {
    $(".btn-find").click();
    return false;
  }
});  
//#Address tyhjennys
$("#address").click(function(){
  $("#address").empty();
});

// Clikkaamalla lisää kommentin kommenttiboxiin
$("#messageinput").click(function(){
   
   var user = document.getElementById("user").value;
   var message = document.getElementById("messageinput").value;
   if (user == "Admin" && message != ''){
  $("#addComment").append(user + " said: " + message + "<br>");
   }
});

// Click-funktio enter-painikkeelle
$("#messageinput").keypress(function (e) {
 var key = e.which;
 if(key == 13)  // enter keykode 
  {
     $("#messageinput").click();
    return false;
  }
});

// Paikantaa ja kohdistaa kartan syötetyn osoitteen perusteella
// Hakee osoitetta vastaavan lähimmän ottomaatin
function codeAddress() {
    var address = document.getElementById("address").value;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
         
        var infoSearch = new google.maps.InfoWindow({map: map});
    
        infoSearch.setPosition(results[0].geometry.location);
        infoSearch.setContent("Your search");
        
        findNearestMarker(results[0].geometry.location)

        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
            
        }
        
        
        );
      } else {
          $(".newPostContent").append("<p>No search results found</p>" + status);
        alert("Geocode was not successful for the following reason: " + status);
      }
      map.setZoom(16);
    });
  }
   