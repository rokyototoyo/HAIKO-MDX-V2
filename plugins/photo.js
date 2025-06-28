const { cmd } = require('../command');
const fs = require('fs');
const { exec } = require("child_process");
const util = require('util');
const execPromise = util.promisify(exec);

cmd({
  pattern: "photo",
  alias: ["toimage", "img"],
  react: "🖼️",
  desc: "*ᴄᴏɴᴠᴇʀᴛ ᴀ sᴛɪᴄᴋᴇʀ ɪɴᴛᴏ ᴀɴ ɪᴍᴀɢᴇ*",
  category: "tools",
  use: "*.photo (reply to sticker)*",
  filename: __filename
}, 
async (conn, mek, m, { reply, quoted }) => {
  try {
    if (!quoted || !/sticker/.test(quoted.mtype)) {
      return reply("❌ Veuillez répondre à un *sticker*.");
    }

    const mediaBuffer = await conn.downloadMediaMessage(quoted);
    const inputFile = './sticker_to_img.webp';
    const outputFile = './converted.jpg';

    // Écrire buffer dans un fichier
    fs.writeFileSync(inputFile, mediaBuffer);

    // Convertir avec ffmpeg (assurez-vous que ffmpeg est installé)
    try {
      await execPromise(`ffmpeg -y -i ${inputFile} ${outputFile}`);
    } catch (err) {
      console.error(err);
      fs.unlinkSync(inputFile);
      return reply("❎ Erreur lors de la conversion avec ffmpeg.");
    }

    fs.unlinkSync(inputFile);

    // Envoyer l'image convertie
    await conn.sendMessage(m.chat, {
      image: fs.readFileSync(outputFile),
      caption: "🖼️ *Sticker converti en image*"
    }, { quoted: m });

    fs.unlinkSync(outputFile);

  } catch (e) {
    console.error(e);
    reply(`❎ Erreur: ${e.message}`);
  }
});
