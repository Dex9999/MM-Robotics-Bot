const { SlashCommandBuilder } = require("discord.js");
const dayjs = require("dayjs");
const { Collection } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("cat").setDescription("cat"),

  async execute(interaction) {
    await interaction.deferReply();
    //await interaction.editReply("yo mr white");

    const fetch = await import("node-fetch");
    const url = `https://api.thecatapi.com/v1/images/search?api_key=live_Znys3tUa9dQDI3chAw546jeQENFWR7kcM9iEUpfS8eafVYMTVvfswc6Yq617ccZ4`;

    const res = await fetch.default(url);

    const firstResponse = await res.json();
    console.log(firstResponse[0].url);
    await interaction.editReply(firstResponse[0].url + "\n");
  },
};
