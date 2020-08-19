/* This file serves as a kind of general interface for dealing with DOM elements and actions
that the player takes on the game page. It selects many of the necessary elements from the DOM
and provides some basic interaction with them, as well as with dynamic element distribution on the
page*/

let gameState = {
	"player": "id",
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
		"rules": ["Draw2", "HandLimit1", "Draw2", "Draw2"],
		"goals": ["Brain(noTV)"],
		"discard": ["AllThatIsCertain"],
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
		"status": "waiting for milo",
		"message": "milo played cookies"
	},
	"updates": ["rules", "goals"]
}
//important game variable definitions
let handContainer = document.querySelector('#cards');
let modalClose = document.querySelector('#modal-close');
let cardModal = document.querySelector('#card-modal');
let modalCardContainer = document.querySelector('#modal-card-container');
let modalTitleContainer = document.querySelector('#modal-title');
let playersContainer = document.querySelector('#players-container');
let playStatus = document.querySelector('#playstatus');
let rulesContainer = document.querySelector('#rules');
let discardContainer = document.querySelector('#discard');
let goalsContainer = document.querySelector('#goal');

let modalOpen = false;
let focusedCard = -1;
let userTurn = false;

function spreadHand(cardContainer, expanded=false) {
	let cards = cardContainer.children;
	let angle;
	let distance;
	let smallDist = expanded ? 200 : 150;
	let largeDist = expanded ? 300 : 200;
	let smallAngle = expanded ? 10 : 20;
	let largeAngle = expanded ? 25 : 40;

	if (cards.length < 4) {
		angle = smallAngle / cards.length;
		distance = smallDist / cards.length;
	}
	else {
		angle = largeAngle / cards.length;
		distance = largeDist / cards.length;
	}
	for (let i = 0; i < cards.length; i++) {
		let normalized = i - Math.floor(cards.length / 2);
		cards[i].style.transform = `rotate(${angle * normalized}deg) translate(${distance * normalized}px, -20px)`;
	}
}

function putCards(cardContainer, cardList, width, height, modal = false) {
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
			card.addEventListener('click', function (e) {
				if (focusedCard !== -1) {
					modalCardContainer.children[focusedCard].style = '';
				}
				focusedCard = Array.from(modalCardContainer.children).indexOf(e.target.parentNode);
				modalCardContainer.children[focusedCard].style = 'transform: scale(1.06)';
			})
		})
	}
}

//cleanup when modal is closed: don't display it, set a variable indicating it's closed and unfocus modal cards
function closeModal() {
	cardModal.style.display = 'none';
	modalOpen = false;
	focusedCard = -1;
}

//function to start player turn
function startTurn() {
	playStatus.style.display = 'block';
	playStatus.textContent = "It's your turn. Play a card";
	userTurn = true;
	spreadHand(handContainer, true);
}

//function to end turn
function endTurn() {
	playStatus.style.display = 'none';
	userTurn = false;
	spreadHand(handContainer);
}

//event listeners for using keys to select cards
//this also includes other modal key bindings: esc to leave modal, enter to play card, arrow keys to move between cards
document.addEventListener('keydown', function (e) {
	e = e || window.event;
	if (e.keyCode === 32) {
		console.log('space')
		//drawCard(3, 8);
		//sendUpdate();
		if (userTurn) {
			endTurn();
		}
		else {
			startTurn();
		}
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
		}
		if (e.keyCode === 39) {
			if (focusedCard !== -1) {
				modalCardContainer.children[focusedCard].style = '';
				focusedCard = (focusedCard + 1) % cards;
			}
			else {
				focusedCard = 0;
			}
			modalCardContainer.children[focusedCard].style = 'transform: scale(1.06)';
		}
	}
});

//spreads cards in a container out over a set width
function spreadCards(cardContainer, width) {
	let cards = cardContainer.children;
	let distance = width / cards.length;
	for (let i = 0; i < cards.length; i++) {
		let normalized = i - Math.floor(cards.length / 2);
		cards[i].style.transform = `translate(${distance * normalized}px, -20px)`;
	}
}

//spread rules: spreads to the right, basically left-aligning the spread
function spreadOnTable(cardContainer, width) {
	let cards = cardContainer.children;
	let distance = width / cards.length;
	for (let i = 0; i < cards.length; i++) {
		cards[i].style.transform = `translate(${distance * i}px, 0px)`;
	}
}

//this was a test feature, it is on longer in use
//(and will not work because allCards variable is no longer present)
function selectRandomCards(array) {
	let final = [];
	let number = Math.random() * 10;
	for (let i = 0; i < number; i++) {
		let index = Math.floor(Math.random() * allCards.length);
		final.push(allCards[index]);
	}
	return final;
}

//basic modal opening and closing event listening
//this is hand opening on regular click instead of right click
// handContainer.addEventListener('click', function () {
// 	setModal(gameState.hand, "Your Hand");
// });

//this is an event listened for using right click instead of click to open expanded view
handContainer.addEventListener('contextmenu', function(e) {
	e.preventDefault();
	setModal(gameState.hand, "Your Hand");
	return false;
})

modalClose.addEventListener('click', closeModal);

function setModal(cardList, title) {
	if (cardList.length == 0) {
		return;
	}
	modalTitleContainer.textContent = title
	modalCardContainer.innerHTML = '';
	cardModal.style.display = 'block';
	modalOpen = true;
	putCards(modalCardContainer, cardList, 150, 225, true);
}

//other player view creation
//places other players that are not the immediate user, uses to placePlayerLine to set them
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

//places line of players (left, top, or right)
function placePlayerLine(players, userLeft, userTop, keepersLeft, keepersTop, keeperRotation) {
	let container = document.querySelector('#players-container')
	for (let i = 0; i < players.length; i++) {
		let elem = createUserElement(players[i].name, players[i].handSize)
		elem.style.left = `${userLeft(i)}px`
		elem.style.top = `${userTop(i)}px`

		//calls method that sets up container for played keepers
		let cardElem = createKeepersElement()
		cardElem.style.left = `${keepersLeft(i)}px`
		cardElem.style.top = `${keepersTop(i)}px`
		cardElem.style.transform = `rotate(${keeperRotation}deg)`
		cardElem.addEventListener('click', function () {
			setModal(players[i].keepers, `${players[i].name}'s Keepers`)
		})
		putCards(cardElem, players[i].keepers, 48, 64)
		spreadCards(cardElem, 80)

		container.appendChild(elem)
		elem.appendChild(cardElem)
	}
}

//used to set up container for keepers
function createKeepersElement() {
	let result = document.createElement('div')
	result.classList.add('keepers')
	return result
}

function createUserElement(name, cards) {
	let result = document.createElement('div')
	result.classList.add('user')
	let profileImg = document.createElement('img')
	profileImg.src = 'imgs/user.png'
	profileImg.classList.add('profile-img')
	let cardsImg = document.createElement('img')
	cardsImg.src = 'imgs/cards.png'
	cardsImg.classList.add('cards-img')
	let nameLabel = document.createElement('span')
	nameLabel.classList.add('name')
	nameLabel.textContent = name
	let cardsLabel = document.createElement('div')
	cardsLabel.classList.add('card-num')
	cardsLabel.textContent = `${cards}`
	let plusOneElem = document.createElement('div')
	plusOneElem.textContent = '+1'
	plusOneElem.classList.add('plus-one')
	let topLine = document.createElement('div')
	topLine.classList.add('topline')
	topLine.appendChild(nameLabel)
	topLine.appendChild(cardsImg)
	topLine.appendChild(cardsLabel)
	topLine.appendChild(plusOneElem)
	result.appendChild(topLine)
	result.appendChild(profileImg)
	return result
}

putUsers(gameState.gameState.players)

window.onresize = function () {
	return putUsers(gameState.gameState.players)
}

//board updating
function updateHand() {
	handContainer.innerHTML = ''
	putCards(handContainer, gameState.hand, 100, 150);
	spreadHand(handContainer);
}

function addCardtoHand() {
	putCards(handContainer, ["Draw2"], 100, 150);
	spreadHand(handContainer);
}

function removeCardByIndex(location, index) {
	location.removeChild(location.childNodes[index]);
	spreadHand(handContainer);
}

function updateRules() {
	const elem = document.querySelector("#rule-cards")
	elem.innerHTML = ''
	putCards(elem, gameState.gameState.rules, 80, 120)
	spreadOnTable(elem, 120)
}

function updateGoals() {
	const elem = document.querySelector("#goal-cards")
	elem.innerHTML = ''
	putCards(elem, gameState.gameState.goals, 80, 120)
	spreadOnTable(elem, 80)
}

function updateDiscard() {
	const elem = document.querySelector("#discard-cards")
	elem.innerHTML = ''
	putCards(elem, gameState.gameState.discard, 80, 120)
	spreadOnTable(elem, 80)
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

updateHand();
updateRules(gameState.gameState.rules)
updateGoals(gameState.gameState.goals)
updateDiscard(gameState.gameState.discard)
addBoardEventListeners();



