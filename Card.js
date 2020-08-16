class Card {
	constructor(name) {
		this.name = name;
	}
	onPlay(player, gamestate) {
		console.log("Played " + this.name);
	}
	toString() {
		return this.name;
	}
}

class NRule extends Card {
	onPlay(player, gamestate) {
		super.onPlay(player, game);
		// some stuff here with RULES
	}
}

class DrawRule extends NRule {
	constructor(name, draws) {
		super(name);
		this.d = draws;
	}
	onPlay(player, gamestate) {
		super.onPlay(player, game);
		// stuff specific to Draw rules
	}
}

class PlayRule extends NRule {
	constructor(name, plays) {
		super(name);
		this.p = plays;
	}
	onPlay(player, gamestate) {
		super.onPlay(player, game);
		// stuff specific to Play rules
	}
}

class LimRule extends NRule {
	constructor(name, lim) {
		super(name);
		this.lim = lim;
	}
	onPlay(player, gamestate) {
		super.onPlay(player, game);
		// stuff specific to limits, maybe just in KLim and HLim?
	}
}


class HLimRule extends LimRule {
	onPlay(player, gamestate) {
		super.onPlay(player, game);
		// stuff specific to hand limits
	}
}

class KLimRule extends LimRule {
	onPlay(player, gamestate) {
		super.onPlay(player, game);
		// stuff specific to keeper limits
	}
}

class Action extends Card {
	constructor(name, action) {
		super(name);
		this.a = action;
	}
	onPlay(player, gamestate) {
		super.onPlay(player, game);
		// stuff specific for Action cards
	}
}

// More action subclasses? Like (D3P2 & D2+U)

class Keeper extends Card {
	constructor(name, id) {
		super(name);
		this.kid = id
	}
	onPlay(player, gamestate) {
		super.onPlay(player, game);
		// add keeper to players
	}
}

class Goal extends Card {
	// wincon: depends on type of goal, defined in subclass
	constructor(name, wcon) {
		super(name);
		this.wcon = wcon;
	}
	onPlay(player, gamestate) {
		super.onPlay(player, game);
		// put goal in play
	}
	isMet() {
		console.log("this is just a generic goal");
		return null;
	}
}

class TwoKeep extends Goal {
	// wincon: [kid Y, kid Y]
	isMet() {
		// check players' keepers in wcon
		// return player who has both or null
	}
}

class OneKeep extends Goal {
	// wincon: [kid Y, kid N]
	isMet() {
		// check that no one has the banned keeper
		// return player with the keeper or null
	}
}

class SpecialGoal extends Goal {
	// wincon: function
	isMet() {
		// call the function in wcon
	}
}

export *;