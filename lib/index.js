'use strict';

var fetch = require('isomorphic-fetch');

module.exports = function (q) {
  return fetch('http://kat.ph/json.php?q=' + q.replace(' ', '%20')).then(function (a) {
    return a.json();
  }).then(function (a) {
    return a.list.map(function (item) {
      return {
        title: item.title,
        magnet: 'magnet:?xt=urn:btih:' + item.hash
      };
    });
  });
};