const express = require('express');
const router = express.Router();
const db = require('../db/mongoose')
const bcrypt = require('bcrypt')
const { makeToken, verifyToken } = require('../bin/jwt')
const passport = require('passport')
const {uriServer} = require("../bin/consts")

// GET product listing. 
// Postman test 
router.get('/', function (req, res, next) {
  let readObj = {
    usersCollection: req.app.locals.usersCollection,
    resource: req.baseUrl.slice(1) // need to add this to other routes and on users.js
  }

  db.readAll(readObj)
    .then(response => {
      res.json(response)
    })
    .catch(error => {
      console.log('Error:', error)
      res.status(500).json(error)
    })
})

//Get a product
// Postman test 
router.get('/:id', function (req, res, next) {

  let readObj = {
    id: req.params.id,
    usersCollection: req.app.locals.usersCollection,
    resource: req.baseUrl.slice(1)
  }

  db.readOne(readObj)
    .then(response => {
      res.json(response)
    })
    .catch(error => {
      console.log('Error:', error)
      res.status(500).json(error)
    })
})

// create a product
// Postman test 
router.post('/', async function (req, res, next) {
console.log("req.app.locals.productssCollection",req.app.locals.productsCollection) //is undefind here
  let newProduct = { ...req.body }

  console.log("products.js post:", newProduct )

  let createObj = {
    doc: newProduct,
    productsCollection: req.app.locals.productssCollection,
    resource: req.baseUrl.slice(1)
  }
  db.create(createObj)
    .then(response => {
        // console.log("req.app.locals.usersCollection",createObj.usersCollection) //is undefind here
        // console.log("req",req) 
      return res.json(response)
    })
    .catch(error => {
      console.log('Error:', error)
      res.status(500).json(error)
    })
})

// update a product
// Postman test 
router.put('/:id', function (req, res, next) {

  let putObj = {
      id: req.params.id,
      doc: req.body,
      usersCollection: req.app.locals.usersCollection,
      resource: req.baseUrl.slice(1)
  }

  db.readOne(putObj)
      .then(response => {
        // console.log("apiUsers readOne() response:", response)
          // response == null ? console.log("apiUsers db.create()") : console.log("apiUsers db.replace()")

          return response == null ? db.create(putObj) : db.replace(putObj)
      })
      
      .then(response => {

        // console.log("apiUsers create/replace response", response)
        res.send(response)

    })
      
    .catch(error => {

          res.status(500).json(error)

      })

});


// update a product
// Postman test 
router.patch('/:id', async function (req, res, next) {

    let patchObj = {
        id: req.params.id,
        doc: req.body,
        usersCollection: req.app.locals.usersCollection,
        resource: req.baseUrl.slice(1)
    }

    // check to see if we have an object with this id
    try {

        // see if we have one to update
        let response = await db.readOne(patchObj)

        // if we didn't find a record
        if (response == null) {

            throw new Error("Not Found")

        } else {

            // update the one we found
            // await db.update(patchObj)
            let updated = await db.update(patchObj)

            // responde with the result from the db
            // res.json(await db.readOne(patchObj))
            res.json(updated)

        } // if not found

    } catch (error) {
        console.log(error)
        res.status(500).json(error)

    }
});

// delete a product
// Postman test 
// router.delete('/:id', verifyToken, function (req, res, next) { //with auth
router.delete('/:id', function (req, res, next) { //without auth

    console.log("BODY")
    console.log(req.params)

    let deleteObj = {
        id: req.params.id,
        usersCollection: req.app.locals.usersCollection,
        resource: req.baseUrl.slice(1)
    }

    db.del(deleteObj)
        .then(response => {

            console.log(response)
            // ToDo see if we throw the error
            // after res.json({})
            if (response.deletedCount == 1) {
                res.json({response})
            } else {
                throw new Error("Not Deleted")
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500)
        })
});

module.exports = router

