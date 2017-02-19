angular.module('starter')
 
.service('AuthService', function($q, $http, API_ENDPOINT) {
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var LOCAL_ID = 'yourID';
  var isAuthenticated = false;
  var authToken;
 
  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }
 
  function storeUserCredentials(token, userId) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    window.localStorage.setItem(LOCAL_ID, userId);
    useCredentials(token);
  }
 
  function useCredentials(token) {
    isAuthenticated = true;
    authToken = token;
 
    // Set the token as header for your requests!
    $http.defaults.headers.common.Authorization = authToken;
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    isAuthenticated = false;
    $http.defaults.headers.common.Authorization = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }
 
  var register = function(user) {
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/signup', user).then(function(result) {
        if (result.data.success) {
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };
 
  var login = function(user) {
    return $q(function(resolve, reject) {
    	console.log(user);
    	
    	$http({
			method: 'POST',
			url: API_ENDPOINT.url + '/login',
			data: JSON.stringify(user)
		}).then(function successCallback(response) {
			if (response.data.code === 200) {
				console.log("Success");
          		storeUserCredentials(response.data.token, response.data.userId);
          		resolve(response.data);
			}
		}, function errorCallback(response) {
			console.log("Failure");
          	reject(response.data);
		});

      /*$http.post(API_ENDPOINT.url + '/login', user).then(function(result) {
        if (result.data.code === 200) {
        	console.log("Success");
          storeUserCredentials(result.data.token);
          resolve(result.data.message);
        } else {
        	console.log("Failure");
          reject(result.data.message);
        }
      });*/
    });
  };
 
  var logout = function() {
  	return $q(function(resolve, reject) {

  		$http({
			method: 'POST',
			url: API_ENDPOINT.url + '/logout',
			data: JSON.stringify({sessiontoken: window.localStorage.getItem(LOCAL_TOKEN_KEY)})
		}).then(function successCallback(response) {
			if (response.data.code === 200) {
				console.log("Success");
          		destroyUserCredentials();
			}
		}, function errorCallback(response) {
			console.log("Failure");
		});


      /*$http.post(API_ENDPOINT.url + '/logout').then(function(result) {
        // if (result.data.code === 200) {
    		destroyUserCredentials();
    	// }
      });*/
    });
  };
 
  loadUserCredentials();
 
  return {
    login: login,
    register: register,
    logout: logout,
    isAuthenticated: function() {return isAuthenticated;},
  };
})
 
.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
      }[response.status], response);
      return $q.reject(response);
    }
  };
})
 
.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});