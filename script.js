let setData = {
	deck: [],
	currentDeck: [],
	clickCount: 0,
	hand: [],
	classes: {
		counts: [],
		shape: [],
		color: [],
		pattern: []
	},
	setCount: 0
}
document.addEventListener("DOMContentLoaded", function(e) {
	setupDesign();
	generateDeck();
});



function generateDeck(){
	for(let c=0; c<3; c++){
		for(let i=0; i<3; i++){
			let shapeClass = `shape${i+1}`;
			for(let j=0; j<3; j++){
				let colorClass = `color${j+1}`;	
				for(let k=0; k<3; k++){
					let patternClass = `pattern${k+1}`;	
					setData.deck.push([c, shapeClass, colorClass, patternClass]);	
				}			
			}
		}
	}
	setData.currentDeck = JSON.parse(JSON.stringify(setData.deck)); 
	setupCards( 12 );
}

function setupDesign( ){
	let designCards = document.querySelectorAll('#components .card');
	designCards.forEach( card =>{
		handleCardFlip( card );
	});
}

function setupCards( count ){
	const board = document.getElementById('board');
	// Get 12 random cards from the deck and remove them
	const randomCards = getCards(setData.currentDeck, count);

	randomCards.forEach( card =>{
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
			cardHTML += `<figure class="${card[1]} ${card[2]} ${card[3]}"></figure>`;
		}
		cardHTML += `</div>`;
		newCard.innerHTML = cardHTML;
		handleCardFlip( newCard );
		handleCardClick( newCard );
		board.appendChild( newCard );
	});
}


function getRandomIndex(max) {
    return Math.floor(Math.random() * max);
}

// Function to get and remove random cards from the deck
function getCards(deck, count) {
    const randomCards = [];

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

// EVENT LISTENERS

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
		card.classList.add('selected');
		if( setData.clickCount < 3 ){
			setData.clickCount++;
			setData.hand.push( card );
		}else{
			//reset selection
			setData.clickCount = 0;
			let selection = document.querySelectorAll('.selected');
			selection.forEach( selection =>{
				selection.classList.remove('selected');
			});
			setData.hand = [];
		}
		if( setData.clickCount == 3){
			checkCards( setData.hand );
		}
	});
}

// GAME LOGIC
function checkCards( elements ){
	// Use the Set data structure to store unique classes
	let counts = [];
	setData.classes.counts = [];
	setData.classes.shape = [];
	setData.classes.color = [];
	setData.classes.pattern = [];

	//collect classes
	elements.forEach( el=>{
		let figures = el.querySelectorAll('figure');
		setData.classes.counts.push( figures.length ); //count of shapes
		let figure = figures[0];
		setData.classes.shape.push( figure.classList[0] );
		setData.classes.color.push( figure.classList[1] );
		setData.classes.pattern.push( figure.classList[2] );
	});

	let checkResult = true;
	//check matches
	for ( const className in setData.classes ){
		let classList = setData.classes[className];
		if ( areAllSame( classList ) || areAllDifferent ( classList) ){
			console.log( className, 'is a SET');
		}else{
			checkResult = false;
			console.log( classList, 'is not a SET');
		}
	}

	if( checkResult ){
		console.log('we have a SET!');
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

function clearCards(elements){
	const delay = 800;
	//clears cards from board and
	//adds new cards
	elements.forEach( el=>{
		el.remove();
	});
	// fill in with new cards after delay;
	setTimeout( ()=>{ setupCards(3) }, delay);
}


function createStyle(){
	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = '.cssClass { color: #f00; }';
	document.getElementsByTagName('head')[0].appendChild(style);
}