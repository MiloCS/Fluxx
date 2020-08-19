class Card {
	constructor(name) {
		this.name = name;
	}
	onPlay(player, gamedata) {
		player.hand.filter(c => c != this);
		console.log("Playing " + this.name);
	}
	toString() {
		return this.name;
	}
	toMinimal() {
		return (this.name, typeof this);
	}
}

class NRule extends Card {
	onPlay(player, gamedata) {
		super.onPlay(player, gamedata);
		// Specifics to New Rules
		for (let index = 0; index < gamedata.rules.length; index++) {
			let r = gamedata.rules[index];
			if ((typeof r != SpecialRule) && (typeof r == typeof this)) {
				gamedata.discard.push(gamedata.rules.splice(index));
				r.unrule();
				break
			}
		}
		gamedata.rules.push(this);
	}
	// call unrule when taken out of rules
	unrule(gamedata) {
		return;
	}
}

class DrawRule extends NRule {
	constructor(name, draws) {
		super(name);
		this.d = draws;
	}
	onPlay(player, gamedata) {
		super.onPlay(player, gamedata);
		// stuff specific to Draw rules
		gamedata.draws = this.d;
	}
	unrule(gamedata) {
		gamedata.draws = 1;
	}
}

class PlayRule extends NRule {
	constructor(name, plays) {
		super(name);
		this.p = plays;
	}
	onPlay(player, gamedata) {
		super.onPlay(player, gamedata);
		// stuff specific to Play rules
		gamedata.plays = this.p;
	}
	unrule(gamedata) {
		gamedata.plays = 1;
	}
}

class LimRule extends NRule {
	constructor(name, lim) {
		super(name);
		this.lim = lim;
	}
	onPlay(player, gamedata) {
		super.onPlay(player, gamedata);
		// stuff specific to limits, maybe just in KLim and HLim?
	}
}


class HLimRule extends LimRule {
	onPlay(player, gamedata) {
		super.onPlay(player, gamedata);
		// stuff specific to hand limits
		gamedata.hlim = this.lim;
	}
	unrule(gamedata) {
		gamedata.hlim = this.lim;
	}
}

class KLimRule extends LimRule {
	onPlay(player, gamedata) {
		super.onPlay(player, gamedata);
		// stuff specific to keeper limits
		gamedata.klim = this.lim;
	}
	unrule(gamedata) {
		gamedata.klim = this.lim;
	}
}

class SpecialRule extends NRule {
	// playMod: an action to be performed on play
	constructor(name, playMod) {
		super();
		this.playMod = playMod;
	}
	onPlay(player, gamedata) {
		super.onPlay(player, gamedata);
		this.playMod(gamedata, true);
	}
	unrule(gamedata) {
		this.playMod(gamedata, false);
	}
}

class Action extends Card {
	constructor(name, action) {
		super(name);
		this.a = action;
	}
	onPlay(player, gamedata) {
		super.onPlay(player, gamedata);
		// stuff specific for Action cards
		this.a(player, gamedata);
		gamedata.deck.discard.push(this);
	}
}

// More action subclasses? Like (D3P2 & D2+U)

class Keeper extends Card {
	constructor(name, id) {
		super(name);
		this.kid = id
	}
	onPlay(player, gamedata) {
		super.onPlay(player, gamedata);
		// add keeper to player's keepers
		player.keepers.push(this);
	}
}

class Goal extends Card {
	// wincon: depends on type of goal, defined in subclass
	constructor(name, wcon) {
		super(name);
		this.wcon = wcon;
	}
	onPlay(player, gamedata) {
		super.onPlay(player, gamedata);
		// put goal in play
		gamedata.goals.push(this)
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
		this.wcon();
	}
}

export * from 'Card.js';