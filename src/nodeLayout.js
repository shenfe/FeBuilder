$(document).ready(function () {
    var layoutHtmlGenerate = function (layout) {
        var classes = {
            1: {
                'fl': '',
                'res': ''
            },
            2: {
                'fr': '',
                'res': ''
            }
        };
        var htmls = {
            1: ''
        };
        return {
            style: classes[layout],
            html: htmls[layout]
        };
    };
    var createLayout = function () {
        var text = window.prompt('choose a layout number:\
            1: left side width fixed\
            2: right side width fixed\
            3: inline blocks\
            4: icon-text button\
            5: text-icon button\
            6: text, input, span\
            7: navigation\
            8: pagination\
            9: two sides\
            10: form', '1');
        if (text === null) {
            return;
        }
        window.currentNode.innerHTML = layoutHtmlGenerate(text);
    };
    $(document).bind('keydown', 'l', function () {
        createLayout();
        return false;
    });
});