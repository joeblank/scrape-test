const config = require('./../config');
const fs = require('fs')



it('scrapes data', () => {
  let urlsToScrape = [];
  function dl() {
    var csv = `Title, Price, Forcast, Market Price Diff, Deal Finder, VIN, Address, Dealer Info, URL\n`;
    urlsToScrape.forEach(({ title, address, listingUrl, dealFinder, dealerInfo, vin, marketPriceDiff, forcast, price }) => {
      csv += `${title}, ${price}, ${forcast}, ${marketPriceDiff},${dealFinder}, ${vin}, ${address}, ${dealerInfo}, ${listingUrl}\n`
    })
    window.location = 'data:text/csv;base64,' + btoa(csv);
  }
  cy.visit(config.baseUrl)
  cy.get('select.select.maker-select-dropdown')
    .then($select => $select.val(config.make.audi))
  cy.get('select.select.maker-select-dropdown')
    .trigger('change')
  cy.get('input[name="zip"]#newSearchHeaderForm_UsedCar_zip')
    .type(config.zip)
  cy.get('form#newSearchHeaderForm_UsedCar input[type="submit"][value="Search"].btn.btn-warning.newSearchSubmitButton')
    // .wait(5000)
    .click()

  // =========
  // cy.visit('https://www.cargurus.com/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?sourceContext=forSaleTab_true_0&newSearchFromOverviewPage=true&inventorySearchWidgetType=AUTO&entitySelectingHelper.selectedEntity=m19&entitySelectingHelper.selectedEntity2=&zip=84058&distance=100&searchChanged=true&modelChanged=true&filtersModified=true&sortType=undefined&sortDirection=undefined')
  //======

  cy.wait(3000)
  cy.get('div#listingsDivParent > div#listingsDiv > div')
    .then(listings => {
      for (let key in listings) {
        if (!listings[key].baseURI) break;
        let index = listings[key].id.indexOf('_')
        let id = listings[key].id.slice(index + 1)
        urlsToScrape.push({ listingUrl: `${listings[key].baseURI}#listing=${id}` })
      }
      urlsToScrape = urlsToScrape.slice(0, 1);
      let promise = new Promise((resolve, reject) => {
        let count = 0
        urlsToScrape.forEach(listing => {
          cy.visit(listing.listingUrl)
          cy.get('h1.ft-listing-detail__header')
            .then(header => {
              listing.title = header[0].innerText
              listing.title = listing.title.replace(',', '').replace(new RegExp('\n', 'g'), ' ')
              listing.title = null
              return cy.get('div.span3.block-icon-offset-address')
            })
            .then(div => {
              let text = div[0].innerText
              text = text.replace(',', '').replace('\n', ' ')
              listing.address = text
              return cy.get('div.dealerInfo-header')
            })
            .then(dealerInfo => {
              listing.dealerInfo = dealerInfo[0].innerText.replace(',', '').replace('\n', ' ')
              return cy.get('span.cg-dealfinder-result-deal-recommendation')
            })
            .then(span => {
              listing.dealFinder = span[0].innerText.replace(',', '').replace('\n', ' ')
              return cy.get('td.attributeLabel').contains('VIN:')
            })
            .then(vinTd => {
              listing.vin = vinTd[0].nextElementSibling.innerText.replace(',', '').replace('\n', ' ')
              return cy.get('table.cg-dealFinder-resultTable > tbody > tr > td')
            })
            .then(td => {
              let forcast = td[0].childNodes[1].innerText.replace(',', '').replace('\n', ' ')
              let marketPriceDiff = td[0].childNodes[3].innerText.replace(',', '').replace('\n', ' ')
              listing.forcast = forcast;
              listing.marketPriceDiff = marketPriceDiff;
              return cy.get('div.cg-listingDetail-specsWrap > table > tbody > tr')
            })
            .then(tr => {
              let row = tr[0];
              console.log(row, tr)
              listing.price = row.childNodes[3].innerText.replace(',', '').replace(new RegExp('\n', 'g'), ' ')
              count++
              if (count === urlsToScrape.length) {
                console.log(count, urlsToScrape.length)
                resolve()
              }
            })
          cy.wait(3000)
        })
      })
      promise.then(() => dl())


    })




})