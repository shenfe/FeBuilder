require('./index.scss');

$('.flex-panel .toggler').click(function (e) {
    let $panel = $(e.target).closest('.flex-panel');
    $panel.toggleClass('inactive');
});