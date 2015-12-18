#!/usr/bin/env node
'use strict';

var _clivas = require('clivas');

var _clivas2 = _interopRequireDefault(_clivas);

var _copyPaste = require('copy-paste');

var _copyPaste2 = _interopRequireDefault(_copyPaste);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _torrentStream = require('torrent-stream');

var _torrentStream2 = _interopRequireDefault(_torrentStream);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var kat = require('./');
var optimist = require('optimist');

var argv = optimist.usage('Usage: $0 search-query [options]').alias('p', 'peerflix').boolean('f').alias('f', 'files').boolean('f').argv;

var query = argv._.join(' ');

kat(query).then(function (results) {
  _inquirer2.default.prompt([{
    type: 'list',
    name: 'selected',
    message: 'Select torrent from below',
    choices: results.map(function (a) {
      return a.title;
    })
  }], function (answers) {
    var choice = results.filter(function (a) {
      return a.title === answers.selected;
    })[0];

    if (!argv.p) {
      var _ret = (function () {
        if (!argv.f) {
          console.log(' Title: ' + choice.title);
          console.log('Magnet: ' + choice.magnet);
          return {
            v: undefined
          };
        }

        var engine = (0, _torrentStream2.default)(choice.magnet);

        console.log('Loading...');

        engine.on('ready', function () {

          _inquirer2.default.prompt([{
            type: 'list',
            name: 'file',
            message: 'Choose file',
            choices: engine.files.map(function (file) {
              return file.name;
            })
          }], function (ans) {
            var i = 0;

            engine.files.map(function (file, n) {
              if (file.name == ans.file) i = n;
            });

            engine.destroy();

            console.log('     Title: ' + choice.title);
            console.log('    Magnet: ' + choice.magnet);
            console.log('File Index: ' + i);
          });
        });

        return {
          v: undefined
        };
      })();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    }

    if (argv.f) {
      var _ret2 = (function () {
        var engine = (0, _torrentStream2.default)(choice.magnet);

        engine.on('ready', function () {
          return _inquirer2.default.prompt([{
            type: 'list',
            name: 'file',
            message: 'Choose file',
            choices: engine.files.map(function (file) {
              return file.name;
            })
          }], function (ans) {
            var i = 0;

            engine.files.map(function (file, n) {
              if (file.name == ans.file) i = n;
            });

            engine.destroy();

            console.log('--vlc --index ' + i);

            peerflix(choice.magnet, ['--vlc -i ' + i]);
          });
        });

        return {
          v: undefined
        };
      })();

      if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
    }

    peerflix(choice.magnet);
  });
});

var peerflix = function peerflix(magnet) {
  var index = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  var cmd = 'peerflix "' + magnet + '" -v -i ' + index;

  console.log(cmd);

  _child_process2.default.exec(cmd, function (error, stdout, stdin) {
    console.log(stdoutx);
  });

  return;

  var child = _child_process2.default.spawn('peerflix', ['"' + magnet + '"'].concat(_toConsumableArray(ops)));

  child.stdout.pipe(process.stdout);
};