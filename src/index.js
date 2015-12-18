var fetch = require('isomorphic-fetch')

module.exports = q =>
  fetch(`http://kat.ph/json.php?q=${q.replace(' ', '%20')}`)
    .then(a => a.json())
    .then(a =>
      a.list.map(item =>
        ({
          title: item.title,
          magnet: `magnet:?xt=urn:btih:${item.hash}`
        })
      )
    )
