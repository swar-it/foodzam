angular.module('starter')
 
.controller('LoginCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    email: '',
    password: ''
  };
 
  $scope.login = function() {
  	console.log($scope.user);
    AuthService.login($scope.user).then(function(msg) {
      // $state.go('inside');
      $state.go('main.youritems', {}, {reload: true});
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed',
        template: errMsg
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
        template: errMsg
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

.controller('YourItemCtrl', function($scope, $state, $http, $q, $ionicPopup, AuthService, API_ENDPOINT, $ionicModal, $cordovaGeolocation) {

	$scope.itemOptions = [{name: "Apple", value :"apple"}, {name: "Banana", value :"banana"}, {name: "Bread", value :"bread"}, {name: "Chicken", value :"chicken"}, {name: "Grapes", value :"grapes"}, {name: "Tofu", value :"tofu"}];
	$scope.selectedItem = $scope.itemOptions[3];

	var posOptions = {timeout: 10000, enableHighAccuracy: false};

	$cordovaGeolocation
	.getCurrentPosition(posOptions)
	
   	.then(function (position) {
   		var lat  = position.coords.latitude
   		var long = position.coords.longitude
   		alert(lat + '   ' + long)
   	}, function(err) {
   		console.log(err)
   	});

	$http({
		method: 'POST',
		url: API_ENDPOINT.url + '/getYourItems',
		data: JSON.stringify({userid: window.localStorage.getItem('yourID')})
	}).then(function successCallback(response) {
		console.log(response.data);
		$scope.youritemList = response.data;
		console.log($scope.youritemList)
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
		   console.log('Your address is', address);
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

			$scope.youritemList = _.filter($scope.youritemList, function(item) { return item.id !== "XWrRGzEZ5d"; });

		}, function errorCallback(response) {
		});
	}

	var share = function(itemId, address) {

		$http({
			method: 'POST',
			url: API_ENDPOINT.url + '/shareYourItem',
			data: JSON.stringify({userid: window.localStorage.getItem('yourID'), itemid: itemId, address: address})
		}).then(function successCallback(response) {
			
		}, function errorCallback(response) {
		});
	}

	$ionicModal.fromTemplateUrl('templates/addmodal.html', {
	    scope: $scope
	  }).then(function(modal) {
	    $scope.addmodal = modal;
	});
	  
	$scope.addItem = function(item) {
	  	console.log(item);
	  	var promise = addItem(window.localStorage.getItem('yourID'), item.value).then(function(result) {
	  		console.log(result)
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

.controller('AvailItemCtrl', function($scope, $state, $http, $q, $ionicPopup, AuthService, API_ENDPOINT, $ionicModal) {

	$http({
		method: 'POST',
		url: API_ENDPOINT.url + '/getAvailableItems',
		data: JSON.stringify({userid: window.localStorage.getItem('yourID')})
	}).then(function successCallback(response) {
		console.log(response.data);
		$scope.availitemList = response.data;
		console.log($scope.availitemList)
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
 
.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('outside.login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
});