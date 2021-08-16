const getGoogleSheet = require('../getGoogleSheet')
const { alphabet } = require('../helpers')

async function getPriceListData (auth, sheetDeets) {
  //may need some work to make it more dynamic to stitch all data together
  let productArray = []

  let priceSheetId = sheetDeets.google_price_list_file
    .replace('https://docs.google.com/spreadsheets/d/', '')
    .split('/')[0] // reduce link to just the id

  const priceSheetInfo = {
    sheetId: `${priceSheetId}`,
    tabName: `${sheetDeets.price_sheet_name}`,
    cellMin: `${sheetDeets.price_data_range.split(':')[0]}`,
    cellMax: `${sheetDeets.price_data_range.split(':')[1]}`,
    brand: `${sheetDeets.brand}`,
    price_parent_sku: alphabet.indexOf(
      sheetDeets.price_parent_sku.toLowerCase()
    ),
    price_product_name: alphabet.indexOf(
      sheetDeets.price_product_name.toLowerCase()
    ),
    price_wholesale: alphabet.indexOf(sheetDeets.price_wholesale.toLowerCase()),
    price_gsa_cost: alphabet.indexOf(sheetDeets.price_gsa_cost.toLowerCase()),
    price_msrp: alphabet.indexOf(sheetDeets.price_msrp.toLowerCase()),
    price_map: alphabet.indexOf(sheetDeets.price_map.toLowerCase()),
    price_gsa_map: alphabet.indexOf(sheetDeets.price_gsa_map.toLowerCase()),
    price_coo: alphabet.indexOf(sheetDeets.price_coo.toLowerCase()),
    price_upc: alphabet.indexOf(sheetDeets.price_upc.toLowerCase())
  }

  const mapGSAPriceListsMap = (list, sheetIdentifier) =>
    list.map((item, i) => {
      let priceItemObject = {
        // carry over some details from the price list
        sheet: `${priceSheetInfo.brand} ${sheetIdentifier}`,
        google_price_list_file: `https://docs.google.com/spreadsheets/d/${priceSheetInfo.sheetId}`,
        price_sheet_name: priceSheetInfo.price_sheet_name,
        price_data_range: priceSheetInfo.price_data_range,
        brand: priceSheetInfo.brand,
        // add item stucture for what is pulled from the price list sheet
        price_parent_sku: item[priceSheetInfo.price_parent_sku],
        price_product_name: item[priceSheetInfo.price_product_name],
        price_wholesale: item[priceSheetInfo.price_wholesale],
        price_gsa_cost: item[priceSheetInfo.price_gsa_cost],
        price_msrp: item[priceSheetInfo.price_msrp],
        price_map: item[priceSheetInfo.price_map],
        price_gsa_map: item[priceSheetInfo.price_gsa_map],
        price_coo: item[priceSheetInfo.price_coo],
        price_upc: item[priceSheetInfo.price_upc]
      }

      // mappedItemObject = (sheet === "priceSheetInfo") ? priceItemObject : upcItemObject
      // productArray = [...productArray, mappedItemObject] //may need to be refactored

      return (productArray = [...productArray, priceItemObject])
    })

  await getGoogleSheet(auth, priceSheetInfo).then(res =>
    mapGSAPriceListsMap(res, 'priceSheetInfo')
  )

  return productArray
}

module.exports = getPriceListData
