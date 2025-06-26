const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
  pattern: 'getpp',
  desc: 'Get profile picture of a user by mention, reply or number',
  alias: ['pp', 'profilepic'],
  category: 'info',
  react: '🖼️',
  async handler(conn, mek, m, { text, args, isOwner, isAdmin, reply }) {
    if (!isOwner) return m.reply('🚫 Commande réservée au propriétaire.');

    let target;

    if (m.mentionedJid && m.mentionedJid.length > 0) {
      target = m.mentionedJid[0];
    } else if (m.quoted && m.quoted.sender) {
      target = m.quoted.sender;
    } else if (text) {
      const number = text.replace(/[^0-9]/g, '');
      target = number + '@s.whatsapp.net';
    } else {
      return m.reply('*Exemple:* *.getpp @52221XXX*');
    }

    try {
      const ppUrl = await conn.profilePictureUrl(target, 'image').catch(() => null);
      if (!ppUrl) return m.reply('*La photo de profil est privée ou introuvable.*');

      await haiko.sendMessage(from, {
        image: { url: ppUrl },
        caption: `✅ Photo de profil de : ${target.split('@')[0]}`
      }, { quoted: m });
    } catch (e) {
      console.error(e);
      m.reply('*Une erreur est survenue lors de la récupération.*');
    }
  }
});
