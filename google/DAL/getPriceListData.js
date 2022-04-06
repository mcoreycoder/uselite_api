const getGoogleSheet = require('../getGoogleSheet')
const { alphabet } = require('../helpers')

async function getPriceListData (auth, sheetDeets) {
  //may need some work to make it more dynamic to stitch all data together
  let productArray = []

  let priceSheetId = sheetDeets.google_price_list_file
    .replace('https://docs.google.com/spreadsheets/d/', '')
    .split('/')[0] // reduce link to just the id
  let upcSheetId = sheetDeets.google_upc_file
    .replace('https://docs.google.com/spreadsheets/d/', '')
    .split('/')[0] // reduce link to just the id

  const priceSheetInfo = {
    sheetId: `${priceSheetId}`,
    tabName: `${sheetDeets.tabName}`,
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
        //test below google files
        // google_price_list_file: `https://docs.google.com/spreadsheets/d/${priceSheetInfo.sheetId}`,
        google_price_list_file: `https://docs.google.com/spreadsheets/d/${priceSheetId}`,
        // google_upc_file: sheetDeets.google_upc_file,
        google_upc_file: `https://docs.google.com/spreadsheets/d/${upcSheetId}`,
        //test complete --------

        // carry over some details from the price list (sheetDeets)
        current_gsa_price_list_name: sheetDeets.current_gsa_price_list_name,
        tabName: sheetDeets.tabName,
        price_data_range: sheetDeets.price_data_range,
        brand: sheetDeets.brand,
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

      if (sheetDeets.brand.includes("ARROWHEAD")){
        // console.log("ARROWHEAD")
        if (productArray[productArray.length-1]?.price_parent_sku === priceItemObject.price_parent_sku){
                  // console.log(`ARROWHEAD ${priceItemObject.price_parent_sku}`)
                  priceItemObject.price_parent_sku = undefined
        }
              }

      if (priceItemObject.price_parent_sku !== undefined) {
        productArray = [...productArray, priceItemObject]
      }
      

      return productArray
    })

  await getGoogleSheet(auth, priceSheetInfo).then(res =>
    mapGSAPriceListsMap(res, 'priceSheetInfo')
  )

  return productArray
}

module.exports = getPriceListData
