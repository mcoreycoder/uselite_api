const alphabet = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z'
]

const compare = (a, b) => {
  if (a < b) {
    return -1
  }
  if (a > b) {
    return 1
  }
  return 0
}

const mapVariantsToProducts = (productArray, productVariantArray) =>
  productArray.map(item => {
    item.variants = productVariantArray.filter(
      // add property "variants" to object and assign array of matched results from UPC list
      option => item.price_parent_sku === option.upc_parent_sku
    )
    return item
  })

module.exports.compare = compare
module.exports.alphabet = alphabet
module.exports.mapVariantsToProducts = mapVariantsToProducts
