
var util = require('util');
var Element = require('./Element');
var nodeType = require('./nodeType');

function Textarea(ownerDocument){
    Textarea.super_.call(this, ownerDocument);

    var self = this;

    Object.defineProperty(this, 'value', {
        get: function(){
            return self.innerHTML;
        },
        set: function(value){
            self.innerHTML = value;
        }
    });
}

util.inherits(Textarea, Element);

module.exports = Textarea;
