let setData = {
	board: "",
	deck: [],
	currentDeck: [],
	clickCount: 0,
	hand: [],
	classes: {
		counts: [],
		habitat: [],
		size: [],
		stage: []
	},
	setCount: 0
}

document.addEventListener("DOMContentLoaded", function(e) {
	setData.board = document.getElementById('board');
	generateDeck();
	generateBoard();
});



function generateDeck(){
	for(let c=0; c<3; c++){
		for(let i=0; i<3; i++){
			let habitatClass = `habitat${i+1}`;
			for(let j=0; j<3; j++){
				let sizeClass = `size${j+1}`;	
				for(let k=0; k<3; k++){
					let stageClass = `stage${k+1}`;	
					setData.deck.push([c, habitatClass, sizeClass, stageClass]);	
				}			
			}
		}
	}
	setData.currentDeck = JSON.parse(JSON.stringify(setData.deck)); 
	const deck = document.getElementById('deck');
	setupCards( deck, setData.currentDeck, true );
}

function generateBoard(){
	// Get 12 random cards from the deck and remove them
	const randomCards = getCards(12);
	setupCards( setData.board, randomCards );
}

function setupCards( container, cards, setup = false ){
	
	cards.forEach( card =>{
		const newCard = document.createElement("div");
		newCard.classList.add('card');
		cardHTML = `
			<div class="back">
			  <div class="classlist">
			  	<div class="classname">.${card[1]}</div>
			  	<div class="classname">.${card[2]}</div>
			  	<div class="classname">.${card[3]}</div>
			  </div>
			</div>
			<div class="item">`;

		for( let j = 0; j < card[0]+1; j++){
			cardHTML += `<figure class="${card[1]} ${card[2]} ${card[3]}"><img src="img/${card[1]}_${card[2]}_${card[3]}.gif" class="img-card"></figure>`;
		}
		cardHTML += `</div>`;
		newCard.innerHTML = cardHTML;
		handleCardFlip( newCard );
		if( !setup ){
			handleCardClick( newCard );
		}
		container.appendChild( newCard );
	});
}

function getRandomIndex(max) {
    return Math.floor(Math.random() * max);
}

function getCards(count) {
    const randomCards = [];
    let deck = setData.currentDeck;
    for (let i = 0; i < count; i++) {
        if (deck.length === 0) {
            console.log("No more cards in the deck.");
            break;
        }

        const randomIndex = getRandomIndex(deck.length);
        const randomCard = deck.splice(randomIndex, 1)[0];
        randomCards.push(randomCard);
    }

    return randomCards;
}


function handleCardFlip( card ){
	card.addEventListener('mouseover', function (e) {
		card.setAttribute('data-flipped', "");		
	});
	card.addEventListener('mouseleave', function(e){
		card.removeAttribute('data-flipped');		
	});
}

function handleCardClick( card ){

	card.addEventListener('click', function (e) {
		if( card.classList.contains('selected')){
			resetSelection();
		}else{
			card.classList.add('selected');
			if( setData.clickCount < 3 ){
				setData.clickCount++;
				setData.hand.push( card );
				if( setData.clickCount == 3 ){
					checkCards( setData.hand );
				}
			}else{
				//reset selection
				resetSelection();
			}
		}
	});
}

// GAME LOGIC
function resetSelection(){
	setData.clickCount = 0;
	let selection = document.querySelectorAll('.selected');
	selection.forEach( selection =>{
		selection.classList.remove('selected');
	});
	setData.hand = [];

	//clear message after delay
	setTimeout(function(){
		document.getElementById('message').innerText = "";
	}, 2000);
}
function checkCards( elements ){
	// Use the Set data structure to store unique classes
	let counts = [];
	setData.classes.counts = [];
	setData.classes.habitat = [];
	setData.classes.size = [];
	setData.classes.stage = [];

	//collect classes
	elements.forEach( el=>{
		let figures = el.querySelectorAll('figure');
		setData.classes.counts.push( figures.length ); //count of habitats
		let figure = figures[0];
		setData.classes.habitat.push( figure.classList[0] );
		setData.classes.size.push( figure.classList[1] );
		setData.classes.stage.push( figure.classList[2] );
	});

	let checkResult = false;
	//check matches
	for ( const className in setData.classes ){
		let classList = setData.classes[className];
		console.log(classList);
		if ( areAllSame( classList ) || areAllDifferent ( classList) ){
			console.log( className, 'is a SET');
			checkResult = true;
		}else{
			checkResult = false;
			displayMessage( className + ': ' + classList + ' is not a SET');
			resetSelection();
			break;
		}
	}

	if( checkResult ){
		displayMessage('We have a set!');
		setData.setCount++;
		document.getElementById('setcount').innerText = setData.setCount;
		// clear cardsb
		clearCards( elements );
	}
	return checkResult;	
}

function areAllSame(classes) {
    const uniqueClasses = new Set(classes);   
    // If there's only one unique class, they are all the same
    return uniqueClasses.size === 1;
}

function areAllDifferent(classes) {
    const uniqueClasses = new Set(classes);   
    // If the number of unique classes is the same as the total number of classes, they are all different
    return uniqueClasses.size === classes.length;
}

function displayMessage(text){
	const messageContainer = document.getElementById('message');
	messageContainer.innerText = text;
}
function clearCards(elements){
	const delay = 800;
	//clears cards from board and
	//adds new cards
	setTimeout( function(){
		elements.forEach( el=>{
			el.remove();
		}); }, delay);

	
	// fill in with new cards after delay;
	let newCards = getCards(3);

	setTimeout( ()=>{ setupCards( setData.board, newCards) }, delay);
}
