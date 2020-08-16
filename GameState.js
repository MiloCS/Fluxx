D = require('./Deck');


class GameState {
	// all the things happen in this class, GameData is manipulated by the GameState
	constructor(gametype, players) {
		this.gd = new GameData(gametype);
		let array = players;
		for (let i = array.length - 1; i > 0; i--) {
    		let j = Math.floor(Math.random() * (i + 1));
    		[array[i], array[j]] = [array[j], array[i]];
    	}
		this.players = array;
		//each player in the list of Players gets a ref to this.gd
		for (int i = 0; i < this.players.length; i++) {
			this.players[i].gamedata = this.gd;
		}
	}

	// Game setup: shuffle and deal
	setup() {
		this.gd.deck.shuffle();
		for (let i = 0; i < this.players.length; i--) {
			let cards = this.gd.deck.deal(3);
			this.players[i - 1].hand = cards;
		}
		// send UPDATE
	}

	// Start a turn for a given player
	start_turn(player) {
		this.gd.activePlayer = player;
		let draws = this.gd.draws;
		let drawnCards = this.gd.deck.draw(draws);
		for (let i = 0; i < drawn; i++) {
			player.hand.push(drawnCards[i]);
		}
		// send UPDATE
		this.gd.drawnThisTurn = drawn;
		this.gd.playedThisTurn = 0;
		this.run_play(player);
	}

	// Run a play for a given player
	run_play(player) {
		this.gd.activePlayer = player;
		// check that all players (except for active player) follow limits
		this.comply_all_limits(false);
		// draw up to correct amount
		let toDraw = draws - this.gd.drawnThisTurn;
		if (toDraw < 0) {
			let drawnCards = this.gd.deck.draw(toDraw);
			player.hand = player.hand.concat(drawnCards);
			// send UPDATE
		}
		// wait for play - MILO can we run a function somewhere that will return once a player plays a card?

		// send UPDATE
		// check for winner
		this.check_all_winner();
		if (this.gd.winners != []) {
			this.end_game();
			return;
		}
		// if no winners, continue with either next play or next turn
		// check if more plays left, run another play if so.
		this.gd.playedThisTurn += 1;
		if (this.gd.playedThisTurn >= this.gd.plays) {
			this.end_turn(player);
		} else {
			run_play(player);
		}
	}

	// This function ends a play and moves on to the next player if no winner
	end_turn(player) {
		// make all players comply with limits
		this.comply_all_limits(true);
		// send UPDATE
		// determine next player and start turn with next player
		let nextPlayer;
		let pindex = this.players.findIndex((p) => p == this.gd.activePlayer);
		if (this.gd.reverseOrder) {
			if (pindex == 0) {
				pindex = this.players.length;
			}
			nextPlayer = this.players[pindex - 1];
		} else {
			if (pindex == this.players.length) {
				pindex = -1;
			}
			nextPlayer = this.players[pindex + 1];
		}
		this.start_turn(player);
	}

	// this function makes players comply with limits
	// checkActive == true -> all players
	// checkActive == false -> all but the active player
	comply_all_limits(checkActive) {
		if(checkActive) {
			// stash the active player to check all
			lastPlayer = this.gd.activePlayer;
			this.gd.activePlayer = null;
			this.players.forEach(player => this.gd.comply_player_limits(player));
			this.gd.activePlayer = lastPlayer;
		} else {
			this.players.forEach(player => this.gd.comply_player_limits(player));
		}
	}

	// this function checks all players for a winner
	check_all_winner() {
		for (var i = this.players.length - 1; i >= 0; i--) {
			let winbool = this.gd.check_player_winner(this.players[i]);
			if (winbool) {
				this.gd.winners.push(this.players[i]);
			}
		}
	}

}


class GameData {
	constructor(gametype) {
		if (gametype == "fluxx3_0") {
			this.deck = D.F3_0Deck(); // a Deck object
		}
		else {
			this.deck = null;
		}
		this.goals = []; // a list of Goal object(s)
		this.draws = 1; // int
		this.plays = 1; // int
		this.hlim = null; // int
		this.klim = null; // int
		this.activePlayer = null; // int: the index in gs.players
		this.winners = [];

		// Special case rules
		this.reverseOrder = false;

		// Variables for turn-by-turn data
		this.playedThisTurn = 0;
		this.drawnThisTurn = 0;
	}

	// make the given player comply with limits if not the active player
	comply_player_limits(player) {
		if (player == this.activePlayer) {
			return;
		}
		while (player.keepers.length > this.klim) {
			player.discard("k");
			// send UPDATE (within discard?)
		}
		while (player.hand.length > this.hlim) {
			player.discard("h");
			// send UPDATE (within discard?)
		}
	}

	// check if the given player is a winner
	// return true if so or false
	check_player_winner(player) {
		for (var i = this.goals.length - 1; i >= 0; i--) {
			if (this.goals[i].winner(player)) {
				return true;
			}
		}
		return false;
	}
}


