const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shutdown')
		.setDescription('Shuts down the bot. Owner only.'),
};