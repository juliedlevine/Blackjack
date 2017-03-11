var deck;
var dealerHand = [];
var playerHand = [];


// Generate a deck, returns deck as array of card objects
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


// Initial deal, deals 2 cards to player, 2 to dealer
function deal() {

    // If no card has been dealt yet, make a new deck
    if ( $('#player-hand').children().length === 0 ) {
        deck = newDeck();
    }

    // If card count gets below 10 at time of deal click, use new deck
    if (deck.length <= 10) {
        deck = newDeck();
    }

    // Remove cards from table, reset player hands
    $('#player-hand').children().remove();
    $('#dealer-hand').children().remove();
    dealerHand = [];
    playerHand = [];

    // Deal 4 cards
    dealCard('player');
    dealCard('dealer');

    $('#dealer-hand :first-child').attr('src', 'img/card.png');
    dealCard('player');
    dealCard('dealer');

    // Update score for player and clear dealer
    updatePlayerScore();
    $('#dealer-label').text('DEALER:');

    // Change message to play, disable deal button and enable other buttons
    $('#messages').html("<h2>LET'S PLAY</h2>");
    $(this).addClass('disabled');
    $('#hit-button').removeClass('disabled');
    $('#stand-button').removeClass('disabled');

    if (calculatePoints(playerHand) === 21) {
        dealerTurn();
    }
}


// Pass in card object (comes from dealCard function) and return image HTML
function getCardImageTag(card){
    var sundry = card.point;

    if (card.point === 1) {sundry = 'ace';}
    if (card.point === 11) {sundry= 'jack';}
    if (card.point === 12) {sundry = 'queen';}
    if (card.point === 13) {sundry = 'king';}
    return '<img src="deck/' + sundry + '_' + card.suit + '.png">';
}


function flipHoleCard() {
    var holeCard = dealerHand[0];
    var sundry = holeCard.point;
    if (holeCard.point === 1) {sundry = 'ace';}
    if (holeCard.point === 11) {sundry= 'jack';}
    if (holeCard.point === 12) {sundry = 'queen';}
    if (holeCard.point === 13) {sundry = 'king';}

    var holeCardSrc = 'deck/' + sundry + '_' + holeCard.suit + '.png';

    $('#dealer-hand :first-child').attr('src', holeCardSrc);
}


// Deal card, target is either Player or Dealer (string)
// Adds card to target's hand, updates HTML, and removes card from deck
function dealCard(target) {
    var cardObject;
    var cardToPlay;

    if (deck.length === 0) {
        console.log('End of deck... Do something');

    } else {
        // Get random number from 1 to length of current deck
        var randomIndex = parseInt(Math.random() * (deck.length));
        // Get card object from deck at random index from line above
        cardObject = deck[randomIndex];

        if (target === 'player') {
            playerHand.push(cardObject);
            // Change card object into HTML tag and add to page
            cardToPlay = getCardImageTag(cardObject);
            $('#player-hand').append(cardToPlay);
        } else {
            dealerHand.push(cardObject);
            // Change card object into HTML tag and add to page
            cardToPlay = getCardImageTag(cardObject);
            $('#dealer-hand').append(cardToPlay);
        }
        // Remove card object from random index location
        deck.splice(randomIndex, 1);
    }
}


// Pass in either Dealer or Player hand (array), returns points of hand
function calculatePoints(hand) {
    // Get hand sum with Ace counting as 1 point
    var sumAces1 = hand.reduce(function(currentSum, card) {
        var tempCardPoint = card.point;
        // If face card - point value is 10
        if (card.point > 10) {
            tempCardPoint = 10;
        }
       return currentSum + tempCardPoint;
    }, 0);

    // Get hand sum with Ace couting as 11 points
    var sumAces11 = hand.reduce(function(currentSum, card) {
        var tempCardPoint = card.point;
        // If face card - point value is 10
        if (card.point > 10) {
            tempCardPoint = 10;
       }
       // If Ace, point value is 1 (this time)
        if (card.point === 1) {
            tempCardPoint = 11;
        }
        return currentSum + tempCardPoint;
     }, 0);

    // If using Ace as 11 points goes over 21, use Ace as 1 point
    if (sumAces11 > 21) {
        return sumAces1;
    } else {
        return sumAces11;
    }
}


// Player portion, deal card to player and calculate points after that hit
function hit() {
    // If player has less than 21 points, deal a card as player
    if (calculatePoints(playerHand) < 21) {
        dealCard('player');
        // Calculate points after player gets new card and update display
        updatePlayerScore();
        // If player has busted, update message and disable hit and stand buttons
    }
    if (calculatePoints(playerHand) > 21) {
        $('#messages').html('<h2>PLAYER BUST</h2>');
        $('#hit-button').addClass('disabled');
        $('#stand-button').addClass('disabled');
        $('#deal-button').removeClass('disabled');
    }

    if (calculatePoints(playerHand) === 21) {

        if (calculatePoints(playerHand) === 21 && playerHand.length === 2) {
            $('#messages').html('<h2>BLACKJACK, PLAYER WINS!</h2>');
        } else if (calculatePoints(playerHand) === calculatePoints(dealerHand)) {
            $('#messages').html('<h2>PUSH</h2>');
        }
        } else {
            $('#messages').html('<h2>PLAYER WINS</h2>');
        }
        $('#hit-button').addClass('disabled');
        $('#stand-button').addClass('disabled');
        $('#deal-button').removeClass('disabled');
    }

}

// Start Dealer portion and check winner scenarios
function dealerTurn() {
    var gameOver = false;
    var currentDealerPoints;
    var currentPlayerPoints = calculatePoints(playerHand);

    flipHoleCard();

    // Keep dealing cards to dealer until game Over
    while (gameOver === false) {
        currentDealerPoints = calculatePoints(dealerHand);
        // If delaer has less than 17 points, deal dealer another card
        if (currentDealerPoints < 17) {
            dealCard('dealer');
            // Calculate points after player gets new card and update display
            updatePlayerScore();
        } else {
            gameOver = true;
        }
    }

    // Dealer has more points than player, dealer wins
    if (currentDealerPoints > currentPlayerPoints) {
        // Dealer has blackjack
        if (currentDealerPoints === 21 && dealerHand.length === 2) {
            $('#messages').html('<h2>BLACKJACK, DEALER WINS!</h2>');
        // Has dealer busted
        } else if (currentDealerPoints > 21 ) {
            if (currentPlayerPoints === 21) {
                $('#messages').html('<h2>BLACKJACK, PLAYER WINS!</h2>');
            } else {
                $('#messages').html('<h2>DEALER BUST</h2>');
            }
        // Dealer hasn't busted, so dealer wins
        } else {
            $('#messages').html('<h2>DEALER WINS</h2>');
        }
    }

    // Player has more points than dealer, player wins
    if (currentPlayerPoints > currentDealerPoints ){
        // Player has blackjack
        if (currentPlayerPoints === 21 && playerHand.length === 2){
            $('#messages').html('<h2>BLACKJACK, PLAYER WINS!</h2>');
        // Has player busted?
        } else if (currentPlayerPoints > 21 ) {
            $('#messages').html('<h2>PLAYER BUST</h2>');
        // Else just regular winner
        } else {
            $('#messages').html('<h2>PLAYER WINS</h2>');
        }
    }

    // Check for Push
    if (currentDealerPoints === currentPlayerPoints){
        $('#messages').html('<h2>PUSH</h2>');
    }

    // Make deal button only active button
    $('#deal-button').removeClass('disabled');
    $('#hit-button').addClass('disabled');
    $('#stand-button').addClass('disabled');

    updateDealerScore();
}

// Changes score display
function updatePlayerScore() {
    var playerPoints = calculatePoints(playerHand);
    $('#player-label').text('PLAYER: ' + playerPoints);
}

function updateDealerScore() {
    var dealerPoints = calculatePoints(dealerHand);
    $('#dealer-label').text('DEALER: ' + dealerPoints);
}

$(function () {

    // Button click event handlers
    $('#deal-button').click(deal);
    $('#hit-button').click(hit);
    $('#stand-button').click(dealerTurn);


}); // End DOM Ready

// Step 0 - Calculate does player have 2 card blackjack
// Step 1 - Check if player score is > 21, game over
// Step 2 - Check if both players have blackjack (push)
// Step 3 - Check if dealer score > 16 and dealer score > player score, dealer has won - check 2 card blackack
// Step 3.5 - Dealer score > 16 && dealer score === player score (push)
// Step 4 - (while loop) Check if dealer score <= player score && dealer score < 17
    // At each iteration, if dealer score > 21, game over
    // If dealer score > player score, dealer wins, game over
    // if dealer score equal to player socre, game over and push
// Step 5 - Check if dealer score is greater than player score, game overs
