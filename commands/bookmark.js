const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bookmarked")
    .setDescription("Provides Bookmarked Competitions For a Given WCA ID (⚠ Slightly Slow, takes about 10 seconds)")
    .addStringOption((option) =>
      option
        .setName("wca_id")
        .setDescription("The id of the person")
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();
    let wca = interaction.options.getString("wca_id");
    const axios = require("axios");
    let data = JSON.stringify({
      sqlQuery:
        `SELECT bc.competition_id, u.name
        FROM bookmarked_competitions bc
        JOIN users u ON u.id = bc.user_id
        WHERE u.wca_id = '${wca}';
        `,
      page: 0,
      size: 20,
    });

    var token = await axios
        .request({
          method: "get",
          url: "https://algs.vercel.app/api",
          headers: {
            "content-type": "application/json",
          },
        })
    console.log(token.data)

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://statistics-api.worldcubeassociation.org/database/query",
      headers: {
        authorization: token.data,
        "content-type": "application/json",
      },
      data: data,
    };
    
    axios
      .request(config)
      .then((response) => {
        const fields = [];

        response.data.content.forEach((entry) => {
          const [competition] = entry;
          fields.push({name: competition, value: '​'});
        });


        const embed = new EmbedBuilder()
      .setColor('#a439d1')
      .setTitle(response.data.content[0][1]+"'s Bookmarked Competitions")
      .addFields(fields)

      interaction.editReply({ embeds: [embed] });

    })
  },
};



// "SELECT name AS competition, countryid, start_date AS date FROM Competitions WHERE id IN (SELECT competitionid FROM Results WHERE personid = '${wcaId}' UNION SELECT r.competition_id FROM registrations r JOIN Competitions c ON r.competition_id = c.id WHERE r.user_id = (SELECT id FROM users WHERE wca_id = '${wcaId}') AND c.start_date > CURRENT_DATE() AND r.accepted_at IS NOT NULL AND r.deleted_at IS NULL) AND start_date > CURRENT_DATE() ORDER BY start_date;"
