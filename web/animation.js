/* This file deals with any and all animations that take place on the fluxx game screen
This includes making cards from the hand draggable, the adding a card to other player's and animation,
as well as the card movement animations.*/

//checks collisions with elements so they can be "focused" when moused over with dragged card
function collideTableCards(event) {
	checkInBoundsAndScale(rulesContainer, event);
	checkInBoundsAndScale(discardContainer, event);
	checkInBoundsAndScale(goalsContainer, event);
}

// for when dragging stops
function resetTableCards() {
	rulesContainer.style.transform = 'scale(1)';
	discardContainer.style.transform = 'scale(1)';
	goalsContainer.style.transform = 'scale(1)';
}

//checks bounds for a generic element and scales if mouse is over it
function checkInBoundsAndScale(container, event) {
	bounds = container.getBoundingClientRect();
	let x = event.clientX;
	let y = event.clientY;
	//in this case, the mouseX and mouseY are in bounds of one of the table sections
	if (x > bounds.left && x < bounds.right && y > bounds.top && y < bounds.bottom) {
		container.style.transform = 'scale(1.06)';
		return true;
	}
	else {
		container.style.transform = 'scale(1)';
		return false;
	}
}

//changes number in hand indicator next to player name based on player index
function changeHandNum(playerIndex, newNum) {
	let player = playersContainer.children[playerIndex];
	let numElem = player.getElementsByClassName('card-num')[0];
	numElem.innerText = newNum;
}

//draws a card: changes 
function drawCard(playerIndex, newNum) {
	drawCardAnimate(playerIndex);
	changeHandNum(playerIndex, newNum);
}

function drawCardAnimate(playerIndex) {

	console.log('animating');
	let animation = [
		{ opacity: '100%' },
		{ opacity: '50%' },
		{ opacity: '0%' }
	]
	let elem = playersContainer.children[playerIndex].getElementsByClassName('plus-one')[0]

	elem.animate(animation, {
		duration: 1000,
		iterations: 1
	})
}


//code to make cards in hand draggable
//this code also deals with events and animations surround card dragging
Array.from(handContainer.children).forEach(elem => dragElement(elem));

function dragElement(elmnt) {
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	elmnt.onmousedown = dragMouseDown;
	let currTop;
	let currLeft;
	let currTransform;

	function dragMouseDown(e) {
		//find and store the existing rotation angle
		currTransform = elmnt.style.transform
		let [firstPart, secondPart, thirdPart] = currTransform.split(' ')
		//construct new transform to normalized rotation angle
		let newTransform = 'rotate(0deg) ' + secondPart + ' ' + thirdPart;
		elmnt.style.transform = newTransform;
		//save current top and left properties for relocation to hand
		currTop = elmnt.style.top
		currLeft = elmnt.style.left

		e = e || window.event;
		e.preventDefault();
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = stopDragging;
		// call a function whenever the cursor moves:
		document.onmousemove = cardDrag;
	}

	function cardDrag(e) {
		//check bounds for collisions
		collideTableCards(e);
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// set the element's new position:
		elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
		elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	}

	function stopDragging() {
		//TODO: validate whatever play has taken place and process it

		//reset scaling of table locations so that none of them stay focused when card gets released
		resetTableCards();

		//reset card position to original position and rotation
		elmnt.style.top = currTop;
		elmnt.style.left = currLeft;
		elmnt.style.transform = currTransform;

		// stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
	}
}

//card movement animations:

//card movement from hand to center piles