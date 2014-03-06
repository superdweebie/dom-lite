var tokenize = function(queryString){

    var chr,
        token = null,
        tokens = [],
        queryString = queryString.split('');

    while (chr = queryString.shift()){
        if (chr == ' '){
            tokens.push(token);
            delete(token);
        } else if (chr == '.'){
            if (token) tokens.push(token);
            token = {type: 'class', name: ''};
        } else if (chr == '['){
            if (token) tokens.push(token);
            token = {type: 'attribute', name: ''};
        } else if (chr == ']'){
            tokens.push(token);
            token = null;
        } else if (token && token.type == 'attribute' && (chr == '=' || chr == '*' || chr == '^' || chr == '$')){
            token.operator += chr;
        } else if (!token){
            token = {type: 'tag', name: chr};
        } else if (token && token.type == 'attribute' && token.operator){
            token.compare += chr;
        } else {
            token.name += chr;
        }
    }

    if (token) tokens.push(token);

    return tokens;
}

exports.getTestFunc = function(queryString){

    var selectors = queryString.split(',').map(function(item){return item.trim()}).map(function(item){return tokenize(item)});

    return function(node){

        var i;
        var j;
        var classes = [];
        var tokens;
        var token;
        var match;

        if (node.hasAttribute('class')) classes = node.getAttribute('class').split(' ')

        for (i = 0; i < selectors.length; i++){
            match = true;
            tokens = selectors[i];
            for (j = 0; j < tokens.length; j++){
                token = tokens[j];
                if (token.type == 'tag'){
                    if (node.tagName != token.name) match = false; break;
                } else if (token.type == 'attribute'){
                    if (!node.hasAttribute(token.name)) match = false; break;
                    if (token.operator == '='){
                        if (node.getAttribute(token.name) != token.compare) match = false; break;
                    } else if (token.operator == '*='){
                        if (node.getAttribute(token.name).indexOf(token.compare) == -1) match = false; break;
                    } else if (token.operator == '^='){
                        if (node.getAttribute(token.name).indexOf(token.compare) != 0) match = false; break;
                    } else if (token.operator == '$='){
                        var value = node.getAttribute(token.name);
                        if (value.indexOf(token.compare) == value.length - token.compare.length) match = false; break;
                    }
                } else if (token.type == 'class'){
                    if (classes.indexOf(token.name) == -1) match = false; break;
                }
            }
            if (match) return true
        }

        return false;
    }
};
