// Defines a lightweight style object

var fromString = function(text){
    var rules = text.split(';'),
        rule,
        pieces,
        obj = {};

    while (rule = rules.pop()){
        pieces = rule.split('=');
        obj[pieces.pop()] = pieces.pop();
    }

    return obj;
};

var toString = function(obj){
    var text = [],
        i;

    for (i in obj){
        text.push(i + '=' + obj[i]);
    }

    return text.join(';');
};

var computeStyle = function(_refNode){

    var style = {};

    if (_refNode.tagName == 'PRE'){
        style['white-space'] = 'pre';
    }
    
    return style;
}

function Style(_refNode, _mode){

    this._refNode = _refNode;
    this._mode = _mode;

    Object.defineProperty(this, 'cssText', {
        get: function(){
            return _refNode.getAttribute('style');
        },
        set: function(value){
            if (_mode == Style.inline) _refNode.setAttribute('style', value);
        }
    });
}

Style.computed = 0;
Style.inline = 1;

Style.prototype.getPropertyValue = function(prop){
    if (this._mode == Style.computed){
        return computeStyle(this._refNode)[prop];
    } else {
        return fromString(this._refNode.getAttribute('style'))[prop];
    }
}

Style.prototype.setPropertyValue = function(prop, value){
    if (this._mode != Style.inline) return;

    var rules = fromString(this._refNode.getAttribute('style'));
    rules[prop] = value;
    this.node.setAttribute('style', toString(rules));
}

module.exports = Style;
