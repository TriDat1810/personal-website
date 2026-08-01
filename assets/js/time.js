$(function () {
    var today = new Date().getDay();
    $('.hours-row[data-day="' + today + '"]').addClass('is-today');

    var now = new Date();
    var hour = now.getHours() + now.getMinutes() / 60;
    var isWeekend = (today === 0 || today === 6);
    var openTime = 9;
    var closeTime = isWeekend ? 17 : 18.5;
    var isOpen = hour >= openTime && hour < closeTime;

    var $status = $('#hours-status');
    if (isOpen) {
        $status.addClass('is-open').find('.hours-status-text').text('Open Now');
    } else {
        $status.addClass('is-closed').find('.hours-status-text').text('Closed Now');
    }
});