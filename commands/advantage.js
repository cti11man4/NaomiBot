const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('advantage')
		.setDescription('Rolls two d20s and returns the better (or worse) result.')
		.addBooleanOption(option =>
			option.setName('disadvantage')
				.setDescription('Set to true for disadvantage.')
				.setRequired(false)),
	async execute(interaction) {
        let disadv = interaction.options.getBoolean('disadvantage');
        // if(disadv == null) disadv = false;

        let out = 'Here\'s what I rolled:\n';
        let rolls = [];
        rolls.push(Math.floor(Math.random()*20)+1);
        rolls.push(Math.floor(Math.random()*20)+1);
        out += '`Rolls: ' + rolls[0] + ', ' + rolls[1] + '`\n';
        out += '`Outcome: ';

        if(disadv) out += Math.min(rolls[0],rolls[1]) + '`';
        else out += Math.max(rolls[0],rolls[1]) + '`';

        await interaction.reply(out);
	},
};
