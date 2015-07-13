var port = process.env.PORT || 9000;
var io = require('socket.io')(port);
var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 600;
var MAP_WIDTH = 80;
var MAP_HEIGHT = 60;
var Map = require('Map.js');
//map is an array of arrays filled with 0s
var map = new Map(MAP_WIDTH, MAP_HEIGHT, SCREEN_WIDTH, SCREEN_HEIGHT);
var playersPos = [map.startingP1Pos(), map.startingP2Pos()];
var playersDir = ['right', 'left'];
var gameIsRunning = false;
var connectedPlayers = 0;

io.on('connection', function (socket) {
  socket.broadcast.emit('hi');
  console.log('connection', socket.id);
  ++connectedPlayers;
  socket.emit('logged_player', connectedPlayers);  
  })

function startGame(){
	init_map();
	while(gameIsRunning) {
	setTimeout(function(){ //esperamos 0'5 segundos entre turno y turno
		update_map();
		render_map ();
		);
		}, 500);
	}
}

function init_map () {
	map.setInfo(playersPos[0].x, playersPos[0].y, 1); //1 = P1 is here
	map.setInfo(playersPos[1].x, playersPos[1].y, 2); //2 = P2 is here
}

socket.on('updateDirection', function (playerNumber, direction) {
	playersDir[playerNumber - 1] = direction;		
}

function update_map (){
	for(var i = 0; i < 2; ++i){
		switch (playersDir[i]) {
			case 'up':
				if(map.info(playersPos[i].x, playersPos[i].y - 1) < 0) {
					console.log('player ' + (i + 1).ToString() + ' fucked up');
					gameIsRunning = false;
				}
				else {
					map.setInfo(playersPos[i].x, playersPos[i].y, (i + 1) * -1)
					--playersPos[i].y;
					map.setInfo(playersPos[i].x, playersPos[i].y, (i + 1));
				}
			break;
			case 'down':			
				if(map.info(playersPos[i].x, playersPos[i].y + 1) < 0) {
					console.log('player ' + (i + 1).ToString() + ' fucked up');
					gameIsRunning = false;
				} 
				else {
					map.setInfo(playersPos[i].x, playersPos[i].y, (i + 1) * -1)
					++playersPos[i].y;
					map.setInfo(playersPos[i].x, playersPos[i].y, (i + 1));
				}
			break;
			case 'left':
				if(map.info(playersPos[i].x - 1, playersPos[i].y) < 0) {
					console.log('player ' + (i + 1).ToString() + ' fucked up');
					gameIsRunning = false;
				} 
				else {
					map.setInfo(playersPos[i].x, playersPos[i].y, (i + 1) * -1)
					--playersPos[i].x;
					map.setInfo(playersPos[i].x, playersPos[i].y, (i + 1));
				}
			break;
			case 'right';
				if(map.info(playersPos[i].x + 1, playersPos[i].y) < 0) {
					console.log('player ' + (i + 1).ToString() + ' fucked up');
					gameIsRunning = false;
				}else {
					map.setInfo(playersPos[i].x, playersPos[i].y, (i + 1) * -1)
					++playersPos[i].x;
					map.setInfo(playersPos[i].x, playersPos[i].y, (i + 1));
				}
			break;
		}
		if(playersPos[i])
	}
}

function render_map () {
	for(var x = 0; x < MAP_WIDTH; ++x) {
		for(var y = 0; y < MAP_WIDTH; ++y) {
			switch (map.info(x, y)) {
				case 1:
				var pos = map.posToPixels(x, y);
				socket.emit('renderPlayer1', pos);
				break;
				case 2:
				var pos = map.posToPixels(x, y);
				socket.emit('renderPlayer2', pos);
				break;
				case -1:
				var pos = map.posToPixels(x, y);
				socket.emit('renderP1col', pos);
				map.setInfo(x, y, -3);
				break;
				case -2:
				var pos = map.posToPixels(x, y);
				socket.emit('renderP2col', pos);
				map.setInfo(x, y, -3);
				break;
				default:
				break;				
			}
		}
	}
}

