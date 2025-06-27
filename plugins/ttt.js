const { cmd } = require('../command');
const config = require('../config');

let games = {};

cmd({
    pattern: "ttt",
    alias: ["morpion", "tic"],
    react: "❌",
    desc: "*ᴘʟᴀʏ ᴛɪᴄ ᴛᴀᴄ ᴛᴏᴇ ᴡɪᴛʜ ᴀɴᴏᴛʜᴇʀ ᴘᴇʀsᴏɴ*",
    category: "games",
    use: "*.ttt @user",
    filename: __filename
},
async (conn, mek, m, { reply, args, isGroup, sender, participants }) => {
    try {
        if (!isGroup) return reply("❌ Ce jeu ne fonctionne qu'en groupe.");

        const mention = m.mentionedJid?.[0];
        if (!mention) return reply("👥 Mentionne quelqu’un pour jouer : *.ttt @utilisateur*");

        const player1 = sender;
        const player2 = mention;

        const gameId = `${player1.split("@")[0]}-${player2.split("@")[0]}`;
        if (games[gameId]) return reply("🎮 Une partie est déjà en cours entre ces joueurs.");

        const emptyBoard = [
            ['⬜', '⬜', '⬜'],
            ['⬜', '⬜', '⬜'],
            ['⬜', '⬜', '⬜']
        ];

        games[gameId] = {
            board: emptyBoard,
            turn: player1,
            player1,
            player2,
            symbol: {
                [player1]: '❌',
                [player2]: '⭕'
            }
        };

        const formatBoard = () => emptyBoard.map(row => row.join(" ")).join("\n");

        await conn.sendMessage(m.chat, {
            text: `🎮 *TIC TAC TOE* 🎮\n\n👤 ${conn.getName(player1)} (❌) vs 👤 ${conn.getName(player2)} (⭕)\n\n🕹️ Tour de : @${player1.split("@")[0]}\n\n${formatBoard()}\n\n👉 Utilise *.place <ligne> <colonne>* pour jouer.`,
            mentions: [player1, player2]
        });

    } catch (e) {
        console.error(e);
        reply(`❎ Erreur: ${e.message}`);
    }
});
