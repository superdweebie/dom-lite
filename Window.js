// Defines a lightweight dom window
var Style = require('./Style');

function Window(){
}

Window.prototype.getComputedStyle = function(element){
    return new Style(element, Style.computed);
}

module.exports = Window;
