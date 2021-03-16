const express = require('express');
const router = express.Router();
require('dotenv').config()

// const fs = require('fs');
// const readline = require('readline');
const {google} = require('googleapis');

const access_token = `${process.env.ACCESS_TOKEN}`
// const googleServer = `${process.env.GOOGLE_SERV}`
const googleServer = {"server":{
    "client_id":process.env.CLIENT_ID,
    "project_id":process.env.PROJECT_ID,
    "auth_uri":"https://accounts.google.com/o/oauth2/auth",
    "token_uri":"https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
    "client_secret":process.env.CLIENT_SECRET,
    "redirect_uris":["http://localhost:3000"],
    "javascript_origins":["http://localhost:3000"]}}

const checkAccess = async() => { 
    res = "my_response_goes_here"

    await console.log(`google get called \n 
    res: ${res} \n
access_token: \n ${access_token} \n
googleServer: \n ${JSON.stringify(googleServer)}
`
)
return res}

async function authorize(credentials, callback) {
    // console.log(`authorize: ${JSON.stringify(credentials)}`)

    const {client_secret, client_id, redirect_uris} = credentials.server;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
        // console.log(`oAuth2Client: ${JSON.stringify(oAuth2Client)}`)

    // Check if we have previously stored a token.
    // fs.readFile(TOKEN_PATH, (err, token) => {
    //     if (err) return getNewToken(oAuth2Client, callback);
    //     oAuth2Client.setCredentials(JSON.parse(token));
    //     callback(oAuth2Client);
    //   });

    await oAuth2Client.setCredentials(JSON.parse(access_token));
    return callback(oAuth2Client)

  }

//   function getNewToken(oAuth2Client, callback) {
//     console.log(`getNewToken: ${oAuth2Client}`)
//     const authUrl = oAuth2Client.generateAuthUrl({
//       access_type: 'offline',
//       scope: SCOPES,
//     });
//     console.log('Authorize this app by visiting this url:', authUrl);
//     const rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });
//     rl.question('Enter the code from that page here: ', (code) => {
//       rl.close();
//       oAuth2Client.getToken(code, (err, token) => {
//         if (err) return console.error('Error while trying to retrieve access token', err);
//         oAuth2Client.setCredentials(token);
//         // Store the token to disk for later program executions
//         fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//           if (err) return console.error(err);
//           console.log('Token stored to', TOKEN_PATH);
//         });
//         callback(oAuth2Client);
//       });
//     });
//   }

  async function listBrands(auth) {
    // console.log(`listBrands_auth: ${JSON.stringify(auth)}`)
    let brandArray = ["test"]
    const sheets = google.sheets({version: 'v4', auth});
    
    try {
         brandArray = (await sheets.spreadsheets.values.get({
            spreadsheetId: '1QKb7y3UNOqdenom37XscsSNk7REUNsHKy-qfXWosNTo',
            range: 'MasterVendorBrands!A3:b',
          })).data.values        
        // console.log(JSON.stringify(brandArray, null, 2));
        console.log(`google sheet call complete`);
      } catch (err) {
        console.error(err);
      }
    return brandArray
  }


// GET brands listing. 
// Postman test 
router.get('/', function (req, res, next) {
  let readObj = {
    // usersCollection: req.app.locals.usersCollection,
    resource: req.baseUrl.slice(1) // need to add this to other routes and on users.js
  }

//   db.readAll(readObj) // changed function to fetch from google
// checkAccess()
authorize(googleServer, listBrands)
.then(response => {
    console.log(`google get response: ${response}`)
    res.send(response)
  })
    // .then(res => {
    //   res.json()
    // })
    .catch(error => {
      console.log('Error:', error)
      res.status(500).json(error)
    })
})




module.exports = router

