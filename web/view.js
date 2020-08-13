let gameState = {
	"player":"id",
	"hand": [
		"Cookies",
		"Milk",
		"MilkandCookies",
		"5Keepers",
		"TrashSomething"
	],
	"keepers": [
		"Bread",
		"Cosmos",
		"Chocolate"
	],
	"gameState": {
		"rules": ["Draw2", "HandLimit1"],
		"goals": ["Brain(noTV)"],
		"discard":["AllThatIsCertain"],
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
//important game variable definitions
let handContainer = document.querySelector('#cards');
let modalClose = document.querySelector('#modal-close');
let cardModal = document.querySelector('#card-modal');
let modalCardContainer = document.querySelector('#modal-card-container');
let modalTitleContainer = document.querySelector('#modal-title');
let playersContainer = document.querySelector('#players-container')

let modalOpen = false;
let focusedCard = -1;

function changeHandNum(playerIndex, newNum) {
	let player = playersContainer.children[playerIndex];
	let numElem = player.getElementsByClassName('card-num')[0];
	numElem.innerText = newNum;
}

function drawCard(playerIndex, newNum) {
	drawCardAnimate(playerIndex);
	changeHandNum(newNum);
}

function drawCardAnimate(playerIndex) {
	playersContainer.children[playerIndex]
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

function putCards(cardContainer, cardList, width, height, modal=false) {
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
	//if we're adding cards to the modal, add the click event listeners so user can select cards
	if (modal) {
		Array.from(modalCardContainer.children).forEach(card => {
			card.addEventListener('click', function(e) {
				if (focusedCard !== -1) {
					modalCardContainer.children[focusedCard].style = '';
				}
				focusedCard = Array.from(modalCardContainer.children).indexOf(e.target.parentNode);
				modalCardContainer.children[focusedCard].style = 'transform: scale(1.06)';
			})
		})
	}
}

function closeModal() {
	cardModal.style.display = 'none';
	modalOpen = false;
	focusedCard = -1;
}

//event listeners for using keys to select cards
//this also includes other modal key bindings: esc to leave modal, enter to play card
document.addEventListener('keydown', function(e) {
	e = e || window.event;
	if (e.keyCode === 32) {
		changeHandNum(0, 0);
	}
	let cards = modalCardContainer.children.length;
	if (modalOpen) {
		if (e.keyCode === 27) {
			closeModal();
		}
		if (e.keyCode === 13) {
			console.log("enter pressed");
		}
		if (e.keyCode === 37) {
			modalCardContainer.children[focusedCard].style = '';
			if (focusedCard !== -1) {
				focusedCard = (focusedCard + cards - 1) % cards;
			}
			modalCardContainer.children[focusedCard].style = 'transform: scale(1.06)';
			console.log(focusedCard);
		}
		if (e.keyCode === 39) {
			if (focusedCard !== -1) {
				modalCardContainer.children[focusedCard].style = '';
				focusedCard = (focusedCard + 1) % cards;
			}
			else {
				focusedCard = 0;
				//modalCardContainer.children[focusedCard].style = '';
			}
			modalCardContainer.children[focusedCard].style = 'transform: scale(1.06)';
			console.log(focusedCard);
		}
	}
});

function spreadCards(cardContainer, width) {
	let cards = cardContainer.children;
	let distance = width / cards.length;
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

putCards(handContainer, gameState.hand, 100, 150);
spreadHand(handContainer);

//basic modal opening and closing event listening
handContainer.addEventListener('click', function () {
	setModal(gameState.hand, "Your Hand");
});

modalClose.addEventListener('click', closeModal);

function setModal(cardList, title) {
	if(cardList.length == 0) {
		return;
	}
	modalTitleContainer.textContent = title
	modalCardContainer.innerHTML = '';
	cardModal.style.display = 'block';
	modalOpen = true;
	putCards(modalCardContainer, cardList, 150, 225, true);
}

//other player view creation

function putUsers(users) {
	let IMG_WIDTH = 100;
	let board = document.querySelector('#table')
	let container = document.querySelector('#players-container')
	container.innerHTML = ''
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
}

function placePlayerLine(players, userLeft, userTop, keepersLeft, keepersTop, keeperRotation) {
	let container = document.querySelector('#players-container')
	for (let i = 0; i < players.length; i++) {
		let elem = createUserElement(players[i].name, players[i].handSize)
		elem.style.left = `${userLeft(i)}px`
		elem.style.top = `${userTop(i)}px`

		let cardElem = createCardElement()
		cardElem.style.left = `${keepersLeft(i)}px`
		cardElem.style.top = `${keepersTop(i)}px`
		cardElem.style.transform = `rotate(${keeperRotation}deg)`
		cardElem.addEventListener('click', function () {
			setModal(players[i].keepers, `${players[i].name}'s Keepers`)
		})
		putCards(cardElem, players[i].keepers, 48, 64)
		spreadCards(cardElem, 80)

		container.appendChild(elem)
		container.appendChild(cardElem)
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

window.onresize = function () {
	return putUsers(gameState.gameState.players)
}

//board updating
function updateRules(ruleList) {
	const elem = document.querySelector("#rule-cards")
	elem.innerHTML = ''
	putCards(elem, ruleList, 80, 120)
	spreadCards(elem, 120)
}

function updateGoals(goalList) {
	const elem = document.querySelector("#goal-cards")
	elem.innerHTML = ''
	putCards(elem, goalList, 80, 120)
	spreadCards(elem, 80)
}

function updateDiscard(card) {
	const elem = document.querySelector("#discard-cards")
	elem.innerHTML = ''
	putCards(elem, card, 80, 120)
	spreadCards(elem, 80)
}

function addBoardEventListeners() {
	const ruleElem = document.querySelector("#rule-cards")
	const goalElem = document.querySelector("#goal-cards")
	const discardElem = document.querySelector("#discard-cards")

	ruleElem.addEventListener('click', function () {
		setModal(gameState.gameState.rules, "Rules")
	})

	goalElem.addEventListener('click', function () {
		setModal(gameState.gameState.goals, "Goals")
	})

	discardElem.addEventListener('click', function () {
		setModal(gameState.gameState.discard, "Discard")
	})
}

function putOwnKeepers(keepers) {
	const elem = document.querySelector('#my-keepers')
	elem.addEventListener('click', function () {
		setModal(gameState.keepers, "Your Keepers")
	})
	putCards(elem, keepers, 80, 120)
}

putOwnKeepers(gameState.keepers)

updateRules(gameState.gameState.rules)
updateGoals(gameState.gameState.goals)
updateDiscard(gameState.gameState.discard)
addBoardEventListeners();



