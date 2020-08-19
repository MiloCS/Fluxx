D = require('./Deck');
INDEX = require('./index')
//require players?


class GameState {
	// all the things happen in this class, GameData is manipulated by the GameState
	constructor(gametype, players) {
		this.gd = new GameData(gametype, players);
	}

	// Game setup: shuffle and deal
	setup() {
		this.gd.deck.shuffle();
		for (let i = 0; i < this.gd.players.length; i--) {
			let cards = this.gd.deck.deal(3);
			this.gd.players[i - 1].hand = cards;
		}
		this.update();
	}

	// Start a turn for a given player
	start_turn(player) {
		this.gd.activePlayer = player;
		let draws = this.gd.draws;
		let drawnCards = this.gd.deck.draw(draws);
		for (let i = 0; i < drawn; i++) {
			player.hand.push(drawnCards[i]);
		}
		this.update();
		this.gd.drawnThisTurn = drawn;
		this.gd.playedThisTurn = 0;
		this.run_play(player);
	}

	// Run a play for a given player
	run_play(player) {
		// this.gd.activePlayer = player;
		// check that all players (except for active player) follow limits
		this.comply_all_limits(false);
		// draw up to correct amount
		let toDraw = draws - this.gd.drawnThisTurn;
		if (toDraw < 0) {
			let drawnCards = this.gd.deck.draw(toDraw);
			player.hand = player.hand.concat(drawnCards);
			this.update();
		}
		// wait for play - MILO can we run a function somewhere that will return once a player plays a card?
		player.play(this.gd);
		// send UPDATE (maybe inside function?)
		// check for winner
		this.check_all_winner();
		if (this.gd.winners != []) {
			this.end_game();  //TODO
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

	// determine the next player
	// returns the Player who goes next
	determineNextPlayer(player) {
		let pindex = this.gd.players.indexOf(player);
		if (this.gd.reverseOrder) {
			if (pindex == 0) {
				return this.gd.players[this.gd.players.length - 1];
			} else {
				return this.gd.players[pindex - 1];
			}
		} else {
			if (pindex == this.gd.players.length) {
				return this.gd.players[0];
			} else {
				return this.gd.players[pindex + 1];
			}
		}
	}

	// This function ends a play and moves on to the next player if no winner
	end_turn(player) {
		// make all players comply with limits
		this.comply_all_limits(true);
		this.update();
		// start turn with next player
		if (this.gd.takeAnotherTurn) {
			this.gd.takeAnotherTurn = false;
			this.start_turn(player);
		} else {
			this.start_turn(this.determineNextPlayer(player));
		}
	}

	// this function makes players comply with limits
	// checkActive == true -> all players
	// checkActive == false -> all but the active player
	comply_all_limits(checkActive) {
		if(checkActive) {
			// stash the active player to check all
			lastPlayer = this.gd.activePlayer;
			this.gd.activePlayer = null;
			this.gd.players.forEach(player => this.gd.comply_player_limits(player));
			this.gd.activePlayer = lastPlayer;
		} else {
			this.gd.players.forEach(player => this.gd.comply_player_limits(player));
		}
	}

	// this function checks all players for a winner
	check_all_winner() {
		for (var i = this.gd.players.length - 1; i >= 0; i--) {
			let winbool = this.gd.check_player_winner(this.gd.players[i]);
			if (winbool) {
				this.gd.winner.push(this.players[i]);
			}
		}
	}

	// Update: Send to each player their appropriate pgs
	update() {
		this.updateMGS();
		this.gd.players.forEach(p => {
			let pgs = this.gd.generatePlayerGameState(p);
			INDEX.update(pgs, p.pID);
		});
	}

	// Pull in player data into player portion of MGS
	updateMGS() {
		this.gd.mgs.discard = this.gd.deck.discard;
		this.gd.players.forEach(p => {
			pJSON = this.gd.mgs.players.find(p => p.pID == player.pID);
			pJSON.hand = p.hand;
			pJSON.keepers = p.keepers;
		});
	}

}


class GameData {
	constructor(gametype, players) {
		if (gametype == "fluxx3_0") {
			this.deck = D.F3_0Deck(); // a Deck object
		}
		else {
			this.deck = null;
		}
		this.draws = 1; // int
		this.plays = 1; // int
		this.hlim = null; // int
		this.klim = null; // int
		this.activePlayer = null; // int: the index in gs.players
		this.winner = null;

		// Players
		let array = players;
		for (let i = array.length - 1; i > 0; i--) {
    		let j = Math.floor(Math.random() * (i + 1));
    		[array[i], array[j]] = [array[j], array[i]];
    	}
		this.players = array;

		// Special case rules
		this.doubleAgenda = false;
		this.reverseOrder = false;
		this.firstPlayRandom = false;
		this.noHandBonus = false;
		this.poorBonus = false;
		this.richBonus = false;
		this.inflation = false;

		// Action special cases
		this.takeAnotherTurn = false;

		// Variables for turn-by-turn data
		this.playedThisTurn = 0;
		this.drawnThisTurn = 0;

		// Master Game State
		this.mgs = 
			{
				"rules": [],
				"goals": [],
				"discard": [],
				"players": [], // id, name, hand[], keepers[]
				"status": {
					"activeStatus": "",
					"inactiveStatus": ""
				}
			};
	}


	// make the given player comply with limits if not the active player
	comply_player_limits(player) {
		if (player == this.activePlayer) {
			return;
		}
		while (this.klim && player.keepers.length > this.klim) {
			player.discard("k");
			// send UPDATE (within discard?)
		}
		while (this.hlim && player.hand.length > this.hlim) {
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

	// Generate the player game state for the given player
	generatePlayerGameState(player) {
		let pgs = {};
		pgs.gameState = Object.assign({}, this.mgs);
		delete pgs.gameState.players;
		delete pgs.
		//find the current player in this.mgs, populate pgs. player, hand, keepers, status
		let thisPJSON = this.mgs.players.find(p => p.pID == player.pID);
		pgs.player = thisPJSON.pID;
		pgs.hand = thisPJSON.hand;
		pgs.keepers = thisPJSON.keepers;
		if (player == this.activePlayer) {
			pgs.status = this.mgs.status.activeStatus;
		} else {
			pgs.status = this.mgs.status.inactiveStatus;
		}
		delete thisPJSON
		//sort through players with a map (need accesory function)
		pgs.gameState.players = 
			pgs.gameState.players
			.filter(p => p.pID != player.pID)
			.map(e => this.sortOtherPlayerData(e));
	}

	// Accessory function to get the hand length and keepers of other players
	sortOtherPlayerData(pJSON) {
		nPJSON = Object.assign({}, pJSON);
		nPJSON.handSize = nPJSON.hand.length;
		delete nPJSON.hand;
		return nPJSON;
	}
}


