var WHAT_SCREEN = '#what-screen';
var NOFOUND_SCREEN = "#nofound-screen";
var WHERE_SCREEN = '#where-screen';
var RED = 'ff0000';
var BLACK = '000000';
var HOME_LABEL = 'L';

/**
 * Zeigt den Screen mit der entsprechenden ID und versteckt die anderen.
 *
 * @param screenID
 */
function show(screenID) {
    $('section').hide();
    $(screenID).show();
}



/**
 * True, wenn der Screen mit der screenID angezeigt wird, false sonst.
 *
 * @param screenID
 * @returns {boolean}
 */
function isLoaded(screenID) {
    return $(screenID).children().length !== 0;
}

/**
 * Zeigt die Treffer auf der Karte an.
 *
 * @param map
 * @param radius
 * @param what
 */
function showPlaces(map, radius, what) {

    var places = new google.maps.places.PlacesService(map);

    var options = { location: map.getCenter(), radius: radius, types : ['öffentliches wc'], keyword: $('.buttonmain').val()    };

    places.nearbySearch(options, function(results, status) {

        if(status === google.maps.places.PlacesServiceStatus.OK ) {

            results.forEach(function(place, i) {

                var index = i + 1;
                new google.maps.Marker(getMarker(map, place.geometry.location, RED, index));
                 });
        }
        else {

            $(NOFOUND_SCREEN).append('<label>Keinen Treffer gefunden</label>');
            console.log('status: ', status);
        }
    });
}

/**
 * Erzeugt die Karte und gibt sie zurück.
 *
 * @param position
 * @param zoom
 *
 * @returns google.maps.Map
 */
function getMap(position, zoom) {

    var here = new google.maps.LatLng(position.coords.latitude,  position.coords.longitude);
    var options = { center: here, zoom: zoom };

    return new google.maps.Map($(WHERE_SCREEN).get(0), options);  // Das ist hässlich, denn es gibt nur eine ID...
}

/**
 * Erzeugt das Marker Objekt und gibt es zurück.
 *
 * @param map
 * @param location
 * @param label
 *
 * @returns Marker Objekt
 */
function getMarker(map, location, bgcolor, label) {

    var url = ['http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=', label, '|', bgcolor, '|ffffff'].join('');
    return { map: map, position: location, icon: url };
}

/**
 * Zeigt zu einer gegebenen Position auf der Karte Treffer an.
 *
 * @param position
 */
function showMapAndPlaces(position) {

    var map = getMap(position, 15);

    new google.maps.Marker(getMarker(map, map.getCenter(), BLACK, HOME_LABEL));

    var choice = $(WHAT_SCREEN).find('.buttonmain').val();
    showPlaces(map, 300, choice);
}

/**
 * Die 'Main' Methode
 */
$(document).ready(function() {


    // Default screen.
    show(WHAT_SCREEN);

    $(".label").click(function(){
        $(this).toggleClass('selectedIMG');
    });

    // Button Handlers.
    $('#what-button').on('click', function() {
        show(WHAT_SCREEN);
    });

    $('#who-button').on('click', function() {
        if(isLoaded(WHO_SCREEN)) {
            show(WHO_SCREEN);
        }
    });

    $('#where-button').on('click', function() {
        if(isLoaded(WHERE_SCREEN)) {
            show(WHERE_SCREEN);
        }
    });

    $(WHAT_SCREEN).find('.buttonmain').on('click', function() {
        console.log('.buttonmain.id');
        show(WHERE_SCREEN);
        navigator.geolocation.getCurrentPosition(showMapAndPlaces);
    });
});