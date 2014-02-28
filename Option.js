
var util = require('util');
var Element = require('./Element');
var nodeType = require('./nodeType');

function Option(ownerDocument){
    Option.super_.call(this, ownerDocument);

    var self = this;

    Object.defineProperty(this, 'text', {
        get: function(){
            return self.innerHTML;
        },
        set: function(value){
            self.innerHTML = value;
        }
    });

    Object.defineProperty(this, 'value', {
        get: function(){
            return self.getAttribute('value');
        },
        set: function(value){
            self.setAttribute('value', value);
        }
    });
}

util.inherits(Option, Element);

module.exports = Option;
