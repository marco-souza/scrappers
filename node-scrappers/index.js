#! env node
const fs = require('fs')
const fetch = require('node-fetch')
const json2csvParser = require('json2csv').parse

const olx = require('./collectors/olx')
const vivareal = require('./collectors/vivareal')
const zapimoveis = require('./collectors/zapimoveis')

const saveFile = name => results => {
  // Save file
  const errorHandler = err => err && console.error(err)
  // csv
  fs.writeFile(`./results/result-${name}.csv`, json2csvParser(results), errorHandler)
  // json
  fs.writeFile(`./results/result-${name}.json`, JSON.stringify(results, null, 4), errorHandler)
}

// Define list of collectors
const collectors = [
  olx,
  vivareal,
  zapimoveis,
]

// Run each collector
collectors.map(collector => {
  Promise.all(collector.urls
    .map(url => fetch(url)
      .then(res => res.text())
      .then(html => collector.handler(html, url))
      .catch(console.error)
    )
  )
    .then(saveFile(collector.prefix))
    .then(collector.onFinish)
})