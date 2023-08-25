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
	generateDeck();
});



function generateDeck(){
	for(let c=0; c<3; c++){
		for(let i=0; i<3; i++){
			let shapeClass = `habitat${i+1}`;
			for(let j=0; j<3; j++){
				let colorClass = `size${j+1}`;	
				for(let k=0; k<3; k++){
					let patternClass = `stage${k+1}`;	
					setData.deck.push([c, shapeClass, colorClass, patternClass]);	
				}			
			}
		}
	}
	setData.currentDeck = JSON.parse(JSON.stringify(setData.deck)); 
	setupCards( )
}

function setupCards( ){
	const deck = document.getElementById('deck');
	// Get 12 random cards from the deck and remove them
	// const randomCards = getCards(setData.currentDeck, count);

	setData.currentDeck.forEach( card =>{
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
			cardHTML += `<figure><img src="img/${card[1]}_${card[2]}_${card[3]}.gif" class="img-card"></figure>`;
		}
		cardHTML += `</div>`;
		newCard.innerHTML = cardHTML;
		// handleCardFlip( newCard );
		// handleCardClick( newCard );
		deck.appendChild( newCard );
	});
}

function getRandomIndex(max) {
    return Math.floor(Math.random() * max);
}

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


function handleCardFlip( card ){
	card.addEventListener('mouseover', function (e) {
		card.setAttribute('data-flipped', "");		
	});
	card.addEventListener('mouseleave', function(e){
		card.removeAttribute('data-flipped');		
	});
}