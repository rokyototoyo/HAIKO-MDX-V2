const { cmd } = require('../command');
const config = require('../config');

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

// ping2 

cmd({
    pattern: "ping2",
    desc: "Check bot's response time.",
    category: "main",
    react: "📡",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const startTime = Date.now()
        const message = await conn.sendMessage(from, { text: '*PINGING...⏳*' })
        const endTime = Date.now()
        const ping = endTime - startTime
        await conn.sendMessage(from, { text: `╭━━━⪨𝗛𝗔𝗜𝗞𝗢-𝗠𝗗𝗫⪩━━━╮
┃╭╼━━━━━━━━━━━┈⊷
┃┃♦ 𝗣𝗜𝗡𝗚𝟮: *${ping}MS*
┃┃♦︎ 𝗗𝗘𝗩: 𝗫𝗧𝗥𝗘𝗠𝗘
┃╰╼━━━━━━━━━━━┈⊷
╰╼══════════════╾╯
> *𝑃𝑂𝑊𝐸𝑅𝐸𝐷 𝐵𝑌 𝑋𝑇𝑅𝐸𝑀𝐸*` }, { quoted: message })
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})
