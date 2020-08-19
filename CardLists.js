C = require('./Card');
const LOVE_ID = 6;

let actions = [
	// 0. Discard and Draw
	function(player, gamedata) {
		let handlen = player.hand.length;
		gamedata.discard.concat(player.hand);
		player.hand = gamedata.deck.deal(handlen);
	},
	// 1. Draw 2 & Use 'Em
	function(player, gamedata) {
		console.log("TODO");
	},
	// 2. Draw 3, Play 2
	function(player, gamedata) {
		console.log("TODO");
	},
	// 3. Empty the Trash
	function(player, gamedata) {
		deck = gamedata.deck;
		deck.pile.concat(deck.discard);
		deck.shuffle();
		deck.discard = [];
	},
	// 4. Everybody Gets 1
	function(player, gamedata) {
		console.log("TODO");
	},
	// 5. Exchange Keepers
	function(player, gamedata) {
		console.log("TODO");
	},
	// 6. Go Fish
	function(player, gamedata) {
		console.log("TODO");
	},
	// 7. I Need a Goal
	function(player, gamedata) {
		console.log("TODO");
	},
	// 8. Let's Do That Again
	function(player, gamedata) {
		console.log("TODO");
	},
	// 9. Let's Simplify
	function(player, gamedata) {
		console.log("TODO");
	},
	// 10. No Limits
	function(player, gamedata) {
		gamedata.rules.forEach(nrule => {
			if (typeof nrule == C.LimRule) {
				gamedata.deck.discard.push(nrule);
				nrule.unrule(gamedata);
			}
		});
		gamedata.rules.filter(nrule => typeof nrule != C.LimRule)
		gamedata.rules.hlim = null;
		gamedata.rules.klim = null;
	},
	// 11. Rotate Hands
	function(player, gamedata) {
		console.log("TODO");
	},
	// 12. Rules Reset
	function(player, gamedata) {
		gamedata.deck.discard.concat(gamedata.rules);
		for (let index = 0; index < gamedata.rules.length; index++) {
			gamedata.rules.splice(index).unrule(gamedata);
		}
	},
	// 13. Scramble Keepers
	function(player, gamedata) {
		// add everyone's keepers to be mixed
		let keeps = [];
		gamedata.players.forEach(p => {
			keeps.concat(p.keepers);
		});
		// shuffle the keepers
		array = keeps;
		for (let i = array.length - 1; i > 0; i--) {
    		let j = Math.floor(Math.random() * (i + 1));
    		[array[i], array[j]] = [array[j], array[i]];
		}
		// distribute based on prior amounts
		gamedata.players.forEach(p => {
			p.keepers = keeps.splice(0, p.keepers.length);
		});
	},
	// 14. Steal a Keeper
	function(player, gamedata) {
		console.log("TODO");
	},
	// 15. Take Another Turn
	function(player, gamedata) {
		gamedata.takeAnother = true;
	},
	// 16. Taxation
	function(player, gamedata) {
		console.log("TODO");
	},
	// 17. Trade Hands
	function(player, gamedata) {
		console.log("TODO");
	},
	// 18. Trash a Keeper
	function(player, gamedata) {
		console.log("TODO");
	},
	// 19. Trash a New Rule
	function(player, gamedata) {
		console.log("TODO");
	},
	// 20. Use What You Take
	function(player, gamedata) {
		console.log("TODO");
	}
];

let specialGoalConditions = [
	// 0. 10 Cards in Hand
	function(gamedata) {
		winners = [];
		gamedata.players.forEach(p => {
			hlen = p.hand.length
			if(hlen >= 10) {
				if (winners == [] || hlen > winners[0].hand.length) {
					winners = [p];
				} else if (hlen == winners[0].hand.length) {
					winners.push(p);
				}
			}
		})
		return winners;
	},
	// 1. 5 Keepers
	function(gamedata) {
		winners = [];
		gamedata.players.forEach(p => {
			klen = p.keepers.length
			if(klen >= 10) {
				if (winners == [] || klen > winners[0].keepers.length) {
					winners = [p];
				}
				else if (hlen == winners[0].keepers.length) {
					winners.push(p);
				}
			}
		})
		return winners;
	},
	// 2. All You Need is Love
	function(gamedata) {
		winners = [];
		gamedata.players.forEach(p => {
			if (p.keepers.length == 1 && p.keepers[0].kid == LOVE_ID) {
					winners.push(p);
				}
		})
		return winners;
	}
]

let f3_0 = [
	new C.DrawRule("Draw 2", 2),
	new C.DrawRule("Draw 3", 3),
	new C.DrawRule("Draw 4", 4),
	new C.DrawRule("Draw 5", 5),
	new C.PlayRule("Play 2", 2),
	new C.PlayRule("Play 3", 3),
	new C.PlayRule("Play 4", 4),
	new C.PlayRule("Play All", Number.MAX_SAFE_INTEGER),
	new C.HLimRule("Hand Limit 0", 0),
	new C.HLimRule("Hand Limit 1", 1),
	new C.HLimRule("Hand Limit 2", 2),
	new C.KLimRule("Keeper Limit 2", 2),
	new C.KLimRule("Keeper Limit 3", 3),
	new C.KLimRule("Keeper Limit 4", 4),
	new C.SpecialRule("Double Agenda", function(gamedata, bool) {
		gamedata.doubleAgenda = bool;
	}),
	new C.SpecialRule("Reverse Order", function(gamedata, bool) {
		gamedata.reverseOrder = bool;
	}),
	new C.SpecialRule("First Play Random", function(gamedata, bool) {
		gamedata.firstPlayRandom = bool;
	}),
	new C.SpecialRule("No-Hand Bonus", function(gamedata, bool) {
		gamedata.noHandBonus = bool;
	}),
	new C.SpecialRule("Poor Bonus", function(gamedata, bool) {
		gamedata.poorBonus = bool;
	}),
	new C.SpecialRule("Rich Bonus", function(gamedata, bool) {
		gamedata.richBonus = bool;
	}),
	new C.SpecialRule("X = X + 1", function(gamedata, bool) {
		gamedata.inflation = bool;
	}),
	new C.Action("Discard and Draw", actions[0]),
	new C.Action("Draw 2 & Use 'Em", actions[1]),
	new C.Action("Draw 3, Play 2", actions[2]),
	new C.Action("Empty the Trash", actions[3]),
	new C.Action("Everybody Gets 1", actions[4]),
	new C.Action("Exchange Keepers", actions[5]),
	new C.Action("Go Fish", actions[6]),
	new C.Action("I Need a Goal", actions[7]),
	new C.Action("Let's Do That Again", actions[8]),
	new C.Action("Let's Simplify", actions[9]),
	new C.Action("No Limits", actions[10]),
	new C.Action("Rotate Hands", actions[11]),
	new C.Action("Rules Reset", actions[12]),
	new C.Action("Scramble Keepers", actions[13]),
	new C.Action("Steal a Keeper", actions[14]),
	new C.Action("Take Another Turn", actions[15]),
	new C.Action("Taxation", actions[16]),
	new C.Action("Trade Hands", actions[17]),
	new C.Action("Trash a Keeper", actions[18]),
	new C.Action("Trash a New Rule", actions[19]),
	new C.Action("Use What You Take", actions[20]),
	new C.Keeper("The Brain", 0),
	new C.Keeper("Bread", 1),
	new C.Keeper("Chocolate", 2),
	new C.Keeper("Cookies", 3),
	new C.Keeper("Death", 4),
	new C.Keeper("Dreams", 5),
	new C.Keeper("Love", 6),
	new C.Keeper("Milk", 7),
	new C.Keeper("Money", 8),
	new C.Keeper("The Moon", 9),
	new C.Keeper("Peace", 10),
	new C.Keeper("Rocket", 11),
	new C.Keeper("Sleep", 12),
	new C.Keeper("The Sun", 13),
	new C.Keeper("Television", 14),
	new C.Keeper("Time", 15),
	new C.Keeper("The Toaster", 16),
	new C.Keeper("War", 17),
	new C.SpecialGoal("10 Cards in Hand", specialGoalConditions[0]),
	new C.SpecialGoal("5 Keepers", specialGoalConditions[1]),
	new C.SpecialGoal("All You Need is Love", specialGoalConditions[2]),
	new C.TwoKeep("The Appliances", [14, 16]),
	new C.TwoKeep("Baked Goods", [1, 3]),
	new C.TwoKeep("Bed Time", [12, 15]),
	new C.OneKeep("The Brain (no TV)", [0, 14]),
	new C.TwoKeep("Chocolate Cookies", [2, 3]),
	new C.TwoKeep("Chocolate Milk", [2, 7]),
	new C.TwoKeep("Death by Chocolate", [2, 4]),
	new C.TwoKeep("Dreamland", [5, 12]),
	new C.TwoKeep("Hearts and Minds", [0, 6]),
	new C.TwoKeep("Hippyism", [6, 10]),
	new C.TwoKeep("Milk and Cookies", [3, 7]),
	new C.TwoKeep("Night and Day", [9, 13]),
	new C.OneKeep("Peace (no War)", [10, 17]),
	new C.TwoKeep("Rocket Science", [3, 7]),
	new C.TwoKeep("Rocket to the Moon", [0, 11]),
	new C.TwoKeep("Squishy Chocolate", [2, 13]),
	new C.TwoKeep("Time is Money", [8, 15]),
	new C.TwoKeep("Toast", [1, 16]),
	new C.TwoKeep("War = Death", [4, 17]),
	new C.TwoKeep("Winning the Lottery", [5, 8])
];

export * from 'CardLists';