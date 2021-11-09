const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls some dice.'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
