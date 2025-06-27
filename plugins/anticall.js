const { cmd } = require('../command');
const config = require('../config');

const antiCallEnabled = new Set();

cmd({
    pattern: "anticall",
    alias: ["nocal", "blockcall"],
    react: "📵",
    desc: "*Aᴄᴛɪᴠᴇ/ᴅᴇ́sᴀᴄᴛɪᴠᴇ ʟ'ᴀɴᴛɪ-ᴀᴘᴘᴇʟs ᴘᴏᴜʀ ᴘʀᴏᴛᴇɢᴇʀ ʟᴇ ʙᴏᴛ*",
    category: "security",
    use: "*.anticall on/off/status",
    filename: __filename
},
async (conn, mek, m, { reply, args, isOwner }) => {
    try {
        if (!isOwner) return reply("❌ Seul le propriétaire peut gérer l’anticall.");

        const mode = args[0]?.toLowerCase();
        const botNumber = conn.user.id;

        switch (mode) {
            case "on":
                antiCallEnabled.add(botNumber);
                reply("📵 *Anticall activé.* Les appels entrants seront automatiquement bloqués.");
                break;

            case "off":
                antiCallEnabled.delete(botNumber);
                reply("✅ *Anticall désactivé.* Le bot acceptera à nouveau les appels.");
                break;

            case "status":
                reply(`📊 *Statut Anticall :* ${antiCallEnabled.has(botNumber) ? "✅ Activé" : "❌ Désactivé"}`);
                break;

            default:
                reply("❓ Utilisation : *.anticall on/off/status*");
        }
    } catch (e) {
        console.error(e);
        reply("❎ Erreur : " + e.message);
    }
});

module.exports = {
    antiCallEnabled,

    // Middleware à appeler sur l'événement de type call
    async handleCall(conn, callUpdate) {
        try {
            const botId = conn.user.id;
            if (!antiCallEnabled.has(botId)) return;

            for (const call of callUpdate) {
                if (call.isGroup === false && call.status === "offer") {
                    const callerId = call.from;
                    await conn.rejectCall(call.id, call.from);
                    await conn.sendMessage(callerId, {
                        text: `🚫 *Appels interdits !*\nVous avez été automatiquement bloqué pour avoir essayé d'appeler le bot.`,
                    });

                    // Optionnel : bloquer l'utilisateur
                    await conn.updateBlockStatus(callerId, "block");
                }
            }
        } catch (e) {
            console.error("❌ Erreur anticall :", e.message);
        }
    }
};
