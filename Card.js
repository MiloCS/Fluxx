class Card {
	constructor(name) {
		this.name = name;
	}
	onPlay(player, game) {
		console.log("Played " + this.name);
	}
	toString() {
		return this.name;
	}
}

class NRule extends Card {
	onPlay(player, game) {
		super.onPlay(player, game);
		// some stuff here with RULES
	}
}

class DrawRule extends NRule {
	onPlay(player, game) {
		super.onPlay(player, game);
		// stuff specific to Draw rules
	}
}

class PlayRule extends NRule {
	onPlay(player, game) {
		super.onPlay(player, game);
		// stuff specific to Play rules
	}
}

class Action extends Card {
	onPlay(player, game) {
		super.onPlay(player, game);
		// stuff specific for Action cards
	}
}

// More action subclasses? Like (D3P2 & D2+U)

class Keeper extends Card {
	onPlay(player, game) {
		super.onPlay(player, game);
		// add keeper to players
	}
}

class Goal extends Card {
	constructor(name, wcon) {
		super(name)
		this.wcon = wcon;
	}
	onPlay(player, game) {
		super.onPlay(player, game);
		// put goal in play
	}
	isMet() {
		console.log("this is just a generic goal")
		return null;
	}
}

class TwoKeep extends Goal {
	isMet() {
		// check players' keepers in wcon
		// return player who has both or null
	}
}

class OneKeep extends Goal {
	isMet() {
		// check that no one has the banned keeper
		// return player with the keeper or null
	}
}

class SpecialGoal extends Goal {
	isMet() {
		// call the function in wcon
	}
}