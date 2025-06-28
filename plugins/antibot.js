const { cmd } = require('../command');
const config = require('../config');

const antibotGroups = new Set();

cmd({
    pattern: "antibot",
    alias: ["botblock", "blockbot"],
    react: "🛡️",
    desc: "*Aᴄᴛɪᴠᴇ/ᴅᴇ́sᴀᴄᴛɪᴠᴇ ʟ'ᴀɴᴛɪ-ʙᴏᴛ ᴅᴀɴs ᴜɴ ɢʀᴏᴜᴘᴇ*",
    category: "group",
    use: "*.ᴀɴᴛɪʙᴏᴛ ᴏɴ/ᴏғғ*",
    filename: __filename
},
async (conn, mek, m, { reply, args, isGroup, isAdmin, isBotAdmin }) => {
    try {
        if (!isGroup) return reply("*❌ ᴄᴇᴛᴛᴇ ᴄᴏᴍᴍᴀɴᴅᴇ ɴᴇ ғᴏɴᴄᴛɪᴏɴɴᴇ ǫᴜ'ᴇɴ ɢʀᴏᴜᴘᴇ*");
        if (!isAdmin) return reply("*❌ sᴇᴜʟs ʟᴇs `ᴀᴅᴍɪɴs` ᴘᴇᴜᴠᴇɴᴛ ᴜᴛɪʟɪsᴇʀ ᴄᴇᴛᴛᴇ ᴄᴏᴍᴍᴀɴᴅᴇ*");
        if (!isBotAdmin) return reply("*❌ ᴊᴇ ᴅᴏɪs ᴇ̂ᴛʀᴇ `ᴅᴍɪɴ` ᴘᴏᴜʀ ᴀᴄᴛɪᴠᴇʀ ʟ'ᴀɴᴛɪʙᴏᴛ*");

        const action = args[0]?.toLowerCase();
        if (!["on", "off"].includes(action)) {
            return reply("*❓ ᴜᴛɪʟɪsᴀᴛɪᴏɴ : .ᴀɴᴛɪʙᴏᴛ ᴏɴ ᴏᴜ .ᴀɴᴛɪʙᴏᴛ ᴏғғ*");
        }

        const groupId = m.chat;

        if (action === "on") {
            antibotGroups.add(groupId);
            reply("*✅ ᴀɴᴛɪʙᴏᴛ ᴀᴄᴛɪᴠᴇ́ ! ʟᴇs ʙᴏᴛs sᴜsᴘᴇᴄᴛs sᴇʀᴏɴᴛ ᴀᴜᴛᴏᴍᴀᴛɪǫᴜᴇᴍᴇɴᴛ ʀᴇᴛɪʀᴇ́s*");
        } else {
            antibotGroups.delete(groupId);
            reply("⚠️ *ᴀɴᴛɪʙᴏᴛ ᴅᴇ́sᴀᴄᴛɪᴠᴇ́. ʟᴇs ʙᴏᴛs ɴᴇ sᴇʀᴏɴᴛ ᴘʟᴜs ʙʟᴏǫᴜᴇ́s ᴀᴜᴛᴏᴍᴀᴛɪǫᴜᴇᴍᴇɴᴛ*");
        }

    } catch (e) {
        console.error(e);
        reply(`❎ Erreur: ${e.message}`);
    }
});

// Middleware — à appeler depuis le gestionnaire principal de participants
async function handleNewParticipants(conn, m) {
    const groupId = m.chat;
    console.log(`[antibot] Nouveaux participants dans le groupe ${groupId}:`, m.participants);

    if (!antibotGroups.has(groupId)) {
        console.log(`[antibot] Antibot désactivé pour le groupe ${groupId}`);
        return;
    }

    for (const participant of m.participants) {
        try {
            const name = await conn.getName(participant);
            const jidUser = participant.split("@")[0];
            const isBotLike = /bot|api/i.test(name) || jidUser.length < 10;

            if (isBotLike) {
                await conn.groupParticipantsUpdate(groupId, [participant], "remove");
                await conn.sendMessage(groupId, {
                    text: `🚫 *@${jidUser}* a été expulsé automatiquement (détecté comme bot).`,
                    mentions: [participant]
                });
                console.log(`[antibot] Participant ${participant} supprimé du groupe ${groupId}`);
            }
        } catch (e) {
            console.error(`[antibot] Erreur: ${e.message}`);
        }
    }
}

module.exports = { antibotGroups, handleNewParticipants };
