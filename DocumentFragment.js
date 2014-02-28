// Defines a lightweight dom root node
var Element = require('./Element');
var util = require('util');
var nodeType = require('./nodeType');

function DocumentFragment(){
    DocumentFragment.super_.call(this);
    this.nodeType = nodeType.DOCUMENT_FRAGMENT_NODE;
}

util.inherits(DocumentFragment, Element);

module.exports = DocumentFragment;
