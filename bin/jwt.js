const jwt = require('jsonwebtoken')
require('dotenv').config()

function makeToken(user) {

    return new Promise((resolve, reject) => {

        jwt.sign({ email: user.email }, process.env.JWT_KEY, { expiresIn: '1h' }, function (err, token) {


            if (err !== null) {

                reject(err)

            } else {
                console.log(token)
                resolve(token)

            }

        });

    })
}

function verifyToken(req, res, next) {

    // get authorization header from api packet
    let auth = req.header('Authorization')

    // check to be sure I got the authorization header
    if (auth !== undefined) {

        console.log(auth)
        // split the header into "bearer" and the token
        let [, token] = auth.split(" ")

        // verify the incoming token
        new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_KEY, (error, payload) => {
                if (error !== null) {
                    reject(error)
                } else {
                    resolve(payload)
                }

            })
        })
            .then(payload => {
                console.log(payload)
                console.log("PAYLOAD")
                req.email = payload.email
                next()
            })
            .catch(error => {
                console.log("ERROR",error)
                res.status(403)
            })
    } else {
        res.status(403)
    }// end if auth is defined


}

module.exports.makeToken = makeToken
module.exports.verifyToken = verifyToken