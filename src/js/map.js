// Initialize Firebase
let config = {
    apiKey: "AIzaSyBs0nAKpahMqi6SKh-5zGsGjsEHVjS7W_k",
    authDomain: "foodmap-bd27c.firebaseapp.com",
    databaseURL: "https://foodmap-bd27c.firebaseio.com",
    projectId: "foodmap-bd27c",
    storageBucket: "foodmap-bd27c.appspot.com",
    messagingSenderId: "707271800628"
  };
  app = firebase.initializeApp(config);

const restaurantContainerElem = document.getElementById('restaurants_container');
const searchButtonElem = document.getElementById('button_search');
const searchInputElem = document.getElementById('search_input');

let map;
let infowindow = null;
let output

let flagSearch = 0;


let restaurantData = {
    placeId: null,
    name: null,
    id: null,
    types: null,
    address: null,
    reference: null
}

const drawListNearRestaurant = (restaurantData) => {
    
    output = `<div class = "${restaurantData.id} post panel-login" style="background-color: #FFFFFF;margin-left: 15px;  ">
    
    <div class="row">
      <div class="col-10">
        <h5 class=" card-title"> <i class="fas fa-utensils" style="color:rgb(199, 26, 26);"> </i>    ${restaurantData.name}</h5>
        <p class="card-text">${restaurantData.address}</p>
      </div>
    </div>
    <hr>
    `;
    restaurantContainerElem.innerHTML += output;
}

const drawListSearchRestaurant = (restaurantsData) => {
    
    restaurantsData.forEach(restaurantData =>{
    output = `<div class = "${restaurantData.id} post panel-login" style="background-color: #FFFFFF;margin-left: 15px;  ">
    
    <div class="row">
      <div class="col-10">
        <h5 class=" card-title"> <i class="fas fa-utensils" style="color:rgb(199, 26, 26);"> </i>    ${restaurantData.name}</h5>
        <p class="card-text">${restaurantData.address}</p>
      </div>
    </div>
    <hr>
    `;
    restaurantContainerElem.innerHTML += output;

})
}




const listRestaurant = (restaurants) => {
    deleteFirtsRestaurants();
    restaurants.forEach(objRestaurant => {
        restaurantData.placeId = objRestaurant.place_id;
        restaurantData.name = objRestaurant.name;
        restaurantData.id = objRestaurant.id;
        restaurantData.types = objRestaurant.types;
        restaurantData.address = objRestaurant.vicinity;
        restaurantData.reference = objRestaurant.reference;
       
        drawListNearRestaurant(restaurantData);
        saveRestaurant(restaurantData);
    })

}

initMap = () => {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -12.0463731, lng: -77.042754 },
        zoom: 18
    });
    infoWindow = new google.maps.InfoWindow;

    const handleLocationError = (browserHasGeolocation, infoWindow, pos) => {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Tu ubicación');
            infoWindow.open(map);
            map.setCenter(pos);

            const createMarker = (place) => {

                let placeLoc = place.geometry.location;
                let marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                });

                google.maps.event.addListener(marker, 'click', () => {
                    infowindow.setContent(place.name);
                    infowindow.open(map, this);
                });
            }

            const callback = (results, status) => {
                listRestaurant(results)
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {

                        createMarker(results[i]);
                    }
                }
            }

            

            const service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                location: pos,
                radius: 150,
                type: ['restaurant']
            }, callback);



        }, () => {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

const cbSearch = (results) =>{
    restaurantContainerElem.innerHTML = '';
    drawListSearchRestaurant(results); 
}


searchButtonElem.addEventListener('click',()=>{
    flagSearch = 1;
    const inputSeach = searchInputElem.value;

    filterRestaurant(inputSeach, cbSearch);
})

