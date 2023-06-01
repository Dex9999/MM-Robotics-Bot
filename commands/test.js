const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("test"),

  async execute(interaction) {
    await interaction.deferReply();
    const axios = require('axios');

    async function getNewCompetitions() {
    const url = 'https://www.worldcubeassociation.org/api/v0/competitions?country_iso2=CA&start=2023-06-01&page=1';
    let page = 1;
    let competitions = [];

    while (true) {
        const response = await axios.get(`${url}&page=${page}`);
        const currentPageCompetitions = response.data;

        if (currentPageCompetitions.length === 0) {
        // No more competitions, break the loop
        break;
        }

        competitions = competitions.concat(currentPageCompetitions);

        // Check if the total number of competitions exceeds 23
        if (competitions.length > 23) {
        break;
        }

        page++;
    }

    // Load previously saved competitions (assuming it's an array)
    const savedCompetitions = loadSavedCompetitions();

    const newCompetitions = [];
    for (const competition of competitions) {
        const { id, name, registration_open, registration_close, announced_at, start_date, end_date, competitor_limit, url, venue_address, event_ids } = competition;

        // Check if the competition is new (not in savedCompetitions)
        const isNewCompetition = !savedCompetitions.some((savedCompetition) => savedCompetition.id === id);

        if (isNewCompetition) {
        newCompetitions.push({
            id,
            name,
            registration_open,
            registration_close,
            announced_at,
            start_date,
            end_date,
            competitor_limit,
            url,
            venue_address,
            event_ids,
        });
        }
    }

    // Save the new competitions for future comparison
    saveCompetitions(competitions);

    // Log the new competitions
    console.log('New Competitions:');
    console.log(newCompetitions);
    }

    // Function to load previously saved competitions (replace with your own implementation)
    function loadSavedCompetitions() {
    // Return an array of saved competitions
    // Replace with your own logic to load the data
    return [{
        id: 'WinnipegOpen2023',
        name: 'Winnipeg Open 2023',
        registration_open: '2023-04-30T22:00:00.000Z',
        registration_close: '2023-06-13T04:59:00.000Z',
        announced_at: '2023-04-25T20:48:25.000Z',
        start_date: '2023-06-17',
        end_date: '2023-06-18',
        competitor_limit: 90,
        url: 'https://www.worldcubeassociation.org/competitions/WinnipegOpen2023',
        venue_address: '1170 Corydon Ave, Winnipeg, MB R3M 0Z1, Canada',
        event_ids: [
          '333',   '222',
          '444',   '777',
          '333bf', 'minx',
          'pyram', 'skewb'
        ]
      },
      {
        id: 'PleaseBeSolvedVancouver2023',
        name: 'Please Be Solved Vancouver 2023',
        registration_open: '2023-03-29T03:00:00.000Z',
        registration_close: '2023-06-08T03:00:00.000Z',
        announced_at: '2023-03-06T18:17:25.000Z',
        start_date: '2023-06-17',
        end_date: '2023-06-17',
        competitor_limit: 40,
        url: 'https://www.worldcubeassociation.org/competitions/PleaseBeSolvedVancouver2023',
        venue_address: '6138 Student Union Blvd, Vancouver, BC V6T 1Z1',
        event_ids: [ '333bf', '444bf', '555bf', '333mbf' ]
      }];
    }

    // Function to save the competitions (replace with your own implementation)
    function saveCompetitions(competitions) {
    // Save the competitions data
    // Replace with your own logic to save the data
    }

    // Call the function to get new competitions
    getNewCompetitions();


    function formatDate(dateString) {
      const date = new Date(dateString);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    }
  },
};