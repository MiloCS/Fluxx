const { matches } = require('z')
C = require('./Card')

class Player {
	constructor(name, pID) {
		this.name = name;
		this.pID = pID;
		this.hand = [];
		this.keepers = [];
	}
	// discard a card
	// cardlist = "h" for hand
	// cardlist = "k" for keeper
	discard(cardlist, gamedata) {
		name = "TODO" // wait for name of card discarded
		let array;
		matches(cardlist)(
			(x = "h") => array = this.hand,
			(x = "k") => array = this.keepers
		);
		card = array.find(c => c.name == name);
		array = array.filter(c => c.name != name);
		gamedata.deck.discard.push();
	}
	play(gamedata) {
		name = "TODO" // wait for name of card played
		card = this.hand.find(c => c.name == name);
		this.hand = this.hand.filter(c => c.name != name);
		card.onPlay(this, gamedata);
		gamedata.playedThisTurn += 1;
	}
}