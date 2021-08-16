const getGoogleSheet = require('../getGoogleSheet')
const { compare } = require('../helpers')

async function getPriceListsMap (auth) {
  let listsArray = []
  const sheetInfo = {
    sheetId: '16bp80BxUOcct7aQY44cfU1WFmpI1BI4Qg5dS-vRNUXI', // 2021 in Development Test > Brands > _GSA_PriceListMap folder
    // sheetId: '1UA4B3ZyerKkTwMrHX3CpvTTazfSRRjCxKKIwQHc0Z0Y', // 7.15.21 copy of GSAbrands2021
    tabName: 'Brands',
    cellMin: 'A1',
    cellMax: 'AU7'
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
        compare(a.brand, b.brand)
      )
    })
    return composeMappedList
  }

  await getGoogleSheet(auth, sheetInfo).then(res => mapGSAPriceListsMap(res))

  return listsArray //returns the list of priceLists with mapped out columns for mapping data in each (always starting with column A)
}

module.exports = getPriceListsMap
