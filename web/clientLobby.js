const socket = io('/lobby');
let room;
//landing page elements
const content = document.getElementById('content')

const joinGameButton = document.getElementById('joinGameButton');
const createGameButton = document.getElementById('createGameButton');
const joinCodeInput = document.getElementById('joincode');
const joinNameInput = document.getElementById('joinname');
const createCodeInput = document.getElementById('createcode');
const createNameInput = document.getElementById('createname');

const errorModal = document.getElementById('errormodal');
const errorText = document.getElementById('errortext');
const closeModal = document.getElementById('closemodal');

//lobby elements
const lobby = document.getElementById('lobby');

const roomId = document.getElementById('roomid');
const players = document.getElementById('players');
const startGameButton = document.getElementById('startgamebutton');

(async function putRoomId() {
    let fetchResult = await fetch("https://random-word-api.herokuapp.com/word?number=2&swear=0");
    let data = await fetchResult.json();
    let randomRoomId = data[0] + "-" + data[1];
    createCodeInput.value = randomRoomId;
})();


//creating room action handling
joinGameButton.addEventListener("click", function () {
    socket.emit('joinRoom', joinCodeInput.value, joinNameInput.value);
    room = joinCodeInput.value;
    joinCodeInput.value = '';
    joinNameInput.value = '';
});
createGameButton.addEventListener("click", function () {
    socket.emit('createRoom', createCodeInput.value, createNameInput.value);
    room = createCodeInput.value;
    createCodeInput.value = '';
    createNameInput.value = '';
});
socket.on('roomJoinFailed', function(code) {
    errorText.textContent = "The room you tried to enter doesn't exist";
    errorModal.style.display = 'block';
});
socket.on('roomCreationFailed', function(code) {
    errorText.textContent = "A room with that code already exists, try another"  
    errorModal.style.display = 'block';
});
socket.on('roomJoined', function(code) {
    roomId.textContent = code;
    content.style.display = 'none';
    lobby.style.display = 'block';
});
socket.on('roomCreated', function(code) {
    roomId.textContent = code;
    content.style.display = 'none';
    lobby.style.display = 'block';
});
socket.on('playerList', function(list) {
    players.innerHTML = '';

    list.forEach(function(x) {
        let name = document.createElement('SPAN');
        name.classList.add('playerName');
        name.textContent = x;
        players.appendChild(name);
    });
});
socket.on('gamestart', function() {
    console.log('game started');
    window.location.href="game.html";
});
closeModal.addEventListener('click', function() {
    errorModal.style.display = 'none';
})
startGameButton.addEventListener('click', function() {
    socket.emit('gamestart', room);
});
