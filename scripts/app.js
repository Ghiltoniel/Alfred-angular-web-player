'use strict';

/**
 * @ngdoc overview
 * @name yapp
 * @description
 * # yapp
 *
 * Main module of the application.
 */
var app = angular
  .module('yapp', [
    'ui.router',
    'ngAnimate', 
	'alfred'
  ])
  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/dashboard', '/dashboard/configuration');
    $urlRouterProvider.otherwise('/dashboard');

    $stateProvider
      .state('base', {
        abstract: true,
        url: '',
        templateUrl: 'views/base.html'
      })
        .state('login', {
          url: '/login',
          parent: 'base',
          templateUrl: 'views/login.html',
          controller: 'LoginCtrl'
        })
		.state('parameters', {
          url: '/parameters',
          parent: 'base',
          templateUrl: 'views/parameters.html',
          controller: 'ParametersCtrl'
        })
        .state('dashboard', {
          url: '/dashboard',
          parent: 'base',
          templateUrl: 'views/dashboard.html',
          controller: 'DashboardCtrl'
        })
          .state('configuration', {
            url: '/configuration',
            parent: 'dashboard',
            templateUrl: 'views/dashboard/configuration.html',
			controller: 'ConfigurationCtrl'
          })
          .state('lights', {
            url: '/lights',
            parent: 'dashboard',
            templateUrl: 'views/dashboard/lights.html',
			controller: 'LightsCtrl'
          })
          .state('parameters-dashboard', {
            url: '/parameters',
            parent: 'dashboard',
            templateUrl: 'views/parameters.html',
			controller: 'ParametersCtrl'
          });

  });

app.run(function($rootScope, $location, alfredClient, alfredAuth, alfredParams) {
	var paramsCache = alfredParams.getParams();
	
	
	if(paramsCache == null){
		$location.path('/parameters');
	} else if( alfredAuth.getUser() == null){
		$location.path('/login');
	}
	
	alfredClient.subscribe(function(data){
		if(data != null
	        && data.Command == 'Unauthorized'){
			$location.path('/login');
	    }
    });	

	if(paramsCache != null){
		try{
			alfredClient.init({
				name: 'Alfred-admin-client',
				host: paramsCache.host,
				portWebSocket: paramsCache.portWebSocket,
				portHttp: paramsCache.portHttp,
				onConnect: function(){					
					$rootScope.$broadcast("connected");
				},
				onError: function(e){
					$rootScope.serverError = "Une erreur est survenue lors de la connection au serveur";
					$rootScope.$apply();
				}
			});
			if( alfredAuth.getUser() == null){
				$location.path('/login');
			}
		}
		catch(e){			
			$location.path('/parameters');
		}
	}
});

app.factory('authHttpResponseInterceptor',['$q','$location',function($q,$location){
    return {
        response: function(response){
            if (response.status === 401) {
                console.log("Response 401");
            }
            return response || $q.when(response);
        },
        responseError: function(rejection) {
            if (rejection.status === 401) {
                console.log("Response Error 401",rejection);
                $location.path('/login');
            }
            return $q.reject(rejection);
        }
    }
}])

alfred.config(['$httpProvider', function($httpProvider) {  
    $httpProvider.interceptors.push('authHttpResponseInterceptor');
}]);