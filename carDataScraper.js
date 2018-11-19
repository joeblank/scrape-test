const rp = require('request-promise');
const cheerio = require('cheerio');
const url = 'https://www.cargurus.com/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?sourceContext=forSaleTab_false_0&newSearchFromOverviewPage=true&inventorySearchWidgetType=AUTO&entitySelectingHelper.selectedEntity=d930&entitySelectingHelper.selectedEntity2=&zip=84058&distance=50&searchChanged=true&modelChanged=true&filtersModified=true';

// rp(url)
//   .then(function (html) {
//     //success!
//     console.log($('big > a', html).length);
//     console.log($('big > a', html));
//   })
//   .catch(function (err) {
//     //handle error
//   });

let results = [];

(async function (url) {
  let html = await rp(url)
  let $ = cheerio.load(html);
  console.log('RESULTS: ', $('#featured_listing_201174150').html())
})(url)

// let str = `https://www.cargurus.com/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?sourceContext=forSaleTab_false_0&newSearchFromOverviewPage=true&inventorySearchWidgetType=AUTO&entitySelectingHelper.selectedEntity=d2113&entitySelectingHelper.selectedEntity2=&zip=84058&distance=50&searchChanged=true&modelChanged=true&filtersModified=true&sortType=undefined&sortDirection=undefined`

/*
QUERY STRING:
sourceContext=
newSearchFormOverviewPage=
inventorySearchWidgetType=
entitySelectingHelper.selectedEndtity= STARTING year filter
entitySelectingHelper.selectedEntity2= ending year filter
zip= zip code
distance= distance search in miles
searchChanged=
modelChanged=
filtersModified=
sortType=
sortDirection=
*/