const express = require('express')
const router = express.Router()
require('dotenv').config()

const { google } = require('googleapis')

const access_token = `${process.env.ACCESS_TOKEN}`
const googleServer = {
  server: {
    client_id: process.env.CLIENT_ID,
    project_id: process.env.PROJECT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_secret: process.env.CLIENT_SECRET,
    redirect_uris: ['http://localhost:3000'],
    javascript_origins: ['http://localhost:3000']
  }
}

let brandsList = ['empty']
console.log(`0 brandsList: ${brandsList}`)
let gsaList = ['empty']
console.log(`0 gsaList: ${gsaList}`)

async function authorize (credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.server
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

router.get('/brands', async function (req, res, next) {
  let readObj = {
    // usersCollection: req.app.locals.usersCollection,
    resource: req.baseUrl.slice(1) // need to add this to other routes and on users.js
  }
  console.log(`check brandsList: ${brandsList[0]}`)

  if (brandsList[0] === 'empty') {
    let userAuthed = await authorize(googleServer)
    brandsList = await listBrands(userAuthed)
      .then(response => {
        brandsList = response
        return brandsList
      })
      .catch(error => {
        console.log('Error:', error)
        res.status(500).json(error)
      })
  }
  return res.send(brandsList)
})

router.get('/gsa', async function (req, res, next) {
  let readObj = {
    // usersCollection: req.app.locals.usersCollection,
    resource: req.baseUrl.slice(1) // need to add this to other routes and on users.js
  }

  if (gsaList[0] === 'empty') {}
  let userAuthed = await authorize(googleServer)
  gsaList = await listGSA(userAuthed)
    .then(response => {
      console.log(`google get response: ${response[0]}`)
      gsaList = response
      return gsaList
    })
    .catch(error => {
      console.log('Error:', error)
      res.status(500).json(error)
    })
    return res.send(gsaList)
})

module.exports = router
