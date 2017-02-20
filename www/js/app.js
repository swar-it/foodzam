angular.module('starter', ['ionic', 'ngCordova', 'ngMap'])
 
.config(function($stateProvider, $urlRouterProvider) {
 
  $stateProvider
  .state('outside', {
    url: '/outside',
    abstract: true,
    templateUrl: 'templates/outside.html'
  })
  .state('outside.login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  .state('outside.register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
  })

  /*.state('inside', {
    url: '/inside',
    templateUrl: 'templates/inside.html',
    controller: 'InsideCtrl'
  })*/

  .state('main', {
    url: '/',
    abstract: true,
    templateUrl: 'templates/main.html'
  })
  .state('main.youritems', {
    url: 'main/youritems',
    views: {
        'youritems-tab': {
          templateUrl: 'templates/youritems.html',
          controller: 'YourItemCtrl'
        }
    }
  })
  .state('main.availitems', {
    url: 'main/availitems',
    views: {
        'availitems-tab': {
          templateUrl: 'templates/availitems.html',
          controller: 'AvailItemCtrl'
        }
    }
  })
  .state('main.map', {
    url: 'main/map',
    views: {
        'map-tab': {
          templateUrl: 'templates/map.html',
          controller: 'MapCtrl'
        }
    }
  });
 
  $urlRouterProvider.otherwise('/outside/login');
})
 
.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {

    $rootScope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDjsCLbL-bkC4cFeLYIfR-a3tbN_vF7XqU";

  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
    $rootScope.logout = function() {
      AuthService.logout();
      $state.go('outside.login');
    };
    if (!AuthService.isAuthenticated()) {
      console.log(next.name);
      if (next.name !== 'outside.login' && next.name !== 'outside.register') {
        event.preventDefault();
        $state.go('outside.login');
      }
    }
  });
})

/*.run(function($ionicPlatform) {

  $ionicPlatform.ready(function() {

    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});*/