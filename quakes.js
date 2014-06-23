//  DAVID WELLS
//  Earthquake website
//
/*

  Website located at:  http://earthquakes.parseapp.com

  1. Takes input: location name (example: San Francisco, CA)
  2. Calls GeoNames recent earthquake WebService
  3. Plots results on a Google Map.  
  Each marker displays details of the earthquake when mouse is hovered over marker.

  Bonus:
  4. Lists top 10 largest earthquakes in the world.
  Original requirement: display earthquakes from last 12 months.
  I have the top 10 earthquakes listed on the page, however there is no parameter 
  on GeoNames webservices allows for retrieving results limited to the last year.
  I am getting the maximum allowed rows to be returned (500 earthquakes), and even with
  the optional date parameter was unable to get the service to return results from specifically
  the past year.  
  With more time I could implement a work-around.  
  One possible solution could be to continually hit the web service and store results
  in an array with the condition that they must be within the past year, and then sort.
  Upon request, I can finish attempting this bonus implementation.

*/



//  Set up some variables we'll need:
var markers = [];
var map;
var largestTen = [];
var tempQuakesArray = [];
var address;
var timeout = 600;
var yyyy;
var mm;


//  Initialize the Google map
function initialize() {
  var mapOptions = {

    //  Set initial map view to coordinates of Bluewolf's SF Office.	
    center: new google.maps.LatLng(37.792528, -122.393981),
    zoom: 11
  };
  map = new google.maps.Map(document.getElementById("map-canvas"),
    mapOptions);

}

 

//  Geocode user-input location
function geoCodeLocation() {
	var address = document.getElementById("address").value;
	deleteMarkers();
	var geocoder = new google.maps.Geocoder();

	geocoder.geocode(	{ 'address': address},
		function(results, status) {
			if (status == google.maps.GeocoderStatus.OK){

				map.setCenter(results[0].geometry.location);

				//  Bounding box dictated by the city entered and geocoded
				var bounds = map.getBounds();
				console.log(bounds);

				var north = bounds.getNorthEast().lat();
				var east = bounds.getNorthEast().lng();
				var west = bounds.getSouthWest().lng();
				var south = bounds.getSouthWest().lat();


				//  Request to the GeoNames.org Earthquakes REST service
				console.log("http://api.geonames.org/earthquakesJSON?north=" + north + "&south="+south+"&east="+east+"&west="+west+"&username=thedavidwells");

				$.getJSON("http://api.geonames.org/earthquakesJSON?north=" + north + "&south="+south+"&east="+east+"&west="+west+"&username=thedavidwells", function(response){
          placeMarkers(response);
        });

			} else {
				alert('Unable to geocode that location: ' + status);
			}

		});
}


//  Function to place earthquake markers on the map
function placeMarkers(data) {
 if(data.earthquakes==null) {
  console.log("NO DATA LOADED...");
}

var quakeInfo = data.earthquakes;

for (var i = 0; i < data.earthquakes.length; i++) {

  var quakeLocation = new google.maps.LatLng(data.earthquakes[i].lat,data.earthquakes[i].lng);
  var marker = new google.maps.Marker({
   position: quakeLocation,
   map: map,
   title: "Time: " + data.earthquakes[i].datetime + ", Magnitude: " +data.earthquakes[i].magnitude + " Depth: " + data.earthquakes[i].depth + " Earthquake ID: " +data.earthquakes[i].eqid
 });
  markers.push(marker);
}


}


//  Removes markers from the map
function deleteMarkers() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];
}



//  Sort quakes by largest
function sortQuakes(data) {
  if(data.earthquakes==null) {
    //console.log("NO DATA LOADED...");
  }


  console.log("SORTING LARGEST QUAKE DATA!");
  for (var i = 0; i < data.earthquakes.length; i++) {

    var quake = data.earthquakes[i];
    var fullDate = data.earthquakes[i].datetime;
    //console.log(fullDate);
    var yearSubstring = fullDate.substring(0, 4);
    var monthSubstring = fullDate.substring(5,7);
    //console.log("YEAR: " + yearSubstring + " MONTH: " + monthSubstring);
    
    tempQuakesArray.push(quake);
    //console.log(quake);   
  }

  var listContainer = document.getElementById("top-10");
  var listElement = document.createElement("ul");
  // listContainer.appendChild(listElement);

  //  Sort the array by magnitude
  tempQuakesArray.sort(function(a,b){return b.magnitude-a.magnitude;});
  

  $("top-10").append("<ul></ul>");

  //  Add top quakes to the list
  for (var j = 0; j < 10; j++) {

    largestTen[j] = tempQuakesArray[j];
    console.log("LARGEST 10.....");
    console.log(largestTen[j]);

    var li = "<li>";
    //  Add the quakes to the web page
    $("#top-10").append(li.concat("<b>Magnitude:</b> " +largestTen[j].magnitude + ",<br> <b>Date: </b>" + largestTen[j].datetime +",<br> <b> lat, lng: </b>" + largestTen[j].lat + ", "+largestTen[j].lng ));

  }
}



//  Bonus:  Get top 10 largest earthquakes in the qorld for the last 12 months:
function tenLargestQuakes() {

  //  Looking at a world map for lat/long coordinates (example: http://www.worldatlas.com/aatlas/findlatlong.htm)
  //  We can see that the world goes from -180 to 180 degrees west to east, and -90 to 90 south to north.  
  //  So if we want to search for all earthquakes in the entire world we need to use these coordinates.
  var largest;
  var north = 90;
  var east = 180;
  var west = -180;
  var south = -90;
  var maxRows = 500;  //  The most allowed by api.geonames.org

  //  We'll need to get the current date, and search a year back
  //  Date needs to be called in 'yyyy-MM-dd' format.
  var today = new Date();
  var dd = today.getDate();
  mm = today.getMonth()+1;  // since January is 0.
  yyyy = today.getFullYear();
  today = yyyy+'-'+mm+'-'+dd;
  //console.log(today);
  var minMagnitude = 1;


  //  get data:
  console.log("GETTING DATA!");
  $.getJSON("http://api.geonames.org/earthquakesJSON?north=" + north + "&south="+south+"&east="+east+"&west="+west+"&datetime="+today+"&minMagnitude="+minMagnitude+"&maxRows="+maxRows+"&username=thedavidwells", function(response){
    sortQuakes(response);
  });
  //console.log("http://api.geonames.org/earthquakesJSON?north=" + north + "&south="+south+"&east="+east+"&west="+west+"&datetime="+today+"&minMagnitude="+minMagnitude+"&maxRows="+maxRows+"&username=thedavidwells");
}


google.maps.event.addDomListener(window, 'load', initialize);
