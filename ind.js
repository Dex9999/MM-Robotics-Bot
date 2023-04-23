const { Client, Events, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

//install the gitbook api
const GitbookAPI = require("gitbook-api");

const gitbookToken = "gb_api_EwZWXq3S9I4z7otdmNXlM94graiRznrZBIa6VmXi"; // your gitbook API token
const gitbookBookID = "rspveEci3s6ltmxEIOzQ"; // your gitbook book ID: https://app.gitbook.com/account/developer

client.on("ready", () => {
  console.log(`Ready!`);
});

client.on("messageCreate", async (message) => {
  if (message.content === "!createGitbook") {
    //fetch the messages, keep in mind you can't fetch more than 100 messages
    const channel = message.channel;
    const messages = await channel.messages.fetch({ limit: 100 });
    console.log(messages);
    const messagesArray = messages.array().reverse();
    //for each, split based on first line, then try to create a page with the content
    for (const msg of messagesArray) {
      const firstLine = msg.content.split("\n")[0];
      const pageTitle = firstLine.trim();
      const pageContent = msg.content.trim();

      const gitbookAPI = new GitbookAPI({ token: gitbookToken });
      try {
        const page = await gitbookAPI.pages.create(
          gitbookBookID,
          pageTitle,
          pageContent
        );
        console.log(`Created Gitbook page: ${page.url}`);
      } catch (error) {
        console.error(`Failed to create Gitbook page: ${error.message}`);
      }
    }
  }
});

client.login(
  "MTA5OTcxMzg4MDM1MzE2NTM1Mw.Ge2jh9.DloQmjsjh7ysAW_UmPVVov_h5z3xwUzgv2tqo0"
); // your discord bot token
