#! env node
const cheerio = require('cheerio')
const iconv = require('iconv-lite')

const urls = [
  'https://www.vivareal.com.br/imovel/apartamento-2-quartos-centro-bairros-belo-horizonte-37m2-aluguel-RS1000-id-85854614/',
  'https://www.vivareal.com.br/imovel/apartamento-2-quartos-centro-bairros-belo-horizonte-45m2-aluguel-RS950-id-93415311/',
  'https://www.vivareal.com.br/imovel/apartamento-2-quartos-centro-bairros-belo-horizonte-49m2-aluguel-RS1000-id-83757177/',
  'https://www.vivareal.com.br/imovel/apartamento-2-quartos-centro-bairros-belo-horizonte-50m2-aluguel-RS700-id-1037841340/',
  'https://www.vivareal.com.br/imovel/apartamento-2-quartos-centro-bairros-belo-horizonte-60m2-aluguel-RS850-id-93643865/',
  'https://www.vivareal.com.br/imovel/apartamento-2-quartos-centro-bairros-belo-horizonte-62m2-aluguel-RS1000-id-83150989/',
  'https://www.vivareal.com.br/imovel/apartamento-2-quartos-centro-bairros-belo-horizonte-65m2-aluguel-RS950-id-88722609/',
  'https://www.vivareal.com.br/imovel/apartamento-2-quartos-centro-bairros-belo-horizonte-70m2-aluguel-RS900-id-76501385/',
]

const handler = (html, url) => {

  const $ = cheerio.load(html)

  // const removeCurrency = val =>
  const currency2num = val => typeof val === 'string' && val !== ''
    ? parseInt(val.replace('R$ ', '').replace('.', ''))
    : 0

  const sumCurrencies = (...list) => list
    .reduce((acc, cur) => acc + cur, 0)


  // Collect some data
  const price = currency2num($('.js-detail-rent-price').text().split("/")[0].trim())
  const condominio = currency2num($('.js-detail-condo-price').text())
  const iptu = currency2num($('.js-detail-iptu-price').text())
  const total = sumCurrencies(price, condominio, iptu)
  const phones = $('a.by.js-contact-call').toArray()
    .map(i => i.children[0].data.trim())
  const area = $('.js-detail-area-value').text().split('m')[0]
  const tipo = $('.js-detail-type-value').text().trim()
  const quartos = $('.js-detail-rooms .aM').text().trim()
  const desc = $('.pq .ps').text().trim()
  const local = $('.Y.js-title-location').text().trim()
  const code = $('.W.js-title-code').text().trim()

  // Define result
  return {
    url,
    "Tipo": tipo,
    "Local": local,
    "Área": area,
    "Quartos": quartos,
    "Total": total,
    "Preço": price,
    "Condomínio": condominio,
    "IPTU": iptu,
    "Descrição": desc,
    "Telefones": phones,
    "Código": code,
  }
}

const prefix = 'vivareal'

const onFinish = () => console.log("[collector:vivareal] \tDone!")

module.exports = {
  urls,
  handler,
  prefix,
  onFinish
}