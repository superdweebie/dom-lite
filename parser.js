var Parser = require('htmlparser2').Parser,
    Dom = require('./Dom');

exports.parse = function(rawHtml, callback){
    var handler = new Dom(function (error, dom) {
        if (error)
            console.log('Error parsing html');
        else
            callback(dom);
    });
    var parser = new Parser(handler);
    parser.write(rawHtml);
    parser.done();
}
