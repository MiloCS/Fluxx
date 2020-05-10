var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/'));

let players = new Map();

io.on('connection', function(socket) {
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
	io.to(roomCode).emit('playerList', Object.keys(io.sockets.adapter.rooms[roomCode].sockets).map(x => players.get(x)));
}


http.listen(3000, () => {
     console.log('listening on localhost:3000');
});