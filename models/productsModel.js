const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productsSchema = new Schema({
    brand: {
        type: String
    },
    productTitle: {
        type: String,
        // required: true
    },
    colors: {
        type: Array,
        // required: true
    },
    sizes: {
        type: Array
    },
    otherSeletionOptions: {
        type: Array
    },
    pricing: {
        type: String
    },
    productLink: {
        type: String
    },
    shippingDIMs: {
        type: String
    },
    gsaListed: {
        type: Boolean
    },
    distributors: {
        type: Array
    },
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

// productsSchema.methods.fullName = function () {
//     return `${this.fName} ${this.lName}`
// }

module.exports.productModel = mongoose.model("Products", productsSchema, "products")
module.exports.productsSchema = productsSchema.obj