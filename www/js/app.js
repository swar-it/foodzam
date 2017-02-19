angular.module('starter', ['ionic'])
 
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
  });
 
  $urlRouterProvider.otherwise('/outside/login');
})
 
.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
    if (!AuthService.isAuthenticated()) {
      console.log(next.name);
      if (next.name !== 'outside.login' && next.name !== 'outside.register') {
        event.preventDefault();
        $state.go('outside.login');
      }
    }
  });
});