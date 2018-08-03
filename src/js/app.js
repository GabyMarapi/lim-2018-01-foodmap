window.deleteFirtsRestaurants = () => {
	firebase.database().ref('/restaurants/').remove();
}
window.saveRestaurant = (restaurantData) => {
	data = {
		name: restaurantData.name,
		address: restaurantData.address,
		placeId: restaurantData.placeId

	}
	const newRestaurantKey = firebase.database().ref().child('restaurants').push().key;
	const updates = {};
	updates['/restaurants/' + restaurantData.id] = data;
	firebase.database().ref().update(updates);
}

window.getRestaurantList = () => firebase.database().ref('restaurants').once('value');

window.filterRestaurant = (filterValue, cb) => {
	getRestaurantList().then(restaurants => {
		const restaurantsArr = Object.values(restaurants.val());

		if(filterValue!== ''){
		const listRestaurantFiltered = restaurantsArr.filter(restaurant =>
			restaurant.name.toUpperCase().indexOf(filterValue.toUpperCase()) !== -1
		)

		cb(listRestaurantFiltered);
	}
	else{
		cb(restaurantsArr);
	}
	
	})
}
