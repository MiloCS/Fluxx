function spreadHand(cardContainer) {
	let cards = cardContainer.children;
	let angle;
	let distance;
	if (cards.length < 4) {
		angle = 20 / cards.length;
		distance = 150 / cards.length;
	}
	else {
		angle = 40 / cards.length;
		distance = 200 / cards.length;
	}
	for (let i=0; i<cards.length; i++) {
		let normalized = i - Math.floor(cards.length/2);
		cards[i].style.transform = `rotate(${angle * normalized}deg) translate(${distance * normalized}px, -20px)`;
	}
}

function putCards(cardContainer, cardList, width, height) {
	cardList.forEach(cardName => {
		let card = document.createElement('div');
		card.classList.add('card');
		let img = document.createElement('img');
		img.classList.add('card-image');
		img.src = `cards/${cardName}.png`;
		img.width = `${width}`;
		img.height = `${height}`;
		card.appendChild(img);
		cardContainer.appendChild(card);
	});
}

function spreadKeepers(keeperContainer) {
	//similar to spreadHand
}

let allCards = ["10CardsinHand",
"5Keepers",
"AllThatIsCertain",
"AllYouNeedisLove",
"Appliances",
"BakedGoods",
"BedTime",
"Brain(noTV)",
"Brain",
"Bread",
"Chocolate",
"ChocolateCookies",
"ChocolateMilk",
"Cookies",
"Cosmos",
"CreeperSweeper",
"DeathbyChocolate",
"DiscardandDraw",
"DoubleAgenda",
"Dough",
"Draw2",
"Draw2anduse'em",
"Draw3,Play2ofthem",
"Draw3",
"Draw4",
"Draw5",
"Dreamland",
"Dreams",
"EverybodyGets1",
"ExchangeKeepers",
"Eye",
"FirstPlayRandom",
"GetOnWithIt!",
"HandLimit0",
"HandLimit1",
"HandLimit2",
"HeartsandMinds",
"Hippyism",
"Inflation",
"InterstellarSpacecraft",
"It'sTrashDay",
"Jackpot",
"KeeperLimit2",
"KeeperLimit3",
"KeeperLimit4",
"Let'sDoThatAgain",
"Let'sSimplify",
"Love",
"Milk",
"MilkandCookies",
"Mind'sEye",
"MixItAllUp",
"Money",
"Moon",
"NightandDay",
"No-HandBonus",
"NoLimits",
"Party",
"PartyBonus",
"PartySnacks",
"Peace(noWar)",
"Peace",
"Play2",
"Play3",
"Play4",
"PlayAll",
"PoorBonus",
"RichBonus",
"Rocket",
"RocketScience",
"RockettotheMoon",
"RotateHands",
"RulesReset",
"SilverLining",
"Sleep",
"SquishyChocolate",
"StarGazing",
"StealSomething",
"Sun",
"TakeAnotherTurn",
"Taxation",
"Television",
"Time",
"TimeisMoney",
"Toast",
"Toaster",
"Today'sSpecial!",
"TradeHands",
"TrashaNewRule",
"TrashSomething",
"UseWhatYouTake",
"War=Death",
"WinningtheLottery",
"YouAlsoNeedaPotato",
]


function selectRandomCards(array) {
	let final = [];
	let number = Math.random() * 10;
	for (let i=0; i<number; i++) {
		let index = Math.floor(Math.random() * allCards.length);
		final.push(allCards[index]);
	}
	return final;
}

let cards = selectRandomCards(allCards);

let handContainer = document.querySelector('#cards');
let modalClose = document.querySelector('#modal-close');
let cardModal = document.querySelector('#card-modal');
let modalCardContainer = document.querySelector('#modal-card-container');

putCards(handContainer, cards, 100, 150);
spreadHand(handContainer);

//modal event listening
handContainer.addEventListener('click', function () {
	setModal(cards);
});

modalClose.addEventListener('click', function () {
	cardModal.style.display = 'none';
});

function setModal(cardList) {
	modalCardContainer.innerHTML = '';
	cardModal.style.display = 'block';
	putCards(modalCardContainer, cardList, 150, 225);
}


