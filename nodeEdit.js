$(document).ready(function () {
    var editNode = function () {
        var text = window.prompt('edit this tag\'s innerHTML:', window.currentNode.innerHTML);
        if (text === null) {
            return;
        }
        window.currentNode.innerHTML = text;
    };
    $(document).bind('keydown', 'e', function () {
        editNode();
        return false;
    });
});