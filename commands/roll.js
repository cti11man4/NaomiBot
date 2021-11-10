const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls some dice. Defaults to d20.')
		.addStringOption(option =>
			option.setName('dice')
				.setDescription('Uses standard dice notation.')
				.setRequired(false))
		.addBooleanOption(option =>
			option.setName('hidden')
				.setDescription('Makes the outcome visible only to the user.')
				.setRequired(false)),
	async execute(interaction) {
		let dice = interaction.options.getString('dice');		// get dice value (if any)
		const hidden = interaction.options.getBoolean('hidden');

		interaction.reply({content: diceRoll(dice), ephemeral: hidden});
	},
	pipe(dice) {
		return diceRoll(dice);
	}
};
	
function diceRoll(dice) {
	let out = 'Here\'s what I rolled:\n'					// output string
	let pos = true;											// indicates positive or negative roll
	let more = false;										// more than one dice size?
	let num = 0;											// number of dice to roll
	let size = 0;											// size of dice to roll
	let curr = 0;											// current roll
	let total = 0;											// current roll total
	let result = 0;											// total result
	let constAdd = false;									// indicates the presence of constants
	let constant = 0;										// result of constants

	if(dice == null) dice = 'd20';							// check if dice value is null
	else dice = dice.toLowerCase().replaceAll(' ','');		// remove whitespace

	// regex: ensures dice value is of the form
	// #d# (+/- #(d#) +/- #(d#) +/- ...)
	const re = /\d*d\d+(((\+|\-)\d*d\d+)*((\+|\-)\d*)*)*/;
	const found = dice.match(re);							// check if dice value matches regex
	if(!(found[0] == dice)) {
		return 'Sorry, I can\'t roll that input.';
	}

	// splits rolls and constants into an array, preserves sign
	let rolls = [dice.match(/\d*d\d+/i)[0]];
	for(r of dice.matchAll(/((\+|\-)\d*d\d+)|((\+|\-)\d*)/g)) {
		if(r[0] != '') rolls.push(r[0]);
		more = true;
	}

	// organizes and calculates rolls
	for(r of rolls) {
		// calculate constants separately
		if(!(r.includes('d'))) {
			constant += parseInt(r);
			constAdd = true;
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
		num = parseInt(r.substring(0,parseInt(r.indexOf('d'))));
		size = parseInt(r.substring(1 + parseInt(r.indexOf('d'))));

		if (num > 10000 || size > 10000) {
			return 'I might break if I roll numbers that big.';
		}

		// generate rolls
		for(let i = 0; i < num; i++) {
			curr = Math.floor(Math.random() * size) + 1;
			total += curr;
			if(i > 0) {
				out += ', ';
			}
			out += curr;
		}

		// completes line in output
		if(!(r[0] == '1' && r[1] == 'd')) out += ' => ' + total;
		out += '`\n';

		if(pos) result += total;
		else result -= total;
	}

	// adds constant to output and result
	if(constAdd) {
		out += '`Constant: ' + constant + '`\n';
		result += constant;
	}
	if(more) out += '`' + dice + ' => ' + result +'`';

	return out;
}
