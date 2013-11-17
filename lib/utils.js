
// Copy the properties of the right obj to the left obj

var copy = function(o, other) {

    for(var prop in other) {
        o[prop] = other[prop];
    }
};

exports.copy = copy;
