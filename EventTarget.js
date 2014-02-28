
function EventTarget(){
    this._eventListeners = {};
}

EventTarget.prototype.addEventListener = function(type, callback){
    if (!this._eventListeners[type]) this._eventListeners[type] = [];
    this._eventListeners[type].push(callback);
}

EventTarget.prototype.removeEventListener = function(type, callback){
    for (var i = 0; i < this._eventListeners[type].length; i++){
        if (this._eventListeners[type][i] == callback) {
            this._eventListeners[type].splice(i, 1);
            return;
        }
    }
}

EventTarget.prototype.dispatchEvent = function(type){
    console.log('TODO: dispatch ' + type);
}

module.exports = EventTarget;
