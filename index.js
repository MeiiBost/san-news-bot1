const { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, REST, Routes } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Daftarkan Slash Command secara otomatis saat bot aktif
const commands = [
  new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Kirim info SAN News')
    .addStringOption(opt => opt.setName('handle_name').setDescription('Nama penanggung jawab').setRequired(true))
    .addStringOption(opt => opt.setName('status').setDescription('Status Open/Close').setRequired(true))
    .addStringOption(opt => opt.setName('payment_time').setDescription('Waktu pembayaran').setRequired(true))
    .addStringOption(opt => opt.setName('location').setDescription('Lokasi pembuatan').setRequired(true))
    .addStringOption(opt => opt.setName('note').setDescription('Catatan tambahan').setRequired(true))
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('🔁 Daftar ulang slash command...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('✅ Slash command berhasil disinkron ulang!');
  } catch (error) {
    console.error('❌ Gagal daftar command:', error);
  }
})();

client.once('ready', () => {
  console.log(`✅ Bot aktif sebagai ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'settings') {
    const handle_name = interaction.options.getString('handle_name');
    const status = interaction.options.getString('status');
    const payment_time = interaction.options.getString('payment_time');
    const location = interaction.options.getString('location');
    const note = interaction.options.getString('note');

    const embed = new EmbedBuilder()
      .setTitle('__San Andreas News Network Payment__')
      .setColor(0x003366)
      .addFields(
        { name: 'Handle payment', value: handle_name },
        { name: 'Status', value: status },
        { name: 'Payment time', value: payment_time },
        { name: 'Location', value: location },
        { name: 'Note', value: note }
      )
      .setImage('https://i.imgur.com/lrV5vVB.png');

    await interaction.reply({ embeds: [embed] });
  }
});

client.login(process.env.DISCORD_TOKEN);