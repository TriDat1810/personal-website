$(function () {
    $('.faq-question').on('click', function () {
        var $item = $(this).closest('.faq-item');
        var isOpen = $item.hasClass('is-open');

        $item.siblings('.faq-item').removeClass('is-open');
        $item.toggleClass('is-open', !isOpen);
    });
});