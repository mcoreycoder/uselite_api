const { google } = require('googleapis')

// old gsa sheet using "Exhibit B. USElite Price Proposal Template(googleFormat)(GSA approved PO-0066)"
// note data is pulled from different columns
// async function listPastGSA (auth) {
//   let gsaArray = []
//   const sheets = google.sheets({ version: 'v4', auth })
//   const tabName = 'PRODUCTS WITH DISCOUNT (A)'
//   const cellMin = 'A2'
//   const cellMax = 'AB197' //last item located on row "AB197", test calls with less data use "AB7"
//   const cellRange = `${cellMin}:${cellMax}`

//   try {
//     gsaArray = (
//       await sheets.spreadsheets.values.get({
//         spreadsheetId: '1xnqSp9zZGk3jpt4JCiuiB4at086va6GjIbOWcZw8TtU', // ID for "Exhibit B. USElite Price Proposal Template(googleFormat)(GSA approved PO-0066)"
//         range: `'${tabName}'!${cellRange}`
//       })
//     ).data.values
//   } catch (err) {
//     console.error(`listBrands Oh Sheet! and err:\n`, err)
//   }
//   return gsaArray
// }

// async function listCurrentGSA (auth) {
//   let gsaArray = []
//   const sheets = google.sheets({ version: 'v4', auth })
//   const tabName = '2021ProductList'
//   const cellMin = 'BE3'
//   const cellMax = 'CG320' //last item located on row "CF320" (changed to "CG320" to work in current sku to this list), test calls with less data use "CF8"
//   const cellRange = `${cellMin}:${cellMax}`
//   console.log('`${tabName}!${cellRange}`', `${tabName}!${cellRange}`)
//   try {
//     gsaArray = (
//       await sheets.spreadsheets.values.get({
//         spreadsheetId: '1UA4B3ZyerKkTwMrHX3CpvTTazfSRRjCxKKIwQHc0Z0Y', // 7.15.21 copy of GSAbrands2021
//         range: `'${tabName}'!${cellRange}`
//       })
//     ).data.values
//   } catch (err) {
//     console.error(`listBrands Oh Sheet! and err:\n`, err)
//   }
//   return gsaArray
// }

async function getGoogleSheet (auth, sheetInfo) {
  const sheetId = sheetInfo.sheetId
  const tabName = sheetInfo.tabName
  const cellMin = sheetInfo.cellMin
  const cellMax = sheetInfo.cellMax
  let dataArray = []
  // console.log(`getGoogleSheet '{tabName}!{cellMin}:{cellMax}':${tabName}!${cellMin}:${cellMax}`)
  try {
    dataArray = (
      await google.sheets({ version: 'v4', auth }).spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `'${tabName}'!${cellMin}:${cellMax}`
      })

    ).data.values
  } catch (err) {
    console.error(`Oh Sheet! getGoogleSheet() had this err:\n`, err)
  }
  return dataArray
}

// module.exports.listPastGSA = listPastGSA
// module.exports.listCurrentGSA = listCurrentGSA
module.exports = getGoogleSheet
