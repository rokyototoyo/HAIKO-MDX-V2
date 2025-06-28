const { cmd, commands } = require('../command');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "cmd",
    alias: ["source", "js"],
    desc: "Fetch the full source code of a command",
    category: "owner",
    react: "📜",
    filename: __filename
},
async (conn, mek, m, { from, args, reply, isOwner }) => {
    try {
        if (!isOwner) return reply("*❌ ʏᴏᴜ ᴅᴏɴ'ᴛ ʜᴀᴠᴇ ᴘᴇʀᴍɪssɪᴏɴ ᴛᴏ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ!*");
        if (!args[0]) return reply("*❌ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴄᴏᴍᴍᴀɴᴅ ɴᴀᴍᴇ. ᴇxᴀᴍᴘʟᴇ:* `.cmd alive`");

        const commandName = args[0].toLowerCase();
        const commandData = commands.find(cmd => cmd.pattern === commandName || (cmd.alias && cmd.alias.includes(commandName)));

        if (!commandData) return reply("*❌ ᴄᴏᴍᴍᴀɴᴅ ɴᴏᴛ ғᴏᴜɴᴅ!*");

        // Get the command file path
        const commandPath = commandData.filename;

        // Read the full source code
        const fullCode = fs.readFileSync(commandPath, 'utf-8');

        // Truncate long messages for WhatsApp
        let truncatedCode = fullCode;
        if (truncatedCode.length > 4000) {
            truncatedCode = fullCode.substring(0, 4000) + "\n\n// Code too long, sending full file 📂";
        }

        // Formatted caption with truncated code
        const formattedCode = `*╭⭑━━━━━➤* *📜`ᴄᴏᴍᴍᴀɴᴅ sᴏᴜʀᴄᴇ`*
\`\`\`js
${truncatedCode}
\`\`\`
╰────────────⊷  
*⚡ ғᴜʟʟ ғɪʟᴇ sᴇɴᴛ ʙᴇʟᴏᴡ 📂*  
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʜᴀɪᴋᴏ ᴍᴅx* 💜`;

        // Send image with truncated source code
        await conn.sendMessage(from, { 
            image: { url: `https://files.catbox.moe/sy6isf.jpg` },  // Image URL
            caption: formattedCode,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363372853772240@newsletter',
                    newsletterName: '𝐏𝐑𝐎𝐅-𝐗𝐓𝐑𝐄𝐌𝐄',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // Send full source file
        const fileName = `${commandName}.js`;
        const tempPath = path.join(__dirname, fileName);
        fs.writeFileSync(tempPath, fullCode);

        await conn.sendMessage(from, { 
            document: fs.readFileSync(tempPath),
            mimetype: 'text/javascript',
            fileName: fileName
        }, { quoted: mek });

        // Delete the temporary file
        fs.unlinkSync(tempPath);

    } catch (e) {
        console.error("Error in .cmd command:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
