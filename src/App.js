import { Client, Lobby } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer'

import './App.css';
import { MemoryGameBoard } from './Board';
import { MemoryGame } from './Game';
import { useState, useEffect } from 'react';
import { createGame, removePrefix } from './utils';
const MemoryGameClient = Client({
    game: MemoryGame,
    board: MemoryGameBoard,
    numPlayers: 2,
    multiplayer: SocketIO({ server: process.env.REACT_APP_GAME_HOST }),
});

const App = () => {
    const stayInTurnOnMatch = true;
    const [playerID, setplayerID] = useState(null)
    const [playerData, setplayerData] = useState(null)
    if (!window.gameid) {
        let gameId = window.location.pathname.split('/').pop();
        if (gameId.indexOf('play_') !== false) {
            window.gameid = gameId;
        }
    }
    useEffect(() => {
        if (window.gameid) {
            let localPlayerID = window.localStorage.getItem(window.gameid);
            setplayerID(localPlayerID);
        }
    });

    if (playerID === null) {
        if (!window.gameid) {
            return (
                <div className='create_game'>
                    <button onClick={async () => {
                        const ret = await createGame(window.post_id);
                        setplayerData(ret.cards);
                        const state = { 'page_id': 1, 'user_id': 5 }
                        window.history.pushState(state, '', ret.gameId)
                        setplayerID("0");
                    }}>
                        Create Game
                    </button>
                </div>
            );
        } else {
            return (
                <button onClick={async () => {
                    window.localStorage.setItem(window.gameid, "1");
                    setplayerID("1")
                }}>
                    Play
                </button>
            )
        }

    }
    let id = removePrefix(window.gameid);
    console.log(id);
    return (
        <div>
            
            <MemoryGameClient matchID={id}   playerID={playerID} />
        </div>
    )
};
export default App;
