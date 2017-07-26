const cheerio = require('cheerio')
const rp = require('request-promise')

function movies(query) {
  const uri = `http://www.imdb.com/find?ref_=nv_sr_fn&q=${encodeURIComponent(query)}&s=all`
  return rp(uri)
  .then(function(body) {
    const $ = cheerio.load(body)
    const results = $('.findSection').first().find('.result_text')
      .map((i, elm) =>
      $(elm).text())
      .toArray()
    return results
  })
}

module.exports = {movies}
