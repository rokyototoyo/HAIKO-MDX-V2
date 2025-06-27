const fs = require('fs');
const path = require('path');
const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "deploy",
    alias: ["autodeploy", "cmddeploy"],
    react: "🚀",
    desc: "*Aᴜᴛᴏᴍᴀᴛɪᴄᴀʟʟʏ ʟᴏᴀᴅ & ʀᴇɢɪsᴛᴇʀ ᴀʟʟ ᴄᴏᴍᴍᴀɴᴅs*",
    category: "owner",
    use: "*.deploy",
    filename: __filename
}, 
async (conn, mek, m, { reply, isOwner }) => {
    try {
        if (!isOwner) return reply("❌ Owner only command");

        const commandsPath = path.join(__dirname, '../commands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        let successCount = 0;
        let errorCount = 0;
        let errors = [];

        for (const file of commandFiles) {
            try {
                const filePath = path.join(commandsPath, file);
                delete require.cache[require.resolve(filePath)];
                require(filePath);
                successCount++;
            } catch (err) {
                errorCount++;
                errors.push(`❌ ${file}: ${err.message}`);
            }
        }

        reply(`╭━『 *AUTO DEPLOY SYSTEM* 』
┃│▸ *✅ Loaded:* ${successCount} commands
┃│▸ *❌ Failed:* ${errorCount}
┃│▸ *🔄 Status:* ${errorCount > 0 ? "Partial Success" : "Success"}
┃╰─────────────❍
╰────────────────┈⊷

${errors.length > 0 ? errors.join('\n') : "✅ All commands loaded successfully!"}
> *©_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇᴠ xᴛʀᴇᴍᴇ_*`);

    } catch (e) {
        console.error(e);
        reply(`❎ Error: ${e.message}`);
    }
});
