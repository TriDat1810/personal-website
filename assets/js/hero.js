$(function () {
    var SLIDE_DURATION = 7000;
    var $slides = $('.hero-slide');
    var $dots = $('.hero-dot');
    var currentSlide = 0;
    var autoplayTimer = null;

    function playRing($dot) {
        var $progress = $dot.find('.hero-dot-ring-progress');
        $progress.css('transition', 'none').css('stroke-dashoffset', '1');

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                $progress.css('transition', 'stroke-dashoffset ' + SLIDE_DURATION + 'ms linear').css('stroke-dashoffset', '0');
            });
        });
    }

    function resetRing($dot) {
        $dot.find('.hero-dot-ring-progress').css('transition', 'none').css('stroke-dashoffset', '1');
    }

    function goToSlide(index) {
        $slides.removeClass('is-active').eq(index).addClass('is-active');
        $dots.each(function () {
            $(this).removeClass('is-active');
            resetRing($(this));
        });
        var $activeDot = $dots.eq(index);
        $activeDot.addClass('is-active');
        playRing($activeDot);
        currentSlide = index;
    }

    function scheduleNext() {
        if (autoplayTimer) {
            window.clearTimeout(autoplayTimer);
        }
        autoplayTimer = window.setTimeout(function () {
            goToSlide((currentSlide + 1) % $slides.length);
            scheduleNext();
        }, SLIDE_DURATION);
    }

    $dots.on('click', function () {
        goToSlide($(this).data('slide'));
        scheduleNext();
    });

    goToSlide(0);
    scheduleNext();

    // Nút CTA — cuộn xuống nav rồi tự chuyển đúng tab
    $('.hero-cta').on('click', function (e) {
        e.preventDefault();
        var target = $(this).data('target');
        if (!target) return;
        $('html, body').animate({ scrollTop: $('#nav').offset().top - 80 }, 500, function () {
            $('.nav-link[data-target="' + target + '"]').trigger('click');
        });
    });

    // Đồng hồ trực tiếp + trạng thái mở cửa cho Trang 3
    function updateHeroClock() {
        var now = new Date();
        var hh = String(now.getHours()).padStart(2, '0');
        var mm = String(now.getMinutes()).padStart(2, '0');
        var ss = String(now.getSeconds()).padStart(2, '0');
        $('#hero-clock-time').text(hh + ':' + mm + ':' + ss);

        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $('#hero-clock-date').text(days[now.getDay()] + ', ' + months[now.getMonth()] + ' ' + now.getDate());

        var day = now.getDay();
        var hourFloat = now.getHours() + now.getMinutes() / 60;
        var isWeekend = (day === 0 || day === 6);
        var openTime = 9;
        var closeTime = isWeekend ? 17 : 18.5;
        var isOpen = hourFloat >= openTime && hourFloat < closeTime;

        var $status = $('#hero-clock-status');
        $status.removeClass('is-open is-closed').addClass(isOpen ? 'is-open' : 'is-closed');
        $('#hero-clock-status-text').text(isOpen ? 'Open Now' : 'Closed Now');

        var closeLabel = isWeekend ? '5:00 PM' : '6:30 PM';
        $('#hero-status-heading').text(isOpen ? ('Open Today Until ' + closeLabel) : 'Closed — Opens Tomorrow at 9:00 AM');
    }

    updateHeroClock();
    window.setInterval(updateHeroClock, 1000);
});