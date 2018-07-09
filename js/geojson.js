/* Map of GeoJSON data from MegaCities.geojson */

//function to instantiante the Leaflet map
function createMap(){
    var map = L.map('map', {
        center: [20,0],
        zoom: 2
    });
    
    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);
    
    //call getData function
    getData(map);
};

//function to attach popups to each mapped feature
function onEachFeature (feature, layer) {
    var popupContent = "";
    if(feature.properties){
        //loop to add feature property names and values to html string
      for (var property in feature.properties){
          popupContent += "<p>" + property + ": " + feature.properties[property] + "<p>";
      }
      layer.bindPopup(popupContent);
    };
};

//function to retrieve the data and place it on the map
function getData(map){
    //load the data
    $.ajax("data/MegaCities.geojson", {
        dataType: "json",
        success: function(response){
            /*
            //create marker options
            var geojsonMarkerOptions = {
                radius: 8,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            
            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(response, {
                
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                },
                
                onEachFeature: onEachFeature,
                
                filter: function (feature, layer) {
                    return feature.properties.Pop_2015 > 20;
                }
            }).addTo(map);
            */

            
            //create an L.markerClusterGroup layer
            var markers = L.markerClusterGroup(); 
            //loop through features to create markers and add to MarkerClusterGroup
            for(var i = 0; i < response.features.length; i++){
                var a = response.features[i];
                //add properties html string to each marker
                var properties = "";
                for(var property in a.properties){
                    properties += "<p>" + property + ": " + a.properties[property] + "</p>";
                };
                var marker = L.marker(new L.LatLng(a.geometry.coordinates[1], a.geometry.coordinates[0]),{properties: properties});
                    //add a popup for each marker
                    marker.bindPopup(properties);
                    //add marker to MarkerClusterGroup
                    markers.addLayer(marker);
                }
            map.addLayer(markers);
        }
    });
};

$(document).ready(createMap);