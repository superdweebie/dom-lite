var Element = require('./Element'),
    Text = require('./Text'),
    Document = require('./Document'),
    nodeType = require('./nodeType'),
    escape = require('./escape');

function Dom(callback){
	this._callback = callback;
	this.document = new Document;
	this._done = false;
	this._tagStack = [];
}

//Resets the handler back to starting state
Dom.prototype.onreset = function(){
	Dom.call(this, this._callback);
};

//Signals the handler that parsing is done
Dom.prototype.onend = function(){
	if(this._done) return;
	this._done = true;
	this._handleCallback(null);
};

Dom.prototype._handleCallback =
Dom.prototype.onerror = function(error){
	if(typeof this._callback === "function"){
		this._callback(error, this.document);
	} else {
		if(error) throw error;
	}
};

Dom.prototype.onclosetag = function(name){
	this._tagStack.pop();
};

Dom.prototype.onopentag = function(name, attribs){

    var lastTag = this._tagStack[this._tagStack.length - 1],
        parent = lastTag ? lastTag : this.document,
        element = this.document.createElement(name);

    parent.appendChild(element);

    for (var i in attribs){
        element.setAttribute(i, attribs[i])
    }

	this._tagStack.push(element);

    if (name == 'body'){
        this.document.body = element;
    }
    if (name == 'head'){
        this.document.head = element;
    }
};

Dom.prototype.ontext = function(data){

	var lastTag;

    data = escape.unescape(data.replace(/^\n|\n$/, ''));

	if(!this._tagStack.length && this.document.childNodes.length && (lastTag = this.document.childNodes[this.document.childNodes.length-1]).nodeType === nodeType.Text){
    	lastTag.nodeValue += data;
	} else {
		if(
			this._tagStack.length &&
			(lastTag = this._tagStack[this._tagStack.length - 1]) &&
			(lastTag = lastTag.childNodes[lastTag.childNodes.length - 1]) &&
			lastTag.nodeType === nodeType.Text
		){
    		lastTag.nodeValue += data;
		} else {

            lastTag = this._tagStack[this._tagStack.length - 1];
            var parent = lastTag ? lastTag : this.document,
                text = this.document.createTextNode(data);

            parent.appendChild(text);
		}
	}
};

Dom.prototype.oncomment = function(data){
	var lastTag = this._tagStack[this._tagStack.length - 1];

	if(lastTag && lastTag.nodeType === nodeType.Comment){
		lastTag.nodeValue += data;
		return;
	}

	var newNode = {
        nodeType: nodeType.Comment,
        nodeValue: data
	};

    if(lastTag){
        lastTag.childNodes.push(newNode);
    } else { //There aren't parent elements
        this.document.childNodes.push(newNode);
    }

	this._tagStack.push(newNode);
};

Dom.prototype.oncdatastart = function(){
    var lastTag = this._tagStack[this._tagStack.length - 1];
	var newNode = {
		childNodes: [{
			nodeValue: '',
			nodeType: nodeType.Text
		}],
		nodeType: nodeType.CDATA
	};

    if(lastTag){
        lastTag.childNodes.push(newNode);
    } else { //There aren't parent elements
        this.document.childNodes.push(newNode);
    }

	this._tagStack.push(newNode);
};

Dom.prototype.oncommentend = Dom.prototype.oncdataend = function(){
	this._tagStack.pop();
};

Dom.prototype.onprocessinginstruction = function(name, data){
    var lastTag = this._tagStack[this._tagStack.length - 1];

    var newNode = {
        tagName: name,
        nodeValue: data,
        nodeType: nodeType.Directive
    };

    if(lastTag){
        lastTag.childNodes.push(newNode);
    } else { //There aren't parent elements
        this.document.childNodes.push(newNode);
    }
};

module.exports = Dom;
