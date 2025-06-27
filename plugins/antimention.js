const { cmd } = require('../command');
const config = require('../config');

const antiMentionGroups = new Set();

cmd({
    pattern: "antimention",
    alias: ["nomention", "blockping"],
    react: "🚫",
    desc: "*Aᴄᴛɪᴠᴇ/ᴅᴇ́sᴀᴄᴛɪᴠᴇ ʟ'ᴀɴᴛɪ-@ᴛᴏᴜs ᴅᴀɴs ʟᴇ ɢʀᴏᴜᴘᴇ*",
    category: "group",
    use: "*.antimention on/off/status",
    filename: __filename
},
async (conn, mek, m, { reply, args, isGroup, isAdmin }) => {
    try {
        if (!isGroup) return reply("❌ Cette commande fonctionne uniquement dans les groupes.");
        if (!isAdmin) return reply("❌ Seuls les *admins* peuvent activer/désactiver.");

        const mode = args[0]?.toLowerCase();
        const groupId = m.chat;

        switch (mode) {
            case "on":
                antiMentionGroups.add(groupId);
                reply("✅ *Antimention activé.* Les messages taguant plusieurs membres seront supprimés.");
                break;

            case "off":
                antiMentionGroups.delete(groupId);
                reply("❌ *Antimention désactivé.* Les mentions sont à nouveau autorisées.");
                break;

            case "status":
                reply(`📊 *Statut Antimention :* ${antiMentionGroups.has(groupId) ? "✅ Activé" : "❌ Désactivé"}`);
                break;

            default:
                reply("❓ Utilisation : *.antimention on/off/status*");
        }
    } catch (e) {
        console.error(e);
        reply("❎ Erreur : " + e.message);
    }
});

// Middleware de filtrage
async function handleAntiMention(conn, m) {
    if (!m.isGroup || !antiMentionGroups.has(m.chat)) return;

    if (m.mentionedJid?.length > 3) {
        try {
            await conn.sendMessage(m.chat, {
                delete: m.key
            });

            await conn.sendMessage(m.chat, {
                text: `🚫 *@${m.sender.split("@")[0]}*, trop de mentions dans un seul message !`,
                mentions: [m.sender]
            });
        } catch (e) {
            console.error(`Erreur suppression message mentionné : ${e.message}`);
        }
    }
}

module.exports = { antiMentionGroups, handleAntiMention };
