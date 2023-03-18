import React from 'react';

export function MemoryGameBoard({ ctx, G, moves, matchData, playerID, setupData }) {


    const _isAllowedToMakeMoves = () => {
        return (
            playerID === ctx.currentPlayer
        );
    };

    const onClick = (id, e) => {
        if (!G.timeShownCards && _isAllowedToMakeMoves()) {
            moves.cardClicked(id)
        }
    };
    const dimensions = 4;

    let winner = null;
    if (ctx.gameover) {
        let userCards = [];
        userCards["1"] = [];
        userCards["0"] = [];
        let status = null;

        console.log({ ctx, G, moves, matchData, playerID });
        for (let i = 0; i < G.cards.length; i++) {
            if (G.cards[i].openedBy === '1') {
                userCards["1"].push(G.cards[i].name);
            } else if (G.cards[i].openedBy === '0') {
                userCards["0"].push(G.cards[i].name);
            }
        }
        if (userCards["1"].length === userCards["0"].length) {
            status = 'Draw!';
        } else if (userCards["1"].length > userCards["0"].length) {
            status = 'winner player 2';
        } else {
            status = 'winner player 1';
        }
        winner = (
            <div id="winner"><p>{status}</p><button onClick={() => {
                console.log(window.location.href.replace(window.gameid, ''));
                window.location.href = window.location.href.replace(window.gameid, '');
            }} >New Game</button></div>
        );
    }

    let tbody = [];
    if (dimensions % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number.")
    }
    let userCards = [];
    userCards["1"] = [];
    userCards["0"] = [];
    console.log({ ctx, G, moves, matchData, playerID });
    for (let i = 0; i < G.cards.length; i++) {
        let cardItems = [];
        if (G.cards[i].openedBy === '1') {
            userCards["1"].push(G.cards[i].name);
        } else if (G.cards[i].openedBy === '0') {
            userCards["0"].push(G.cards[i].name);
        }
        if(G.cards[i].image){
            
        
        cardItems.push(
            <>
                <div key={'front' + i} className="card-front"></div>
                <div key={'back' + i} className="card-back">
                    <div className='small-text' dangerouslySetInnerHTML={{ __html: G.cards[i].word }} />
                    <img src={G.cards[i].image} width="64px" height='64px' alt={G.cards[i].name} />
                    <div className='small-text'>
                        {G.cards[i].name}
                    </div>
                </div>
            </>
        );
        tbody.push(<div data-key={i} className={['show', 'open'].includes(G.cards[i].state) ? "flipped card" : "card"} onClick={(e) => onClick(i, e)} key={i}>{cardItems}</div >);
        }
    }
    if (G.timeShownCards && _isAllowedToMakeMoves()) {
        setTimeout(() => {
            if (_isAllowedToMakeMoves()) {
                moves.hideShownCards();
            }
        }, 1500);
    }
    return (
        <div className='game'>
            <div className='players'>
                {winner == null ? <div>{playerID === ctx.currentPlayer ? 'your step' : 'opponents\'s step'}</div> : ''}
                <div>Player 1: {userCards["0"].length > 1 ? userCards["0"].length / 2 : 0}</div>
                <div>Player 2: {userCards["1"].length > 1 ? userCards["1"].length / 2 : 0}</div>
            </div>

            <div className="board" id="board">
                {tbody}
            </div>
            {winner}
        </div>
    );
}
