describe('getCardImageUrl', function () {
  it('works for aces', function () {
    expect(getCardImageUrl({ point: 1, suit: 'diamonds' }))
      .toEqual('images/ace_of_diamonds.png');
  });

  it('works for 2 - 10', function () {
    for (var i = 2; i <= 10; i++) {
      expect(getCardImageUrl({ point: i, suit: 'diamonds' }))
        .toEqual('images/' + i + '_of_diamonds.png');
    }
  });

  it('works for jack, queen, and king', function () {
    expect(getCardImageUrl({ point: 11, suit: 'diamonds' }))
      .toEqual('images/jack_of_diamonds.png');
    expect(getCardImageUrl({ point: 12, suit: 'diamonds' }))
        .toEqual('images/queen_of_diamonds.png');
    expect(getCardImageUrl({ point: 13, suit: 'diamonds' }))
          .toEqual('images/king_of_diamonds.png');
  });
  
  it('should work for different suit', function() {
    expect(getCardImageUrl({ point: 1, suit: 'clubs' }))
      .toEqual('images/ace_of_clubs.png');
    expect(getCardImageUrl({ point: 1, suit: 'spades' }))
      .toEqual('images/ace_of_spades.png');
    expect(getCardImageUrl({ point: 1, suit: 'hearts' }))
      .toEqual('images/ace_of_hearts.png');
  });
});

describe('calculatePoints', function () {
  it('adds face values for 2-9', function () {
    var cards = [{ point: 2, suit: 'diamonds' }];
    expect(calculatePoints(cards)).toEqual(2);
    cards = [{ point: 9, suit: 'diamonds' }];
    expect(calculatePoints(cards)).toEqual(9);
    cards = [
      { point: 2, suit: 'diamonds' },
      { point: 9, suit: 'diamonds' }
    ];
    expect(calculatePoints(cards)).toEqual(11);
  });

  it('values 10, Jack, Queen and King at 10 points', function () {
    expect(calculatePoints([{ point: 10, suit: 'diamonds'} ])).toEqual(10);
    expect(calculatePoints([{ point: 11, suit: 'diamonds'} ])).toEqual(10);
    expect(calculatePoints([{ point: 12, suit: 'diamonds'} ])).toEqual(10);
    expect(calculatePoints([{ point: 13, suit: 'diamonds'} ])).toEqual(10);
  });

  it('picks 1 or 11 for Ace depending if it busts', function () {
    expect(calculatePoints([
      { point: 10, suit: 'diamonds' },
      { point: 1, suit: 'diamonds' }
    ])).toEqual(21);
    expect(calculatePoints([
      { point: 2, suit: 'diamonds' },
      { point: 10, suit: 'diamonds' },
      { point: 1, suit: 'diamonds' }
    ])).toEqual(13);
    expect(calculatePoints([
      { point: 1, suit: 'diamonds' },
      { point: 2, suit: 'diamonds' },
      { point: 10, suit: 'diamonds' }
    ])).toEqual(13);
    expect(calculatePoints([
      { point: 8, suit: 'diamonds' },
      { point: 1, suit: 'hearts' },
      { point: 1, suit: 'diamonds' },
      { point: 8, suit: 'diamonds' }
    ])).toEqual(18);

  });

});

describe('newDeck', function () {
  it('has all the cards', function () {
    var deck = newDeck();
    expect(deck.length).toEqual(52);
    var stringRepresentation = deck.map(function(card) {
      return card.point + ' of ' + card.suit;
    }).join(',');
    expect(stringRepresentation).toEqual('1 of spades,1 of hearts,1 of clubs,1 of diamonds,2 of spades,2 of hearts,2 of clubs,2 of diamonds,3 of spades,3 of hearts,3 of clubs,3 of diamonds,4 of spades,4 of hearts,4 of clubs,4 of diamonds,5 of spades,5 of hearts,5 of clubs,5 of diamonds,6 of spades,6 of hearts,6 of clubs,6 of diamonds,7 of spades,7 of hearts,7 of clubs,7 of diamonds,8 of spades,8 of hearts,8 of clubs,8 of diamonds,9 of spades,9 of hearts,9 of clubs,9 of diamonds,10 of spades,10 of hearts,10 of clubs,10 of diamonds,11 of spades,11 of hearts,11 of clubs,11 of diamonds,12 of spades,12 of hearts,12 of clubs,12 of diamonds,13 of spades,13 of hearts,13 of clubs,13 of diamonds');
  });
});
