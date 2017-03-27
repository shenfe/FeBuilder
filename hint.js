$(document).ready(function () {
    var tmpl = '<div class="_fb-hint"><input type="text"></div>';
    var $hint = $(tmpl);
    var $input = $hint.find('input');
    $hint.hide();
    $(document.body).append($hint);

    window.onhelp = function () {
        return false;
    };
    
    $(document).bind('keydown', 'F1', function (e) {
        console.log('F1');
        $hint.toggle();
        if ($hint.is(':visible')) $input.trigger('focus');
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
});