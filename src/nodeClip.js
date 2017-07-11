$(document).ready(function () {
    window.clipboard = null;

    var copyNode = function (e) {
        window.clipboard = window.currentNode.outerHTML.replace('style="border: 1px dashed red;"', '');
        var text = document.head.getElementsByTagName('style')[0].outerHTML + '<template>' + window.clipboard + '</template>';
        e.clipboardData.setData('text/plain', text);
        e.clipboardData.setData('text/html', text);
        e.preventDefault(); // We want our data, not data from any selection, to be written to the clipboard
    };

    var cutNode = function () {
        copyNode();
        removeNode();
        return false;
    };

    var pasteNode = function () {
        window.currentNode.innerHTML += window.clipboard;
        return false;
    };

    var removeNode = function () {
        var parent = window.currentNode.parentElement;
        if (parent == null) {
            return false;
        }
        var p = $(window.currentNode).prev()[0];
        if (!p) {
            p = $(window.currentNode).parent()[0];
        }
        parent.removeChild(window.currentNode);
        focusNode(p);
        return false;
    };

    // $(document).bind('keydown', 'Ctrl+c', copyNode);
    $(document).bind('keydown', 'Ctrl+x', cutNode);
    $(document).bind('keydown', 'Ctrl+v', pasteNode);
    $(document).bind('keydown', 'del', removeNode);

    document.addEventListener('copy', copyNode);
});