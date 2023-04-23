//use subscriptions graphql wca live api to update rounds, ping person in server if they're added
//https://lucasconstantino.github.io/graphiql-online/
//https://www.netlify.com/blog/2020/12/21/send-graphql-queries-with-the-fetch-api-without-using-apollo-urql-or-other-graphql-clients/
//https://live.worldcubeassociation.org/api/graphql

const { SlashCommandBuilder } = require("discord.js");
const { Collection } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("recent")
    .setDescription("Provides information about recent records"),

  async execute(interaction) {
    await interaction.deferReply();
    //await interaction.editReply("yo mr white");
    const getUpcomingCompetitions = async () => {
      res = axios.post(
        "https://live.worldcubeassociation.org/api/graphql",
        {
          query: `
    {
      recentRecords {
        type
        tag
        attemptResult
        result {
          person {
            name
            country {
              iso2
              name
            }
          }
          round {
            id
            competitionEvent {
              event {
                id
                name
              }
              competition {
                id
                name
              }
            }
          }
        }
      }
    }
  `,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res.data);
      // .then((result) => console.log(result));
      const firstResponse = await res.json();

      const responseArray = [];
      for (let i = 2; i <= numberOfPages; i++) {
        const response = await fetch
          .default(url + "&page=" + i)
          .then((res) => res.json());
        responseArray.push(response);
      }

      const allResponses = [firstResponse, ...responseArray];
      const competitions = allResponses.flatMap((response) =>
        response.map(
          ({ delegates, trainee_delegates, organizers, ...rest }) => rest
        )
      );
      console.log(competitions[0][0] + "\n Two:" + competitions[1][0]);
      //await interaction.editReply(competitions);
      await interaction.editReply(
        competitions[0][0] + "\n Two:" + competitions[1][0]
      );
    };
    await getUpcomingCompetitions();
  },
};
