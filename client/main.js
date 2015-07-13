var serverURL = 'localhost:9000'
var socket = require('socket.io-client')(serverURL)
var renderer = new PIXI.WebGLRenderer(800, 600);
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
if(playerOne) var moveDirection = 'right';
else var moveDirection = 'left';
var p1colTexture = PIXI.Texture.fromImage('p1col.png')
var p2colTexture = PIXI.Texture.fromImage('p2col.png')


function animate() {	
	requestAnimationFrame(animate);
	moveDirection = moveWithInput(moveDirection);
	socket.emit('update_position', moveDirection);
}

function moveWithInput(moveDirection) {
	if (keyboard.char('W')) return 'up'
	else if (keyboard.char('A')) return 'down'
	else if (keyboard.char('D')) return 'right'
	else if (keyboard.char('S')) return 'left'
	else return moveDirection;
}

socket.on('startGame', function (map, myPlayer, otherPlayer, playerOne) {
	global.myPlayer = myPlayer;
	global.otherPlayer = otherPlayer;
	stage.addChild(myPlayer.sprite);
	stage.addChild(otherPlayer.sprite);
	myPlayer.sprite.position = map.positionToPixel(myPlayer.position);
	otherPlayer.sprite.position = map.positionToPixel(otherPlayer.position);
	global.map = map;	
	global.playerOne = playerOne;
	animate();
}

socket.on('renderPlayer1', function (pos) {
	
}
	