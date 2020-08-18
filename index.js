var express = require('express');
var app = express();
var http = require('http').createServer(app);
var https = require('https');
var io = require('socket.io')(http);

app.get('/game', function(req, res) {
	res.sendFile(__dirname + '/web/game.html')
});

app.use(express.static(__dirname + '/web/'));

//maps id to human-readable name
let players = new Map();

//lobby functionality
let lobby = io.of('/lobby')

function getLobbyRooms() {
	let lobbySockets = lobby.sockets
	return lobbySockets[Object.keys(lobbySockets)[0]].adapter.rooms;
}

lobby.on('connection', function(socket) {
	socket.on('disconnecting', function(data) {
		Object.keys(socket.rooms).forEach(function(x) {
			sendPlayerList(x, Object.keys(getLobbyRooms()[x].sockets).filter(x=>(x!=socket.id)).map(x => players.get(x)));
		});
	});
	socket.on('gamestart', function(code) {
			lobby.to(code).emit('gamestart');
	});
	socket.on('createRoom', function(roomCode, name) {
		if (Object.keys(getLobbyRooms()).includes(roomCode)) {
			socket.emit('roomCreationFailed', roomCode);
		}
		else {
			console.log('room created', roomCode);
			players.set(socket.id, name);
			socket.join(roomCode);
			socket.emit('roomCreated', roomCode);
			updatePlayerList(roomCode);
		}
	});

	socket.on('joinRoom', function(roomCode, name) {

		if (!Object.keys(getLobbyRooms()).includes(roomCode)) {
			socket.emit('roomJoinFailed', roomCode);
		}
		else {
			players.set(socket.id, name);
			socket.join(roomCode);
			socket.emit('roomJoined', roomCode);
			updatePlayerList(roomCode);
		}
	});
});

function updatePlayerList(roomCode) {
	sendPlayerList(roomCode, Object.keys(getLobbyRooms()[roomCode].sockets).map(x => players.get(x)));
}

function sendPlayerList(roomCode, list) {
	lobby.to(roomCode).emit('playerList', list);
}

//main game room namespace and server function
let gameNs = io.of('/game');

gameNs.on('connection', function(socket){
	socket.on('update', function(data) {
		let temp = data;
		//temp.hand.push('Draw2')
		//send temp/data to master gamestate??
		//update master gamestate to reflect most recent client side changes
		update(temp, socket.id);
	})
	//more specific events that happen for playCard, discard, etc
	socket.on('playcard', function(cardName, playerID) {
		//pass player id to gamestate??
		//resolve played function in gamestate that's waiting
		gameState.play()
	}) 
	socket.on('discard', function(cardName, playerID) {
		//similar to above
	})
})

function update(data, id) {
	gameNs.to(id).emit('update', data);
}


//main server function
let options = {

}


// https.createServer(options, app).listen(443, () => {
// 	console.log('listening on https://localhost');
// });
http.listen(3000, () => {
     console.log('listening on localhost:3000');
});