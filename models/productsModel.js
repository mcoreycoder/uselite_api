const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productsSchema = new Schema({
  brand: {
    type: String
  },
  sku: {
    type: String
  },
  productTitle: {
    type: String
    // required: true
  },
  pricing: {
    wholesale: {
      type: Number
    },
    map: {
      type: Number
    },
    msrp: {
      type: Number
    }
  },
  countryOfOrigin: {
    type: String
  },
  options: {
    colors: {
      type: Array
    },
    sizes: {
      type: Array
    },
    otherOptions: {
      type: Array
    }
  },
  unitOfMeasure: {
    type: String
  },
  productLinks: {
    type: Array
  },
  shippingDIMs: {
    weigth: {
      type: Number
    },
    lenght: {
      type: Number
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    }
  },
  gsa: {
    listed: {
      type: Boolean
    },
    price: {
      type: Number
    },
    modNumber: {
      type: Array
    }
  },

  distributors: {
    type: Array
  }
})

// productsSchema.methods.fullName = function () {
//     return `${this.fName} ${this.lName}`
// }

module.exports.productModel = mongoose.model(
  'Products',
  productsSchema,
  'products'
)
module.exports.productsSchema = productsSchema.obj
