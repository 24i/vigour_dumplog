'use strict'

var Repl = require('repl')
var repl = Repl.start({ prompt: '> ', useGlobal: true })
var context = repl.context

var dl = require('../lib/index')

var client = global.client = dl.client({
  port: 50666
})

var client2 = dl.client({
  port: 50666
})

var dump1 = client.dump.logger('label')
var dump2 = client2.dump.logger('label')

setInterval(function () {
  dump1({obj: true})
  dump1('ja hallo', 'urk:\n', {ahahaha: 1})
  // dump2('lalawa')
}, 1000)

// -- repl shortcuts
Object.defineProperty(context, 'q', {
  get: function () {
    console.log('k bye!')
    process.exit()
  },
  configurable: true
})

setTimeout(function() {
  var lerk = {
  }
  lerk.blerk = lerk

  dump1(lerk)
}, 1000)