const { cmd } = require('../command');
const config = require('../config');

const antiSpamGroups = new Set();
const userMessageTimestamps = new Map();

cmd({
    pattern: "antispam",
    alias: ["spamblock", "blockspam"],
    react: "🛡️",
    desc: "*Aᴄᴛɪᴠᴇ/ᴅéᴀᴄᴛɪᴠᴇ ʟ'ᴀɴᴛɪ-sᴘᴀᴍ ᴘᴏᴜʀ ʟᴇ ɢʀᴏᴜᴘᴇ*",
    category: "group",
    use: "*.antispam on/off/status",
    filename: __filename
},
async (conn, mek, m, { reply, args, isGroup, isAdmin }) => {
    try {
        if (!isGroup) return reply("❌ Commande réservée aux groupes.");
        if (!isAdmin) return reply("❌ Seuls les admins peuvent gérer l'antispam.");

        const mode = args[0]?.toLowerCase();
        const groupId = m.chat;

        switch (mode) {
            case "on":
                antiSpamGroups.add(groupId);
                reply("✅ *Antispam activé.* Les messages répétés ou trop rapides seront supprimés.");
                break;

            case "off":
                antiSpamGroups.delete(groupId);
                reply("⚠️ *Antispam désactivé.* Les messages ne seront plus filtrés.");
                break;

            case "status":
                reply(`📊 *Statut Antispam :* ${antiSpamGroups.has(groupId) ? "✅ Activé" : "❌ Désactivé"}`);
                break;

            default:
                reply("❓ Utilisation : *.antispam on/off/status*");
        }
    } catch (e) {
        console.error(e);
        reply("❎ Erreur : " + e.message);
    }
});

// Middleware à utiliser dans le handler principal
async function handleAntiSpam(conn, m) {
    if (!m.isGroup || !antiSpamGroups.has(m.chat) || !m.sender) return;

    const key = `${m.chat}:${m.sender}`;
    const now = Date.now();

    if (!userMessageTimestamps.has(key)) {
        userMessageTimestamps.set(key, []);
    }

    const timestamps = userMessageTimestamps.get(key);

    // Garde uniquement les 5 derniers messages dans les 10 secondes
    timestamps.push(now);
    const recent = timestamps.filter(t => now - t < 10000);
    userMessageTimestamps.set(key, recent);

    if (recent.length > 5) {
        try {
            await conn.sendMessage(m.chat, {
                delete: m.key
            });

            await conn.sendMessage(m.chat, {
                text: `🚫 *@${m.sender.split("@")[0]}*, spam détecté. Calme-toi.`,
                mentions: [m.sender]
            });
        } catch (err) {
            console.error("Erreur suppression anti-spam :", err.message);
        }
    }
}

module.exports = { antiSpamGroups, handleAntiSpam };
