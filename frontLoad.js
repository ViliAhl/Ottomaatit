/*global map*/
/*global markerArr*/
/*global google*/
/*global $*/

loadOttomaatit();

function loadOttomaatit() {
    $.ajax({type: 'post',
       url: "load.php",
       data: {func:"loadOttomaatit"},
       dataType:"json",
       success: function(data) {
           addMarkers(data);
       }})
}

function loadComments($ottomaattiId) {
    $.ajax({type: 'post',
        url: "load.php",
        data: {func:"loadComments", id:$ottomaattiId},
        dataType:"json",
        success: function(data) {
            return data;
        }
    })
}

function addMarkers(data) {
    
    var parsedData = JSON.parse(data);
    
    for (var i = 0; i < parsedData.length; i++) {
        var maatti = parsedData[i];
        
        if (maatti == null) {
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
        
        markerArr.push(marker);
    }
}