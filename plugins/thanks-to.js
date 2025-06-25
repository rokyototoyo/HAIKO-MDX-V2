const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "ping2",
    alias: ["thanksto"],
    desc: "thanks to dev for helping",
    category: "main",
    react: "🗯️",
    filename: __filename
},
async (conn, mek, m, { from }) => {
    try {
        const message =`╭━━━⪨𝗛𝗔𝗜𝗞𝗢-𝗠𝗗𝗫⪩━━━╮
┃╭╼━━━━━━━━━━━┈⊷
┃┃♦ 𝗣𝗜𝗡𝗚𝟮: *${ping}MS*
┃┃♦︎ 𝗗𝗘𝗩: 𝗫𝗧𝗥𝗘𝗠𝗘
┃╰╼━━━━━━━━━━━┈⊷
╰╼══════════════╾╯
> *𝑃𝑂𝑊𝐸𝑅𝐸𝐷 𝐵𝑌 𝑋𝑇𝑅𝐸𝑀𝐸*`;

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/2vosmn.jpg' },
            caption: message,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 1000,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363398101781980@newsletter', // remplace avec ton vrai newsletterJid si besoin
                    newsletterName: '𝐏𝐑𝐎𝐅-𝐗𝐓𝐑𝐄𝐌𝐄',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (err) {
        console.error("ThanksTo Error:", err);
        await conn.sendMessage(from, { text: `Error: ${err.message}` }, { quoted: mek });
    }
});
