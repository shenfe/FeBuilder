window.loadJs = function (src) {
    var script = document.createElement('script');
    var head = document.getElementsByTagName('head')[0];
    script.src = src;
    head.appendChild(script);
};

var jsConf = [];

for (var js of jsConf) {
    loadJs(js + '.js');
}