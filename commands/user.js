const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("upcoming")
    .setDescription("Provides Upcoming Competitions For a Given WCA ID (⚠ Slightly Slow, takes about 10 seconds)")
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
        `SELECT c.name AS competition, u.name, c.countryid, c.start_date AS date
        FROM Competitions c
        JOIN users u ON u.wca_id = '${wca}'
        WHERE c.id IN (
          SELECT competitionid FROM Results WHERE personid = '${wca}'
          UNION
          SELECT r.competition_id FROM registrations r
          JOIN Competitions c ON r.competition_id = c.id
          WHERE r.user_id = (SELECT id FROM users WHERE wca_id = '${wca}')
          AND c.start_date > CURRENT_DATE() AND r.accepted_at IS NOT NULL AND r.deleted_at IS NULL
        )
        AND c.start_date > CURRENT_DATE()
        ORDER BY c.start_date;
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
          const [competition, name, country, date] = entry;
          fields.push({name: competition, value: 'In '+country + ' on ' + formatDate(date)});
        });


        const embed = new EmbedBuilder()
      .setColor('#a439d1')
      .setTitle('Upcoming Competitions for ' + response.data.content[0][1])
      .addFields(fields)

      interaction.editReply({ embeds: [embed] });

    })
    function formatDate(dateString) {
      const date = new Date(dateString);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    }
  },
};



// "SELECT name AS competition, countryid, start_date AS date FROM Competitions WHERE id IN (SELECT competitionid FROM Results WHERE personid = '${wcaId}' UNION SELECT r.competition_id FROM registrations r JOIN Competitions c ON r.competition_id = c.id WHERE r.user_id = (SELECT id FROM users WHERE wca_id = '${wcaId}') AND c.start_date > CURRENT_DATE() AND r.accepted_at IS NOT NULL AND r.deleted_at IS NULL) AND start_date > CURRENT_DATE() ORDER BY start_date;"
// "SELECT competition_id FROM bookmarked_competitions WHERE user_id = (SELECT id FROM users WHERE wca_id = '${wcaId}') ORDER BY id DESC;"
// "SELECT GROUP_CONCAT(user_preferred_events.event_id) AS Preferred_Events FROM users  JOIN user_preferred_events ON users.id = user_preferred_events.user_id WHERE wca_id = '${wcaId}' GROUP BY users.id, users.name, users.wca_id;"



// const response3 = await fetch("https://statistics-api.worldcubeassociation.org/database/query", requestOptions3);
