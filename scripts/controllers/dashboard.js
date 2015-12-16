'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('yapp')
  .controller('DashboardCtrl', function($scope, $location, $state, alfredClient) {

    $scope.$state = $state;
	
	
	$scope.logout = function(){
		alfredClient.User.logout().then(function(result){
			$location.path('/login');
		}, function(error){
			alert(error);	
		});
	};

  })
  
  .controller('PlayerCtrl', function($scope, $location, $state, alfredClient, VideosService) {

		$scope.musicUrl = '';
		$scope.state = 2;
		

		init();

		function init() {
			VideosService.initPlayer();
		}

  });

