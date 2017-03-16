# Blackjack
---
## [Live Demo](http://julies-blackjack.bitballoon.com/)

## What It Is
Simple blackjack game

## Languages used
* HTML
* CSS
* jQuery

## Game Walkthrough
Landing page when user first gets to site. This pop up was created using the jQuery plugin Sweet Alert. The user now knows the table minimum and is aware of how to start betting.
<br>
![alt text](https://github.com/juliemdyer/Blackjack/blob/master/screenshots/start_game.png)

After the player bets and hits deal the initial 4 cards are dealt. The dealer's hole card is hidden. If the player busts, it remains hidden, in all other cases the hole card is flipped. A this point the deal button is inactive, and all the other buttons are activated.
<br>
![alt text](https://github.com/juliemdyer/Blackjack/blob/master/screenshots/deal.png)

If the player busts, they lose the chips they bet and all buttons are inactive. They remain inactive until the player has placed the table minimum bet.
<br>
![alt text](https://github.com/juliemdyer/Blackjack/blob/master/screenshots/player_bust.png)

In this case the dealer has busted so the player gets the chips they bet. Notice that the player has 21 points, but this is not blackjack. If the player had actual blackjack (10 point card and Ace) a message alerting player blackjack appears instead.
<br>
![alt text](https://github.com/juliemdyer/Blackjack/blob/master/screenshots/dealer_bust.png)


If the player chooses to double down a pop up will appear asking how much they'd like to double down. If they try to bet more than their current bet an error will pop up and ask them to enter another amount.
<br>
![alt text](https://github.com/juliemdyer/Blackjack/blob/master/screenshots/double_down.png)

If the player runs out of chips a pop up appears letting them know they've run out of chips and asking if they want to play again. If OK is clicked, a new game starts clearing the board and re-setting their chips to $500.
<br>
![alt text](https://github.com/juliemdyer/Blackjack/blob/master/screenshots/game_over.png)



## Challenges

### Adding mobile responsiveness
There are a lot of buttons in this game so we spent some time figuring out the best way to display everything all in one mobile screen frame. We ended up basically shrinking everything down, with the exception of the betting section which is broken up on to multiple rows.

Player blackjack on mobile version
<br>
![alt text](https://github.com/juliemdyer/Blackjack/blob/master/screenshots/mobile.png)

### Covering all the win and lose scenarios
Our first version of the game we realized we weren't using the correct blackjack rules, so we had to go back and do some research and change our scenarios. On the whiteboard we ran through each deal scenario to make sure all of our if statements were caught at the appropriate point. We ended up turning this into a flow chart which we then implemented in the code.

Flow chart
![alt text](https://github.com/juliemdyer/Portfolio/blob/master/screenshots/flow_chart.png)

Code checking winner / loser / push scenarios. All of this happens during the Dealer's turn
```JavaScript
// if player has busted then game is over
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
```


### Converting code to classes
We first worked on this project in class before we knew about JavaScript objects. Halfway through we were tasked with converting the code into JavaScript objects. As the game got more complicated this actually made things easier. We have classes for Bets, Card, Hand and Deck. Each of these classes has it's own set of methods which makes it very easy to implement functions in the actual game logic.


Deck object which creates a 52 card deck in an array
```JavaScript
function Deck() {
  this.deck = [];
  // Loop over each point value
  for (var points = 1;  points < 14; points++) {
      var suits =['spades','hearts','clubs','diamonds'];
      // Loop over each suit
      for (var suit in suits) {
          // Add each suit as an object to deck array

          this.deck.push(new Card(points, suits[suit]));
      } // End suit for loop
  } // End point for loop
}
```
