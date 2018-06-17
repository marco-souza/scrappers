#! env node
const fs = require('fs')
const assert = require('assert')
const encoding = require('encoding')
const encodings = require('./availableCharsets.json')
const {
  times
} = require('lodash')

// times(100, i => `ISO-8859-${i+1}`)
encodings
  .map(format => {
    let result = null
    try {
      result = encoding.convert('Á', format, 'UTF-8').toString()
    } catch (err) {}
    return result || ''
  })
  .map((v, i) => {
    console.log(v, encodings[i])
    // if ((v) === 'í')
  })

