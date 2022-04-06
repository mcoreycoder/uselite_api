const getGoogleSheet = require('../getGoogleSheet')
const { alphabet } = require('../helpers')

async function getGSA_docData (auth, sheetDeets) {
  //may need some work to make it more dynamic to stitch all data together
  let docDataArray = []

  // moved this to getGSA_docsMap
  //   let docSheetId = sheetDeets.doc_link
  //     .replace('https://docs.google.com/spreadsheets/d/', '')
  //     .split('/')[0] // reduce link to just the id

  //map sheet to standardize keys based on category/doc
  const docSheetMap = {
    //this maps out the doc and data range to fetch
    sheetId: `${sheetDeets.docSheetId}`, // refactored from 'docSheetId' since I moved the func above to getGSA_docsMap
    tabName: `${sheetDeets.doc_sheet_name}`,
    cellMin: `${sheetDeets.data_range.split(':')[0]}`,
    cellMax: `${sheetDeets.data_range.split(':')[1]}`

    //may not need the details below here, might be best to map in next function
    // category: `${sheetDeets.category}`,
    // drive_link: `${sheetDeets.drive_link}`,
    // doc_link: `${sheetDeets.doc_link}`,
    // file_format: `${sheetDeets.file_format}`,
    // doc_name: `${sheetDeets.doc_name}`,
    // doc_sheet_name: `${sheetDeets.doc_sheet_name}`,

    // ***** need to refactor ***** time to standardize keys based on category/doc
    // gsa_doc_parent_sku: alphabet.indexOf(
    //   sheetDeets.price_parent_sku.toLowerCase()
    // ),
    // gsa_doc_product_name: alphabet.indexOf(
    //   sheetDeets.price_product_name.toLowerCase()
    // ),
    // gsa_doc_wholesale: alphabet.indexOf(sheetDeets.price_wholesale.toLowerCase()),
    // gsa_doc_gsa_cost: alphabet.indexOf(sheetDeets.price_gsa_cost.toLowerCase()),
    // gsa_doc_msrp: alphabet.indexOf(sheetDeets.price_msrp.toLowerCase()),
    // gsa_doc_map: alphabet.indexOf(sheetDeets.price_map.toLowerCase()),
    // gsa_doc_gsa_map: alphabet.indexOf(sheetDeets.price_gsa_map.toLowerCase()),
    // gsa_doc_coo: alphabet.indexOf(sheetDeets.price_coo.toLowerCase()),
    // gsa_doc_upc: alphabet.indexOf(sheetDeets.price_upc.toLowerCase())
  }

  const mapGSA_DocData = (fetchedData, sheetIdentifier) =>
    fetchedData.map((item, i) => {
      // console.log('sheetDeets',Object.keys(sheetDeets))
      // console.log('sheetDeets[i]',Object.keys(sheetDeets)[i])

      let docDataObject = {
        // assign values to standard keys for all docs, descided these are not needed here since they are already assigned on the main object on the frontend and this is in the array of a prop on that object
        // category: `${sheetDeets.category}`,
        // doc_notes: `${sheetDeets.doc_notes}`,
        // drive_link: `${sheetDeets.drive_link}`,
        // doc_link: `${sheetDeets.doc_link}`,
        // file_format: `${sheetDeets.file_format}`,
        // doc_name: `${sheetDeets.doc_name}`,
        // doc_sheet_name: `${sheetDeets.doc_sheet_name}`,
        // data_range: `${sheetDeets.data_range}`
      }

      // add item stucture for what is pulled from the doc  *** could look to refactor to be more dynamic ***
      // example of the Object.keys(sheetDeets) array from the object that is passed to the function:
      //   sheetDeets [
      //     'category',        'doc_notes',
      //     'drive_link',      'doc_link',
      //     'docSheetId',      'file_format',
      //     'doc_name',        'doc_sheet_name',
      //     'data_range',      'header_column_1',
      //     'header_column_2', 'header_column_3',
      //     'header_column_4', 'header_column_5',
      //     'header_column_6', 'header_column_7',
      //     'header_column_8', 'header_column_9'
      //   ]

// create array for just the headers to use for assigning the key:values coming from the doc
    //   let headerArr = Object.keys(sheetDeets).filter(el =>
    //     el.includes('header_column')
    //   )
    //refactored above after change to sheetDeets object structure, added header_columns prop to map out header# to object
      let headerArr = Object.keys(sheetDeets.header_columns)
      // console.log('headerArr', headerArr)
      item.map((prop, j) => {
        // set the keyName and assign the propValue
        // if (i === 0) {
        //   console.log(`keyName:`, headerArr[j])
        //   console.log('propValue:', prop)
        // }

        // docDataObject[`${sheetDeets.header_columns[headerArr[j]]}`] = prop
        docDataObject[`${headerArr[j]}`] = prop // revised to above so it assigns the header_column value rather than the key(ex:'header_column_1')
      })

      //old and seems to work but did not seem dynamic enough. revised version above.
      //   item.map((prop, j) => {
      //       // create the starting point for assigning key:value based on the manually assigned properties
      //     let mapHeaders = Object.keys(docDataObject).length+1
      //     // set the keyName and assign the propValue
      //     docDataObject[`${Object.keys(sheetDeets)[mapHeaders]}`] = prop
      //   })

      return (docDataArray = [...docDataArray, docDataObject])
    })

  await getGoogleSheet(auth, docSheetMap).then(res =>
    mapGSA_DocData(res, 'priceSheetInfo')
  )

  return docDataArray
}

module.exports = getGSA_docData
