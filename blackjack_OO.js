var deck;
var dealerHand = [];
var playerHand = [];
var bets = new Bets();
var currentHand;

function Bets(){
  this.pot = 500;
  this.bet =0;
  $('#bet').text(0);
  $('#pot').text('$' + this.pot);

}

Bets.prototype.updateAmounts = function (){
  $('#bet').text('$' + this.bet);
  $('#pot').text('$' + this.pot);
};

Bets.prototype.potAmount = function(){
  return this.pot;

};

Bets.prototype.enableDoubleDown = function () {
  $('#doubledown').removeClass('disabled');

};

Bets.prototype.disableDoubleDown = function() {
  $('#doubledown').removeClass('disabled');
};

Bets.prototype.doubleDown = function() {
  this.pot -= this.bet;
  this.bet += this.bet;
};

Bets.prototype.betAmount = function(){
  return this.bet;

};
Bets.prototype.disableDeal = function () {
  $('#deal-button').addClass('disabled');

};

Bets.prototype.addBet = function(amount){

    if (this.pot >= amount) {
      this.pot = this.pot - amount;
      this.bet = this.bet + amount;
      this.updateAmounts();
      $('#deal-button').removeClass('disabled');
    } else {
      notEnoughChips();
    }
};


Bets.prototype.winner = function(){
    this.pot += this.bet*2;
    this.bet = 0;
    this.updateAmounts();
    this.disableDeal();
};

Bets.prototype.loser = function (){
  this.bet = 0;
  this.updateAmounts();
  this.disableDeal();
};

Bets.prototype.push = function (){
  this.pot += this.bet;
  this.bet = 0;
  this.updateAmounts();
  this.disableDeal();
};

Bets.prototype.blackJackWinner = function(){
    this.pot += parseInt(this.bet*2.5);
    this.bet =0;
    this.updateAmounts();
    this.disableDeal();
};

Bets.prototype.updateOptions = function(){
  if (playerHand.numCards()===2){
    $('#doubledown').removeClass('disabled');
  } else {
    $('#doubledown').removeClass('disabled');
  }

};


//              Card Ojbect

function Card(value,suit){this.point = value; this.suit = suit;}

Card.prototype.getImageUrl = function(){
  var sundry = this.point;

  if (this.point === 1)  {sundry = 'ace';}
  if (this.point === 11) {sundry= 'jack';}
  if (this.point === 12) {sundry = 'queen';}
  if (this.point === 13) {sundry = 'king';}

  // return 'images/' + sundry + "_" + this.suit + ".png";
  return '<img src="deck/' + sundry + '_' + this.suit + '.png">';
};
//      Hands Object
function Hands() {
  this.hands = [];

}

Hands.prototype.addHand = function(hand) {
  this.hands.push(hand);

};
//            Hand Object

function Hand() {
  this.hand =[];
  this.doubledown = false;
}

Hand.prototype.addCard = function(card){
  this.hand.push(card);

};

Hand.prototype.secondCardAce = function(){
  return (this.hand[1].point === 1);

};

Hand.prototype.hasBlackJack = function(){
  return (this.hand.length === 2 && this.getPoints() === 21);
};


Hand.prototype.numCards = function(){
  return this.hand.length;

};

Hand.prototype.firstCard = function(){
  return this.hand[0];

};

Hand.prototype.doubleDown = function(){
  this.doubleDown = true;
};

Hand.prototype.getPoints = function(){
  var sumCards;
  var sortedHand = this.hand.slice(0).sort(function(a,b){return b.point - a.point;});
  sumCards = sortedHand.reduce(function(currentSum, card) {
      var tempCardPoint = card.point;
      // If face card - point value is 10
      if (card.point > 10) {
          tempCardPoint = 10;
      }
      if (card.point === 1){
        if (currentSum + 11 > 21){
          tempCardPoint = 1;
        } else {
          tempCardPoint = 11;
        }
      }
     return currentSum + tempCardPoint;
  }, 0);
  return sumCards;
};
//                Deck Object
function Deck() {
  this.deck = [];
  // Loop over each point value
  for (var points = 1;  points < 14; points++) {
      var suits =['spades','hearts','clubs','diamonds'];
      // Loop over each suit
      for (var suit in suits) {
          // Add each suit as an object to deck array

          this.deck.push(new Card(points,suits[suit]));
      } // End suit for loop
  } // End point for loop
}

Deck.prototype.draw = function(target) {
  var cardObject;

  // Get random number from 1 to length of current deck
  var randomIndex = parseInt(Math.random() * (this.deck.length));
  // Get card object from deck at random index from line above
  cardObject = this.deck[randomIndex];

  if (target === 'player') {
      playerHand.addCard(cardObject);
      // Change card object into HTML tag and add to page
      // cardToPlay = getCardImageTag(cardObject);
      cardToPlay = cardObject.getImageUrl();
      $('#player-hand').append(cardToPlay);
  } else {
      dealerHand.addCard(cardObject);
      // Change card object into HTML tag and add to page
      cardToPlay = cardObject.getImageUrl();
      $('#dealer-hand').append(cardToPlay);
  }
    // Remove card object from random index location
    this.deck.splice(randomIndex, 1);

  return cardObject;
};


Deck.prototype.numCardsLeft = function() {
  return this.deck.length;

};

// Initial deal, deals 2 cards to player, 2 to dealer
function deal() {

    // If no card has been dealt yet, make a new deck
    if ( $('#player-hand').children().length === 0 ) {
        deck = new Deck();
    }

    // If card count gets below 16 at time of deal click, use new deck
    if (deck.numCardsLeft() <= 16) {
        deck = new Deck();
    }

    // Remove cards from table, reset player hands
    $('#player-hand').children().remove();
    $('#dealer-hand').children().remove();
    dealerHand = new Hand();
    playerHand = new Hand();

    // Deal 4 cards
    deck.draw('player');
    deck.draw('dealer');
    $('#dealer-hand :first-child').attr('src', 'img/card.png');
    deck.draw('player');
    deck.draw('dealer');

    // Update score for player and clear dealer
    updatePlayerScore();
    $('#dealer-label').text('DEALER:');

    // Change message to play, disable deal button and enable other buttons
    $('#messages').html("<h2>LET'S PLAY</h2>");
    $('#deal-button').addClass('disabled');
    $('#hit-button').removeClass('disabled');
    $('#stand-button').removeClass('disabled');

    if (bets.potAmount() >= bets.betAmount()){
      $('#doubledown').removeClass('disabled');
    }

    if (playerHand.hasBlackJack()) {
      dealerTurn();
    }

    if(dealerHand.secondCardAce()){
      $('#insurance').removeClass('disabled');
    }

}

function flipHoleCard() {
    var holeCard = dealerHand.firstCard();
    var sundry = holeCard.point;
    if (holeCard.point === 1) {sundry = 'ace';}
    if (holeCard.point === 11) {sundry= 'jack';}
    if (holeCard.point === 12) {sundry = 'queen';}
    if (holeCard.point === 13) {sundry = 'king';}

    var holeCardSrc = 'deck/' + sundry + '_' + holeCard.suit + '.png';

    $('#dealer-hand :first-child').attr('src', holeCardSrc);
}

function doubleDown(){
  playerHand.doubleDown();
  deck.draw('player');
  bets.doubleDown();
  updatePlayerScore();
  dealerTurn();
}

// Player portion, deal card to player and calculate points after that hit
function hit() {
    $('#doubledown').addClass('disabled');
    //  Deal a card as player

    deck.draw('player');
    updatePlayerScore();

    if (playerHand.getPoints() >= 21) {
        $('#hit-button').addClass('disabled');
        $('#stand-button').addClass('disabled');
        // $('#deal-button').removeClass('disabled');
        dealerTurn();
    }

}

// Start Dealer portion and check winner scenarios
function dealerTurn() {
    var gameOver = false;
    var revealHoleCard = true;
    var playerPoints = playerHand.getPoints();
    var dealerPoints = dealerHand.getPoints();
    var playerHasBlackJack = playerHand.hasBlackJack();
    var dealerHasBlackJack = dealerHand.hasBlackJack();

    $('#doubledown').addClass('disabled');
    // if (playerPoints > 21 then game is over) {
    if (playerPoints > 21) {
        revealHoleCard = false;
        gameOver = true;
        $('#messages').html('<h2>PLAYER BUST</h2>');
        bets.loser();
    } else {
      flipHoleCard();
    }

    if (gameOver === false){
    // Player and Dealer blackjack scenarios
        if (playerHasBlackJack && dealerHasBlackJack){
          gameOver = true;
          $('#messages').html('<h2>PUSH</h2>');
          bets.push();
        } else if (playerHasBlackJack) {
          gameOver = true;
          $('#messages').html('<h2>PLAYER BLACKJACK</h2>');
          bets.blackJackWinner();
        } else if (dealerHasBlackJack){
          gameOver = true;
          $('#messages').html('<h2>DEALER BLACKJACK</h2>');
          bets.loser();
        }
    }


    if (gameOver === false){
        // At this point dealer takes cards until dealers has at least 17 points
        while (dealerPoints < 17){
          // dealCard('dealer');
          deck.draw('dealer');
          dealerPoints = dealerHand.getPoints();
        }
        // Now see who won
        if (dealerPoints < playerPoints) {
          $('#messages').html('<h2>PLAYER WINS</h2>');
          bets.winner();
        } else if (dealerPoints > 21) {
          $('#messages').html('<h2>DEALER BUSTS</h2>');
          bets.winner();
        } else if (dealerPoints === playerPoints) {
          $('#messages').html('<h2>PUSH</h2>');
          bets.push();
        } else {
          $('#messages').html('<h2>DEALER WINS</h2>');
          bets.loser();
        }
    }

    // Make deal button only active button
    // $('#deal-button').removeClass('disabled');
    $('#hit-button').addClass('disabled');
    $('#stand-button').addClass('disabled');

    // If Player went bust then don't reveal hole card
    if (revealHoleCard === true){
      updateDealerScore();
    }
    if (bets.potAmount() <= 5){
      outOfChips();
    }
}

// Changes score display
function updatePlayerScore() {
    // var playerPoints = calculatePoints(playerHand);
    var playerPoints = playerHand.getPoints();
    $('#player-label').text('PLAYER: ' + playerPoints);
}

function updateDealerScore() {
    // var dealerPoints = calculatePoints(dealerHand);
    var dealerPoints = dealerHand.getPoints();
    $('#dealer-label').text('DEALER: ' + dealerPoints);
}

function outOfChips(){
    swal({
      title: "You're Out of Chips!",
      text: "That's too bad. \n Do you want to play again?",
      imageUrl: "img/chip-2.png"
    },
      function(isConfirm){
        if (isConfirm) {
          bets = new Bets();
        }
    });
}

function notEnoughChips(){
    swal({
      title: "Insufficient Chips!",
      text: "You don't have enough chips for that.",
      imageUrl: "img/chip-2.png"
    });
}

function welcome() {
  swal({
    title: "Welcome to Blackjack!",
    text: "Table minimum is $5. Click any of the chips to start betting. \n Ready to play?",
    imageUrl: "img/chip.png"
  });
}

$(function () {

    // Button click event handlers
    $('#deal-button').click(deal);
    $('#deal-button').addClass('disabled');
    $('#hit-button').click(hit);

    $('#stand-button').click(dealerTurn);

    $('#five').click(function() {bets.addBet(5);});
    $('#ten').click(function() {bets.addBet(10);});
    $('#fifteen').click(function() {bets.addBet(15);});
    $('#fifty').click(function() {bets.addBet(50);});
    $('#doubledown').click(doubleDown);
    welcome();



}); // End DOM Ready
