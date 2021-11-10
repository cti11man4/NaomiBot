const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token, owner } = require('./config.json');
const { waitForDebugger } = require('inspector');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// collect the list of commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// prints once when bot is online
client.once('ready', () => {
	console.log('Ready!');
});

// command handler
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return; // returns on non-slash commands

	const command = client.commands.get(interaction.commandName); // get name of command

	if (!command) return;

	if(interaction.commandName == 'shutdown' && interaction.user.id == owner) {
		await interaction.reply('Shutting down. See you later!');
		process.exit();
	}
	else {
		try {
			await command.execute(interaction); // calls execute function for given command
		} 
		catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(token);
