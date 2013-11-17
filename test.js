var test = function(a) {
    console.log(a);
    console.log(arguments);
    console.log(Array.prototype.slice.call(arguments));
};
