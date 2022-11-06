mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: campgroundCoordinates, // starting position [lng, lat]
zoom: 9, // starting zoom
projection: 'globe' // display the map as a 3D globe
});
 
map.on('style.load', () => {
map.setFog({}); // Set the default atmosphere style

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker()
.setLngLat(campgroundCoordinates)
.addTo(map);
});
