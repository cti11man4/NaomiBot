const { SlashCommandBuilder } = require('@discordjs/builders');
const { owner } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shutdown')
		.setDescription('Shuts down the bot. Owner only.'),
	async execute(interaction) {
		const out = shutdown(interaction.user.id);
		await interaction.reply(out[0]);
		if(out[1]) process.exit();
	},
	pipe(uid) {
		return shutdown(uid);
	},
};

function shutdown(uid) {
	if (uid == owner) {
		return ['Shutting down. See you later!', true];
	}
	else {
		return [{content: 'That command isn\'t for you!', ephemeral: true}, false];
	}
}