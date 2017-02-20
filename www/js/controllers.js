angular.module('starter')
 
.controller('LoginCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    email: '',
    password: ''
  };
 
  $scope.login = function() {
    AuthService.login($scope.user).then(function(msg) {
      // $state.go('inside');
      $state.go('main.youritems', {}, {reload: true});
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed',
        template: 'Please try again'
      });
    });
  };
})
 
.controller('RegisterCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    email: '',
    password: ''
  };
 
  $scope.signup = function() {
    AuthService.register($scope.user).then(function(msg) {
      $state.go('outside.login');
      var alertPopup = $ionicPopup.alert({
        title: 'Registration successful',
      });
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Registration failed',
        template: 'Please try again'
      });
    });
  };
})
 
.controller('InsideCtrl', function($scope, AuthService, API_ENDPOINT, $http, $state) {
  
  $scope.destroySession = function() {
    AuthService.logout();
  };
 
  $scope.logout = function() {
    AuthService.logout();
    $state.go('outside.login');
  };
})

.controller('YourItemCtrl', function($scope, $cordovaDevice, $state, $http, $interval, $q, $window, $ionicPopup, AuthService, API_ENDPOINT, $ionicModal, $cordovaGeolocation, $ionicPlatform) {

	$scope.itemOptions = [{name: "Apple", value :"apple"}, {name: "Banana", value :"banana"}, {name: "Bread", value :"bread"}, {name: "Chicken", value :"chicken"}, {name: "Grapes", value :"grapes"}, {name: "Tofu", value :"tofu"}, {name: "Milk", value :"milk"}];
	$scope.selectedItem = $scope.itemOptions[3];

	$http({
		method: 'POST',
		url: API_ENDPOINT.url + '/getYourItems',
		data: JSON.stringify({userid: window.localStorage.getItem('yourID')})
	}).then(function successCallback(response) {
		$scope.youritemList = response.data;
	}, function errorCallback(response) {
	});

	$scope.doRefresh = function() {

	    $http({
	    	method: 'POST',
			url: API_ENDPOINT.url + '/getYourItems',
			data: JSON.stringify({userid: window.localStorage.getItem('yourID')})
		}).then(function successCallback(response) {
			$scope.youritemList = response.data;
		}).finally(function() {
	       // Stop the ion-refresher from spinning
	       $scope.$broadcast('scroll.refreshComplete');
	   	});
	};

	$scope.formatDate = function(date) {
    	return moment(date).format("Do MMMM YYYY");
	};

	$scope.formatDateTime = function(date) {
		return moment(date).format("Do MMMM YYYY, hh:mm A");
	};

	$scope.confirmConsume = function(itemId) {

		var confirmPopup = $ionicPopup.confirm({
			title: 'Mark Item as Consumed',
			template: 'Are you sure you want to mark this item as consumed?'
		});

		confirmPopup.then(function(res) {
			if(res) {
				consume(itemId);
			}
		});
	}

	$scope.confirmShare = function(itemId) {

		$ionicPopup.prompt({
		   title: 'Enter Your Address',
		   inputType: 'text',
		   inputPlaceholder: 'Your address'
		 }).then(function(address) {
		   if(address) {
		   		share(itemId, address);
		   }
		 });
	}

	var consume = function(itemId) {

		$http({
			method: 'POST',
			url: API_ENDPOINT.url + '/consumeYourItem',
			data: JSON.stringify({userid: window.localStorage.getItem('yourID'), itemid: itemId})
		}).then(function successCallback(response) {

			$scope.youritemList = _.filter($scope.youritemList, function(item) { return item.id !== itemId; });
			// $window.location.reload();

		}, function errorCallback(response) {
		});
	}

	var share = function(itemId, address) {

		$http({
			method: 'POST',
			url: API_ENDPOINT.url + '/shareYourItem',
			data: JSON.stringify({userid: window.localStorage.getItem('yourID'), itemid: itemId, address: address})
		}).then(function successCallback(response) {
			var alertPopup = $ionicPopup.alert({
		        title: 'Item shared'
		    });
		}, function errorCallback(response) {
		});
	}

	$ionicModal.fromTemplateUrl('templates/addmodal.html', {
	    scope: $scope
	  }).then(function(modal) {
	    $scope.addmodal = modal;
	});
	  
	$scope.addItem = function(item) {
	  	var promise = addItem(window.localStorage.getItem('yourID'), item.value).then(function(result) {
			$scope.youritemList.push(result);
		}, function(error) {
			console.log(error);
		});
		$scope.addmodal.hide();
	};

	function addItem(userid, itemvalue) {

		return $q(function(resolve, reject) {

			$http({
				method: 'POST',
				url: API_ENDPOINT.url + '/addYourItem',
				data: JSON.stringify({userid: userid, itemvalue: itemvalue})
			}).then(function successCallback(response) {
				resolve(response.data);
			}, function errorCallback(response) {
				reject(response.data);
			});
		});
	}

})

.controller('AvailItemCtrl', function($scope, $state, $http, $q, $ionicPopup, AuthService, API_ENDPOINT, $ionicModal, $cordovaGeolocation) {

	$http({
		method: 'POST',
		url: API_ENDPOINT.url + '/getAvailableItems',
		data: JSON.stringify({userid: window.localStorage.getItem('yourID')})
	}).then(function successCallback(response) {
		$scope.availitemList = response.data;
	}, function errorCallback(response) {
	});

	$scope.doRefresh = function() {

	    $http({
	    	method: 'POST',
			url: API_ENDPOINT.url + '/getAvailableItems',
			data: JSON.stringify({userid: window.localStorage.getItem('yourID')})
		}).then(function successCallback(response) {
			$scope.availitemList = response.data;
		}).finally(function() {
	       // Stop the ion-refresher from spinning
	       $scope.$broadcast('scroll.refreshComplete');
	   	});
	};

	$scope.changeInterest = function(itemId) {

	    $http({
	    	method: 'POST',
			url: API_ENDPOINT.url + '/changeInterest',
			data: JSON.stringify({userid: window.localStorage.getItem('yourID'), itemid: itemId})
		}).then(function successCallback(response) {
			if(response.data.interested)
				title = 'Thank you for your interest';
			else
				title = 'We are sorry to see you go';
			var alertPopup = $ionicPopup.alert({
		        title: title
		    });
		    var item = _.find($scope.availitemList, function(item) { return item.id == itemId; });
		    item.interested = response.data.interested;
		}, function errorCallback(response) {
		});
	};

	$scope.viewContact = function(itemOwner, itemNumber) {
		var alertPopup = $ionicPopup.alert({
			title: 'Owner Information',
			template: 'You can contact ' + itemOwner + ' at ' + itemNumber
		});

		alertPopup.then(function(res) {
			console.log('Thank you for not eating my delicious ice cream cone');
		});
	};

	$scope.formatDate = function(date) {
    	return moment(date).format("Do MMMM YYYY");
	};

	$scope.formatDateTime = function(date) {
		return moment(date).format("Do MMMM YYYY, hh:mm A");
	};

	$scope.interestClass = function(exercise) {
		return exercise ? 'ion-ios-heart' : 'ion-ios-heart-outline';
	};
})

.controller('MapCtrl', function($scope, $cordovaGeolocation) {

	var options = {timeout: 10000, enableHighAccuracy: true};

	console.log("Here1");

	$cordovaGeolocation.getCurrentPosition(options).then(function(position) {

		console.log(position);

		$http({
			method: 'POST',
			url: API_ENDPOINT.url + '/sendLocation',
			data: JSON.stringify({userid: window.localStorage.getItem('yourID'), lat: position.coords.latitude, long: position.coords.longitude})
		}).then(function successCallback(response) {
		}, function errorCallback(response) {
		});

		console.log("Here2");

		var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

		var mapOptions = {
			center: latLng,
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

		google.maps.event.addListenerOnce($scope.map, 'idle', function() {

			var marker = new google.maps.Marker({
				map: $scope.map,
				animation: google.maps.Animation.DROP,
				position: latLng
			});      

		});

	}, function(error){
		console.log("Could not get location");
	});

})
 
.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS, $cordovaGeolocation) {

	/*var posOptions = {timeout: 10000, enableHighAccuracy: false};

	$cordovaGeolocation
	.getCurrentPosition(posOptions)
	
   	.then(function (position) {
   		var lat  = position.coords.latitude
   		var long = position.coords.longitude
   		// alert(lat + '   ' + long)
   		var alertPopup = $ionicPopup.alert({
        	title: 'Location',
        	template: lat + ' ' + long
      	});
   	}, function(err) {
   		console.log(err)
   	});

   	var watchOptions = {timeout : 3000, enableHighAccuracy: false};
	var watch = $cordovaGeolocation.watchPosition(watchOptions);

	watch.then(
		null,

		function(err) {
			console.log(err)
		},

		function(position) {
			var lat  = position.coords.latitude
			var long = position.coords.longitude
			console.log(lat + '' + long)
		}
	);

	watch.clearWatch();*/

  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('outside.login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
});