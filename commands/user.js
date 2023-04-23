const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Provides information about the user."),
  async execute(interaction) {
    const axios = require("axios");
    let data = JSON.stringify({
      sqlQuery:
        "SELECT ROW_NUMBER() OVER (ORDER BY start_date) comp_number, start_date > CURRENT_DATE() upcoming, '2022OLEA04' personid, (SELECT name FROM Persons WHERE id = '2022OLEA04' AND subid = 1) personname, name competition, countryid, start_date date FROM Competitions WHERE id IN (SELECT competitionid FROM Results WHERE personid = '2022OLEA04' UNION SELECT r.competition_id FROM registrations r JOIN Competitions c ON r.competition_id = c.id WHERE r.user_id = (SELECT id FROM users WHERE wca_id = '2022OLEA04') AND c.start_date > CURRENT_DATE() AND r.accepted_at IS NOT NULL AND r.deleted_at IS NULL) ORDER BY start_date DESC",
      page: 0,
      size: 20,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://statistics-api.worldcubeassociation.org/database/query",
      headers: {
        authorization: "Bearer 6tAed0Lt9m8ab70CA5z8oD1SbESM_UD0Z2OpCgtPC7Y",
        "content-type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
