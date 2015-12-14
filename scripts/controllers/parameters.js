'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('yapp')
  .controller('ParametersCtrl', function($rootScope, $scope, $location, alfredClient, alfredParams) {
    
	$scope.parameters = {
		host: 'api-nam.kicks-ass.org',
		portWebSocket: 13100,
		portHttp: 80
	};
	
	var paramsCache = alfredParams.getParams();
	
	
	if(paramsCache != null){
		$scope.parameters = paramsCache;
	}
	
	// Perform the login action when the user submits the login form
	$scope.submit = function() {
		try{
			alfredClient.init({
				name: 'Alfred-admin-client',
				host: $scope.parameters.host,
				portWebSocket: $scope.parameters.portWebSocket,
				portHttp: $scope.parameters.portHttp,
				onConnect: function(){					
					$rootScope.$broadcast("connected");
				},
				onError: function(e){
					$rootScope.serverError = "Une erreur est survenue sur le serveur";
				}
			});
			
			$location.path('/login');
			$scope.error = '';
		}
		catch(e){			
			$scope.error = e.message;
		}
	};

  });
