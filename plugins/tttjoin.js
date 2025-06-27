const { cmd } = require('../command');

let games = require('./ttt').games;

cmd({
    pattern: "join",
    alias: ["play"],
    react: "🎯",
    desc: "*ᴘʟᴀᴄᴇ ʏᴏᴜʀ ᴍᴏᴠᴇ ɪɴ ᴛɪᴄ ᴛᴀᴄ ᴛᴏᴇ*",
    category: "games",
    use: "*.place 1 1",
    filename: __filename
},
async (conn, mek, m, { reply, args, sender }) => {
    try {
        const [rowStr, colStr] = args;
        const row = parseInt(rowStr) - 1;
        const col = parseInt(colStr) - 1;

        if (isNaN(row) || isNaN(col) || row > 2 || col > 2 || row < 0 || col < 0) {
            return reply("📍 Coordonnées invalides. Utilise : *.place 1 1*");
        }

        const gameId = Object.keys(games).find(id => id.includes(sender.split("@")[0]));
        if (!gameId) return reply("❌ Tu n’es dans aucune partie en cours.");

        const game = games[gameId];

        if (game.turn !== sender) return reply("⏳ Ce n’est pas ton tour.");

        if (game.board[row][col] !== '⬜') return reply("🚫 Cette case est déjà occupée.");

        game.board[row][col] = game.symbol[sender];

        // Vérifie victoire
        const win = checkWin(game.board, game.symbol[sender]);
        const draw = checkDraw(game.board);

        const formatBoard = () => game.board.map(row => row.join(" ")).join("\n");

        if (win) {
            await reply(`🎉 *Victoire !* ${game.symbol[sender]} gagne !\n\n${formatBoard()}`);
            delete games[gameId];
        } else if (draw) {
            await reply(`⚖️ Match nul !\n\n${formatBoard()}`);
            delete games[gameId];
        } else {
            game.turn = sender === game.player1 ? game.player2 : game.player1;
            await conn.sendMessage(m.chat, {
                text: `🕹️ Tour de : @${game.turn.split("@")[0]}\n\n${formatBoard()}`,
                mentions: [game.turn]
            });
        }

    } catch (e) {
        console.error(e);
        reply(`❎ Erreur: ${e.message}`);
    }
});

// Vérifie victoire
function checkWin(board, symbol) {
    for (let i = 0; i < 3; i++) {
        if (board[i].every(c => c === symbol)) return true;
        if (board.map(r => r[i]).every(c => c === symbol)) return true;
    }
    return board[0][0] === symbol && board[1][1] === symbol && board[2][2] === symbol ||
           board[0][2] === symbol && board[1][1] === symbol && board[2][0] === symbol;
}

// Vérifie match nul
function checkDraw(board) {
    return board.flat().every(cell => cell !== '⬜');
}
