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
  
  .controller('ConfigurationCtrl', function($scope, $location, $state, alfredClient) {

    $scope.$state = $state;
	
	
	alfredClient.Configuration.getAll().then(function(result){
		$scope.configs = result.data;
	}, function(error){
		alert(error.statusText);	
	});
	
	$scope.save = function(){
		alfredClient.Configuration.saveAll($scope.configs).then(function(result){
			alert('Sauvegarde effectuée !');
		}, function(error){
			alert(error.statusText);	
		});
	}

  })
  
  .controller('LightsCtrl', function($scope, $location, $state, $http, alfredClient) {

    $scope.$state = $state;
	
	function loadLights(){
		alfredClient.Lights.getAllInterfaces().then(function(result){
			$scope.lights = result.data;
		}, function(error){
			alert(error.statusText);	
		});
	}
	loadLights();
	
	$scope.save = function(){
		alfredClient.Lights.saveInterfaces($scope.lights).then(function(result){
			alert('Sauvegarde effectuée !');
		}, function(error){
			alert(error.statusText);	
		});
	}
	
	$scope.searchHue = function(){
		$scope.hueBridgeError = '';
		$scope.no_bridges = false;
		$scope.bridges = [];
		alfredClient.Lights.getHueBridges().then(function(result){
			$scope.bridges = result.data;
			if(!result.data.length){				
				$scope.no_bridges = true;
			}
		}, function(error){
			alert(error.statusText);	
		});
	};
	
	$scope.registerHueBridge = function(ip){
		$scope.hueBridgeError = '';
		alfredClient.Lights.registerHueBridge(ip).then(function(result){
			loadLights();
		}, function(error){
			$scope.hueBridgeError = error.data.Message;
		});
	};

  });

