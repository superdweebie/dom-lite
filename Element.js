
var util = require('util');
var Node = require('./Node');
var nodeType = require('./nodeType');

function Element(ownerDocument){

    Element.super_.call(this, ownerDocument);
    this.nodeType = nodeType.ELEMENT_NODE;

    var self = this;

    Object.defineProperty(this, 'children', {
        get: function(){
            return self.childNodes.filter(function(node){return (node.nodeType == nodeType.ELEMENT_NODE)})
        }
    });

    Object.defineProperty(this, 'firstElementChild', {
        get: function(){
            var children = self.children;
            if (children.length > 0) return children[0];
        }
    });

    Object.defineProperty(this, 'lastElementChild', {
        get: function(){
            var children = self.children;
            if (children.length > 0) return children[children.length - 1];
        }
    });
}

util.inherits(Element, Node);

Element.prototype.cloneNode = function(deep){

    var newNode = Element.super_.prototype.cloneNode.call(this, deep);

    newNode.tagName = this.tagName;

    return newNode;
}

Element.prototype.getElementsByTagName = function(tagName){

    tagName = tagName.toUpperCase();

    var result = [],
        search = function(node){
            if (node.tagName == tagName) result.push(node);
            node.children.forEach(search);
        }
    search(this);
    return result;
};

module.exports = Element;
