var LOGIN_SCREEN = '#login-screen';
var WHAT_SCREEN = '#what-screen';
var NOFOUND_SCREEN = "#nofound-screen";
var WHERE_SCREEN = '#where-screen';
var REGISTER_SCREEN = '#register-screen';
var COMMENT_SCREEN = '#comment-screen';
var RED = 'ff0000';
var BLACK = '000000';
var HOME_LABEL = 'L';
var what;
var attempt = 3; // Anzahl max. Versuche
var titles = [];
var titleInput = document.getElementById("title");
var messageBox = document.getElementById("display");
var commentEnable=false;

function register() {
    show(REGISTER_SCREEN);
}

/**
 * Validiert die Registrieung des neuen Benutzers
 *
 *
 */
function registerValidate() {
    var email = document.getElementById("emailaddress").value;
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    commentEnable=true;
    if (username !=="" || password !== "" || email!=="") {
        alert("Registered successfully");
        showWhatScreenUser(); // Redirecting to other page.
        return false;
    }else{
        alert("No empty fields allowed")
    }
}
/**
 * Validiert das Passwort des Users
 *
 * @param attempt
 */
function validate() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    commentEnable=true;
    if (username == "Formget" && password == "formget#123") {
        showWhatScreenUser(); // Redirecting to other page.
        return false;
    }
    else {
        attempt--;
        alert("You have left " + attempt + " attempt;");
// Disabling fields nach 3 Fehlversuchen
        if (attempt == 0) {
            document.getElementById("username").disabled = true;
            document.getElementById("password").disabled = true;
            document.getElementById("submit").disabled = true;
            return false;
        }
    }
}
/**
 * Zeigt den Screen an mit der Auswahl an Suchmöglichkeiten
 *
 *
 */
function showWhatScreen() {
    show(WHAT_SCREEN);
}

function showWhatScreenUser() {
    show(WHAT_SCREEN);
}
/**
 * Zeigt das Comment Fenster
 *
 * @param titles
 * @param titleInputs
 * @param messageBox
 */

function setComment(){
    if(commentEnable===true){
        show(COMMENT_SCREEN)
    }else{
        alert('Please Login')
        show(LOGIN_SCREEN)
    }

}
function Allow()
{
    if (!user.title.value.match(/[a-zA-Z]$/) && user.title.value !="")
    {
        user.title.value="";
        alert("Please Enter only alphabets");
    }
    window.location.reload()
}

function insert () {
    titles.push(titleInput.value);
    clearAndShow();
}
function clearAndShow ()
{
    titleInput.value = "";
    messageBox.innerHTML = "";
    messageBox.innerHTML += " " + titles.join("<br/> ") + "<br/>";
}
function getwords() {
    text = ('#words').value;
    document.getElementById('para').innerHTML += '<p>'+text
    document.getElementById('words').value = "enter"
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

window.onbeforeunload = function() { showWhatScreen() };

function goBack() {
   show(WHAT_SCREEN);
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
                var sContent = "<div>" + place.name + "<a onclick='setComment()'href=#> (Comment me)</a></div>";
                var index = i + 1;
                var marker = new google.maps.Marker(getMarker(map, place.geometry.location, RED, index));
                var infoWindow = new google.maps.InfoWindow({content: sContent});
                google.maps.event.addListener(marker, 'click', function () {
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

    $(WHAT_SCREEN).find('#4').on('click', function () {
        setId("Logout");
        show(LOGIN_SCREEN);
    });
});