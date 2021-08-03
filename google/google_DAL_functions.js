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
  const mapArcItems = (itemsArray) =>
  itemsArray.map((item) => {
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
        img_src: item[10],
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

  const mapArcVariants = (getArray) => {
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
    let priceListMapObject = {}

    return list.map((item, i) => {
      let priceListObject = {
        Vendor: item[0],
        Brand: item[1],
        Active: item[2],
        Last_Check: item[3],
        Notes: item[4],
        GSADriveLink: item[5],
        Current_GSA_Price_List_Name: item[6],
        Vendor_Price_List_file: item[7],
        //map docLink and tab name
        Current_GSA_Price_List_GoogleDoc: item[8],
        Pricing_Sheet_Name: item[9],
        Data_Range: item[10],
        //map columns 
        Parent_SKU: item[11],
        PRODUCT_NAME: item[12],
        Wholesale: item[13],
        GSA_Cost: item[14], //currently same as above
        MSRP: item[15],
        MAP: item[16],
        GSA_MAP: item[17], //currently same as above
        COO: item[18],
        UPC: item[19],
        //map docLink and tab name
        UPC_Google_UP_file: item[20],
        UPC_Sheet_Name: item[21],
        UPC_Data_Range: item[22],
        //map columns 
        UPC_Parent_SKU: item[23],
        UPC_Variant_SKU: item[24],
        UPC_Color: item[25],
        UPC_Size: item[26],
        UPC_Length: item[27],
        UPC_ProductName: item[28],
        UPC_WHLS: item[29],
        UPC_MSRP: item[30],
        UPC_MAP: item[31],
        UPC_COO: item[32],
        UPC_UPC: item[33],

        
      }

      listsArray = [...listsArray, priceListObject].sort((a, b) =>
        compare(a.Brand, b.Brand)
      )
    })}

  await getGoogleSheet(auth, sheetInfo).then(res => mapGSAPriceListsMap(res))

  return listsArray
}

async function priceListsData (auth, sheetDeets) { //may need some work to make it more dynamic to stitch all data together
  let productArray = []
  const sheetInfo = {
    sheetId: `${sheetDeets.Current_GSA_Price_List_GoogleDoc}`, // Current_GSA_Price_List_GoogleDoc Link, need to remove all but sheet Id
    tabName: `${sheetDeets.Pricing_Sheet_Name}`,
    cellMin: `A1`, //need to figure out how to best set only have the column range
    cellMax: `${sheetDeets}`, //need to figure out how to best set only have the range
  }

  const mapGSAPriceListsMap = list => // need to refactor
    list.map((item, i) => {
      let mappedItemObject = {
        // add item stucture
      }

      productArray = [...productArray, mappedItemObject] //may need to ve refactored 
    })

  await getGoogleSheet(auth, sheetInfo).then(res => mapGSAPriceListsMap(res))

  return listsArray
}

// module.exports.authorize = authorize
module.exports.listBrands = listBrands
module.exports.listGSA = listGSA
module.exports.listArcteryx = listArcteryx
module.exports.listArcteryxVariants = listArcteryxVariants
module.exports.listGSAPriceListsMap = listGSAPriceListsMap
