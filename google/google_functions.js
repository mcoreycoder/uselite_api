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

async function listBrands (auth) {
  let brandArray = ['test']
  const sheets = google.sheets({ version: 'v4', auth })

  try {
    brandArray = (
      await sheets.spreadsheets.values.get({
        spreadsheetId: '1QKb7y3UNOqdenom37XscsSNk7REUNsHKy-qfXWosNTo',
        range: 'MasterVendorBrands!A3:A8'
      })
    ).data.values
  } catch (err) {
    console.error(`listBrands Oh Sheet! and err:\n`, err)
  }
  return brandArray
}

async function listGSA (auth) {
  let gsaArray = []
  const sheets = google.sheets({ version: 'v4', auth })

  try {
    gsaArray = (
      await sheets.spreadsheets.values.get({
        spreadsheetId: '1wGPTT10lpextZn0A4LGNuqhrRqLDJC7ysBGEpAY9Xks',
        range: '2021ProductList!Q3:V8'
      })
    ).data.values
  } catch (err) {
    console.error(`listBrands Oh Sheet! and err:\n`, err)
  }
  return gsaArray
}

async function listArcteryx (auth) {
  let arcteryxArray = []
  const sheets = google.sheets({ version: 'v4', auth })

  try {
    arcteryxArray = (
      await sheets.spreadsheets.values.get({
        spreadsheetId: '1nmHCXD7QrEsL-Dc5a7oKaqPOXGS61W0ltbOnZNGSh30',
        range: 'data!B2:K140'
      })
    ).data.values
  } catch (err) {
    console.error(`listBrands Oh Sheet! and err:\n`, err)
  }
  return arcteryxArray
}

async function listArcteryxVariants (auth) {
  let getArray = []
  const sheets = google.sheets({ version: 'v4', auth })
  let newArray = []

  

  try {
    getArray = (
      await sheets.spreadsheets.values.get({
        spreadsheetId: '18faOFA7mRDKJTbDa0ZKgSRlmP01yGSyYZMli8qsm85I',
        // range: 'Sheet1!A12:X20'
        range: 'Sheet1!A12:X952'
      })
    ).data.values
  } catch (err) {
    console.error(`listBrands Oh Sheet! and err:\n`, err)
  }
  getArray.map((item,i) => {
    let itemObject = {
      Model: item[0],
      SKU: item[1],
      Description: item[2],
      Color: item[6],
      Size: item[9],
      HS_Tariff: item[11],
      of_Origin: item[13],
      UPC: item[15],
      Weight: item[17],
      Season_Year: item[18],
      Wholesale: item[20],
      Retail: item[22]
    }
    newArray = [...newArray,itemObject] 
  })
  return newArray
}

module.exports.authorize = authorize
module.exports.listBrands = listBrands
module.exports.listGSA = listGSA
module.exports.listArcteryx = listArcteryx
module.exports.listArcteryxVariants = listArcteryxVariants
