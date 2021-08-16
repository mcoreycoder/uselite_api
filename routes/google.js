const express = require('express')
const router = express.Router()
require('dotenv').config()

const authorize = require('../google/authGoogle')
const {
  listBrands,
  listGSA,
  listGSAPriceListsMap,
  listArcteryx,
  listArcteryxVariants,
  listPriceListsMap,
  getAllProductsData,
  getProductData,
  getProductVariantData
} = require('../google/google_DAL_functions')

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

let gsaPriceList = ['empty']
console.log(`0 gsaList: ${gsaPriceList}`)

let arcteryxList = ['empty']
console.log(`0 arcteryxList: ${arcteryxList}`)

let priceListsArray = ['empty']
let productListsArray = ['empty']
let productVariantArray = ['empty']

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
        return response
      })
      .catch(error => {
        console.log('Error:', error)
        res.status(500).json(error)
      })
    return res.send(gsaList)
  })

  router.get('/gsapricelists', async function (req, res, next) {
    let readObj = {
      // usersCollection: req.app.locals.usersCollection,
      resource: req.baseUrl.slice(1) // need to add this to other routes and on users.js
    }
    console.log(`check gsaPriceList: ${gsaPriceList[0]}`)

    if (gsaPriceList[0] === 'empty') {
    }
    // let userAuthed = await authorize(googleServer)
    gsaPriceList = await listGSAPriceListsMap(userAuthed)
      .then(response => {
        console.log(`google get response: ${response[0]}`)
        gsaPriceList = response
        return gsaPriceList
      })
      .catch(error => {
        console.log('Error:', error)
        res.status(500).json(error)
      })
    return res.send(gsaPriceList)
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

  // revising routes *************************************************************

  router.get('/pricelists', async function (req, res, next) {
    let priceListData = await listPriceListsMap(userAuthed)
      .then(response => {
        priceListsArray = response
        return response
      })
      .catch(error => {
        console.log('Error:', error)
        res.status(500).json(error)
      })
    return res.send(priceListData)
  })

  router.get('/products', async function (req, res, next) {
    if (priceListsArray[0] === 'empty') {
      priceListsArray = await listPriceListsMap(userAuthed).catch(error => {
        console.log('google Error:', error)
        res.status(500).json(error)
      })
    }

    let brands = req.query.brands.split(',')
    console.log(
      `google line 182 - /product req.query: ${brands}\n priceListsArray.lenght: ${priceListsArray.length}`
    ) // need to be able to pass multiple brands
    // console.log(
    //   `line 183 - /product priceListsArray[1].Brand should show "Arc'teryx": "${priceListsArray[1].brand}"`
    // ) // working to filter to only what is in req.query, // need to be able to pass multiple brands
    let myFilter = brands.map((el, i) => {
      return priceListsArray.filter(priceList => priceList.brand === el)[0]
    })
    console.log(
      `google line 185 - /product priceListsArray.filter() should show ${brands[0]}: ${myFilter[0].brand}`
    ) // working to filter to only what is in req.query, // need to be able to pass multiple brands

    let productData = await getAllProductsData(userAuthed, myFilter)
      .then(response => {
        productListsArray = response
        return response
      })
      .catch(error => {
        console.log('Error:', error)
        res.status(500).json(error)
      })
    return res.send(productData)
  })

  // router.get('/variants', async function (req, res, next) {
  //   let productData = await getProductVariantData(userAuthed, priceLists=[priceListsArray[0]])
  //     .then(response => {
  //       productListsArray = response
  //       return response
  //     })
  //     .catch(error => {
  //       console.log('Error:', error)
  //       res.status(500).json(error)
  //     })
  //   return res.send(productData)
  // })
})

module.exports = router
