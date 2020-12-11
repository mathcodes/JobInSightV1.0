const router = require('express').Router();
const parseString = require('xml2js').parseString;
const bbcUrl = 'http://feeds.bbci.co.uk/news/rss.xml';
const sportUrl = 'http://www.football-data.co.uk/mmz4281/1718/I1.csv';
const axios = require('axios').default;
const CSVtoJSON = require('csvtojson');
const Team = require('../models/Team');
const port = process.env.PORT || 5000;

// Auth
const auth = require('../config/auth');

/**
 * POST
 * Favourite Team
 */
router.post('/sport/team', auth, async (req, res) => {
  // Checking if the user has team entry
  const teamExists = await Team.findOne({userId: req.user._id});
  var teamFound = false;

  // check for valid team in the array of italian teams in the csv
  const domain = req.headers.host;
  try {
    const res = await axios.get('http://'+domain+'/api/news/sport', {
      headers: {
        'Authorization': req.header('Authorization')
      }
    });
    if (res.status === 200) {
      // get teams array
      const teamsArr = res.data;
      // check if team exists in that array
      teamFound = teamsArr.filter(e => e.teamName.toLowerCase() === req.body.team.toLowerCase()).length > 0;
    }
  } catch (err) {
    console.log(err);
  }
  
  // Save team in DB
  if (!teamExists && teamFound) {
      // Create a new team entry
      const entry = new Team({
          userId: req.user._id
      });
      entry.team =  req.body.team;
      try {
          const savedEntry = await entry.save();
          res.send(savedEntry);
      } catch(err) {
          res.status(400).send(err);
      }
  } 
  else if (teamExists && teamFound) {
      // add to existing entry
      const entry = teamExists;
      entry.team = req.body.team;
      try {
          const savedEntry = await entry.save();
          res.send(savedEntry);
      } catch(err) {
          console.log(err);
          res.status(400).send(err);
      }
    } else {
      res.status(400).send('Team not found');
    }
});

/**
 * GET
 * User Team Data
 */
router.get('/sport/team', auth, async (req, res) => {

  // Checking if the user has tasks entry
  const teamExists = await Team.findOne({userId: req.user._id});

  // retrieve task data
  const entry = teamExists;
  try {
      res.send(entry);
  } catch(err) {
      console.log(err);
      res.status(400).send(err);
  }
});


/**
 * GET
 * XML BBC News Converted in JSON
 */
router.get('/bbc', auth, async (req, res) => {
  // get xml news data
  try {
    const xmlRes = await axios.get(bbcUrl);
    // parse xml response data
    const parsedXml = parseString(xmlRes.data, (err, result) => {
      const json = JSON.stringify(result);
      res.send(json);
    });
  } catch (err) {
    console.log(err.message);
  }
})

/**
 * GET
 * CSV Sport News
 */
router.get('/sport', auth, async (req, res) => {
  // get csv data 
  const response = await axios.get(sportUrl);
  const csvString = response.data;
  // conv csv to json
  CSVtoJSON().fromString(csvString)
    .then((source) => {
      const matchDataArr = [];
      source.forEach((row) => {
        matchDataArr.push({
          homeTeam: row.HomeTeam,
          awayTeam: row['AwayTeam'],
          fullTimeResult: row['FTR'],
        });
      })
      // filter out necessary data
      // we want an array with team objects as follows
      const teamsArr = [
        /* 
        {
          team: 'Juventus',
          teamsBeaten: ['Cagliari', 'Napoli']
        }, ...
        */
      ];
      // Loop through teamArr data 
      matchDataArr.forEach((matchData) => {
        // create structure for team objects
        const teamArrObj = {
          teamName: "",
          teamsBeaten: []
        };
        // -- CODE BELOW NEEDS TO BE OPTIMISED --
        // if HOME TEAM wins add home team as team name and away team to teams beaten list
        if (matchData.fullTimeResult === 'H') {
          // check if that team object is already in the teams array
          if (teamsArr.filter(e => e.teamName === matchData.homeTeam)) {
            // if it is found then just add away team to their teams beaten
            teamsArr.forEach((teamData) => {
              if (teamData.teamName === matchData.homeTeam) {
                teamData.teamsBeaten.push(matchData.awayTeam);
              }
            })
            // get rid of duplicates in teamsBeaten array incase they are already added

          } else {
            // add new entry for the team to teamsArr
            teamArrObj.teamName = matchData.homeTeam;
            teamArrObj.teamsBeaten.push(matchData.awayTeam);
          }

        // if AWAY TEAM wins add away team as team name and home team to teams beaten list
        } else if (matchData.fullTimeResult === 'A') {
          // check if that team object is already in the teams array
          if (teamsArr.filter(e => e.teamName === matchData.awayTeam).length > 0) {
            // if it is found then just add home team to their teams beaten
            teamsArr.forEach((teamData) => {
              if (teamData.teamName === matchData.awayTeam) {
                teamData.teamsBeaten.push(matchData.homeTeam);
              }
            })
            // get rid of duplicates in teamsBeaten array incase they are already added

          } else {
            // add new entry for the team to teamsArr
            teamArrObj.teamName = matchData.awayTeam;
            teamArrObj.teamsBeaten.push(matchData.homeTeam);
          }
        }
        if (teamArrObj.teamName !== "") {
          teamsArr.push(teamArrObj);
        }
      });
      try {
        if (response.status === 200) {
          res.json(teamsArr);
        }
      } catch (err) {
        console.log(err);
      }
    });
})


// Export
module.exports = router;