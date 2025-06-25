const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "getpp",
     if (!Owner) return m.reply(mess.owner)
    let target;

    // Jika ada mention
    if (m.mentionedJid && m.mentionedJid.length > 0) {
        target = m.mentionedJid[0];
    } 
    // Jika ada reply ke orang
    else if (m.quoted && m.quoted.sender) {
        target = m.quoted.sender;
    } 
    // Jika input berupa nomor biasa
    else if (q) {
        const nomor = q.replace(/[^0-9]/g, '');
        target = nomor + '@s.whatsapp.net';
    } else {
        return m.reply(`*ᴇxᴀᴍᴘʟᴇ : .ɢᴇᴛᴘᴘ @1849xxxx* 〽️`);
    }

    try {
        const pp = await Bellah.profilePictureUrl(target, 'image').catch(() => null);
        if (!pp) return m.reply(`*ᴘʀᴏғɪʟ ᴘɪᴄᴛᴜʀᴇ ɪs ʜɪᴅᴅᴇɴ ᴘʀɪᴠᴀᴛᴇ.*`);
        await Bellah.sendMessage(m.chat, {
            image: { url: pp },
            caption: `*✅ sᴜᴄᴄᴇss :* ${target.split('@')[0]}`
        }, { quoted: m });
    } catch (err) {
        console.log(err);
        m.reply(`*ᴀɴ ᴇʀʀᴏʀ ʜᴀs ᴏᴄᴄᴜʀʀᴇᴅ*`);
    }
}
break;
