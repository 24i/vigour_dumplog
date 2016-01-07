'use strict'

var EventEmitter = require('events').EventEmitter

const DELIMIT = 'DUMPLOGDELIMITOR'
const DELENGTH = DELIMIT.length

var MessageBus = module.exports = function MessageBus (data) {
  this.id = Math.random()
  this.emitter = new EventEmitter()
}

MessageBus.prototype.feed = function feed (data) {
  var findPacket = /(.*?)DUMPLOGDELIMITOR/g
  var parsed = data.toString()
  var found
  var datacache = this.datacache
  if (datacache) {
    parsed = datacache + parsed
  }
  while ((found = findPacket.exec(parsed))) {
    let packet = found[1]
    this.emitter.emit('message', packet)
    parsed = parsed.slice(packet.length + DELENGTH)
    findPacket.lastIndex = 0
  }
  this.datacache = parsed
}
