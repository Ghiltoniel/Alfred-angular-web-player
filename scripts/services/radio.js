app.service('RadioPlayer', ['$window', '$rootScope', '$log', 'alfredClient', function ($window, $rootScope, $log, alfredClient)  {
	
	var audio = document.getElementById('audio');
	var audioSrc = document.getElementById('audio-src');
	
	
	audio.onloadeddata = function() {
		audio.play();
	};
	
	audio.onplay = function(){
		var status = 3;
		updateStatus(3);
	}
	
	audio.onpause = function(){
		var status = 4
		updateStatus(4);		
	}
	
	function updateStatus(status){
		alfredClient.Player.sendUpdateStatusSignal(
			status,
			audio.duration == 'Infinity' ? 0 : audio.duration, 
			audio.currentTime,
			audio.volume);
	}
	
	function play(file){
		if(file == "http://www.ledjamradio.com/playlist.m3u"){
			file = 'http://www.ledjamradio.com/sound';
		}
		audioSrc.setAttribute("src",file);
		audio.load();	
	}	
	
	function stop(){
		audio.pause();
	}
	
	function toggle(){
		if(audio.paused){
			audio.play();
		}
		else{
			audio.pause();
		}
	}	
	
	function setPosition(position){
		audio.currentTime = 100 * position / audio.duration;
	}
	
	return {
		play: play,
		stop: stop,
		toggle: toggle,
		setPosition: setPosition
	};
}]);