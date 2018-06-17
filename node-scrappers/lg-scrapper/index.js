const fs = require('fs')
const axios = require("axios")
const qs = require("querystring")
const $ = require("jquery")
const {JSDOM} = require("jsdom");

const url = "http://www.fnde.gov.br/pls/simad/internet_fnde.liberacoes_result_pc"
let data = {
    "p_ano": "2017",
    "p_verifica": "sigef",
    "p_programa":"",
    "p_cgc": "7942271000105",

}
console.log(qs.stringify(data));

// return
const getHTML = data => axios({
    method: 'post',
    url,
    body: qs.stringify(data),
    headers: {

    },
})
    .then(res => {
      let dados = res.data
      // const document = new JSDOM(res.data)
      // const window = document.window
      // const $ = require('jquery')(window)
      console.log(dados)
      let links = $("a")
      //console.log(links)
    })
    .catch(err => console.log(err))

    getHTML()
