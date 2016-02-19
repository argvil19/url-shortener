module.exports = function(times) {
    var result = "";
    for (var i=0;i<times;i++) {
        result += String.fromCharCode(Math.floor((Math.random() * 10) + 48));
    }
    return result;
}