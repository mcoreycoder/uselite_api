const express = require('express')
const router = express.Router()
require('dotenv').config()

const {authorize, listBrands, listGSA, listArcteryx, listArcteryxVariants} = require('../google/google_functions')



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

let arcteryxList = ['empty']
console.log(`0 arcteryxList: ${arcteryxList}`)


authorize(googleServer, access_token).then(userAuthed => {
  router.get('/brands', async function (req, res, next) {
    let readObj = {
      // usersCollection: req.app.locals.usersCollection,
      resource: req.baseUrl.slice(1) // need to add this to other routes and on users.js
    }
    console.log(`check brandsList: ${brandsList[0]}`)

    if (brandsList[0] === 'empty') {
      // let userAuthed = await authorize(googleServer)
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
    console.log(`check gsaList: ${gsaList[0]}`)

    if (gsaList[0] === 'empty') {
    }
    // let userAuthed = await authorize(googleServer)
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

  router.get('/arcteryx', async function (req, res, next) {
    let readObj = {
      // usersCollection: req.app.locals.usersCollection,
      resource: req.baseUrl.slice(1) // need to add this to other routes and on users.js
    }
    console.log(`check arcteryxList: ${arcteryxList[0]}`)

    if (arcteryxList[0] === 'empty') {
    }
    // let userAuthed = await authorize(googleServer)
    arcteryxList = await listArcteryx(userAuthed)
      .then(response => {
        console.log(`google get response: ${response[0]}`)
        arcteryxList = response
        return arcteryxList
      })
      .catch(error => {
        console.log('Error:', error)
        res.status(500).json(error)
      })
    return res.send(arcteryxList)
  })
  
  router.get('/listArcteryxVariants', async function (req, res, next) {
    let readObj = {
      // usersCollection: req.app.locals.usersCollection,
      resource: req.baseUrl.slice(1) // need to add this to other routes and on users.js
    }
    console.log(`check arcteryxList: ${arcteryxList[0]}`)

    if (arcteryxList[0] === 'empty') {
    }
    // let userAuthed = await authorize(googleServer)
    arcteryxList = await listArcteryxVariants(userAuthed)
      .then(response => {
        console.log(`google get response: ${response[0]}`)
        arcteryxList = response
        return arcteryxList
      })
      .catch(error => {
        console.log('Error:', error)
        res.status(500).json(error)
      })
    return res.send(arcteryxList)
  })
})

module.exports = router
