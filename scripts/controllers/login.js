'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('yapp')
  .controller('LoginCtrl', function($rootScope, $scope, $location, alfredClient) {
    
	$scope.loginData = {};		

	// Perform the login action when the user submits the login form
	$scope.submit = function() {
		alfredClient.User.login($scope.loginData.username, $scope.loginData.password).then(function(result) {
			$scope.error = null;
            $scope.message = 'Login successful !';
			$location.path('/dashboard');
			$rootScope.$broadcast("authenticated");
		}, function(data) {
			$scope.error = data.error;
		});
	};	

  });
