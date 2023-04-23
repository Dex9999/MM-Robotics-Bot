//use subscriptions graphql wca live api to update rounds, ping person in server if they're added
//https://lucasconstantino.github.io/graphiql-online/
//https://www.netlify.com/blog/2020/12/21/send-graphql-queries-with-the-fetch-api-without-using-apollo-urql-or-other-graphql-clients/
//https://live.worldcubeassociation.org/api/graphql

const { EmbedBuilder } = require("@discordjs/builders");
const { default: axios } = require("axios");
const { SlashCommandBuilder, MessageCollector } = require("discord.js");
const { Collection } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("id")
    .setDescription("Provides information about a given WCA_ID")
    .addStringOption((option) =>
      option
        .setName("wca_id")
        .setDescription("The id of the person")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();
    let wca_id = interaction.options.getString("wca_id");

    res = await axios.get(
      `https://www.worldcubeassociation.org/api/v0/persons?q=${wca_id.replace(
        " ",
        "+"
      )}`
    );
    var e = res.data;
    if (Array.isArray(res.data)) {
      var e = res.data[0];
    } else {
      var e = res.data;
    }
    if (e) {
      const embed = new EmbedBuilder()
        .setTitle(e.person.name)
        .setURL(`https://www.worldcubeassociation.org/persons/${e.person.id}`)
        .setDescription("`" + e.person.id + "`")
        .addFields(
          {
            name: "Country: ",
            value: `:flag_${e.person.country_iso2.toLowerCase()}:`,
            inline: true,
          },
          {
            name: "Competitions: ",
            value: e.competition_count.toString(),
            inline: true,
          },
          {
            name: "Medals: ",
            value:
              "`" +
              e.medals.gold +
              "🥇   " +
              e.medals.silver +
              "🥈   " +
              e.medals.bronze +
              "🥉`",
            inline: true,
          },
          {
            name: "Records:",
            value: e.records.total.toString(),
          }
        )
        //   .setImage(e.person.avatar.url)
        .setThumbnail(e.person.avatar.url)
        .setColor(0xa349d1);

      //await interaction.editReply(competitions);
      await interaction.editReply({ embeds: [embed] });
    } else {
      await interaction.editReply("invalid query: " + wca_id);
    }
  },
};

// const collector = new MessageCollector(
//       interaction.channel,
//       (m) => m.author.id === message.author.id,
//       { time: 10000 }
//     );
//     console.log(collector);
//     collector.on("collect", (message) => {
//       if (message.content === "kys") {
//         message.channel.send("no u!");
//       }
//     });
