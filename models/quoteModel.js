const mongoose = require('mongoose')
const Schema = mongoose.Schema

const quoteSchema = new Schema({
    userId: {
        type: Schema.ObjectId,
        required: true
    },
    products: {
        type: Array,
        required: true
    },
    // lName: {
    //     type: String,
    //     required: true
    // },
    // passwordHash: {
    //     type: String
    // },
    // userName: {
    //     type: String
    // },
    // phone: {
    //     type: String
    // },
    // industry: {
    //     type: String
    // },
    // organization: {
    //     type: String
    // },
    // billing_address: {
    //     type: Array
    // },
    // shipping_address: {
    //     type: Array
    // },
    // inbound: {
    //     type: String
    // },
    // quotes: {
    //     type: Array
    // },
    // orders: {
    //     type: Array
    // },
});

// usersSchema.methods.fullName = function () {
//     return `${this.fName} ${this.lName}`
// }

module.exports.quoteModel = mongoose.model("Quote", quoteSchema, "quote")
module.exports.quoteSchema = quoteSchema.obj