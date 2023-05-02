const fs = require("node:fs");
const path = require("node:path");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] urmom is ${filePath} and missing da needed "data" shit
       or "execute" property.`
    );
  }
}
// When the client is ready, run this code (only once)
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

//auth key has to be Auth='WHATEVERTHEKEYIS'
let config = {
  method: 'get',
  maxBodyLength: Infinity,
  headers: { 
    'X-TBA-Auth-Key': process.env.TBA
  }
};

client.on(Events.MessageCreate, async (message) => {
  if (message.content.startsWith("!team")) {
    args = message.content.split(" ");
    console.log(args.length)
    if(args.length == 2){
      var blueres = await axios.request(`https://www.thebluealliance.com/api/v3/team/frc${args[1]}`,config)
      .catch((error) => {
        console.log(error);
      });
      
      
      console.log(blueres.data)
      message.channel.send(`Team ${args[1]} is ${blueres.data.nickname} from ${blueres.data.city}, ${blueres.data.state_prov}, ${blueres.data.country}`);
      message.reply('idiot')
      // statsres = await axios.get(`https://www.thebluealliance.com/api/v3/team/frc${args[1]}`);
    }
  }
});

client.login(process.env.token);