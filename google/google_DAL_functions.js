// const { google } = require('googleapis')
const getGoogleSheet = require('./getGoogleSheet')
const getPriceListsMap = require('./DAL/getPriceListmap')
const getPriceListData = require('./DAL/getPriceListData')
const getUPC_ListData = require('./DAL/getUPC_ListData')
const { mapVariantsToProducts, compare } = require('./helpers')

const getGSA_docsMap = require('./DAL/getGSA_docsMap')
const getGSA_docData = require('./DAL/getGSA_docData')

// const compare = (a, b) => {
//   if (a < b) {
//     return -1
//   }
//   if (a > b) {
//     return 1
//   }
//   return 0
// }

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
        gsa_item_list: `${listName}`,
        hasNewSKU:
          listName === 'Current GSA'
            ? item[28] !== item[6]
              ? item[28]
              : 'No New Sku'
            : 'No New Sku',
        last_mod: item[0],
        brand: item[5],
        sku: item[6],
        product_name: item[9],
        unit_of_measure: item[11],
        retail: item[17],
        gsa_discount: item[18],
        gsa_price_without_iff: item[19],
        gsa_price_with_iff: item[20],
        country_of_origin: item[22],
        description: item[10]
      }

      itemObject.sku !== '#N/A'
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

  return itemArray.sort((a, b) => compare(a.sku, b.sku))
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

// new formatting of functions

async function listGSAPriceListsMap (auth) {
  let listData = await getPriceListsMap(auth)
  let productArray = []
  for (i = 0; i < listData.length; i++) {
    productArray = [
      ...productArray,
      ...(await getPriceListData(auth, listData[i]))
    ]
    console.log(`Price listData[i] ${listData[i].brand}`)
  }

  let productVariantArray = []
  for (i = 0; i < listData.length; i++) {
    productVariantArray = [
      ...productVariantArray,
      ...(await getUPC_ListData(auth, listData[i]))
    ]
    console.log(`UPC listData[i] ${listData[i].brand}`)
  }

  return mapVariantsToProducts(productArray, productVariantArray)
}

// ******* listGSAPricelistsmap broken down into seperate functions
async function listPriceListsMap (auth) {
  let listData = await getPriceListsMap(auth)
  return listData
}

async function listGSA_DocsListsMap (auth) {
  let listData = await getGSA_docsMap(auth)
  return listData
}

async function getProductData (auth, listsData) {
  let productArray = []
  for (i = 0; i < listsData.length; i++) {
    productArray = [
      ...productArray,
      ...(await getPriceListData(auth, listsData[i]))
    ]
    console.log(`priceLists[i] ${listsData[i].Brand}`)
  }
  return productArray
}

/*revised above to get ALL product data, not just priceList data*/
async function getAllProductsData (auth, listsData) {
  let productArray = []
  for (i = 0; i < listsData.length; i++) {
    let foundData = await getPriceListData(auth, listsData[i])
    console.log(`251 DAL getAllProductsData listData.length: ${listsData.length}\n listsData[i].brand: ${listsData[i].brand}`)
    productArray = [
      ...productArray,
      ...(foundData)
    ]
    console.log(`256 DAL Price listsData[i].brand: ${listsData[i].brand}`)
  }

  let productVariantArray = []
  for (i = 0; i < listsData.length; i++) {
    productVariantArray = [
      ...productVariantArray,
      ...(await getUPC_ListData(auth, listsData[i]))
    ]
    console.log(`265 DAL UPC listData[i] ${listsData[i].brand}`)
  }

  return mapVariantsToProducts(productArray, productVariantArray)
}

async function getAllDocsData (auth, listsData) {
  console.log(`listsData[0].doc_name: ${listsData[0].doc_name}`)
  let docsArray = []
  for (i = 0; i < listsData.length; i++) {
    let foundData = await getGSA_docData(auth, listsData[i])
    docsArray = [
      ...docsArray,
      ...(foundData)
    ]
  }

  return docsArray
}

// async function getProductVariantData (auth, listsData) {
//   let productVariantArray = []
//   for (i = 0; i < listsData.length; i++) {
//     productVariantArray = [
//       ...productVariantArray,
//       ...(await getUPC_ListData(auth, listsData[i]))
//     ]
//     console.log(`UPC listData[i] ${listsData[i].Brand}`)
//   }
//   return productVariantArray
// }

// module.exports.authorize = authorize
module.exports.listBrands = listBrands
module.exports.listGSA = listGSA
module.exports.listArcteryx = listArcteryx
module.exports.listArcteryxVariants = listArcteryxVariants

// new formatting of functions
module.exports.listGSAPriceListsMap = listGSAPriceListsMap
module.exports.listPriceListsMap = listPriceListsMap
module.exports.listGSA_DocsListsMap = listGSA_DocsListsMap
module.exports.getProductData = getProductData
module.exports.getAllProductsData = getAllProductsData
module.exports.getAllDocsData = getAllDocsData
// module.exports.getProductVariantData = getProductVariantData
