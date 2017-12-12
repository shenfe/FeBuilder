require('./index.scss');

$('.flex-panel .toggler .label').click(function (e) {
    let $panel = $(e.target).closest('.flex-panel');
    if (!$panel.siblings().length && !$panel.is('.inactive')) return;
    $panel.toggleClass('inactive');
});

$('.flex-panel .toggler .ctrl-show').click(function (e) {
    let $panel = $(e.target).closest('.flex-panel');
    $panel.removeClass('inactive');
});

$('.flex-panel .toggler .ctrl-hide').click(function (e) {
    let $panel = $(e.target).closest('.flex-panel');
    if (!$panel.siblings().length && !$panel.is('.inactive')) return;
    $panel.addClass('inactive');
});

$('.flex-panel .toggler .ctrl-update').click(function (e) {
    let $panel = $(e.target).closest('.flex-panel');
    let componentName = $panel.attr('component-name');
    if (!componentName) return;
    document.dispatchEvent(new CustomEvent(`${componentName}-update`));
});