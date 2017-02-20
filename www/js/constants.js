angular.module('starter')
 
.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated'
})
 
.constant('API_ENDPOINT', {
  // url: 'https://ionic-nodejs.azurewebsites.net'
  // url: 'http://52.230.27.118:8080'
  url: 'http://localhost:8080'
  //  For a simulator use: url: 'http://127.0.0.1:8080/api'
});