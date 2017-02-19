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
        title: 'Login failed!',
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
        title: 'Register success!',
        template: msg
      });
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Register failed!',
        template: errMsg
      });
    });
  };
})
 
.controller('InsideCtrl', function($scope, AuthService, API_ENDPOINT, $http, $state) {
  $scope.destroySession = function() {
    AuthService.logout();
  };
 
  $scope.getInfo = function() {
    $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
      $scope.memberinfo = result.data.msg;
    });
  };
 
  $scope.logout = function() {
    AuthService.logout();
    $state.go('outside.login');
  };
})

.controller('YourItemCtrl', function($scope, $state, $http, $ionicPopup, AuthService, API_ENDPOINT) {

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

	$scope.logout = function() {
	    AuthService.logout();
	    $state.go('outside.login');
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

	var consume = function(itemId) {

		$http({
			method: 'POST',
			url: API_ENDPOINT.url + '/consumeYourItem',
			data: JSON.stringify({userid: window.localStorage.getItem('yourID'), itemid: itemId})
		}).then(function successCallback(response) {

			$scope.youritemList = _.filter($scope.youritemList, function(item) { return item.id !== "XWrRGzEZ5d"; });

		}, function errorCallback(response) {
			alert("Unable to unpair.");
		});
	}

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