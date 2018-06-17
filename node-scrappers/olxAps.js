#! env node
const fs = require('fs')
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const iconv = require('iconv-lite')
const json2csvParser = require('json2csv').parse

const urls = [
  'https://mg.olx.com.br/belo-horizonte-e-regiao/imoveis/aluga-se-apartamento-av-augusto-de-lima-bairro-centro-474044064',
  'https://mg.olx.com.br/belo-horizonte-e-regiao/imoveis/aluga-se-apartamento-av-augusto-de-lima-bairro-centro-474044064',
  'https://mg.olx.com.br/belo-horizonte-e-regiao/imoveis/alugo-apto-centro-494909050',
  'https://mg.olx.com.br/belo-horizonte-e-regiao/imoveis/apartamento-3-quartos-para-alugar-80-m2-por-r-700-00-490160663',
  'https://mg.olx.com.br/belo-horizonte-e-regiao/imoveis/apartamento-padrao-491124606',
  'https://mg.olx.com.br/belo-horizonte-e-regiao/imoveis/apartamento-padrao-495154162',
  'https://mg.olx.com.br/belo-horizonte-e-regiao/imoveis/apto-02-qrts-barro-preto-484600685',
  'https://mg.olx.com.br/belo-horizonte-e-regiao/imoveis/locacao-centro-bh-490963828',
  'https://mg.olx.com.br/belo-horizonte-e-regiao/imoveis/otimo-apartamento-de-2-quartos-com-armarios-proximo-ao-shopping-cidade-493339056',
]

const handlerOlx = (html, url) => {

  const $ = cheerio.load(html, {
    normalizeWhitespace: false,
  })

  // Collect some data
  const price = $('.OLXad-price').text().trim().split("\n")[0]
  const details = $('.OLXad-details')
  const terms = details.find('span.term')
  const desc = details.find('strong.description')

  // Define result
  let results = {
    url,
    "Preço": price
  }

  desc
    .map((i, v) => {
      const encoder = (str, from, to) => iconv.decode(iconv.encode(str, from),to)

      const normalize = str =>
        str.includes('�rea �til')
          ? "Área Útil"

        : str.includes("Condom�nio")
          ? "Condomínio"

        : str.includes('m�')
          ? str.split(' ')[0]

        : str === "Aluguel - apartamento padr�o"
          ? "Aluguel - apartamento padrão"

        : str

      const key = normalize($(terms[i]).text())
      const val = normalize($(desc[i]).text())

      results = {
        ...results,
        [key]: val
      }
    })

  return results
}


Promise.all(
  urls.map(url =>
    fetch(url)
      .then(res => res.text())
      .then(html => handlerOlx(html, url))
      .catch(console.error)
  )
).then(results => {
  // Save file
  // csv
  fs.writeFile('./result-olx.csv', json2csvParser(results), console.error)
  // json
  fs.writeFile('./result-olx.json', JSON.stringify(results, null, 4), console.error)
})