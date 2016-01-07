'use strict'

var net = require('net')

var events = require('events')
var mainChannel = new events.EventEmitter()
var channels = {
  main: mainChannel
}

var MessageBus = require('./MessageBus')

const DELIMIT = 'DUMPLOGDELIMITOR'

module.exports = function server (params) {
  var port = params.port

  var server = net.createServer(function (client) {
    client.id = client.remoteAddress + ':' + client.remotePort
    var bus = new MessageBus()

    client.on('data', function (data) {
      bus.feed(data)
    })

    bus.emitter.on('message', function (data) {
      handlePacket(client, data)
    })

    client.on('end', function () {
      cleanUp(client)
    })
  })

  server.listen(port)

  server.on('error', function (err) {
    if (!params.silent) {
      console.log('[dumplog server] error:\n', err)
    }
  })

  return server
}



function handlePacket (client, packet) {
  var id = client.id
  var parsed
  try {
    parsed = JSON.parse(packet)
  } catch (err) {
    console.log('client', id, 'is talking jibberish!', packet)
  }

  var labels = parsed.labels
  // console.log('client', id, 'says', parsed)

  switch (parsed.type) {
    case 'dump':
      for (let label of labels) {
        let channel = channels[label]
        if (channel) {
          channel.emit('broadcast', id, packet)
        }
      }
      break
    case 'subscribe':
      for (let label of labels) {
        let channel = channels[label]
        if (!channel) {
          channel = channels[label] = createChannel(label)
        }
        channel.clients[id] = client
      }
      break
    case 'unsubscribe':
      for (let label of labels) {
        let channel = channels[label]
        if (channel) {
          let clients = channel.clients
          delete clients[id]
          if (Object.keys(clients).length === 0) {
            delete channels[label]
          }
        }
      }
      break
  }
}

function createChannel (label) {
  var channel = new events.EventEmitter()
  var clients = channel.clients = {}
  channel.on('broadcast', function (id, data) {
    for (let clientId in clients) {
      if (clientId !== id) {
        // console.log('write to client!!', clientId, id)
        clients[clientId].write(data + DELIMIT)
      }
    }
  })
  return channel
}

function cleanUp (client) {
  for (let ch in channels) {
    let channel = channels[ch]
    let clients = channel.clients
    for (let cl in clients) {
      let hasClient = clients[cl]
      if (hasClient === client) {
        delete clients[cl]
      }
    }
    if (!clients || Object.keys(clients) === 0) {
      delete channels[ch]
    }
  }
}
