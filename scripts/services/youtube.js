app.service('YoutubePlayer', ['$window', '$rootScope', '$log', 'alfredClient', function ($window, $rootScope, $log, alfredClient)  {

	var service = this;	
	
	var youtube = {
		ready: false,
		player: null,
		playerId: null,
		videoId: null,
		videoTitle: null,
		playerHeight: '464',
		playerWidth: '584',
		state: 'stopped'
	};
	var results = [];
	var upcoming = [];

	function onYoutubeStateChange (event) {
		console.log(event);
		if (event.data == YT.PlayerState.PLAYING) {
			youtube.state = 'playing';
		} else if (event.data == YT.PlayerState.PAUSED) {
			youtube.state = 'paused';
		} else if (event.data == YT.PlayerState.ENDED) {
			youtube.state = 'ended';
			alfredClient.Player.sendNextSongSignal();
		}
		
		var status = event.data == YT.PlayerState.PLAYING ? "3" : event.data == YT.PlayerState.PAUSED ? "4" : event.data == YT.PlayerState.BUFFERING ? "2" : "0";
		alfredClient.Player.sendUpdateStatusSignal(
			status,
			youtube.player.getDuration(), 
			youtube.player.getCurrentTime(),
			youtube.player.getVolume);
		
		if(!$rootScope.$$phase) {
			$rootScope.$apply();
		}
	}

	this.bindPlayer = function (elementId) {
		$log.info('Binding to ' + elementId);
		youtube.playerId = elementId;
	};

	this.createPlayer = function (callbackReady) {
		$log.info('Creating a new Youtube player for DOM id ' + youtube.playerId + ' and video ' + youtube.videoId);

		return new YT.Player(youtube.playerId, {
		  height: youtube.playerHeight,
		  width: youtube.playerWidth,
		  playerVars: {
			rel: 0,
			showinfo: 0
		  },
		  events: {
			'onReady': callbackReady,
			'onStateChange': onYoutubeStateChange
		  }
		});
	};

	this.loadPlayer = function (callbackReady) {
		if (youtube.ready && youtube.playerId) {
		  if (youtube.player) {
			youtube.player.destroy();
		  }
		  youtube.player = service.createPlayer(callbackReady);
		}
	};

	this.initPlayer = function(callbackReady){
		if(!youtube.ready && typeof(YT) != 'undefined' && typeof(YT.Player) != 'undefined'){
			youtube.ready = true;
			service.bindPlayer('placeholder');
			service.loadPlayer(callbackReady);
			if(!$rootScope.$$phase) {
				$rootScope.$apply();
			}  
		}
	}  
	
	this.play = function(file){
		var id = file.replace('https://www.youtube.com/watch?v=', '');
		youtube.player.loadVideoById(id);
	}	
	
	this.stop = function(){
		youtube.player.stopVideo();
	}
	
	this.toggle = function(){
		
		if(youtube.player.getPlayerState() == 2){
			youtube.player.playVideo();
		}				
		
		if(youtube.player.getPlayerState() == 1){
			youtube.player.pauseVideo();
		}
	}  
	
	this.setPosition = function(position){
		youtube.player.seekTo(100 * position / youtube.player.getDuration());
	}
	

}]);