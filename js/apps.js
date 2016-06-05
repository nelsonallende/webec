var LOGIN_SCREEN = '#login-screen';
var WHAT_SCREEN = '#what-screen';
var NOFOUND_SCREEN = "#nofound-screen";
var WHERE_SCREEN = '#where-screen';
var RED = 'ff0000';
var BLACK = '000000';
var HOME_LABEL = 'L';
var what;
var attempt = 3; // Variable to count number of attempts.



// Below function Executes on click of login button.
function validate() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (username == "Formget" && password == "formget#123") {
        alert("Login successfully");
        show(WHAT_SCREEN); // Redirecting to other page.
        return false;
    }
    else {
        attempt--;// Decrementing by one.
        alert("You have left " + attempt + " attempt;");
// Disabling fields after 3 attempts.
        if (attempt == 0) {
            document.getElementById("username").disabled = true;
            document.getElementById("password").disabled = true;
            document.getElementById("submit").disabled = true;
            return false;
        }
    }
}

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

    var options = {
        location: map.getCenter(),
        radius: radius,
        types: ['Suche'],
        keyword: what
    };

    places.nearbySearch(options, function (results, status) {

        if (status === google.maps.places.PlacesServiceStatus.OK) {

            results.forEach(function (place, i) {
                var sContent = place.name;
                var index = i + 1;
                var marker = new google.maps.Marker(getMarker(map, place.geometry.location, RED, index));
                google.maps.event.addListener(marker, 'click', function () {
                    infoWindow = new google.maps.InfoWindow({content: sContent});
                    infoWindow.open(map, marker);

                });
            });
        }
        else {
            show(NOFOUND_SCREEN);
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

    var here = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var options = {center: here, zoom: zoom};

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
    return {map: map, position: location, icon: url};

}

/**
 * Zeigt zu einer gegebenen Position auf der Karte Treffer an.
 *
 * @param position
 */
function showMapAndPlaces(position) {

	var map = getMap(position, 15);
    new google.maps.Marker(getMarker(map, map.getCenter(), BLACK, HOME_LABEL));
	var choice=what;
    console.log(choice)
	showPlaces(map, 300, choice);
}

function setId(_what) {
	what=_what;
 }

/**
 * Die 'Main' Methode
 */
$(document).ready(function () {


    // Default screen.
    show(LOGIN_SCREEN);


    $(WHAT_SCREEN).find('#1').on('click', function () {
		setId("Bank");
		show(WHERE_SCREEN);		
        navigator.geolocation.getCurrentPosition(showMapAndPlaces);
    });
	$(WHAT_SCREEN).find('#2').on('click', function () {
		setId("Haltestelle");
		show(WHERE_SCREEN);
        navigator.geolocation.getCurrentPosition(showMapAndPlaces);
    });
	$(WHAT_SCREEN).find('#3').on('click', function () {
		setId("Öffentliches WC");
		show(WHERE_SCREEN);
        navigator.geolocation.getCurrentPosition(showMapAndPlaces);
    });
});