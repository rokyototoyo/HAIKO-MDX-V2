const fetch = require('node-fetch');
const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Fetch GitHub repository information",
    react: "🪄",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    const githubRepoURL = 'https://github.com/PROFESSEURMDX/HAIKO-MDX-V2';

    try {
        const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
        
        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
        const repoData = await response.json();

        // Format 1: Classic Box
        const style1 = `
╭╼⧼⧼𝐇𝐀𝐈𝐊𝐎 𝐌𝐃𝐗 𝐑𝐄𝐏𝐎⧽⧽╾╮
┇╭─────────────┈⊷
┇┃♢ *sᴛᴀʀs*: ${repoData.stargazers_count}
┇┃♢ *ғᴏʀᴋs*: ${repoData.forks_count}
┇┃♢ *ᴜʀʟ*: ${repoData.html_url}
┇┃♢ *sᴇssɪᴏɴ*:https://haiko-mdx-v2-session.onrender.com/pair
┇┃♢ *ʙᴇsᴛ ʙᴏᴛ ᴡᴀ 2025-2026*
┇╰─────────────┈⊷
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╍╯
> ${config.DESCRIPTION}`;

        const styles = [style1,];
        const selectedStyle = styles[Math.floor(Math.random() * styles.length)];

        // Send image with repo info
        await conn.sendMessage(from, {
            image: { url: `https://files.catbox.moe/yzttl0.jpg` },
            caption: selectedStyle,
            contextInfo: { 
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363398101781980@newsletter',
                    newsletterName: '𝐏𝐑𝐎𝐅-𝐗𝐓𝐑𝐄𝐌𝐄',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // Send audio
        await conn.sendMessage(from, {
            audio: { url: 'https://files.catbox.moe/uzvvj1.mp3' },
            mimetype: 'audio/mp4',
            ptt: true,
            contextInfo: { 
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Repo command error:", error);
        reply(`❌ Error: ${error.message}`);
    }
});

