const { google } = require('googleapis')

async function authorize (googleServer, access_token) {
    const { client_secret, client_id, redirect_uris } = googleServer.server
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    )
  
    await oAuth2Client.setCredentials(JSON.parse(access_token))
    return oAuth2Client
  }

  module.exports = authorize
