var map = L.map('map').setView([40.674649,-73.844261], 11);

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var RaceResultsLayer = L.geoJson(RaceResults, {
	fillColor: "purple",
	fillOpacity: .02,
	color: "#2b2e5e",
}).addTo(map);
