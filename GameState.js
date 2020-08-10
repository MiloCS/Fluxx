
// NOT GOOD SYNTAX
class GameState {
	// all the things happen here, GameData is manipulated by the GameState
	this.gd;
	this.players = []; //each player gets a ref to this.gd
}


// NOT GOOD SYNTAX
class GameData {
	this.deck; // a Deck object
	this.goals; // a list of Goal object(s)
	this.draws; // int
	this.plays; // int
	this.hlim; // int
	this.klim; // int
	this.activePlayer; // int: the index in gs.players
}