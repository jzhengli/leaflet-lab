
function debugCallback(response){
	
	$(mydiv).append('GeoJSON data: ' + JSON.stringify(response));
};


function debugAjax(){
	
	var mydata;

	$.ajax("data/MegaCities.geojson", {
		dataType: "json",
		success: debugCallback
	});

	//$(mydiv).append('<br>GeoJSON data:<br>' + JSON.stringify(mydata));
};

//$(mydiv).append('GeoJSON data: ' + JSON.stringify(mydata));

$(document).ready(debugAjax);