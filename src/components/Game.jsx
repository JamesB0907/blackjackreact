import React, { useEffect, useState } from "react";

const Game = () => {
    const [deck, setDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [playerTurn, setPlayerTurn] = useState(true);
    const [gameResult, setGameResult] = useState("");
    const [dealerDrawing, setDealerDrawing] = useState(false);

    const initializeDeck = () => {
        const suits = ["hearts", "diamonds", "clubs", "spades"];
        const values = [
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "J",
            "Q",
            "K",
            "A",
        ];
        const newDeck = [];
        suits.forEach((suit) => {
            values.forEach((value) => {
                newDeck.push({ suit, value });
            });
        });
        for (let i = newDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
        }
        return newDeck;
    };
    /*
    const dealCards = () => {
        setDeck((prevDeck) => {
            const updatedDeck = [...prevDeck];
            const newPlayerHand = [updatedDeck.pop(), updatedDeck.pop()];
            const newDealerHand = [updatedDeck.pop(), updatedDeck.pop()];

            setPlayerHand(newPlayerHand);
            setDealerHand(newDealerHand);

            return updatedDeck;
        });
    };
*/
    const startGame = () => {
        setPlayerHand([]);
        setDealerHand([]);
        setGameResult("");
        setPlayerTurn(true);
        setDealerDrawing(false);

        const newDeck = initializeDeck();
        const newPlayerHand = [newDeck.pop(), newDeck.pop()];
        const newDealerHand = [newDeck.pop(), newDeck.pop()];

        setPlayerHand(newPlayerHand);
        setDealerHand(newDealerHand);
        setDeck(newDeck);
    };

    /*
    useEffect(() => {
        if (deck.length === 52) {
            dealCards();
        }
    }, [deck]);
*/

    const calculateHandValue = (hand) => {
        let value = 0;
        let aceCount = 0;
        hand.forEach((card) => {
            if (!card) return;

            if (["J", "Q", "K"].includes(card.value)) {
                value += 10;
            } else if (card.value === "A") {
                aceCount += 1;
                value += 11;
            } else {
                value += parseInt(card.value);
            }
        });
        while (value > 21 && aceCount > 0) {
            value -= 10;
            aceCount -= 1;
        }
        return value;
    };
    /*
    const playerHit = () => {
        if (playerTurn) {
            setDeck(prevDeck => {
                const updatedDeck = [...prevDeck];
                const card = updatedDeck.pop();

                setPlayerHand((prevHand) => {
                    const newHand = [...prevHand, card];

                    if (calculateHandValue(newHand) > 21) {
                        setGameResult("Player Bust! Dealer wins!");
                        setPlayerTurn(false);
                    }

                    return newHand;
                });
                return updatedDeck;
            });
        }
    };
*/

    const playerHit = () => {
        if (!playerTurn || deck.length === 0) return;

        const updatedDeck = [...deck];
        const card = updatedDeck.pop();

        if (!card) {
            setGameResult("Deck is empty! Game cannot continue.");
            return;
        }

        const newPlayerHand = [...playerHand, card];
        setPlayerHand(newPlayerHand);
        setDeck(updatedDeck);

        const handValue = calculateHandValue(newPlayerHand);
        if (handValue > 21) {
            setGameResult("Player Bust! Dealer win!");
            setPlayerTurn(false);
        }
    };

    const playerStand = () => {
        setPlayerTurn(false);
        setDealerDrawing(true);
    };

    // [REMOVED] The synchronous version of dealerTurn function
    // const dealerTurn = () => {
    //     let dealerHandValue = calculateHandValue(dealerHand);
    //     while (dealerHandValue < 17) {
    //         const updatedDeck = [...deck];
    //         const newDealerHand = [...dealerHand, updatedDeck.pop()]
    //         setDeck(updatedDeck);
    //         setDealerHand(newDealerHand);
    //         dealerHandValue = calculateHandValue(newDealerHand);
    //     }
    //     determineWinner();
    // };

    useEffect(() => {
        if (dealerDrawing) {
            const dealerValue = calculateHandValue(dealerHand);

            if (dealerValue < 17) {
                const drawDealerCard = setTimeout(() => {
                    if (deck.length === 0) {
                        setGameResult("Deck is empty! Game cannot continue.");
                        setDealerDrawing(false);
                    }

                    const updatedDeck = [...deck];
                    const card = updatedDeck.pop();
                    const newDealerHand = [...dealerHand, card];

                    setDealerHand(newDealerHand);
                    setDeck(updatedDeck);

                    const newHandValue = calculateHandValue(newDealerHand);
                    if (newHandValue > 21) {
                        setGameResult("Dealer Busts! Player Wins!");
                        setDealerDrawing(false);
                    }
                }, 500);

                return () => clearTimeout(drawDealerCard);
            } else {
                setDealerDrawing(false);
                determineWinner();
            }
        }
    }, [dealerHand, dealerDrawing, deck]);

    const determineWinner = () => {
        const playerHandValue = calculateHandValue(playerHand);
        const dealerHandValue = calculateHandValue(dealerHand);
        if (dealerHandValue > 21) {
            setGameResult("Dealer Busts! Player Wins!");
        } else if (playerHandValue > dealerHandValue) {
            setGameResult("Player Wins!");
        } else if (playerHandValue < dealerHandValue) {
            setGameResult("Dealer Wins!");
        } else {
            setGameResult("It's a Tie!");
        }
    };

    const displayCard = (card) => {
        if (!card) return null;

        const suitSymbols = {
            hearts: "♥",
            diamonds: "♦",
            clubs: "♣",
            spades: "♠",
        };

        const color =
            card.suit === "hearts" || card.suit === "diamonds"
                ? "red"
                : "black";

        return (
            <span style={{ color, marginRight: "10px", fontSize: "18px" }}>
                {card.value} {suitSymbols[card.suit]}
            </span>
        );
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <h1>Blackjack</h1>

            {/* CHANGED: Added styling to button */}
            <button
                onClick={startGame}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginBottom: "20px",
                }}
            >
                Start New Game
            </button>

            <div style={{ marginBottom: "20px" }}>
                {/* ADDED: Display hand value */}
                <h2>Player's Hand ({calculateHandValue(playerHand)})</h2>
                {/* CHANGED: Enhanced card display */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        marginBottom: "10px",
                    }}
                >
                    {playerHand.map((card, index) => (
                        <div
                            key={index}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                padding: "10px",
                                margin: "5px",
                                minWidth: "50px",
                                textAlign: "center",
                            }}
                        >
                            {displayCard(card)}
                        </div>
                    ))}
                </div>
                {/* CHANGED: Added styling to buttons */}
                <button
                    onClick={playerHit}
                    disabled={!playerTurn}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: playerTurn ? "#2196F3" : "#ccc",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: playerTurn ? "pointer" : "not-allowed",
                        marginRight: "10px",
                    }}
                >
                    Hit
                </button>
                <button
                    onClick={playerStand}
                    disabled={!playerTurn}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: playerTurn ? "#FF9800" : "#ccc",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: playerTurn ? "pointer" : "not-allowed",
                    }}
                >
                    Stand
                </button>
            </div>

            <div>
                {/* ADDED: Display hand value */}
                <h2>Dealer's Hand ({calculateHandValue(dealerHand)})</h2>
                {/* CHANGED: Enhanced card display */}
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {dealerHand.map((card, index) => (
                        <div
                            key={index}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                padding: "10px",
                                margin: "5px",
                                minWidth: "50px",
                                textAlign: "center",
                            }}
                        >
                            {displayCard(card)}
                        </div>
                    ))}
                </div>
            </div>

            {/* CHANGED: Enhanced game result display */}
            {gameResult && (
                <div
                    style={{
                        marginTop: "20px",
                        padding: "15px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "5px",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "20px",
                    }}
                >
                    {gameResult}
                </div>
            )}

            {/* ADDED: Display remaining cards count */}
            <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
                Cards remaining in deck: {deck.length}
            </div>
        </div>
    );
};

export default Game;
