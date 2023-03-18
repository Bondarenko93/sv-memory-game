import { getScoreBoard } from './utils';

const stayInTurnOnMatch = true;

export const MemoryGame = {
    minPlayers: 2,
    maxPlayers: 2,
    name: 'memory-game',
    setup: (ctx, setupData = {}) => ({ cards: setupData.cards, timeShownCards: false, stayInTurnOnMatch }),
    moves: {
        cardClicked: ({ G, ctx, events, playerID }, id) => {

            const clickedCard = G.cards.filter((c) => c.id === id)[0];
            const currentPlayer = ctx.currentPlayer;
            const shownCards = G.cards.filter((c) => { console.log(c.state); return c.state === 'show' });
            const cardPair = G.cards.filter((c) => c.name === clickedCard.name && c.id !== id)[0];
            let changeTurn = false;
            G.timeShownCards = false; // disable timer by default


            if (clickedCard.state === 'hidden') {
                clickedCard.openedBy = currentPlayer;
                if (shownCards.length >= 1) {
                    if (cardPair.state === 'show' && cardPair.openedBy === currentPlayer) {
                        cardPair.state = 'open';
                        clickedCard.state = 'open';
                        if (!G.stayInTurnOnMatch) {
                            changeTurn = true;
                        }
                    } else {
                        clickedCard.state = 'show';
                        G.timeShownCards = true;
                        if (G.stayInTurnOnMatch && shownCards.length % 2 === 0) {
                            changeTurn = true;
                        }
                    }
                } else {
                    clickedCard.state = 'show';
                }
            }
            if (changeTurn) {
                events.endTurn();
            } else {
                events.endTurn({ next: currentPlayer });
            }
            return G;
        },
        hideShownCards: ({ G, ctx, events }) => {
            const shownCards = G.cards.filter((c) => c.state === 'show');
            for (let i = 0; i < shownCards.length; i++) {
                shownCards[i].state = 'hidden';
                shownCards[i].openedBy = undefined;
            }
            G.timeShownCards = false;
            console.log(G.timeShownCards);
            events.endTurn();
            return G;
        },
    },
    endIf: ({ G, ctx }) => {
        if (G.cards) {

            const unOpenedCards = G.cards.filter((c) => !c.openedBy);
            console.log(unOpenedCards);
            if (unOpenedCards.length === 0) {
                const scoreBoard = getScoreBoard(G, ctx);

                if (scoreBoard[0].score === scoreBoard[1].score) {
                    return { draw: true };
                } else {
                    return { winner: scoreBoard[0].playerID };
                }
            }

        }
    },
};