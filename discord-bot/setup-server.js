// discord-bot/setup-server.js
// Automated Discord Server Architect for HandleMyFile
// Creates Categories, Channels, Roles, and Welcome Embeds in seconds.

import { 
  Client, 
  GatewayIntentBits, 
  ChannelType, 
  PermissionFlagsBits, 
  EmbedBuilder 
} from 'discord.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const TOKEN = process.env.DISCORD_TOKEN;

if (!TOKEN || TOKEN.trim() === '') {
  console.error('\x1b[31m[ERROR] DISCORD_TOKEN is missing!\x1b[0m');
  console.log('Please put your bot token inside discord-bot/.env:');
  console.log('DISCORD_TOKEN=your_token_here\n');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once('ready', async () => {
  console.log(`\x1b[32m✔ Logged in as ${client.user?.tag}!\x1b[0m`);

  const guild = client.guilds.cache.first();
  if (!guild) {
    console.error('\x1b[31m[ERROR] The bot is not in any Discord server yet!\x1b[0m');
    console.log('Please invite the bot using your OAuth2 link first, then re-run this script.');
    process.exit(1);
  }

  console.log(`\x1b[36m🚀 Target Server: "${guild.name}" (ID: ${guild.id})\x1b[0m`);
  console.log('Starting automated server architecture setup...\n');

  try {
    // 1. Create Roles
    console.log('--> [1/4] Configuring Server Roles...');
    const existingRoles = await guild.roles.fetch();

    const rolesToCreate = [
      { name: '👑 Owner', color: 0xf59e0b, hoist: true },
      { name: '🛡️ Moderator', color: 0x3b82f6, hoist: true },
      { name: '💎 PRO Member', color: 0xec4899, hoist: true },
      { name: '🌟 Member', color: 0x10b981, hoist: true },
    ];

    const createdRoles = {};
    for (const r of rolesToCreate) {
      let role = existingRoles.find(er => er.name === r.name);
      if (!role) {
        role = await guild.roles.create({
          name: r.name,
          color: r.color,
          hoist: r.hoist,
          reason: 'Automated HandleMyFile server setup',
        });
        console.log(`    + Created role: ${r.name}`);
      } else {
        console.log(`    = Role exists: ${r.name}`);
      }
      createdRoles[r.name] = role;
    }

    const proRole = createdRoles['💎 PRO Member'];
    const everyoneRole = guild.roles.everyone;

    // 2. Setup Categories & Channels
    console.log('\n--> [2/4] Building Channels & Categories...');

    const structure = [
      {
        category: '📢 ︱ INFORMASI & RULES',
        channels: [
          { name: '📜・rules', type: ChannelType.GuildText, readOnly: true },
          { name: '📢・announcements', type: ChannelType.GuildText, readOnly: true },
          { name: '🎁・updates-and-perks', type: ChannelType.GuildText, readOnly: true },
        ],
      },
      {
        category: '💬 ︱ COMMUNITY LOUNGE',
        channels: [
          { name: '💬・general-chat', type: ChannelType.GuildText },
          { name: '💡・suggestions-feedback', type: ChannelType.GuildText },
          { name: '📸・media-and-shares', type: ChannelType.GuildText },
        ],
      },
      {
        category: '🛠️ ︱ DOKUMEN & BANTUAN',
        channels: [
          { name: '❓・ask-support', type: ChannelType.GuildText },
          { name: '🐛・bug-reports', type: ChannelType.GuildText },
          { name: '🤖・bot-commands', type: ChannelType.GuildText },
        ],
      },
      {
        category: '💎 ︱ PRO & VIP LOUNGE',
        proOnly: true,
        channels: [
          { name: '💎・pro-chat', type: ChannelType.GuildText },
          { name: '🚀・early-access', type: ChannelType.GuildText },
        ],
      },
      {
        category: '🔊 ︱ VOICE ROOMS',
        channels: [
          { name: '🔊・Lounge (Voice)', type: ChannelType.GuildVoice },
          { name: '🎧・Focus Room (Voice)', type: ChannelType.GuildVoice },
        ],
      },
    ];

    let rulesChannel = null;
    let announcementsChannel = null;

    for (const group of structure) {
      // Create category
      let categoryOverwrites = [];
      if (group.proOnly && proRole) {
        categoryOverwrites = [
          { id: everyoneRole.id, deny: [PermissionFlagsBits.ViewChannel] },
          { id: proRole.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        ];
      }

      const cat = await guild.channels.create({
        name: group.category,
        type: ChannelType.GuildCategory,
        permissionOverwrites: categoryOverwrites,
      });
      console.log(`  📁 Category: ${group.category}`);

      for (const ch of group.channels) {
        let channelOverwrites = [];
        if (ch.readOnly) {
          channelOverwrites = [
            { id: everyoneRole.id, deny: [PermissionFlagsBits.SendMessages] },
          ];
        }

        const channel = await guild.channels.create({
          name: ch.name,
          type: ch.type,
          parent: cat.id,
          permissionOverwrites: channelOverwrites,
        });

        if (ch.name === '📜・rules') rulesChannel = channel;
        if (ch.name === '📢・announcements') announcementsChannel = channel;

        console.log(`    # ${ch.name}`);
      }
    }

    // 3. Post Professional Rules Embed
    if (rulesChannel) {
      console.log('\n--> [3/4] Posting Rules Embed...');
      const rulesEmbed = new EmbedBuilder()
        .setColor(0xe11d48)
        .setTitle('📜 TATA TERTIB & ATURAN SERVER')
        .setDescription(
          'Selamat datang di komunitas resmi **HandleMyFile**! Untuk menjaga komunitas tetap nyaman, produktif, dan aman bagi semua anggota, harap patuhi aturan berikut:'
        )
        .addFields(
          { name: '1. Saling Menghormati', value: 'Perlakukan setiap anggota dengan sopan dan ramah. Dilarang keras melakukan pelecehan, ujaran kebencian, atau diskriminasi.' },
          { name: '2. Gunakan Kanal yang Sesuai', value: 'Kirim pesan dan pertanyaan di kanal yang tepat (misal: pertanyaan teknis di `#ask-support`, chat santai di `#general-chat`).' },
          { name: '3. Privasi & Dokumen Rahasia', value: 'Jangan membagikan file pribadi, data sensitif, atau dokumen rahasia di kanal publik.' },
          { name: '4. Dilarang Spam & Iklan Liar', value: 'Promosi diri tanpa izin dan spamming dalam bentuk apapun tidak diperbolehkan.' },
          { name: '5. Laporkan Kendala', value: 'Jika menemukan bug di website atau ada hal mencurigakan, laporkan di `#bug-reports`.' }
        )
        .setFooter({ text: 'HandleMyFile Community • 100% Private Client-Side Document Tools' })
        .setTimestamp();

      await rulesChannel.send({ embeds: [rulesEmbed] });
    }

    // 4. Post Welcome Announcement Embed
    if (announcementsChannel) {
      console.log('--> [4/4] Posting Welcome Announcement Embed...');
      const welcomeEmbed = new EmbedBuilder()
        .setColor(0x10b981)
        .setTitle('🎉 SERVER HANDLEMYFILE TELAH RESMI DIBUKA!')
        .setDescription(
          'Selamat datang di server komunitas **HandleMyFile** — platform olah dokumen 100% aman, client-side, tanpa upload ke server luar!'
        )
        .addFields(
          { name: '🌐 Kunjungi Website', value: '[https://handlemyfile.com](https://handlemyfile.com)' },
          { name: '⚡ Fitur Utama', value: '30+ Tools PDF & Dokumen (Merge, Split, Compress, Sign ISO 32000-1, Convert Word/Excel/PPT, dan SHA-256 Audit).' },
          { name: '💎 PRO Tier & Lifetime Pass', value: 'Dapatkan kuota batch tanpa batas dan fitur premium melalui [Pricing Page](https://handlemyfile.com/pricing).' },
          { name: '🤖 Bantuan AI', value: 'Gunakan bot di channel `#bot-commands` atau mention bot kapan saja untuk tanya jawab.' }
        )
        .setFooter({ text: 'Arsitektur server berhasil disetup otomatis oleh AI Agent' })
        .setTimestamp();

      await announcementsChannel.send({ embeds: [welcomeEmbed] });
    }

    console.log('\n\x1b[32m=================================================================\x1b[0m');
    console.log('\x1b[32m🎉 SELESAI! Seluruh kategori, channel, role & embed berhasil dibuat!\x1b[0m');
    console.log('\x1b[32m=================================================================\x1b[0m\n');
  } catch (err) {
    console.error('\x1b[31m[ERROR] Terjadi kesalahan saat membangun server:\x1b[0m', err);
  } finally {
    client.destroy();
    process.exit(0);
  }
});

client.login(TOKEN).catch((err) => {
  console.error('\x1b[31m[ERROR] Gagal login ke Discord. Pastikan DISCORD_TOKEN Anda valid!\x1b[0m', err.message);
  process.exit(1);
});
