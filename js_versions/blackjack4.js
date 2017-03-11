// BET CONSTRUCTOR
function Bets(){
  this.pot = 500;
  this.betAmount = 0;
  $('#bet').text(0);
  $('#pot').text('$' + this.pot);

}
Bets.prototype.updateAmounts = function (){
  $('#bet').text('$' + this.betAmount);
  $('#pot').text('$' + this.pot);
};
Bets.prototype.potAmount = function(){
  return this.pot;
};
Bets.prototype.enableDoubleDown = function () {
  //add code to enable DD button
};
Bets.prototype.disableDoubleDown = function() {
  // add code to disable DD button
};
Bets.prototype.betAmount = function(){
    return this.betAmount;
};
Bets.prototype.disableButtons = function () {
    $('.buttons button').addClass('disabled');
};
Bets.prototype.addBet = function(amount){
    if (this.pot > amount) {
        this.pot = this.pot - amount;
        this.betAmount = this.betAmount + amount;
        this.updateAmounts();
        $('#deal-button').removeClass('disabled');
    }
};
Bets.prototype.winner = function(){
    this.pot += this.betAmount*2;
    this.betAmount = 0;
    this.updateAmounts();
    this.disableButtons();
};
Bets.prototype.loser = function (){
    this.betAmount = 0;
    this.updateAmounts();
    this.disableButtons();
};
Bets.prototype.push = function (){
    this.pot += this.betAmount;
    this.betAmount = 0;
    this.updateAmounts();
    this.disableButtons();
};
Bets.prototype.blackJackWinner = function(){
    this.pot += parseInt(this.betAmount*2.5);
    this.betAmount =0;
    this.updateAmounts();
    this.disableButtons();
};



// CARD CONSTRUCTOR
var Card = function(point, suit) {
    this.point = point;
    this.suit = suit;
};
// Get Image Tag method
Card.prototype.getImageTag = function() {
    var sundry = this.point;
    if (this.point === 11) {
        sundry = 'jack';
    } else if (this.point === 12) {
        sundry = 'queen';
    } else if (this.point === 13) {
        sundry = 'king';
    } else if (this.point === 1) {
        sundry = 'ace';
    }
    return '<img src="deck/' + sundry + '_' + this.suit + '.png">';
};


// HAND CONSTRUCTOR
var Hand = function(name) {
    this.hand = [];
    this.name = name;
};
// Add card method
Hand.prototype.addCard = function(card) {
    this.hand.push(card);
};
// CHeck how many cards
Hand.prototype.numCards = function(){
    return this.hand.length;
};
// Flip dealer's hole card
Hand.prototype.flipHoleCard = function() {
    var holeCard = this.hand[0];
    var sundry = holeCard.point;
    if (holeCard.point === 1) {sundry = 'ace';}
    if (holeCard.point === 11) {sundry= 'jack';}
    if (holeCard.point === 12) {sundry = 'queen';}
    if (holeCard.point === 13) {sundry = 'king';}
    var holeCardSrc = 'deck/' + sundry + '_' + holeCard.suit + '.png';
    $('#dealer-hand :first-child').attr('src', holeCardSrc).addClass('hole-card');
};
// Update HTML score
Hand.prototype.updateScore = function() {
    $('#' + this.name + '-label').text(this.name.toUpperCase() + ': ' + this.getPoints());
};
// Get points method
Hand.prototype.getPoints = function() {
    // Get hand sum with Ace counting as 1 point
    var sumCards;
    // Get copy of hand and sort it
    var sortedHand = this.hand.slice(0).sort(function(a, b) {
        return b.point - a.point;
    });
    sumCards = sortedHand.reduce(function(currentSum, card) {
        var tempCardPoint = card.point;
        // If face card - point value is 10
        if (card.point > 10) {
            tempCardPoint = 10;
        }
        if (card.point === 1) {
            if (currentSum + 11 > 21) {
                tempCardPoint = 1;
            } else {
                tempCardPoint = 11;
            }
        }
       return currentSum + tempCardPoint;
    }, 0);
    return sumCards;
};
// Check if hand has blackjack
Hand.prototype.hasBlackjack = function() {
    if (this.getPoints() === 21 && this.numCards() === 2) {
        return true;
    }
};


// DECK CONSTRUCTOR
var Deck = function() {
    this.deck = [];

    // Loop over each point value
    for (var points = 1;  points < 14; points++) {
        var suits =['spades','hearts','clubs','diamonds'];
        // Loop over each suit
        for (var suit in suits) {
            // Add each suit as an object to deck array
            var card = new Card(points, suits[suit]);
            this.deck.push(card);
        } // End suit for loop
    } // End point for loop
};
// Cards remaining function
Deck.prototype.numCardsLeft = function() {
    return this.deck.length;
};
// Draw card method, add to appropraite hand, update HTML
Deck.prototype.draw = function(target) {
    var randomIndex = parseInt(Math.random() * (deck.numCardsLeft()));
    var card = this.deck[randomIndex];
    if (target === 'player') {
        playerHand.addCard(card);
        $('#player-hand').append(card.getImageTag());
    } else if (target === 'dealer') {
        dealerHand.addCard(card);
        $('#dealer-hand').append(card.getImageTag());
    }
    this.deck.splice(randomIndex, 1);
};


// Initiate player hands and bets
var dealerHand = new Hand('dealer');
var playerHand = new Hand('player');
var bets = new Bets();

function deal() {

    // If no card has been dealt yet (beginning of game), make a new deck
    if ( $('#player-hand').children().length === 0 ) {
        deck = new Deck();
    }
    // If card count gets below 10 at time of deal click, use new deck
    if (deck.numCardsLeft() <= 10) {
        deck = new Deck();
    }

    // Remove cards from table, reset player hands
    $('#player-hand').children().remove();
    $('#dealer-hand').children().remove();
    dealerHand = new Hand('dealer');
    playerHand = new Hand('player');

    // Deal 4 cards
    deck.draw('player');
    deck.draw('dealer');
    // Hide dealer's first card
    $('#dealer-hand :first-child').attr('src', 'img/card.png');
    deck.draw('player');
    deck.draw('dealer');

    // Update score for player and clear dealer
    playerHand.updateScore();
    $('#dealer-label').text('DEALER:');

    // Change message to play, disable deal button and enable other buttons
    $('#messages').html("<h2>LET'S PLAY</h2>");
    $('.buttons button').removeClass('disabled');
    $(this).addClass('disabled');

    if (playerHand.getPoints() === 21) {
      dealerTurn();
    }
}


// Player portion, deal card to player and calculate points after that hit
function hit() {
    // If player has less than 21 points, draw a card as player
    if (playerHand.getPoints() < 21) {
        deck.draw('player');
        // Calculate points after player gets new card and update display
        playerHand.updateScore();
    }

    // If player gets 21 or over, disable buttons and start dealer's turn
    if (playerHand.getPoints() >= 21) {
        $('#hit-button').addClass('disabled');
        $('#stand-button').addClass('disabled');
        $('#deal-button').removeClass('disabled');
        dealerTurn();
    }
}


// Start Dealer portion and check winner scenarios
function dealerTurn() {
    var gameOver = false;
    var playerPoints = playerHand.getPoints();
    var dealerPoints = dealerHand.getPoints();

    // if Player busts, game is over, every other time show hole card
    if (playerPoints > 21) {
        gameOver = true;
        $('#messages').html('<h2>PLAYER BUST</h2>');
        bets.loser();
    } else {
        dealerHand.updateScore();
        dealerHand.flipHoleCard();
    }

    // Player and Dealer blackjack scenarios
    if (gameOver === false) {
        if (playerHand.hasBlackjack() && dealerHand.hasBlackjack()){
            gameOver = true;
            $('#messages').html('<h2>PUSH</h2>');
            bets.push();
      } else if (playerHand.hasBlackjack()) {
            gameOver = true;
            $('#messages').html('<h2>PLAYER BLACKJACK</h2>');
            bets.blackJackWinner();
      } else if (dealerHand.hasBlackjack()){
            gameOver = true;
            $('#messages').html('<h2>DEALER BLACKJACK</h2>');
            bets.loser();
        }
    }

    if (gameOver === false) {
        // At this point dealer takes cards until dealer has at least 17 points
        // Update points at every draw
        while (dealerPoints < 17){
            deck.draw('dealer');
            dealerHand.updateScore();
            dealerPoints = dealerHand.getPoints();
        }
        // See if anyone won after each dealer card, if no winner loop again
        if (dealerPoints < playerPoints) {
            $('#messages').html('<h2>PLAYER WINS</h2>');
            bets.winner();
        } else if (dealerPoints > 21) {
            $('#messages').html('<h2>DEALER BUSTS</h2>');
            bets.winner();
        } else if (dealerPoints === playerPoints) {
            $('#messages').html('<h2>PUSH</h2>');
            bets.push();
        } else if (dealerPoints > playerPoints) {
            $('#messages').html('<h2>DEALER WINS</h2>');
            bets.loser();
        }
    }

}


$(function () {

    // Button click event handlers
    $('#deal-button').click(deal);
    $('#hit-button').click(hit);
    $('#stand-button').click(dealerTurn);

    $('#five').click(function() {bets.addBet(5);});
    $('#ten').click(function() {bets.addBet(10);});
    $('#fifteen').click(function() {bets.addBet(15);});
    $('#fifty').click(function() {bets.addBet(50);});

}); // End DOM Ready
