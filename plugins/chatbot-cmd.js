// 📁 chatbot-cmd.js
const { cmd } = require('../command');
const fs = require('fs');
const path = './chatbot_users.json';

// Charger la liste des utilisateurs activés
let chatbotUsers = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};

cmd({
    pattern: "chatbot",
    alias: ["aibot", "cb"],
    react: "🤖",
    desc: "*ᴀᴄᴛɪᴠᴀᴛᴇ/ᴅᴇsᴀᴄᴛɪᴠᴀᴛᴇ ᴄʜᴀᴛʙᴏᴛ ғᴏʀ ʏᴏᴜʀ ɴᴜᴍʙᴇʀ*",
    category: "ai",
    use: "*.chatbot on / off",
    filename: __filename
},
async (conn, mek, m, { reply, args, sender }) => {
    try {
        const option = args[0]?.toLowerCase();
        if (!["on", "off"].includes(option)) {
            return reply("❌ Utilisation : *.chatbot on* ou *.chatbot off*");
        }

        if (option === "on") {
            chatbotUsers[sender] = true;
            reply("✅ Chatbot activé pour toi.");
        } else {
            delete chatbotUsers[sender];
            reply("🛑 Chatbot désactivé pour toi.");
        }

        fs.writeFileSync(path, JSON.stringify(chatbotUsers, null, 2));

    } catch (e) {
        console.error(e);
        reply("❎ Erreur lors du traitement.");
    }
});

module.exports.chatbotUsers = chatbotUsers;
