import React, { useState } from 'react';

const Game = () => {
    const [deck, setDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [gameStatus, setGameStatus] = useState('playing');

    const initializeDeck = () => {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const newDeck = [];
        suits.forEach(suit => {
            values.forEach(value =>{
                newDeck.push({ suit, value})
            });
        });
        setDeck(newDeck)
    }

    const dealCards = () => {
        const newPlayerHand = [deck.pop(), deck.pop()];
        const newDealerHand = [deck.pop(), deck.pop()];
        setPlayerHand(newPlayerHand);
        setDealerHand(newDealerHand);
    }

    const startGame = () => {
        initializeDeck();
        dealCards();
        setGameStatus('playing');
    }

    return (
        <div>
            <button onClick={startGame}>Start Game</button>
            <div>
                <h2>Player's Hand</h2>
                {playerHand.map((card, index) => (
                    <div key={index}>{card.value} of {card.suit}</div>
                ))}
            </div>
            <div>
                <h2>Dealer's Hand</h2>
                {dealerHand.map((card, index) => (
                    <div key={index}>{card.value} of {card.suit}</div>
                ))}
            </div>
        </div>
    );
};

export default Game;