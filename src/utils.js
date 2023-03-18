
export const pickRandom = (array, items) => {
    const clonedArray = [...array]
    const randomPicks = []

    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)

        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)
    }

    return randomPicks
}
export const shuffle = array => {
    const clonedArray = [...array]

    for (let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const original = clonedArray[index]

        clonedArray[index] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }

    return clonedArray
}
export function getScoreBoard(G, ctx) {
    let scoreBoard = new Array(ctx.numPlayers).fill(0);
    G.cards
        .filter((c) => c.openedBy)
        .forEach((c) => {
            scoreBoard[c.openedBy]++;
        });
    return scoreBoard
        .map((score, i) => ({ playerID: i.toString(), score: Math.floor(score / 2) }))
        .sort((a, b) => b.score - a.score);
}

export function removePrefix(gameId) {
    console.log(gameId.replace('play_', ''));
    return gameId.replace('play_', '');
}
export async function createGame(post_id) {
    const emojis = await getGemaData(post_id);
    const shuffeledContnet = pickRandom(emojis, emojis.length);
    const doubledContent = shuffle([...shuffeledContnet, ...shuffeledContnet])
    const cards = await doubledContent.map(function (gameData, index) {
        return {
            id: index,
            name: gameData.card_text,
            image: gameData.card_image,
            word: gameData.card_word,
            state: 'hidden',
        }
    });


    const createGameBody = await fetch(process.env.REACT_APP_GAME_SERVER + '/games/memory-game/create', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
            options: 5,
            numPlayers: 2,
            setupData: { cards: cards }
        }),
        headers: { 'Content-Type': 'application/json' },

    }
    );
    const createGameData = await createGameBody.json();
    console.log(createGameData);
    window.gameid = 'play_' + createGameData.matchID;
    window.localStorage.setItem(window.gameid, "0");
    return { cards: cards, gameId: window.gameid };
}

export async function getGemaData(id = 5) {
    const reqGameData = await fetch(process.env.REACT_APP_WP_HOST + '/wp-json/wp/v2/game/' + id, {
        method: 'GET'
    });
    const gameData = await reqGameData.json();
    return gameData.crb_cards;
}