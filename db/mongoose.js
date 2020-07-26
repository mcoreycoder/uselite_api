const mongoose = require('mongoose')
const {userModel: Users, usersSchema } = require("../models/usersModel") //imports accessed dynamically in formulas
const {productModel: Products, productsSchema } = require("../models/productsModel") //imports accessed dynamically in formulas
require('dotenv').config()

// let objReceived = {resource: " "}
// let route = (objReceived) => `${objReceived.resource[0].toUpperCase()}${objReceived.resource.slice(1)}`
// let collections = mongoose.models
let collection = (objReceived) => mongoose.models[`${objReceived.resource[0].toUpperCase()}${objReceived.resource.slice(1)}`]
let schema = (objReceived) => mongoose.modelSchemas[`${objReceived.resource[0].toUpperCase()}${objReceived.resource.slice(1)}`].tree

function connect(collections){

    uri = `${process.env.DB_CONNECT}`

    return mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "USElite"
    })
    .then(console.log("mongoose connected"))


}

function close(){
    console.log("mongoose closing")
    mongoose.connection.close()
}

// refactoring this one, original is commented out below
function create(obj) {

    let serial = {}

    console.log("mongoose create objCreate:", obj)
    console.log("mongoose mongoose.modelSchemas:", schema(obj))

    for (let key in schema(obj)) {
        if (obj.doc.hasOwnProperty(key)) {
            serial[key] = obj.doc[key]
        }
    }

    // console.log("mongoose create usersSchema:", usersSchema)
    console.log("mongoose create serial:", serial)
    // console.log("mongoose create models:", mongoose.models.Users)
    // objReceived = obj
    // let route = `${objCreate.resource[0].toUpperCase()}${objCreate.resource.slice(1)}`
    // let collection = mongoose.models[route]
    // console.log("mongoose create route:", route)
    // console.log("mongoose create collection:", collection)
    // return Users.create(serial) //original set up
    return collection(obj).create(serial)


}

// //original create version of the code above set for just Users
// function create(objCreate) {

//     let serial = {}

//     console.log("mongoose create objCreate.doc:", objCreate.doc)



//     for (let key in usersSchema) {
//         if (objCreate.doc.hasOwnProperty(key)) {
//             serial[key] = objCreate.doc[key]
//         }
//     }

//     // console.log("mongoose create usersSchema:", usersSchema)
//     console.log("mongoose create serial:", serial)

//     return Users.create(serial)

// }

function readAll(obj) {
    
    // let collection = collections[route(objRead)]
    console.log("mongoose readAll objReceived", obj)
    console.log("mongoose readAll collection", collection)
    // return collection.find().exec()
    return collection(obj).find().exec()
}

// // original readAll version of the code above set for just Users
// function readAll(objRead) {
//    
//     return Users.find().exec()
// }

function readOne(obj) {

    return collection(obj).findById(obj.id).exec()

}
// //original readOne version of the code above set for just Users
// function readOne(objRead) {

//     return Users.findById(objRead.id).exec()

// }

async function findOne(obj){
    let found = await collection(obj).findOne(obj.query).exec()
    console.log("mongoose findOne returns:", found)
    if(found===null){
        console.log(`*** mongoose findOne returns null when there is no match and should be addressed in function that called it from ${obj.resource}.js ***`)
    }

    return found
}

// //original findOne version of the code above set for just Users
// function findOne(objFind){

//     return Users.findOne(objFind.query).exec()
// }

function update(obj){

    let serial = {}
    for (let key in schema(obj)) {
        if (obj.doc.hasOwnProperty(key)) {
            serial[key] = obj.doc[key]
        }
    }

    return collection(obj).updateOne({_id: obj.id}, serial).exec()

}

// // original readOne version of the code above set for just Users
// function update(objUpdate){

//     let serial = {}
//     for (let key in usersSchema) {
//         if (objUpdate.doc.hasOwnProperty(key)) {
//             serial[key] = objUpdate.doc[key]
//         }
//     }

//     return Users.updateOne({_id: objUpdate.id}, serial).exec()

// }

async function replace(obj){

    let serial = {}
    for (let key in schema(obj)) {
        if (obj.doc.hasOwnProperty(key)) {
            serial[key] = obj.doc[key]
        }
    }
    
    let response = await collection(obj).replaceOne({_id: obj.id}, serial).exec()
    console.log("mongoose replaceOne response:", response)
    console.log("mongoose replace serial:", serial)
    return response

}

// // original readOne version of the code above set for just Users
// async function replace(objReplace){

//     let serial = {}
//     for (let key in usersSchema) {
//         if (objReplace.doc.hasOwnProperty(key)) {
//             serial[key] = objReplace.doc[key]
//         }
//     }
    
//     let response = await Users.replaceOne({_id: objReplace.id}, serial).exec()
//     console.log("mongoose replaceOne response:", response)
//     console.log("mongoose replace serial:", serial)
//     return response

// }



function del(obj){

    return collection(obj).deleteOne({_id: obj.id}).exec()

}

// // original readOne version of the code above set for just Users
// function del(objDelete){

//     return Users.deleteOne({_id: objDelete.id}).exec()

// }


module.exports.connect = connect
module.exports.close = close
module.exports.create = create
module.exports.readOne = readOne
module.exports.readAll = readAll
module.exports.update = update
module.exports.replace = replace
module.exports.findOne = findOne
module.exports.del = del
