'use strict'

var net = require('net')

var MessageBus = require('./MessageBus')

const DELIMIT = 'DUMPLOGDELIMITOR'

module.exports = function client (params) {
  var port = params.port
  var client = net.connect({port: port}, function () { // 'connect' listener
    console.log('connected to server at', port)
  })
  var bus = new MessageBus()
  client.on('data', function (data) {
    bus.feed(data)
  })
  bus.emitter.on('message', function onMessage (data) {
    data = JSON.parse(data)
    console.log('got dat', data)
    console.log('\n------', new Date(), data.labels)
    console.log.apply(console, data.data)
    console.log('------')
  })
  client.on('end', function () {
    console.log('disconnected from server')
  })

  client.dump = function dump (labels, data) {
    client.write(toStream({ type: 'dump', labels, data }))
  }

  client.dump.logger = function makeLogger (labels) {
    if (typeof labels === 'string') {
      labels = [labels]
    }
    return function dumplog (data) {
      var args = Array.prototype.slice.call(arguments)
      client.dump(labels, args)
    }
  }

  client.subscribe = function subscribe (labels) {
    client.write(toStream({ type: 'subscribe', labels }))
  }

  client.unsubscribe = function unsubscribe (labels) {
    client.write(toStream({ type: 'unsubscribe', labels }))
  }

  client.on('error', function (err) {
    if (!params.silent) {
      console.log('dumplog client error:\n', err)
    }
  })

  return client
}

function toStream (obj) {
  var packet
  try {
    packet = JSON.stringify(obj)
  } catch (err) {
    packet = '[ unstreamable object (' + err.message + ') ]'
  }
  return packet + DELIMIT
}
