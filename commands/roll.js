const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls some dice. Defaults to d20.')
		.addStringOption(option =>
			option.setName('dice')
				.setDescription('Uses standard dice notation.')
				.setRequired(false))
		.addStringOption(option =>
			option.setName('advantage')
				.setDescription('Roll with advantage or disadvantage.')
				.setRequired(false)
				.addChoice('Advantage', 'adv')
				.addChoice('Disadvantage', 'dis')),
	async execute(interaction) {
		let dice = interaction.options.getString('dice');		// get dice value (if any)
		const adv = interaction.options.getString('advantage');	// get advantage or disadvantage (if any)

		if(dice == null) dice = 'd20';							// check if dice value is null
		else dice = dice.toLowerCase().replaceAll(' ','');		// remove whitespace

		// regex: ensures dice value is of the form
		// #d# (+/- #(d#) +/- #(d#) +/- ...)
		const re = /\d*d\d+(((\+|\-)\d*d\d+)*((\+|\-)\d*)*)*/;
		const found = dice.match(re);							// check if dice value matches regex
		if(found == null) {
			await interaction.reply('Sorry, I can\'t roll that input.');
			return;
		}

		// splits rolls and constants into an array, preserves sign
		let rolls = [dice.match(/\d*d\d+/i)[0]];
		console.log(dice.match(/\d*d\d+/i)[0]);
		for(r of dice.matchAll(/((\+|\-)\d*d\d+)|((\+|\-)\d*)/g)) {
			if(r[0] != '') rolls.push(r[0]);
		}

		let out = 'Here\'s what I rolled:\n'					// output string
		let pos = true;											// indicates positive or negative roll
		let curr = 0;											// current roll
		let total = 0;											// current roll total
		let result = 0;											// total result
		let constant = 0;										// result of constants

		// organizes and calculates rolls
		for(r of rolls) {
			// calculate constants separately
			if(!(r.includes('d'))) {
				constant += parseInt(r);
				continue;
			}

			// checks and removes sign
			if(r.search(/\+|\-/) > -1) {
				if(r[0] == '-') pos = false;
				else pos = true;
				r = r.substring(1);
			}

			// simplifies dice
			if(r[0] == 'd') r = '1'.concat(r);

			out += '`' + r + ': ';
			curr = 0;
			total = 0;

			// generate rolls
			for(let i = 0; i < parseInt(r.substring(0,parseInt(r.indexOf('d')))); i++) {
				curr = Math.floor(Math.random() * parseInt(r.substring(1 + parseInt(r.indexOf('d'))))) + 1;
				total += curr;
				if(i > 0) {
					out += ', ';
				}
				out += curr;
			}

			if(!(r[0] == '1' && r[1] == 'd')) out += ' => ' + total;
			out += '`\n';

			if(pos) result += total;
			else result -= total;
		}

		if(constant != 0) {
			out += '`Constant: ' + constant + '`\n';
			result += constant;
		}
		out += '`' + dice + ' => ' + result +'`';

		console.log(out);
		await interaction.reply(out);
	},
};
