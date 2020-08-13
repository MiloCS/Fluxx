var express = require('express');
var app = express();
var http = require('http').createServer(app);
var https = require('https');
var io = require('socket.io')(http);

app.get('/game', function(req, res) {
	res.sendFile(__dirname + '/web/game.html')
});

app.use(express.static(__dirname + '/web/'));

let players = new Map();

io.on('connection', function(socket) {
	socket.on('disconnecting', function(data) {
		Object.keys(socket.rooms).forEach(function(x) {
			sendPlayerList(x, Object.keys(io.sockets.adapter.rooms[x].sockets).filter(x=>(x!=socket.id)).map(x => players.get(x)));
		});
	});
	socket.on('gamestart', function(code) {
			io.to(code).emit('gamestart');
	});
	socket.on('createRoom', function(roomCode, name) {
		if (Object.keys(io.sockets.adapter.rooms).includes(roomCode)) {
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

		if (!Object.keys(io.sockets.adapter.rooms).includes(roomCode)) {
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
	sendPlayerList(roomCode, Object.keys(io.sockets.adapter.rooms[roomCode].sockets).map(x => players.get(x)));
}

function sendPlayerList(roomCode, list) {
	io.to(roomCode).emit('playerList', list);
}

function update() {
	
}

let options = {

}


// https.createServer(options, app).listen(443, () => {
// 	console.log('listening on https://localhost');
// });
http.listen(3000, () => {
     console.log('listening on localhost:3000');
});