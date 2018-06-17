#! env node
const cheerio = require('cheerio')
const iconv = require('iconv-lite')
const jsdom = require("jsdom")
const { JSDOM } = jsdom


const urls = [
  'https://www.zapimoveis.com.br/oferta/aluguel+apartamento+2-quartos+centro+belo-horizonte+mg+40m2/ID-18263823/?paginaoferta=3',
  'https://www.zapimoveis.com.br/oferta/aluguel+apartamento+2-quartos+centro+belo-horizonte+mg+50m2/ID-16893085/?paginaoferta=4',
  'https://www.zapimoveis.com.br/oferta/aluguel+apartamento+2-quartos+centro+belo-horizonte+mg+60m2/ID-15097613/?paginaoferta=4',
]

const handler = (html, url) => {

  const { window, window: { document } } = new JSDOM(html)
  const $ = require("jquery")(window)

  const currency2num = val => typeof val === 'string' && val !== ''
    ? parseInt(val.replace('R$ ', '').replace('.', ''))
    : 0

  const sumCurrencies = (...list) => list
    .reduce((acc, cur) => acc + cur, 0)

  // Actions

  // Collect some data
  const desc = $('.descricao p').text().trim()
  const [ quartos, area, condominio, iptu ] = $('.informacoes-imovel .unstyled li').toArray()
    .map(i => i.innerHTML.split('<')[0].trim())
    .map(currency2num)
  const price = currency2num($('.endereco-imovel .value-ficha').text().split('\n')[2] || '')
  const local = ($('.endereco-imovel .pull-left').text().split('\n')[2] || '').trim()
  const tipo = ($('.endereco-imovel .pull-left').text().split('\n')[1] || '').trim()
  const total = sumCurrencies(
    price,
    condominio,
    iptu
  )


  // Define result
  return {
    url,
    "Tipo": tipo,
    // "Código": code,
    "Local": local,
    "Área": area,
    "Quartos": quartos,
    "Preço": price,
    "Condomínio": condominio,
    "IPTU": iptu,
    "Total": total,
    // "Telefones": phones,
    "Descrição": desc,
  }
}

const prefix = 'zapimoveis'

const onFinish = () => console.log("[collector:zapimoveis] \tDone!")

module.exports = {
  urls,
  handler,
  prefix,
  onFinish
}