require('./index.scss');

$('.flex-panel .toggler .label').click(function (e) {
    let $panel = $(e.target).closest('.flex-panel');
    if (!$panel.siblings().length && !$panel.is('.inactive')) return;
    $panel.toggleClass('inactive');
});

$('.flex-panel .toggler .ion-android-add').click(function (e) {
    let $panel = $(e.target).closest('.flex-panel');
    $panel.removeClass('inactive');
});

$('.flex-panel .toggler .ion-android-remove').click(function (e) {
    let $panel = $(e.target).closest('.flex-panel');
    if (!$panel.siblings().length && !$panel.is('.inactive')) return;
    $panel.addClass('inactive');
});