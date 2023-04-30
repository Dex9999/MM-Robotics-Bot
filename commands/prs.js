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
    .setName("pr")
    .setDescription("Provides information about someone's PR's")
    .addStringOption((option) =>
      option
        .setName("wca_id")
        .setDescription("The id of the person (can also be a search query eg. 'max park')")
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
      const centiToMSC = n => {
        const padWithZero = n => n.toString().padStart(2, 0);
        const centiseconds = n % 100;
        n = (n - centiseconds) / 100;
        const seconds = n % 60;
        const minutes = (n - seconds) / 60;
        return `${minutes}:${padWithZero(seconds)}.${padWithZero(centiseconds)}`;
      };

      function expandName(str) {
        if(str == '333mbf') return '3x3 Multi-Blind'
        if(str == '333fm') return '3x3 Fewest Moves'
        if(str == '333oh') return '3x3 One-Handed'
        if(str == '333ft') return '3x3 With Feet'
        if(str == '444bf') return '4x4 Multi-Blind'
        if(str == '555bf') return '5x5 Multi-Blind'
        if(str == '333') return '3x3'
        if(str == '222') return '2x2'
        if(str == '444') return '4x4'
        if(str == '555') return '5x5'
        if(str == '666') return '6x6'
        if(str == '777') return '7x7'
        if(str == 'pyram') return 'Pyraminx'
        if(str == 'minx') return 'Megaminx'
        if(str == 'sq1') return 'Square-1'
        if(str == 'clock') return 'Clock'
        if(str == 'skewb') return 'Skewb'
      }
       
      var arr = []
      for(let i = 0; i < Object.keys(e.personal_records).length; i++){
       //a json where the events can just not be there so can't use array options
        var itemId = Object.keys(e.personal_records)[i]
        var item = e.personal_records[itemId]
        var event = itemId
        var single = 'single: '+centiToMSC(item.single.best)
        if(item.average != null){
        var avg = 'average: '+centiToMSC(item.average.best)
        var rankAvg = item.average.world_rank
        } else {
          var avg = null
          //last place for 3x3 single x 10
          var rankAvg = 1832000
        }
        console.log(event, single, avg, rankAvg)
        arr.push({event, single, avg, rankAvg})
      }
      arr.sort((a, b) => a.rankAvg - b.rankAvg);
      mainEvent = ' - '+expandName(arr[0].event)+' Main (WR'+arr[0].rankAvg+')'

      const embed = new EmbedBuilder()
        .setTitle(e.person.name)
        .setURL(`https://www.worldcubeassociation.org/persons/${e.person.id}`)
        .setDescription("`"+e.person.id+mainEvent+"`")
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
