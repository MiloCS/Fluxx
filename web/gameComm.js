const socket = io('/game');

function sendUpdate() {
    socket.emit('update', gameState)
}

socket.on('update', function(data) {
    gameState = data;
    //updateHand();
    addCardtoHand();
    removeCardByIndex(handContainer, 0);
})