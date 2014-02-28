var tokenize = function(queryString){

    var chr,
        token = null,
        tokens = [],
        queryString = queryString.split('');

    while (chr = queryString.shift()){
        if (chr == ' '){
            tokens.push(token);
            delete(token);
        } else if (chr == '['){
            if (token) tokens.push(token);
            token = {type: 'attribute', name: ''};
        } else if (chr == ']'){
            tokens.push(token);
            token = null;
        } else if (!token){
            token = {type: 'tag', name: chr};
        } else {
            token.name = token.name + chr;
        }
    }

    if (token) tokens.push(token);

    return tokens;
}

exports.getTestFunc = function(queryString){

    var tokens = tokenize(queryString);

    return function(node){
        var i,
            token;

        for (i = 0; i < tokens.length; i++){
            token = tokens[i];
            if (token.type == 'tag'){
                if (node.tagName != token.name) return false;
            } else if (token.type == 'attribute'){
                if (!node.hasAttribute(token.name)) return false;
            }
        }

        return true;
    }
};
