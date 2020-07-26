const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usersSchema = new Schema({
    email: {
        type: String
    },
    fName: {
        type: String,
        required: true
    },
    lName: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String
    },
    userName: {
        type: String
    },
    phone: {
        type: String
    },
    industry: {
        type: String
    },
    organization: {
        type: String
    },
    billing_address: {
        type: Array
    },
    shipping_address: {
        type: Array
    },
    inbound: {
        type: String
    },
    quotes: {
        type: Array
    },
    orders: {
        type: Array
    },
});

usersSchema.methods.fullName = function () {
    return `${this.fName} ${this.lName}`
}

module.exports.userModel = mongoose.model("Users", usersSchema, "users")
module.exports.usersSchema = usersSchema.obj