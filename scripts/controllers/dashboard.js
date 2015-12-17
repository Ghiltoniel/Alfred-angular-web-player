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
  
  .controller('PlayerCtrl', function($scope, $window, $http, $location, $state, alfredClient, YoutubePlayer, RadioPlayer) {

		$scope.musicUrl = '';
		$scope.state = 2;	
		var player;
		
		init();
		

		function onYoutubeReady (event) {
			console.log('YouTube Player is ready');
			alfredClient.Player.register('alfred-web-player');
		}		

		$window.onYouTubeIframeAPIReady = function () {
			YoutubePlayer.initPlayer(onYoutubeReady);
		};

		function init() {
			YoutubePlayer.initPlayer(onYoutubeReady);
		}
		
		alfredClient.subscribe(function(data){
		if (data != null
			&& data.Arguments != null
			&& data.Command == 'DirectPlay'
			&& data.Type == 3
			&& typeof(data.Arguments.file) != 'undefined') {
				var oldPlayer = player;
				var index = data.Arguments.file.indexOf('https://www.youtube.com/watch?v=');
				if(index == 0){
					player = YoutubePlayer;
				}
				else if(data.Arguments.file.indexOf('http') != -1){
					player = RadioPlayer;
				}
				
				if(oldPlayer){
					oldPlayer.stop();
				}
				
				if(player){
					player.play(data.Arguments.file);
				}
		}
		
		if (data != null
			&& data.Command == 'PlayPause') {
				player.toggle();
		}
		
		if (data != null
			&& data.Command == 'SetPosition'
			&& data.Type == 3
			&& data.Arguments.position) {
				player.setPosition(data.Arguments.position);
		}
	});

  });

