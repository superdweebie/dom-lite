// Defines a lightweight dom node

var util = require('util');
var EventTarget = require('./EventTarget');
var nodeType = require('./nodeType');

var Style = require('./Style'),
    parser = require('./parser'),
    escape = require('./escape'),
    query = require('./query');

var selfClosingTags = [
    'IMG',
    'BR',
    'HR',
    'PATH'
];

function Node(ownerDocument){

    Node.super_.call(this);
    this.attributes = [];
    this.childNodes = [];
    this.ownerDocument = ownerDocument;

    var self = this;

    Object.defineProperty(this, 'className', {
        get: function(){
            return self.getAttribute('class') || '';
        },
        set: function(value){
            return self.setAttribute('class', value);
        }
    });

    Object.defineProperty(this, 'firstChild', {
        get: function(){
            if (self.childNodes.length > 0) return self.childNodes[0];
        }
    });

    Object.defineProperty(this, 'id', {
        get: function(){
            return self.getAttribute('id');
        },
        set: function(value){
            return self.setAttribute('id', value);
        }
    });

    Object.defineProperty(this, 'innerHTML', {
        get: function(){
            if (self.nodeType == nodeType.ELEMENT_NODE ||
                self.nodeType == nodeType.DOCUMENT_NODE ||
                self.nodeType == nodeType.DOCUMENT_FRAGMENT_NODE
            ){
                var pieces = [];
                if (selfClosingTags.indexOf(self.tagName) == -1){
                    self.childNodes.forEach(function(node){
                        pieces.push(node.outerHTML);
                    });
                }
                return pieces.join('');
            } else if (self.nodeType == nodeType.TEXT_NODE && self.parentNode.tagName == 'SCRIPT'){
                return self.nodeValue;
            } else if (self.nodeType == nodeType.TEXT_NODE){
                return escape.escape(self.nodeValue);
            } else {
                return self.nodeValue;
            }
        },
        set: function(rawHtml){
            parser.parse(rawHtml, function(dom){
                self.childNodes.forEach(function(node){self.removeChild(node)});
                dom.childNodes.forEach(function(node){self.appendChild(node)});
            });
        }
    });

    Object.defineProperty(this, 'lastChild', {
        get: function(){
            if (self.childNodes.length > 0) return self.childNodes[self.childNodes.length - 1];
        }
    });

    Object.defineProperty(this, 'nextSibling', {
        get: function(){
            if (!self.parentNode) return;
            var i = self.parentNode.childNodes.indexOf(self);
            if (self.parentNode.childNodes.length < i + 2) return;
            return self.parentNode.childNodes[i + 1];
        }
    });

    Object.defineProperty(this, 'outerHTML', {
        get: function(){
            if (self.nodeType == nodeType.ELEMENT_NODE ||
                self.nodeType == nodeType.DOCUMENT_NODE ||
                self.nodeType == nodeType.DOCUMENT_FRAGMENT_NODE
            ){
                var pieces = [];
                pieces.push('<');
                pieces.push(self.tagName);
                pieces.push(' ');
                self.attributes.forEach(function(attr){
                    var quote = attr.singleQuote ? "'" : '"';
                    pieces.push(attr.name);
                    pieces.push('=');
                    pieces.push(quote);
                    pieces.push(attr.value);
                    pieces.push(quote);
                    pieces.push(' ');
                });
                if (selfClosingTags.indexOf(self.tagName) == -1){
                    pieces.push('>');
                    pieces.push(self.innerHTML);
                    pieces.push('</');
                    pieces.push(self.tagName);
                    pieces.push('>');
                } else {
                    pieces.push('/>');
                }
                return pieces.join('');
            } else {
                return self.innerHTML;
            }
        },
        set: function(rawHtml){
            console.log('set outterhtml not done yet');
        }
    });

    Object.defineProperty(this, 'style', {
        get: function(){
            return new Style(self, Style.inline);
        }
    });
}

util.inherits(Node, EventTarget);

Node.prototype.appendChild = function(node){
    this.insertBefore(node);
}

Node.prototype.cloneNode = function(deep){

    var newNode = new this.constructor(this.ownerDocument);

    this.attributes.forEach(function(attr){newNode.setAttribute(attr.name, attr.value)});

    for (var i in this._eventListeners){
        this._eventListeners[i].forEach(function(listener){newNode.addEventListener(i, listener)})
    }

    newNode.nodeValue = this.nodeValue;

    if (deep){
        this.childNodes.forEach(function(node){
            var newChild = node.cloneNode(deep);
            newNode.childNodes.push(newChild);
            newChild.parentNode = newNode;
        })
    }
    return newNode;
}

Node.prototype.getAttribute = function(attrName){
    var attrNode = this.getAttributeNode(attrName);
    if (attrNode) return attrNode.value;
}

Node.prototype.getAttributeNode = function(attrName){
    for (var i = 0; i < this.attributes.length; i++){
        if (this.attributes[i].name == attrName){
            return this.attributes[i];
        }
    }
}

Node.prototype.hasAttribute = function(attrName){
    return !!(this.getAttributeNode(attrName));
}

Node.prototype.hasChildNodes = function(){
    return (this.childNodes.length > 0);
}

Node.prototype.insertBefore = function(node, ref){
    if (node.parentNode) node.parentNode.removeChild(node);
    node.parentNode = this;

    if (ref){
        var i = this.childNodes.indexOf(ref);
        this.childNodes.splice(i, 0, node);
    } else {
        this.childNodes.push(node);
    }

    return (this.childNodes.length > 0);
}

Node.prototype.querySelector = function(queryString){
    var result,
        testFunc = query.getTestFunc(queryString),
        search = function(node){
            if (testFunc(node)) {
                result = node;
            } else {
                node.children.forEach(search);
            }
        };
    search(this);
    return result;
}

Node.prototype.querySelectorAll = function(queryString){
    var result = [],
        testFunc = query.getTestFunc(queryString),
        search = function(node){
            if (testFunc(node)) result.push(node);
            node.children.forEach(search);
        };
    search(this);

    return result;
}

Node.prototype.removeAttribute = function(attrName){
    for (var i = 0; i < this.attributes.length; i++){
        if (this.attributes[i].name == attrName){
            this.attributes.splice(i, 1);
            break;
        }
    }
}

Node.prototype.removeChild = function(node){
    var i = this.childNodes.indexOf(node);
    if (i > -1) this.childNodes.splice(i, 1);
    node.parentNode = undefined;
    return node;
}

Node.prototype.replaceChild = function(newNode, oldNode){
    var i = this.childNodes.indexOf(oldNode);
    if (i > -1) this.childNodes[i] = newNode;
    newNode.parentNode = this;
}

Node.prototype.setAttribute = function(attrName, value){
    for (var i = 0; i < this.attributes.length; i++){
        if (this.attributes[i].name == attrName){
            this.attributes[i].value = value;
            return;
        }
    }
    this.attributes.push({name: attrName, value: value, specified: true});
}

module.exports = Node;
