const { SlashCommandBuilder } = require("discord.js");
const dayjs = require("dayjs");
const { Collection } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("comps")
    .setDescription("Provides information about upcoming Canadian comps."),

  async execute(interaction) {
    await interaction.deferReply();
    //await interaction.editReply("yo mr white");
    const getUpcomingCompetitions = async () => {
      const fetch = await import("node-fetch");
      //   const url = `https://www.worldcubeassociation.org/api/v0/competitions?sort=start_date&start=${dayjs().format(
      //     "YYYY-MM-DD"
      //   )}`;
      const url = `https://www.worldcubeassociation.org/api/v0/competitions?country_iso2=CA&sort=start_date&start=${dayjs().format(
        "YYYY-MM-DD"
      )}`;

      const res = await fetch.default(url);
      const numberOfPages = Math.ceil(
        res.headers.get("Total") / res.headers.get("Per-page")
      );

      const firstResponse = await res.json();
      console.log(firstResponse);

      // const responseArray = [];
      // for (let i = 2; i <= numberOfPages; i++) {
      //   const response = await fetch
      //     .default(url + "&page=" + i)
      //     .then((res) => res.json());
      //   responseArray.push(response);
      // }

      // const allResponses = [firstResponse, ...responseArray];
      // const competitions = allResponses.flatMap((response) =>
      //   response.map(
      //     ({ delegates, trainee_delegates, organizers, ...rest }) => rest
      //   )
      // );
      // console.log(competitions[0][0] + "\n Two:" + competitions[1][0]);
      //await interaction.editReply(competitions);
      await interaction.editReply(firstResponse[0].name + "\n");
    };
    await getUpcomingCompetitions();

    // const prettifyTwoDates = (startDateStr, endDateStr) => {
    //   const startDate = dayjs(startDateStr);
    //   const endDate = dayjs(endDateStr);
    //   const formattedDate = endDate.format("DD/MM/YYYY");

    //   if (startDate.year() === endDate.year()) {
    //     if (startDate.month() === endDate.month()) {
    //       if (startDate.day() === endDate.day()) {
    //         return formattedDate;
    //       }
    //       return `${startDate.format("DD")} au ${formattedDate}`;
    //     }
    //     return `${startDate.format("DD/MM")} au ${formattedDate}`;
    //   }
    //   return `${startDate.format("DD/MM/YYYY")} au ${formattedDate}`;
    // };

    // const getAllThreads = async (forum) => {
    //   const active = await forum.threads.fetchActive();
    //   const archived = await forum.threads.fetchArchived();

    //   return new Collection([...active.threads, ...archived.threads]);
    // };

    // // export { getUpcomingCompetitions, prettifyTwoDates, getAllThreads };
  },
};
