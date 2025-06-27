const { cmd } = require('../command');
const config = require('../config');

const antibotGroups = new Set();

cmd({
    pattern: "antibot",
    alias: ["botblock", "blockbot"],
    react: "🛡️",
    desc: "*Aᴄᴛɪᴠᴇ/ᴅᴇ́sᴀᴄᴛɪᴠᴇ ʟ'ᴀɴᴛɪ-ʙᴏᴛ ᴅᴀɴs ᴜɴ ɢʀᴏᴜᴘᴇ*",
    category: "group",
    use: "*.antibot on/off",
    filename: __filename
},
async (conn, mek, m, { reply, args, isGroup, isAdmin, isBotAdmin }) => {
    try {
        if (!isGroup) return reply("❌ Cette commande ne fonctionne qu'en groupe.");
        if (!isAdmin) return reply("❌ Seuls les *admins* peuvent utiliser cette commande.");
        if (!isBotAdmin) return reply("❌ Je dois être *admin* pour activer l'antibot.");

        const action = args[0]?.toLowerCase();
        if (!["on", "off"].includes(action)) {
            return reply("❓ Utilisation : *.antibot on* ou *.antibot off*");
        }

        const groupId = m.chat;

        if (action === "on") {
            antibotGroups.add(groupId);
            reply("✅ *Antibot activé !* Les bots suspects seront automatiquement retirés.");
        } else {
            antibotGroups.delete(groupId);
            reply("⚠️ *Antibot désactivé.* Les bots ne seront plus bloqués automatiquement.");
        }

    } catch (e) {
        console.error(e);
        reply(`❎ Erreur: ${e.message}`);
    }
});

// Middleware — à appeler depuis le gestionnaire principal de participants
async function handleNewParticipants(conn, m) {
    const groupId = m.id;
    if (!antibotGroups.has(groupId)) return;

    for (const participant of m.participants) {
        try {
            const name = await conn.getName(participant);
            const isBotLike = /bot|api/i.test(name) || participant.startsWith("92") || participant.length < 12;

            if (isBotLike) {
                await conn.groupParticipantsUpdate(groupId, [participant], "remove");
                await conn.sendMessage(groupId, {
                    text: `🚫 *@${participant.split("@")[0]}* a été expulsé automatiquement (détecté comme bot).`,
                    mentions: [participant]
                });
            }
        } catch (e) {
            console.error(`Erreur antibot: ${e.message}`);
        }
    }
}

module.exports = { antibotGroups, handleNewParticipants };
