const getGoogleSheet = require('../getGoogleSheet')
const { alphabet } = require('../helpers')

async function getUPC_ListData (auth, sheetDeets) {
  let productVariantArray = []
  let upcSheetId = sheetDeets.google_upc_file
    .replace('https://docs.google.com/spreadsheets/d/', '')
    .split('/')[0] // reduce link to just the id

  const upcSheetInfo = {
    sheetId: `${upcSheetId}`,
    tabName: `${sheetDeets.upc_sheet_name}`,
    cellMin: `${sheetDeets.upc_data_range.split(':')[0]}`,
    cellMax: `${sheetDeets.upc_data_range.split(':')[1]}`,
    // add item stucture for what is pulled from the UPC list sheet
    upc_parent_sku: alphabet.indexOf(sheetDeets.upc_parent_sku.toLowerCase()),
    upc_variant_sku: alphabet.indexOf(sheetDeets.upc_variant_sku.toLowerCase()),
    upc_color: alphabet.indexOf(sheetDeets.upc_color.toLowerCase()),
    upc_size: alphabet.indexOf(sheetDeets.upc_size.toLowerCase()),
    upc_length: alphabet.indexOf(sheetDeets.upc_length.toLowerCase()),
    upc_productname: alphabet.indexOf(sheetDeets.upc_productname.toLowerCase()),
    upc_whls: alphabet.indexOf(sheetDeets.upc_whls.toLowerCase()),
    upc_msrp: alphabet.indexOf(sheetDeets.upc_msrp.toLowerCase()),
    upc_map: alphabet.indexOf(sheetDeets.upc_map.toLowerCase()),
    upc_coo: alphabet.indexOf(sheetDeets.upc_coo.toLowerCase()),
    upc_upc: alphabet.indexOf(sheetDeets.upc_upc.toLowerCase())
  }

  const mapUPCListsMap = (list, sheet) =>
    list.map((item, i) => {
      let upcItemObject = {
        sheet: `${sheetDeets.brand} ${sheet}`,
        google_upc_file: `https://docs.google.com/spreadsheets/d/${upcSheetInfo.sheetId}`,
        upc_sheet_name: item[upcSheetInfo.upc_sheet_name],
        upc_data_range: item[upcSheetInfo.upc_data_range],
        upc_parent_sku: item[upcSheetInfo.upc_parent_sku],
        upc_variant_sku: item[upcSheetInfo.upc_variant_sku],
        upc_color: item[upcSheetInfo.upc_color],
        upc_size: item[upcSheetInfo.upc_size],
        upc_length: item[upcSheetInfo.upc_length],
        upc_productname: item[upcSheetInfo.upc_productname],
        upc_whls: item[upcSheetInfo.upc_whls],
        upc_msrp: item[upcSheetInfo.upc_msrp],
        upc_map: item[upcSheetInfo.upc_map],
        upc_coo: item[upcSheetInfo.upc_coo],
        upc_upc: item[upcSheetInfo.upc_upc]
      }

      return (productVariantArray = [...productVariantArray, upcItemObject])
    })

  await getGoogleSheet(auth, upcSheetInfo).then(res =>
    mapUPCListsMap(res, 'upcSheetInfo')
  )

  return productVariantArray
}

module.exports = getUPC_ListData
