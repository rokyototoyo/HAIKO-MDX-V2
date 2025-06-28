// antimention.js
const { cmd } = require('../command');

const antiMentionGroups = new Set();

cmd({
    pattern: "antimention",
    alias: ["nomention", "blockping"],
    react: "🚫",
    desc: "*Aᴄᴛɪᴠᴇ/ᴅᴇ́sᴀᴄᴛɪᴠᴇ ʟ'ᴀɴᴛɪ-@ᴛᴏᴜs ᴅᴀɴs ʟᴇ ɢʀᴏᴜᴘᴇ*",
    category: "group",
    use: "*.antimention on/off/status",
    filename: __filename
}, async (conn, mek, m, { reply, args, isGroup, isAdmin }) => {
    try {
        if (!isGroup) return reply("❌ Cette commande fonctionne uniquement dans les groupes.");
        if (!isAdmin) return reply("❌ Seuls les *admins* peuvent activer/désactiver.");

        const mode = args[0]?.toLowerCase();
        const groupId = m.chat;

        switch (mode) {
            case "on":
                antiMentionGroups.add(groupId);
                return reply("✅ *Antimention activé.* Les messages taguant plusieurs membres seront supprimés.");
            case "off":
                antiMentionGroups.delete(groupId);
                return reply("❌ *Antimention désactivé.* Les mentions sont à nouveau autorisées.");
            case "status":
                return reply(`📊 *Statut Antimention :* ${antiMentionGroups.has(groupId) ? "✅ Activé" : "❌ Désactivé"}`);
            default:
                return reply("❓ Utilisation : *.antimention on/off/status*");
        }
    } catch (e) {
        console.error(e);
        return reply("❎ Erreur : " + e.message);
    }
});

async function handleAntiMention(conn, m) {
    try {
        if (!m.message) return;
        if (!m.key.remoteJid.endsWith('@g.us')) return; // Asire se group
        if (!antiMentionGroups.has(m.key.remoteJid)) return;

        const messageContent = m.message;
        // Tcheke si gen mention
        const mentionedJids = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (mentionedJids.length > 3) {
            // Efase mesaj la
            await conn.sendMessage(m.key.remoteJid, { delete: m.key });
            // Avètisman moun nan
            const senderId = m.key.participant || m.key.remoteJid;
            await conn.sendMessage(m.key.remoteJid, {
                text: `🚫 *@${senderId.split("@")[0]}*, trop de mentions dans un seul message !`,
                mentions: [senderId]
            });
        }
    } catch (err) {
        console.error("Erreur suppression message mentionné : ", err);
    }
}

module.exports = { antiMentionGroups, handleAntiMention };
