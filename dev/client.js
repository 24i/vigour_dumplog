'use strict'

var Repl = require('repl')
var repl = Repl.start({ prompt: '> ', useGlobal: true })
var context = repl.context

var dl = require('../lib/index')

var client = global.client = dl.client({
  port: 50555
})

var dump1 = client.dump.logger('label')
var dump2 = client.dump.logger(['otherlabel', 'thirdlabel'])

setInterval(function () {
  dump1({obj: true})
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