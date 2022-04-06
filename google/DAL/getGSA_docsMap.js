const getGoogleSheet = require('../getGoogleSheet')
const { compare } = require('../helpers')

async function getGSA_docsMap (auth) {
  let listsArray = []
  const sheetInfo = {
    sheetId: '1x17QYlhO-PkNoCX7ATP-7zExOTjrlKUoQkjGLi3eXpM', // 2022 in Development Test > Brands > _GSA_PriceListMap folder
    // sheetId: '16bp80BxUOcct7aQY44cfU1WFmpI1BI4Qg5dS-vRNUXI', // 2021 in Development Test > Brands > _GSA_PriceListMap folder
    tabName: 'Docs',
    cellMin: 'A1',
    cellMax: 'DC50'
  }

  const mapGSAdocsListsMap = list => {
    // remove first item of the list array, sheets column 'headers',
    // assigning to an object using the spread opperator assigns the index as the property name making it easier to use when
    // creating the docsListObject and assigning the key:value using the index passed through the item.map() below
    let docsListMapObject = { ...list.shift() }

    let composeMappedList = list.map((item, i) => {
      let docsListObject = {}
      let docHeaderListObject = {}
      item.map((prop, j) => {
        // use the priceListMapObject and index in the item.map() to select the correct key:value to set property names on the priceListObject when assigning the prop value
        if (docsListMapObject[j] !== ""){
          // docsListObject[docsListMapObject[j]] = prop
          if(docsListMapObject[j] === 'doc_link'){
            let docSheetId = prop
            .replace('https://docs.google.com/spreadsheets/d/', '')
            .split('/')[0] // reduce link to just the id
            docsListObject['docSheetId'] = docSheetId
          }
          if(docsListMapObject[j].includes(`header_column`)){
            // console.log(`docsListMapObject[j].includes('header_column')`)
            docHeaderListObject[docsListMapObject[j]] = prop
            // let header_column_num = docsListObject[docsListMapObject[j]]
            // docsListObject['header_columns'] = {...docsListObject['header_column'], [header_column_num] : prop}
          }else
{          docsListObject[docsListMapObject[j]] = prop
}
        }
      })

      if(docsListObject.category !== undefined && docsListObject.file_format !== "excel format" ){
        docsListObject['header_columns'] = docHeaderListObject
        listsArray = [...listsArray, docsListObject].sort((a, b) =>
        compare(a.category, b.category)
      )
      }
      
    })
    return composeMappedList
  }

  await getGoogleSheet(auth, sheetInfo).then(res => mapGSAdocsListsMap(res))

  return listsArray //returns the list of gsaDocsLists with mapped out columns for mapping data in each (always starting with column A)
}

module.exports = getGSA_docsMap
