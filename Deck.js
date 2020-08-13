CL = require('./CardLists')

// Parent class only
class Deck {
	contructor() {
		this.pile = [];
		this.discard = [];
	}
	// randomize the order of the cards left in the pile
	shuffle() {
		for (let i = array.length - 1; i > 0; i--) {
    		let j = Math.floor(Math.random() * (i + 1));
    		[array[i], array[j]] = [array[j], array[i]];
    	}
	}
	// return an array of the top n Card objects from the deck
	deal(n) {
		let dealt = [];
		for (var i = n; i > 0; i--) {
			dealt.push(this.pile.shift())
			if (this.pile.length == 0) {
				this.pile = this.discard;
				this.discard = [];
				this.shuffle();
			}
		}
		return dealt;
	}
}

export class F3_0Deck extends Deck {
	constructor() {
		super();
		this.pile = CL.f3_0;
	}
}