const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token, owner } = require('./config.json');
const { waitForDebugger } = require('inspector');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

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

	const command = client.commands.get(interaction.commandName); // get command file by name

	if (!command) return;

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

// message handler
client.on("messageCreate", (message) => {
	if(message.author.bot) return false; // returns on messages sent by this bot
	
	// if message contains bot's name
	if(message.content.search(/naomi/i) > -1) {
		console.log(`Message from ${message.author.username}: ${message.content}`); // message logger
		if(message.content.search(/(shutdown)|(shut\sdown)/) > -1) { // temp: if message contains 'shutdown' or 'shut down'
			const out = client.commands.get('shutdown').pipe(message.author.id); // pipes allow this file to access functions outside of module.exports of each command
			message.reply(out[0])
				.then(() => process.exit());
		}
	}
  });

client.login(token);