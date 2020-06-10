let gameState = {
	"player":"id",
	"hand": [
		"Cookies",
		"Milk",
		"MilkandCookies",
		"5Keepers",
		"TrashSomething"
	],
	"gameState": {
		"rules": [],
		"goals": [],
		"players": [
			{
				"name": "Milo",
				"handSize": 9,
				"keepers": [
					"Bread",
					"Cosmos",
					"Chocolate"
				]
			},
			{
				"name": "Noah",
				"handSize": 4,
				"keepers": [
					"Chocolate",
					"Cosmos",
					"Bread"
				]
			},
			{
				"name": "Henry",
				"handSize": 8,
				"keepers": [
					"Chocolate",
					"Cosmos",
					"Brain"
				]
			},
			{
				"name": "Mark",
				"handSize": 2,
				"keepers": [
					"Chocolate",
					"Cookies",
					"Cosmos"
				]
			},
		],
		"status":"waiting for milo",
		"message":"milo played cookies"
	},
	"updates": ["rules", "goals"]
}

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
	for (let i = 0; i < cards.length; i++) {
		let normalized = i - Math.floor(cards.length / 2);
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
	let cards = keeperContainer.children;
	let distance;
	if (cards.length < 4) {
		distance = 50 / cards.length;
	}
	else {
		angle = 40 / cards.length;
		distance = 100 / cards.length;
	}
	for (let i = 0; i < cards.length; i++) {
		let normalized = i - Math.floor(cards.length / 2);
		cards[i].style.transform = `translate(${distance * normalized}px, -20px)`;
	}
}


function selectRandomCards(array) {
	let final = [];
	let number = Math.random() * 10;
	for (let i = 0; i < number; i++) {
		let index = Math.floor(Math.random() * allCards.length);
		final.push(allCards[index]);
	}
	return final;
}

let handContainer = document.querySelector('#cards');
let modalClose = document.querySelector('#modal-close');
let cardModal = document.querySelector('#card-modal');
let modalCardContainer = document.querySelector('#modal-card-container');

putCards(handContainer, gameState.hand, 100, 150);
spreadHand(handContainer);

let rules = ["Draw2", "HandLimit1"];
let goal = [""]
putCards(document.querySelector('#rules'), rules, 80, 120);

//modal event listening
handContainer.addEventListener('click', function () {
	setModal(gameState.hand);
});

modalClose.addEventListener('click', function () {
	cardModal.style.display = 'none';
});

function setModal(cardList) {
	modalCardContainer.innerHTML = '';
	cardModal.style.display = 'block';
	putCards(modalCardContainer, cardList, 150, 225);
}

//other player view creation

function putUsers(users) {
	let IMG_WIDTH = 100;
	let board = document.querySelector('#table')
	board.innerHTML = ''
	let rect = board.getBoundingClientRect()
	let left = [];
	let middle = [];
	let right = [];
	let inc = (rect.width + rect.height * 2) / users.length
	for (let i = 0; i < users.length; i++) {
		let pos = i * inc + inc / 2;
		if (pos < rect.height) {
			left.push(users[i])
		}
		else if (pos < (rect.height + rect.width)) {
			middle.push(users[i])
		}
		else {
			right.push(users[i])
		}
	}
	let leftInc = rect.height / (left.length + 1)
	let middleInc = rect.width / (middle.length + 1)
	let rightInc = rect.height / (right.length + 1)

	const leftUserLeft = i => rect.left - IMG_WIDTH
	const leftUserTop = i => rect.bottom - leftInc * (i + 1) - IMG_WIDTH / 2
	const leftKeepersLeft = i => rect.left + IMG_WIDTH * 0.2
	const leftKeepersTop = i => rect.bottom - leftInc * (i + 1)
	placePlayerLine(left, leftUserLeft, leftUserTop, leftKeepersLeft, leftKeepersTop, 90) 

	const middleUserLeft = i => rect.left + middleInc * (i + 1) - IMG_WIDTH / 2
	const middleUserTop = i => rect.top - IMG_WIDTH * 1.3
	const middleKeepersLeft = i => rect.left + middleInc * (i + 1) - IMG_WIDTH / 4
	const middleKeepersTop = i => rect.top + IMG_WIDTH * 0.1
	placePlayerLine(middle, middleUserLeft, middleUserTop, middleKeepersLeft, middleKeepersTop, 0) 

	const rightUserLeft = i => rect.right
	const rightUserTop = i => rect.top + rightInc * (i + 1) - IMG_WIDTH / 2
	const rightKeepersLeft = i => rect.right - IMG_WIDTH * 0.7
	const rightKeepersTop = i => rect.top + rightInc * (i + 1)
	placePlayerLine(right, rightUserLeft, rightUserTop, rightKeepersLeft, rightKeepersTop, -90)

	//setKeeperClickEvent()
}

function placePlayerLine(players, userLeft, userTop, keepersLeft, keepersTop, keeperRotation) {
	let board = document.querySelector('#table')
	for (let i = 0; i < players.length; i++) {
		let elem = createUserElement(players[i].name, players[i].handSize)
		elem.style.left = `${userLeft(i)}px`
		elem.style.top = `${userTop(i)}px`

		let cardElem = createCardElement()
		cardElem.style.left = `${keepersLeft(i)}px`
		cardElem.style.top = `${keepersTop(i)}px`
		cardElem.style.transform = `rotate(${keeperRotation}deg)`
		cardElem.addEventListener('click', function () {
			setModal(players[i].keepers)
		})
		putCards(cardElem, players[i].keepers, 48, 64)
		spreadKeepers(cardElem)

		board.appendChild(elem)
		board.appendChild(cardElem)
	}
}


function createCardElement() {
	let result = document.createElement('div')
	result.classList.add('keepers')
	return result
}

function createUserElement(name, cards) {
	let result = document.createElement('div')
	result.classList.add('user')
	let profileImg = document.createElement('img')
	profileImg.src = 'user.png'
	profileImg.classList.add('profile-img')
	let cardsImg = document.createElement('img')
	cardsImg.src = 'cards.png'
	cardsImg.classList.add('cards-img')
	let nameLabel = document.createElement('span')
	nameLabel.classList.add('name')
	nameLabel.textContent = name
	let cardsLabel = document.createElement('div')
	cardsLabel.classList.add('card-num')
	cardsLabel.textContent = `${cards}`
	let topLine = document.createElement('div')
	topLine.classList.add('topline')
	topLine.appendChild(nameLabel)
	topLine.appendChild(cardsImg)
	topLine.appendChild(cardsLabel)
	result.appendChild(topLine)
	result.appendChild(profileImg)
	return result
}

putUsers(gameState.gameState.players)

// function setKeeperClickEvent() {
// 	Array.from(document.querySelectorAll('.keepers')).map(keep => {
// 		keep.addEventListener('click', function () {
// 			setModal(keepers)
// 		})
// 	})
// }

window.onresize = function () {
	return putUsers(gameState.gameState.players)
}
