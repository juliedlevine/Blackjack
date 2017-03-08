$(function () {

var deck;
var dealerHand = [];
var playerHand = [];

function getCardImageTag(card){
    var sundry = card.point;
    if (card.point ===1){sundry = 'ace';}
    if (card.point ===11){sundry= 'jack';}
    if (card.point ===12){sundry = 'queen';}
    if (card.point ===13){sundryt = 'king';}
    return '<img src="deck/' + sundry + '_' + card.suit + '.png">';
}

function calculatePoints(cards) {
    console.log(cards);
    // Get hand sum withAce counting as 1 point
    var sumAces1 = cards.reduce(function(currentSum, card) {
        // If face card - point value is 10
        if (card.point > 10) {
            card.point = 10;
        }
       return currentSum + card.point;
    }, 0);

    // Get hand sum with Ace couting as 11 points
    var sumAces11 = cards.reduce(function(currentSum, card) {
        // If face card - point value is 10
        if (card.point > 10){
            card.point = 10;
       }
       // If Ace, point value is 1 (this time)
        if (card.point === 1){
            card.point = 11;
        }
        return currentSum + card.point;
     }, 0);

    // If using Ace as 11 points goes over 21, use Ace as 1 point
    if (sumAces11 > 21) {
        console.log(sumAces1);
        return sumAces1;
    } else {
        console.log(sumAces11);
        return sumAces11;
    }
}

function dealCard(target) {
    var cardDealt;
    var cardToPlay;
    if (deck.length === 0) {
        console.log('End of deck... Do something');
    } else {
        var randomIndex = parseInt(Math.random() * (deck.length));
        cardDealt = deck[randomIndex];

        if (target === 'player') {
            playerHand.push(cardDealt);
            cardToPlay = getCardImageTag(cardDealt);
            $('#player-hand').append(cardToPlay);
        } else {
            dealerHand.push(cardDealt);
            cardToPlay = getCardImageTag(cardDealt);
            $('#dealer-hand').append(cardToPlay);
        }

        deck.splice(randomIndex, 1);
    }

}

function deal() {
    // If no card has been dealt yet, make a new deck
    if ( $('#player-hand').children().length === 0 ) {
        deck = newDeck();
    }

    dealCard('player');
    dealCard('dealer');
    dealCard('player');
    dealCard('dealer');

}

function hit(){

    if (calculatePoints(playerHand) < 21) {
        console.log('Julie was here');
        dealCard('player');

        console.log(calculatePoints(playerHand));
    } else {

    }
}

function newDeck() {
    var deck = [];

    // Loop over each point value
    for (var points = 1;  points < 14; points++) {
        var suits =['spades','hearts','clubs','diamonds'];
        // Loop over each suit
        for (var suit in suits) {
            // Add each suit as an object to deck array
            deck.push({
                'point': points,
                'suit': suits[suit]
            });

        } // End suit for loop

    } // End point for loop
    return deck;
}


    $('#deal-button').click(deal);
    $('#hit-button').click(hit);
});
