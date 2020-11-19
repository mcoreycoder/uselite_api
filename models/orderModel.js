const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    userId: {
        type: mongoose.ObjectId,
        required: true
    },
    quoteId: {
        type: mongoose.ObjectId,
        // required: true
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

module.exports.orderModel = mongoose.model("Order", orderSchema, "order")
module.exports.orderSchema = orderSchema.obj