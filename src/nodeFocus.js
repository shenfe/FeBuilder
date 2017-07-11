$(document).ready(function () {
    window.currentNode = document.body;

    var focusNode = function (el) {
        if ($(el).is('._fb-hint') || $(el).closest('._fb-hint').length) return false;
        if (el == null) return false;
        if (el.nodeName === 'HTML') el = document.body;
        window.currentNode.style.border = '';
        window.currentNode = el || document.body;
        window.currentNode.style.border = '1px red dashed';
        console.log('[focus]', window.currentNode);
    };

    $(document).on('click', function (e) {
        focusNode(e.target);
    });

    $(document).bind('keydown', 'Ctrl+up', function () {
        if (window.currentNode === document.body) return false;
        focusNode($(window.currentNode).prev()[0] || window.currentNode);
        return false;
    });
    $(document).bind('keydown', 'Ctrl+down', function () {
        focusNode($(window.currentNode).next()[0] || window.currentNode);
        return false;
    });
    $(document).bind('keydown', 'Ctrl+left', function () {
        if (window.currentNode === document.body) return false;
        focusNode($(window.currentNode).parent()[0] || window.currentNode);
        return false;
    });
    $(document).bind('keydown', 'Ctrl+right', function () {
        var i = 0, children = $(window.currentNode).children(),
            node = children[0];
        while (node && node.className.startsWith('_fb-')) {
            i++;
            node = children[i];
        }
        focusNode(node || window.currentNode);
        return false;
    });
});
