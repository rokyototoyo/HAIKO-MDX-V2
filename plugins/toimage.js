const { cmd } = require('../command');
const fs = require('fs');
const config = require('../config');

cmd({
    pattern: "photo",
    alias: ["toimage", "img"],
    react: "🖼️",
    desc: "*ᴄᴏɴᴠᴇʀᴛ ᴀ sᴛɪᴄᴋᴇʀ ɪɴᴛᴏ ᴀɴ ɪᴍᴀɢᴇ*",
    category: "tools",
    use: "*.photo (reply to sticker)*",
    filename: __filename
},
async (conn, mek, m, { reply, quoted, mime }) => {
    try {
        if (!quoted || !/sticker/.test(quoted.mtype)) {
            return reply("❌ Veuillez répondre à un *sticker*.");
        }

        const media = await conn.downloadMediaMessage(quoted);
        const filename = './sticker_to_img.webp';

        fs.writeFileSync(filename, media);

        const { exec } = require("child_process");
        const outputFile = './converted.jpg';

        exec(`ffmpeg -i ${filename} ${outputFile}`, async (err) => {
            fs.unlinkSync(filename);

            if (err) {
                console.error(err);
                return reply("❎ Erreur lors de la conversion.");
            }

            await conn.sendMessage(m.chat, {
                image: fs.readFileSync(outputFile),
                caption: "🖼️ *Sticker converti en image*"
            }, { quoted: m });

            fs.unlinkSync(outputFile);
        });

    } catch (e) {
        console.error(e);
        reply(`❎ Erreur: ${e.message}`);
    }
});
