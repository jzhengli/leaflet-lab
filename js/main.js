/**************************** PRE-MODULE ****************************************************/
/*
//using JavaScript to manipulate DOM
function myfunc(){
  var mydiv = document.getElementById("mydiv");
  mydiv.innerHTML = "Hello World";  
};

//This is a best practice that load script after the rest of the HTML document loads so that it doesn't try to perform any actions on elements that don't exist yet. It is a standard practice to call window.onload last so the interpreter reads through everything once before reading it. 
window.onload = myfunc();
*/

/*
//using JQeury to manipulate DOM
///jQuery('#mydiv').html('Hello JQuery!');
$('#mydiv').html('Hello again!');

//exmaple 3.5 building an HTML table
function initialize(){
    cities();
};

function cities(){
    var cityPop = [
        {
            city: 'Madison',
            population: 233209
        },
        {
            city: 'Milwaukee',
            population: 594833
        },
        {
            city: 'Green Bay',
            population: 104057
        },
        {
            city: 'Superior',
            population: 27244
        }
    ];
    
    $('#mytable').append("<table>");
    
    $("table").append("<tr>");
    
    $("tr").append("<th>City</th><th>Population</th>");
    
    for (var i = 0; i < cityPop.length; i++){
        var rowHtml = "<tr><td>" + cityPop[i].city + "</td><td>" + cityPop[i].population + "</td></tr>";
        $("table").append(rowHtml);
    };
};

//use .attr method to get the id of mydiv
var theid = $('#mydiv').attr('id');
$('#mydiv').append(" (The id of this div is \"" + theid + "\")");
//use .css method to get and set the style of mydiv
$('#mydiv').css({
    'color': 'blue',
    'font-size': '2em',
    'text-align': 'left'
});

$('#mydiv').on('click', function(){
    alert('Go Badgers!');
})

//Rather than using window.onload, this will execute the script as soon as the DOM is prepared, before all images and frames are loaded, making the loading of the site faster.
$(document).ready(initialize);
*/


//Javascript AJAX request
/*
function jsAjax(){
    //step 1: Create the request
    var ajaxRequest = new XMLHttpRequest();
    
    //step 2: Create an event handler to send received data to a callback function
    ajaxRequest.onreadystatechange = function(){
        console.log("readyState: ", ajaxRequest.readyState);
        //ajax request state:
        //1:server connection established
        //2.request received
        //3.processing request
        //4.response is received from the server
        if(ajaxRequest.readyState === 4){
            callback(ajaxRequest.response);
        };
    };
    
    //step 3: Open the server connection, the true parameter means set data to be sent asynchronously
    ajaxRequest.open('GET', 'data/MegaCities.geojson', true);
    
    //step 4: Set the response data type
    ajaxRequest.responseType = "json";
    
    //step 5: Send the request
    ajaxRequest.send();
};

//define callback function
function callback(response){
    //console.log(response);
    console.log(JSON.stringify(response));
};

window.onload = jsAjax();
*/

//jQuery AJAX request
/*function jQueryAjax(){
    $.ajax("data/MegaCities.geojson",{
        dataType: "json",
        success: callback
        //optionally we can write an anonymous function here. console.log(mydata) needs to be included in the function
        success: function(response){
            mydata = response;
            //the data here can be accessed
            console.log(mydata);
        }
        
    });
    //shorthand methods:
    //$.get("data/MegaCities.geojson", callback, "json");
    //or
    //$.getJSON("data/MegaCities.geojson", callback);
    //this mydata cannot be accessed, because the line is executed by the interpreter before the data arrived and was assigned to the variable
    //console.log(mydata);
};


//a callback function will execute any script that makes use of the data retrieved from the server only once the data has arrived
//status and jqXHRobject can be omitted
function callback(response, status, jqXHRobject){
    console.log(response);
};
*/




/***************************  Lab 1  **********************************************************/
/********** 2-2 Zoom, Pan, Retrieve Interactions ********/
//GOAL: Proportional symbols representing attribute values of mapped features
//STEPS:
//1. Create the Leaflet map--done (in createMap())
//2. Import GeoJSON data--done (in getData())
//3. Add circle markers for point features to the map--done (in AJAX callback)
//4. Determine which attribute to visualize with proportional symbols
//5. For each feature, determine its value for the selected attribute
//6. Give each feature's circle marker a radius based on its attribute value

/************** 2-3 Sequence Interaction ****************/
//GOAL: Allow the user to sequence through the attributes and resymbolize the map
//   according to each attribute
//STEPS:
//1. Create slider widget
//2. Create skip buttons
//3. Create an array of the sequential attributes to keep track of their order
//4. Assign the current attribute based on the index of the attributes array
//5. Listen for user input via affordances
//6. For a forward step through the sequence, increment the attributes array index;
//   for a reverse step, decrement the attributes array index
//7. At either end of the sequence, return to the opposite end of the seqence on the next step
//   (wrap around)
//8. Update the slider position based on the new index
//9. Reassign the current attribute based on the new attributes array index
//10. Resize proportional symbols according to each feature's value for the new attribute

//Step 2.1: Create the Leaflet map
function createMap(){
    var map = L.map('map', {
        center: [20,0],
        zoom: 2
    });
    
    //add OSM base tilelayer
    var OSMSt = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    });
    
    var esriImg = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });
    
    var mapboxSt = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',{
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiemxpLXdpc2MiLCJhIjoiY2pjdHVwNjc5MDJ0bDJxbWpmOHllejYweiJ9.zsVQQz34Ie2vf5Ma6dDs_A'
    }).addTo(map);
    
    var basemaps = {
		"Mapbox Street": mapboxSt,
		"<span style='color: gray'>OpenStreatMap</span>": OSMSt,
		"<span style='color: gray'>Esri World Imagery</span>": esriImg
	};
	L.control.layers(basemaps).addTo(map);
    
    //add mapbox access token
    //L.mapbox.accessToken = //"pk.eyJ1IjoiemxpLXdpc2MiLCJhIjoiY2pjdHVwNjc5MDJ0bDJxbWpmOHllejYweiJ9.zsVQQz34Ie2vf5Ma6dDs_A";
    
    //call getData function
    getData(map);
};

/*
//test: function to attach popups to each mapped feature
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
*/

//calculate the radius of each proportional symbol
function calcPropRadius(attValue){
    //scale factor to adjust symbol size evenly
    var scaleFactor = 50;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);
    return radius;
};

//a consolidated popup creation function
function Popup(properties, attribute, layer, radius){

    this.properties = properties;
    this.attribute = attribute;
    this.layer = layer;
    
    //add formatted attribute to panel content string
    this.year = attribute.substr(4,4);
    this.unemploymentRate = this.properties[attribute];
    this.content = "<p><b>Country:</b> " + this.properties.NAME + "</p><p><b>" + " Unemployment Rate in " + this.year + ":</b> " + this.unemploymentRate + "%</p>";

    //replace the layer popup
    this.bindToLayer = function(){
        this.layer.bindPopup(this.content, {
            offset: new L.Point(0,-radius)
        });
    };
};

//function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes) {
    //Determine which attribute to visualize with proportional symbols
    //var attribute = "Year2008";
    //Step 3.4: Assign the current attribute based on the first index of the attributes array
    var attribute = attributes[0];
    //check
    //console.log(attribute);
    //create marker options
    var options = {
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    
    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);
    
    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);
    
    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //create a new popup and add to circle marker
    var popup = new Popup(feature.properties, attribute, layer, options.radius);
    popup.bindToLayer();
    
    //event listeners to open popup on hover and fill panel on click
    layer.on({
        mouseover: function(){
            this.openPopup();
        },
        mouseout: function(){
            this.closePopup();
        },
        //click: function(){
          //  $("#info").html(panelContent);
        //}
    });
    
    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};



//Step 2.3: Add circle markers for point features to the map
function createPropSymbols(data, map, attributes){
  /*step 2.4-6 are moved out to be a separate function pointToLayer
  //Step 2.4: Determine which attribute to visualize with proportional symbols
   var attribute = "Year2008";
    
  //create marker options
   var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
   };

  //create a leaflet GeoJSON layer and add it to the map
  L.geoJson(data, {
      pointToLayer: function (feature, latlng) {
          //Step 2.5: For each feature, determine its value for the selected attribute
          var attValue = Number(feature.properties[attribute]);
          
          //console.log(feature.properties, attValue);
          
          //Step 2.6: Give each feature's circle marker a radius based on its attribute value
          geojsonMarkerOptions.radius = calcPropRadius(attValue);
          
          return L.circleMarker(latlng, geojsonMarkerOptions);
      }
  }).addTo(map);
  */
  var marker = L.geoJsonFilter(data, {
      pointToLayer: function(feature, latlng){
          return pointToLayer(feature, latlng, attributes);
      },
      filter: function(feature){
        return true;
          //return feature.properties.REGION - 0;
        //return filterPropSymbols(feature.properties.REGION);
      }
  }).addTo(map);
/*
    //console.log(marker);
  $('#testB').on('click', function(){
      marker.setFilter(function(f){
          return false;
      });
  });
    */
};

/*******************not implemented yet***********************************************************/
/*
//The fifth operator - filter data by continent
function createFilterDropdown(map){
    //create filter menu
    $('#filter').append('<nav id="menu" class="menu-ui">');
    $('#menu').append('<a href="#" class="active" data-filter="0"><strong>World</strong></a>');
    $('#menu').append('<a href="#" data-filter="2">Africa</a>');
    $('#menu').append('<a href="#" data-filter="142">Asia</a>');
    $('#menu').append('<a href="#" data-filter="150">Europe</a>');
    $('#menu').append('<a href="#" data-filter="29">North America</a>');
    $('#menu').append('<a href="#" data-filter="9">Oceania</a>');
    $('#menu').append('<a href="#" data-filter="19">South America</a>');
    $('#filter').append('</nav>');
    
    //click listener for filter menu
    $('.menu-ui a').on('click', function() {
        var filter = $(this).data('filter');
        $(this).addClass('active').siblings().removeClass('active');
        //console.log(filter);
        //return filterPropSymbols(map,filter);
    });
};          


function filterPropSymbols(map,filter){

    map.eachLayer(function(layer){
        if(layer.feature && layer.feature.properties.REGION){
            //var r = layer.feature.properties["REGION"];
            //console.log(layer.feature.properties.REGION);
            //console.log(layer);
            console.log(layer.filter);
            //layer.setFilter(function(f){
                //return !(layer.feature.properties["REGION"] - filter);
            //});
        };
        //return true;
    });
};
*/
/*******************not implemented yet***********************************************************/


//Step 3.10: Resize proportional symbols according to new attribute values
function updatePropSymbols(map, attribute){
    map.eachLayer(function(layer){
        if(layer.feature && layer.feature.properties[attribute]){
            //access feature properties
            var props = layer.feature.properties;
            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);
            
            //create new popup and add to circle marker
            var popup = new Popup(props, attribute, layer, radius);
            popup.bindToLayer;
            
            //update temporal legend
            updateLegend(map, attribute);
        };
    });
};


//Step 3.1, 3.2: create new sequence controls
function createSequenceControls(map, attributes){
    var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },
        
        onAdd: function (map) {
            // create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'sequence-control-container');   

            //add skip buttons
            $(container).append('<button class="skip" id="reverse" title="Reverse"><<</button>');
            //create range input element (slider)
            $(container).append('<input class="range-slider" type="range">');
            
            $(container).append('<button class="skip" id="forward" title="Forward">>></button>');

            
            //kill any mouse event listeners on the map
            $(container).on('mousedown dblclick', function(e){
                L.DomEvent.stopPropagation(e);
                map.dragging.disable();
            });
            
            return container;
        }
        
    });
        
    map.addControl(new SequenceControl());
    
    //set slider attributes
    $('.range-slider').attr({
        max: 6,
        min: 0,
        value: 0,
        step: 1
    });
    //Step 3.5: click listener for buttons and input listener for slider
    $('.skip').click(function(){
        //get the old index value
        var index = $('.range-slider').val();
        //console.log(index);
        //Step 3.6: increment or decrement depending on button clicked
        if($(this).attr('id') == 'forward'){
            index++;
            //Step 3.7: if past the last attribute, wrap around to first attribute
            index = index > 6 ? 0 : index;
        }else if ($(this).attr('id') == 'reverse'){
            index--;
            //Step 3.7: if past the first attribute, wrap around to last attribute
            index = index < 0 ? 6 : index;
        };

        //Step 3.8: update slider
        $('.range-slider').val(index);

        //Step 3.9: pass new attribute to update symbols
        updatePropSymbols(map, attributes[index]);
    });
    $('.range-slider').on('input', function(){
        //Step 3.6: get the new index value
        var index = $(this).val();
        //console.log(index);
        //Step 3.9: pass new attribute to update symbols
        updatePropSymbols(map, attributes[index]);
    });

};

/******************************************************/
//PSEUDO-CODE FOR ATTRIBUTE LEGEND
/*******************************************
1. Add an `<svg>` element to the legend container
2. Add a `<circle>` element for each of three attribute values: max, mean, and min
3. Assign each `<circle>` element a center and radius based on the dataset max, mean, and min values of the current attribute
4. Create legend text to label each circle
5. Update circle attributes and legend text when the data attribute is changed by the user
*******************************************/

//Update the legend with new attribute
function updateLegend(map, attribute){
    //create content for legend
    var year = attribute.substr(4,4);
    var legend = "<p><b>Unemployment Rate in " + year + "</b></p>";

    //replace legend content
    $('#temporal-legend').html(legend);
    
    var circleValues = getCircleValues(map, attribute);
    //console.log(circleValues);
    for(var key in circleValues){
        //get the radius
        var radius = calcPropRadius(circleValues[key]);
        //Step 4.3: assign the cy and r attribute
        $('#'+key).attr({
            cy: 59 - radius,
            r: radius
        });
        
        //Step 4.4: add legend text
        $('#'+key+'-text').text(Math.round(circleValues[key]*100)/100 + "%");
    };
};

//create function to add a legend
function createLegend(map, attributes){
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },

        onAdd: function (map) {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'legend-control-container');

            //add temporal legend div to container
            $(container).append('<div id="temporal-legend">')
            
            //Step 4.1: start attribute legend svg string
            var svg = '<svg id="attribute-legend" width="160px" height="60px">';

            //array of circle names to base loop on
            var circles = ["max", "mean", "min"];
            
            //Step 4.2: loop to add each circle and text to svg string
            var circles = {
                max: 20,
                mean: 40,
                min: 60
            };

            //loop to add each circle and text to svg string
            for (var circle in circles){
                //circle string
                svg += '<circle class="legend-circle" id="' + circle + '" fill="#F47821" fill-opacity="0.8" stroke="#000000" cx="30"/>';

                //text string
                svg += '<text id="' + circle + '-text" x="65" y="' + circles[circle] + '"></text>';
            };
            
            //close svg string
            svg += "</svg>";
            
            //add attribute legend svg to container
            $(container).append(svg);
            
            return container;
        }
    });

    map.addControl(new LegendControl());
    
    //console.log(attributes[0]);
    updateLegend(map, attributes[0]);
};

//Calculate the max, mean, and min values for a given attribute
function getCircleValues(map, attribute){
    //start with min at highest possible and max at lowest possible number
    var min = Infinity,
        max = -Infinity;

    map.eachLayer(function(layer){
        //get the attribute value
        if (layer.feature){
            var attributeValue = Number(layer.feature.properties[attribute]);

            //test for min
            if (attributeValue < min){
                min = attributeValue;
            };

            //test for max
            if (attributeValue > max){
                max = attributeValue;
            };
        };
    });

    //set mean
    var mean = (max + min) / 2;
    //return values as an object
    return {
        max: max,
        mean: mean,
        min: min
    };
};



//Step 3.3: build an attributes array from the data
function processData(data){
    //empty array to hold attributes
    var attributes = [];
    //properties of the first feature in the dataset
    var properties = data.features[0].properties;
    
    //push each attribute name into attributes array
    for(var attribute in properties){
        //only take attributes with unemployment rate values
        if(attribute.indexOf("Year") > -1){
            attributes.push(attribute);
        };
    };
    
    //check result
    //console.log(attributes);
    return attributes;
};

//Step 2.2: Import GeoJSON data
function getData(map){
    //load the data
    $.ajax("data/UnemploymentRate.geojson", {
       dataType: "json",
       success: function(response) {
           //create an attribute array
           var attributes = processData(response);
           
           //call function to create proportional symbols
           createPropSymbols(response, map, attributes);
           createSequenceControls(map, attributes);
           createLegend(map,attributes);
           //createFilterDropdown(map);
           /*
           //test: add data to map
           L.geoJson(response, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                },
               
                onEachFeature: onEachFeature
           }).addTo(map);  
           
           
           //test: add markerClusterGroup
           
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
            */
       }
    });
};


$(document).ready(createMap);

