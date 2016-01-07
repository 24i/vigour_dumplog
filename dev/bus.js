'use strict'

var MessageBus = require('../lib/MessageBus')

var bus = new MessageBus()

bus.emitter.on('message', function (output) {
  console.log('ha message', output)
})
bus.feed('11DUMPLOGDELIMITOR2')
bus.feed('2DUMPLOGDELIMITOR33DUMPLOGDELIMITOR')
