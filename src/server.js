let MyRequire = require("esm")(module);
const { MemoryGame } = MyRequire("./Game.js")

//const { MemoryGame } = require('./Game');
const { Server, FlatFile,Origins } = require('boardgame.io/server');
const server = Server({
    games: [MemoryGame],
    origins: ['*','playlearnspeak.com','https://playlearnspeak.com'],
    db: new FlatFile({
        dir: '/home/qyklaeyc/server.playlearnspeak.com/storage',
        logging: true,
    }),
});
server.router.get('/', (ctx, next) => {
  ctx.body ='work';
});
server.run(3000);
