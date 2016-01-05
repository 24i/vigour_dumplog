var delimitLength = 9
var findPacket = /(.*)\|delimit\|/g

var input = 'jajadit|delimit|hanoghalf'
var found
while (found = findPacket.exec(input)) {
  var packet = found[1]
  input = input.slice(packet.length + delimitLength)
  console.log('input is now', input)
  findPacket.lastIndex = 0
}
