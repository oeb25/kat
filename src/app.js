#!/usr/bin/env node

var kat = require('./')
var optimist = require('optimist')
import clivas from 'clivas'
import cp from 'copy-paste'
import inquirer from 'inquirer'
import ts from 'torrent-stream'
import proc from 'child_process'

const argv = optimist
  .usage('Usage: $0 search-query [options]')
  .alias('p', 'peerflix').boolean('f')
  .alias('f', 'files').boolean('f')
  .argv

const query = argv._.join(' ')

kat(query)
  .then(results => {
    inquirer.prompt([
      {
        type: 'list',
        name: 'selected',
        message: 'Select torrent from below',
        choices: results.map(a => a.title)
      }
    ], answers => {
      const choice = results
        .filter(a => a.title === answers.selected)[0]

      if (!argv.p) {
        if (!argv.f) {
          console.log(' Title: ' + choice.title)
          console.log('Magnet: ' + choice.magnet)
          return
        }

        const engine = ts(choice.magnet)

        console.log('Loading...')

        engine.on('ready', () => {

          inquirer.prompt([
            {
              type: 'list',
              name: 'file',
              message: 'Choose file',
              choices: engine.files
                .map(file => file.name)
            }
          ], ans => {
            let i = 0

            engine.files.map((file, n) => {
              if (file.name == ans.file)
                i = n
            })

            engine.destroy()

            console.log('     Title: ' + choice.title)
            console.log('    Magnet: ' + choice.magnet)
            console.log('File Index: ' + i)
          })
        })

        return
      }

      if (argv.f) {
        const engine = ts(choice.magnet)

        engine.on('ready', () =>
          inquirer.prompt([
            {
              type: 'list',
              name: 'file',
              message: 'Choose file',
              choices: engine.files
                .map(file => file.name)
            }
          ], ans => {
            let i = 0

            engine.files.map((file, n) => {
              if (file.name == ans.file)
                i = n
            })

            engine.destroy()

            console.log('--vlc --index ' + i);

            peerflix(choice.magnet,
              ['--vlc -i ' + i])
          })
        )

        return
      }

      peerflix(choice.magnet)
    })
  })

const peerflix = (magnet, index = 0) => {
  const cmd = `peerflix "${magnet}" -v -i ${index}`

  console.log(cmd)

  proc.exec(cmd, (error, stdout, stdin) => {
    console.log(stdoutx)
  })

  return

  const child = proc.spawn('peerflix',
    [`"${magnet}"`, ...ops])

  child.stdout.pipe(process.stdout)
}
