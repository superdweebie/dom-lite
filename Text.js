
var util = require('util');
var Node = require('./Node');
var nodeType = require('./nodeType');

function Text(ownerDocument){
    Text.super_.call(this, ownerDocument);
    this.nodeType = nodeType.TEXT_NODE;
}

util.inherits(Text, Node);

module.exports = Text;
