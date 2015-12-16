app.service('VideosService', ['$window', '$rootScope', '$log', 'alfredClient', function ($window, $rootScope, $log, alfredClient)  {

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

	$window.onYouTubeIframeAPIReady = function () {
		$log.info('Youtube API is ready');
		youtube.ready = true;
		service.bindPlayer('placeholder');
		service.loadPlayer();
		if(!$rootScope.$$phase) {
			$rootScope.$apply();
		}
	};

  function onYoutubeReady (event) {
    $log.info('YouTube Player is ready');
	alfredClient.Player.register('alfred-web-player');
  }

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
		
		var status = YT.PlayerState.PLAYING ? "3" : YT.PlayerState.PAUSED ? "4" : YT.PlayerState.BUFFERING ? "2" : "0";
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

  this.createPlayer = function () {
    $log.info('Creating a new Youtube player for DOM id ' + youtube.playerId + ' and video ' + youtube.videoId);
	
	return new YT.Player(youtube.playerId, {
      height: youtube.playerHeight,
      width: youtube.playerWidth,
      playerVars: {
        rel: 0,
        showinfo: 0
      },
      events: {
        'onReady': onYoutubeReady,
        'onStateChange': onYoutubeStateChange
      }
    });
  };

  this.loadPlayer = function () {
    if (youtube.ready && youtube.playerId) {
      if (youtube.player) {
        youtube.player.destroy();
      }
      youtube.player = service.createPlayer();
    }
  };

  this.launchPlayer = function (id) {
    youtube.player.loadVideoById(id);
    return youtube;
  }
  
  this.initPlayer = function(){
	if(!youtube.ready && typeof(YT) != 'undefined' && typeof(YT.Player) != 'undefined'){
		youtube.ready = true;
		service.bindPlayer('placeholder');
		service.loadPlayer();
		if(!$rootScope.$$phase) {
			$rootScope.$apply();
		}  
	}
  }
  
	alfredClient.subscribe(function(data){
	if (data != null
		&& data.Arguments != null
		&& data.Command == 'DirectPlay'
		&& data.Type == 3
		&& typeof(data.Arguments.file) != 'undefined') {
			var index = data.Arguments.file.indexOf('https://www.youtube.com/watch?v=');
			if(index == 0){
				var id = data.Arguments.file.replace('https://www.youtube.com/watch?v=', '');
				service.launchPlayer(id);
			}
		}
	});

}]);