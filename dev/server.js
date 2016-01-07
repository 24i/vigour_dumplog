'use strict'

var Repl = require('repl')
var repl = Repl.start({ prompt: '> ', useGlobal: true })
var context = repl.context

var dl = require('../lib/index')

context.server = dl.server({
  port: 50666
})

// -- repl shortcuts
Object.defineProperty(context, 'q', {
  get: function () {
    console.log('k bye!')
    process.exit()
  },
  configurable: true
})
