// discord-bot/index.js
// Interactive AI & Community Bot for HandleMyFile

import { 
  Client, 
  GatewayIntentBits, 
  REST, 
  Routes, 
  SlashCommandBuilder, 
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
  console.error('\x1b[31m[ERROR] DISCORD_TOKEN is missing in discord-bot/.env!\x1b[0m');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
  ],
});

// Slash Command Definitions
const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Cek respon dan latensi bot'),
  new SlashCommandBuilder()
    .setName('tools')
    .setDescription('Lihat daftar lengkap 30+ tools dokumen HandleMyFile'),
  new SlashCommandBuilder()
    .setName('pro')
    .setDescription('Informasi fitur akun PRO dan Founder Lifetime Pass'),
  new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Tanya jawab seputar fitur atau solusi kendala PDF')
    .addStringOption(opt => 
      opt.setName('pertanyaan')
         .setDescription('Apa yang ingin Anda tanyakan?')
         .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Panduan penggunaan bot dan menu bantuan'),
].map(cmd => cmd.toJSON());

client.once('ready', async () => {
  console.log(`\x1b[32m✔ HandleMyFile Bot online as ${client.user?.tag}!\x1b[0m`);

  // Register Slash Commands globally or per guild
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    console.log('Refreshing application (/) commands...');
    if (client.user) {
      await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commands }
      );
      console.log('\x1b[32m✔ Successfully registered global slash commands!\x1b[0m');
    }
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
});

// Slash Commands Interaction Handler
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    const latency = Date.now() - interaction.createdTimestamp;
    await interaction.reply({ content: `🏓 Pong! Latensi bot: **${latency}ms** (API: ${Math.round(client.ws.ping)}ms)`, ephemeral: true });
  }

  else if (commandName === 'tools') {
    const embed = new EmbedBuilder()
      .setColor(0xe11d48)
      .setTitle('🛠️ Daftar Lengkap Tools HandleMyFile')
      .setDescription('Semua tools berjalan **100% Client-Side** di browser Anda tanpa upload ke server luar:')
      .addFields(
        { name: '📄 Edit & Kelola PDF', value: '• **Merge PDF**\n• **Split PDF**\n• **Compress PDF** (Ringan/Sedang/Ekstrem)\n• **Rotate PDF**\n• **Number Pages / Penomoran**\n• **Delete Pages**' },
        { name: '🔄 Konversi File', value: '• **PDF to Word / Docx** (High Precision)\n• **Word to PDF**\n• **Excel to PDF / CSV**\n• **PPT to PDF**\n• **Image to PDF / JPG to PDF**' },
        { name: '🔒 Keamanan & Sertifikasi', value: '• **Protect / Encrypt PDF**\n• **Unlock PDF**\n• **Sign PDF** (ISO 32000-1 Adobe Acrobat compliant)\n• **SHA-256 Crypto Audit Trail Certificate**' }
      )
      .setFooter({ text: 'Akses gratis kapan saja di https://handlemyfile.com' });

    await interaction.reply({ embeds: [embed] });
  }

  else if (commandName === 'pro') {
    const embed = new EmbedBuilder()
      .setColor(0xf59e0b)
      .setTitle('💎 Keuntungan HandleMyFile PRO Tier')
      .setDescription('Tingkatkan produktivitas dokumen tanpa batas!')
      .addFields(
        { name: '🚀 Batch Processing Tanpa Batas', value: 'Proses ratusan dokumen sekaligus tanpa batasan kuota 3 batch per bulan.' },
        { name: '📜 Unlimited Cryptographic Audit Trail', value: 'Dapatkan sertifikat audit SHA-256 berstandar ISO 32000-1 tanpa batas kuota.' },
        { name: '🏷️ Kustomisasi Nama File Output', value: 'Bebas atur nama file unduhan sesuai kebutuhan kantor/perusahaan.' },
        { name: '👑 Akses 4-in-1 Suite', value: 'Satu akun SSO berlaku untuk HandleMyFile, HelpMyIMG, SolveMyMedia, & CreateMy-QR.' }
      )
      .setFooter({ text: 'Upgrade langsung di https://handlemyfile.com/pricing' });

    await interaction.reply({ embeds: [embed] });
  }

  else if (commandName === 'ask') {
    const q = interaction.options.getString('pertanyaan') || '';
    const qLower = q.toLowerCase();

    let answer = 'Untuk mengolah dokumen Anda secara gratis dan aman tanpa upload ke server, silakan kunjungi https://handlemyfile.com!';

    if (qLower.includes('compress') || qLower.includes('kecil') || qLower.includes('ukuran')) {
      answer = '💡 **Cara Kompres PDF**: Gunakan fitur **Compress PDF** di https://handlemyfile.com/compress-pdf. Tersedia mode Extreme, Recommended, dan Low compression tanpa mengurangi keterbacaan teks.';
    } else if (qLower.includes('merge') || qLower.includes('gabung')) {
      answer = '💡 **Cara Gabung PDF**: Gunakan fitur **Merge PDF** di https://handlemyfile.com/merge-pdf. Anda bisa drag-and-drop banyak file, atur urutan halaman, lalu download dalam 1 klik.';
    } else if (qLower.includes('sign') || qLower.includes('tanda tangan')) {
      answer = '💡 **Tanda Tangan Digital**: Fitur **Sign PDF** di https://handlemyfile.com/sign-pdf mendukung standar ISO 32000-1 Adobe Acrobat dengan visual certificate valid.';
    } else if (qLower.includes('pro') || qLower.includes('harga') || qLower.includes('biaya')) {
      answer = '💎 **Paket PRO**: Anda bisa memilih Monthly, Yearly, atau Founder Lifetime Pass di https://handlemyfile.com/pricing dengan garansi kuota batch & sertifikat audit tanpa batas.';
    }

    await interaction.reply({
      content: `> **Pertanyaan**: *${q}*\n\n${answer}`,
    });
  }

  else if (commandName === 'help') {
    const embed = new EmbedBuilder()
      .setColor(0x3b82f6)
      .setTitle('🤖 Panduan Perintah HandleMyFile Bot')
      .setDescription('Gunakan perintah slash (/) berikut:')
      .addFields(
        { name: '`/tools`', value: 'Melihat seluruh daftar 30+ fitur tools olah dokumen.' },
        { name: '`/pro`', value: 'Melihat informasi fitur dan manfaat upgrade ke akun PRO.' },
        { name: '`/ask <pertanyaan>`', value: 'Tanya jawab seputar kendala PDF atau panduan penggunaan.' },
        { name: '`/ping`', value: 'Memeriksa kecepatan respon bot.' }
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
});

// Handle Direct Mentions in Chat
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // If user mentions the bot
  if (client.user && message.mentions.has(client.user)) {
    const cleanContent = message.content.replace(/<@!?[0-9]+>/g, '').trim();
    if (!cleanContent) {
      await message.reply('Halo! Ada yang bisa saya bantu seputar dokumen atau tools di **HandleMyFile**? Ketik `/help` atau `/tools` untuk melihat menu.');
      return;
    }

    const lower = cleanContent.toLowerCase();
    if (lower.includes('halo') || lower.includes('hai')) {
      await message.reply(`Halo <@${message.author.id}>! Selamat datang di komunitas HandleMyFile. Butuh bantuan dengan file dokumen Anda hari ini?`);
    } else {
      await message.reply(`Terima kasih atas pertanyaannya! Untuk bantuan lengkap seputar dokumen, Anda bisa gunakan perintah \`/ask ${cleanContent}\` atau langsung buka website di https://handlemyfile.com.`);
    }
  }
});

client.login(TOKEN);
