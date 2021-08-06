const { google } = require('googleapis')
const { getGoogleSheet } = require('./getGoogleSheet')

const compare = (a, b) => {
  if (a < b) {
    return -1
  }
  if (a > b) {
    return 1
  }
  return 0
}

async function listBrands (auth) {
  let brandArray = []
  let getBrands = () => {
    const sheetInfo = {
      sheetId: '1QKb7y3UNOqdenom37XscsSNk7REUNsHKy-qfXWosNTo',
      tabName: 'MasterVendorBrands',
      cellMin: 'A3',
      cellMax: 'A8'
    }
    return getGoogleSheet(auth, sheetInfo)
  }

  try {
    await getBrands().then(res =>
      res.map(el => {
        let brandObj = { Brand: el[0] }
        brandArray = [...brandArray, brandObj]
        return brandObj
      })
    )
  } catch (err) {
    console.error(`listBrands Oh Sheet! and err:\n`, err)
  }
  return brandArray
}

//original listGSA function format
// async function listGSA (auth) {
//   let gsaArray = []
//   const sheets = google.sheets({ version: 'v4', auth })

//   try {
//     gsaArray = (
//       await sheets.spreadsheets.values.get({
//         // spreadsheetId: '1wGPTT10lpextZn0A4LGNuqhrRqLDJC7ysBGEpAY9Xks', // old gsa sheet
//         spreadsheetId: '1UA4B3ZyerKkTwMrHX3CpvTTazfSRRjCxKKIwQHc0Z0Y', // 7.15.21 copy of GSAbrands2021
//         range: '2021ProductList!A3:F8'
//       })
//     ).data.values
//   } catch (err) {
//     console.error(`listBrands Oh Sheet! and err:\n`, err)
//   }
//   return gsaArray
// }
/* end of original function format */

//new function format to pull old or current gsa from google_gsa.js
async function listGSA (auth) {
  let itemArray = []
  const mapLists = (list, listName) =>
    list.map((item, i) => {
      let itemObject = {
        GSA_Item_List: `${listName}`,
        hasNewSKU:
          listName === 'Current GSA'
            ? item[28] !== item[6]
              ? item[28]
              : 'No New Sku'
            : 'No New Sku',
        Last_Mod: item[0],
        Brand: item[5],
        SKU: item[6],
        Product_Name: item[9],
        Unit_of_Measure: item[11],
        Retail: item[17],
        GSA_Discount: item[18],
        GSA_Price_without_IFF: item[19],
        GSA_Price_with_IFF: item[20],
        Country_of_Origin: item[22],
        Description: item[10]
      }

      itemObject.SKU !== '#N/A'
        ? (itemArray = [...itemArray, itemObject])
        : itemArray
    })

  // range differs that these two get, but the return Array is formated the same since they are based on the same template structure
  let listPastGSA = () => {
    const sheetInfo = {
      sheetId: '1xnqSp9zZGk3jpt4JCiuiB4at086va6GjIbOWcZw8TtU', // Exhibit B. USElite Price Proposal Template(googleFormat)(GSA approved PO-0066)
      tabName: 'PRODUCTS WITH DISCOUNT (A)',
      cellMin: 'A2',
      cellMax: 'AB197'
    }
    return getGoogleSheet(auth, sheetInfo).then(res =>
      mapLists(res, 'Past GSA')
    )
  }

  // range differs that these two get, but the return Array is formated the same since they are based on the same template structure
  let listCurrentGSA = () => {
    const sheetInfo = {
      sheetId: '1UA4B3ZyerKkTwMrHX3CpvTTazfSRRjCxKKIwQHc0Z0Y', // 7.15.21 copy of GSAbrands2021
      tabName: '2021ProductList',
      cellMin: 'BE3',
      cellMax: 'CG320'
    }
    return getGoogleSheet(auth, sheetInfo).then(res =>
      mapLists(res, 'Current GSA')
    )
  }

  await listPastGSA()
  await listCurrentGSA()

  return itemArray.sort((a, b) => compare(a.SKU, b.SKU))
}

async function listArcteryx (auth) {
  let arcteryxArray = []
  const mapArcItems = itemsArray =>
    itemsArray.map(item => {
      let itemObject = {
        category_url: item[0],
        category: item[1],
        product_page_link_href: item[2],
        style_name: item[3],
        description: item[4],
        msrp: item[5],
        Sizes: item[6],
        Weight: item[7],
        SKU: item[8],
        title: item[9],
        img_src: item[10]
      }

      arcteryxArray = [...arcteryxArray, itemObject]
    })

  let getArcteryx = () => {
    const sheetInfo = {
      sheetId: '1nmHCXD7QrEsL-Dc5a7oKaqPOXGS61W0ltbOnZNGSh30', // sheet with web scrapped data
      tabName: 'data',
      cellMin: 'A2',
      cellMax: 'K140'
    }
    return getGoogleSheet(auth, sheetInfo)
  }

  try {
    await getArcteryx().then(res => mapArcItems(res))
  } catch (err) {
    console.error(`listArcteryx Oh Sheet! and err:\n`, err)
  }
  return arcteryxArray
}

async function listArcteryxVariants (auth) {
  let ArcVariantsArray = []
  const sheetInfo = {
    sheetId: '18faOFA7mRDKJTbDa0ZKgSRlmP01yGSyYZMli8qsm85I', //leaf s21 upc codes usd.pdf(google format)
    tabName: 'Sheet1',
    cellMin: 'A12',
    cellMax: 'X952'
  }

  const mapArcVariants = getArray => {
    getArray.map((item, i) => {
      let itemObject = {
        Model: item[0],
        SKU: item[1],
        Description: item[2],
        Color: item[6],
        Size: item[9],
        HS_Tariff: item[11],
        of_Origin: item[13],
        UPC: item[15],
        Weight: item[17],
        Season_Year: item[18],
        Wholesale: item[20],
        Retail: item[22]
      }
      ArcVariantsArray = [...ArcVariantsArray, itemObject]
    })
  }

  try {
    await getGoogleSheet(auth, sheetInfo).then(res => mapArcVariants(res))
  } catch (err) {
    console.error(`listArcteryxVariants Oh Sheet! and err:\n`, err)
  }

  return ArcVariantsArray
}

async function listGSAPriceListsMap (auth) {
  let listsArray = []
  const sheetInfo = {
    sheetId: '16bp80BxUOcct7aQY44cfU1WFmpI1BI4Qg5dS-vRNUXI', // 2021 in Development Test > Brands > _GSA_PriceListMap folder
    // sheetId: '1UA4B3ZyerKkTwMrHX3CpvTTazfSRRjCxKKIwQHc0Z0Y', // 7.15.21 copy of GSAbrands2021
    tabName: 'Brands',
    cellMin: 'A1',
    cellMax: 'AU8'
  }

  const mapGSAPriceListsMap = list => {
    // remove first item of the list array, sheets column 'headers',
    // assigning to an object using the spread opperator assigns the index as the property name making it easier to use when
    // creating the priceListObject and assigning the key:value using the index passed through the item.map() below
    let priceListMapObject = { ...list.shift() }

    let composeMappedList = list.map((item, i) => {
      let priceListObject = {}
      item.map((prop, j) => {
        // use the priceListMapObject and index in the item.map() to select the correct key:value to set property names on the priceListObject when assigning the prop value
        priceListObject[priceListMapObject[j]] = prop
      })
      listsArray = [...listsArray, priceListObject].sort((a, b) =>
        compare(a.Brand, b.Brand)
      )
    })
    return composeMappedList
  }

  await getGoogleSheet(auth, sheetInfo).then(res => mapGSAPriceListsMap(res))

  // return listsArray
  return priceListsData (auth, listsArray[1])
}

async function priceListsData (auth, sheetDeets) {
  //may need some work to make it more dynamic to stitch all data together
  let productArray = []
  var alphabet = [
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

  let priceSheetId = sheetDeets.Google_Price_List_file.replace(
    'https://docs.google.com/spreadsheets/d/',
    ''
  ).split('/')[0] // reduce link to just the id

  let upcSheetId = sheetDeets.Google_UPC_file.replace(
    'https://docs.google.com/spreadsheets/d/',
    ''
  ).split('/')[0] // reduce link to just the id

  const priceSheetInfo = {
    sheetId: `${priceSheetId}`,
    tabName: `${sheetDeets.Price_Sheet_Name}`,
    cellMin: `${sheetDeets.Price_Data_Range.split(':')[0]}`,
    cellMax: `${sheetDeets.Price_Data_Range.split(':')[1]}`,
    Price_Parent_SKU: alphabet.indexOf(sheetDeets.Price_Parent_SKU.toLowerCase()),
    Price_PRODUCT_NAME: alphabet.indexOf(sheetDeets.Price_PRODUCT_NAME.toLowerCase()),
    Price_Wholesale: alphabet.indexOf(sheetDeets.Price_Wholesale.toLowerCase()),
    Price_GSA_Cost: alphabet.indexOf(sheetDeets.Price_GSA_Cost.toLowerCase()),
    Price_MSRP: alphabet.indexOf(sheetDeets.Price_MSRP.toLowerCase()),
    Price_MAP: alphabet.indexOf(sheetDeets.Price_MAP.toLowerCase()),
    Price_GSA_MAP: alphabet.indexOf(sheetDeets.Price_GSA_MAP.toLowerCase()),
    Price_COO: alphabet.indexOf(sheetDeets.Price_COO.toLowerCase()),
    Price_UPC: alphabet.indexOf(sheetDeets.Price_UPC.toLowerCase()),
  }
  const upcSheetInfo = {
    sheetId: `${upcSheetId}`,
    tabName: `${sheetDeets.UPC_Sheet_Name}`,
    cellMin: `${sheetDeets.UPC_Data_Range.split(':')[0]}`,
    cellMax: `${sheetDeets.UPC_Data_Range.split(':')[1]}`,
    UPC_Parent_SKU: alphabet.indexOf(sheetDeets.UPC_Parent_SKU.toLowerCase()),
    UPC_Variant_SKU: alphabet.indexOf(sheetDeets.UPC_Variant_SKU.toLowerCase()),
    UPC_Color: alphabet.indexOf(sheetDeets.UPC_Color.toLowerCase()),
    UPC_Size: alphabet.indexOf(sheetDeets.UPC_Size.toLowerCase()),
    UPC_Length: alphabet.indexOf(sheetDeets.UPC_Length.toLowerCase()),
    UPC_ProductName: alphabet.indexOf(sheetDeets.UPC_ProductName.toLowerCase()),
    UPC_WHLS: alphabet.indexOf(sheetDeets.UPC_WHLS.toLowerCase()),
    UPC_MSRP: alphabet.indexOf(sheetDeets.UPC_MSRP.toLowerCase()),
    UPC_MAP: alphabet.indexOf(sheetDeets.UPC_MAP.toLowerCase()),
    UPC_COO: alphabet.indexOf(sheetDeets.UPC_COO.toLowerCase()),
    UPC_UPC: alphabet.indexOf(sheetDeets.UPC_UPC.toLowerCase()),
  }
  console.log(`
  priceSheetInfo:\n`,
  priceSheetInfo,
  `\n
  upcSheetInfo:\n`,
  upcSheetInfo)

  // need to refactor
  const mapGSAPriceListsMap = (list,sheet) =>
    list.map((item, i) => {
      let priceItemObject = {
        // add item stucture
        // ...item
        sheet: sheet,
        Google_Price_List_file: `https://docs.google.com/spreadsheets/d/${priceSheetInfo.sheetId}`,
        Price_Sheet_Name: item[priceSheetInfo.Price_Sheet_Name],
        Price_Data_Range: item[priceSheetInfo.Price_Data_Range],
        Price_Parent_SKU: item[priceSheetInfo.Price_Parent_SKU],
        Price_PRODUCT_NAME: item[priceSheetInfo.Price_PRODUCT_NAME],
        Price_Wholesale: item[priceSheetInfo.Price_Wholesale],
        Price_GSA_Cost: item[priceSheetInfo.Price_GSA_Cost],
        Price_MSRP: item[priceSheetInfo.Price_MSRP],
        Price_MAP: item[priceSheetInfo.Price_MAP],
        Price_GSA_MAP: item[priceSheetInfo.Price_GSA_MAP],
        Price_COO: item[priceSheetInfo.Price_COO],
        Price_UPC: item[priceSheetInfo.Price_UPC],
      }
      let upcItemObject = {
        sheet: sheet,
        Google_UPC_file: `https://docs.google.com/spreadsheets/d/${upcSheetInfo.sheetId}`,
        UPC_Sheet_Name: item[upcSheetInfo.UPC_Sheet_Name],
        UPC_Data_Range: item[upcSheetInfo.UPC_Data_Range],
        UPC_Parent_SKU: item[upcSheetInfo.UPC_Parent_SKU],
        UPC_Variant_SKU: item[upcSheetInfo.UPC_Variant_SKU],
        UPC_Color: item[upcSheetInfo.UPC_Color],
        UPC_Size: item[upcSheetInfo.UPC_Size],
        UPC_Length: item[upcSheetInfo.UPC_Length],
        UPC_ProductName: item[upcSheetInfo.UPC_ProductName],
        UPC_WHLS: item[upcSheetInfo.UPC_WHLS],
        UPC_MSRP: item[upcSheetInfo.UPC_MSRP],
        UPC_MAP: item[upcSheetInfo.UPC_MAP],
        UPC_COO: item[upcSheetInfo.UPC_COO],
        UPC_UPC: item[upcSheetInfo.UPC_UPC],
      }

      mappedItemObject = (sheet === "priceSheetInfo") ? priceItemObject : upcItemObject

      productArray = [...productArray, mappedItemObject] //may need to be refactored
    })

  await getGoogleSheet(auth, priceSheetInfo).then(res =>
    mapGSAPriceListsMap(res, "priceSheetInfo")
  )
  await getGoogleSheet(auth, upcSheetInfo).then(res => mapGSAPriceListsMap(res, "upcSheetInfo"))

  return productArray
}

// module.exports.authorize = authorize
module.exports.listBrands = listBrands
module.exports.listGSA = listGSA
module.exports.listArcteryx = listArcteryx
module.exports.listArcteryxVariants = listArcteryxVariants
module.exports.listGSAPriceListsMap = listGSAPriceListsMap
