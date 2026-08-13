$(function () {
    var $navLinks = $('.nav-link');
    var items = $navLinks.map(function () {
        return { target: $(this).data('target'), label: $(this).text().trim() };
    }).get();

    if (!items.length) {
        return;
    }

    var $bar = $(
        '<div id="mobile-nav-bar">' +
            '<img class="mobile-nav-logo" src="images/use/Main-Logo.png" alt="Tierrasanta Barber logo" />' +
            '<div class="mobile-nav-center" id="mobile-nav-center">' +
                '<span class="mobile-nav-label" id="mobile-nav-label"></span>' +
                '<div class="mobile-nav-dots" id="mobile-nav-dots"></div>' +
            '</div>' +
            '<a class="mobile-nav-call" href="tel:+18582629221" aria-label="Call the shop">' +
                '<i class="icon solid fa-phone"></i>' +
            '</a>' +
        '</div>'
    ).prependTo('#wrapper');

    var currentIndex = 0;   // mục đã thực sự chuyển tab
    var pendingIndex = 0;   // mục đang xem trước khi vuốt (chưa chốt)
    var $label = $bar.find('#mobile-nav-label');
    var $dotsWrap = $bar.find('#mobile-nav-dots');

    items.forEach(function (_, i) {
        $dotsWrap.append('<span class="mobile-nav-dot" data-index="' + i + '"></span>');
    });
    var $dots = $dotsWrap.find('.mobile-nav-dot');

    var COMMIT_DELAY = 500;
    var commitTimer = null;
    var labelAnimTimer = null;

    // Chỉ đổi CHỮ + chấm tròn ngay lập tức (mượt, không giật) — KHÔNG chuyển tab thật
    function previewIndex(index, direction) {
        var item = items[index];

        if (labelAnimTimer) {
            window.clearTimeout(labelAnimTimer);
        }

        var exitX = direction === 1 ? '-100%' : '100%';
        var enterX = direction === 1 ? '100%' : '-100%';

        $label
            .css('transition', 'transform 0.18s ease, opacity 0.18s ease')
            .css('transform', 'translateX(' + exitX + ')')
            .css('opacity', 0);

        labelAnimTimer = window.setTimeout(function () {
            $label
                .text(item.label)
                .css('transition', 'none')
                .css('transform', 'translateX(' + enterX + ')');

            void $label[0].offsetWidth;

            $label
                .css('transition', 'transform 0.18s ease, opacity 0.18s ease')
                .css('transform', 'translateX(0)')
                .css('opacity', 1);
        }, 180);

        $dots.removeClass('is-active');
        $dots.eq(index).addClass('is-active');

        pendingIndex = index;

        // Reset bộ đếm 0.5s — chỉ khi NGỪNG vuốt trong 0.5s mới thực sự chuyển tab
        if (commitTimer) {
            window.clearTimeout(commitTimer);
        }
        commitTimer = window.setTimeout(function () {
            commitNavigation(pendingIndex);
        }, COMMIT_DELAY);
    }

    // Chuyển tab THẬT — chỉ gọi 1 lần, sau khi người dùng dừng vuốt
    function commitNavigation(index) {
        var item = items[index];
        $navLinks.filter('[data-target="' + item.target + '"]').trigger('click');
        currentIndex = index;
    }

    function goNext() {
        previewIndex((pendingIndex + 1) % items.length, 1);
    }

    function goPrev() {
        previewIndex((pendingIndex - 1 + items.length) % items.length, -1);
    }

    var touchStartX = 0, touchStartY = 0;

    $bar.on('touchstart', function (e) {
        touchStartX = e.originalEvent.touches[0].clientX;
        touchStartY = e.originalEvent.touches[0].clientY;
    });

    $bar.on('touchend', function (e) {
        var deltaX = e.originalEvent.changedTouches[0].clientX - touchStartX;
        var deltaY = e.originalEvent.changedTouches[0].clientY - touchStartY;

        if (Math.abs(deltaX) < 35 || Math.abs(deltaX) < Math.abs(deltaY)) {
            return;
        }
        deltaX < 0 ? goNext() : goPrev();
    });

    var contentStart = $('#nav').length ? $('#nav').offset().top : 0;
    var lastScrollY = window.scrollY;
    var ticking = false;

    function onScroll() {
        var currentY = window.scrollY;

        if (currentY < contentStart) {
            $bar.removeClass('is-hidden');
        } else if (currentY > lastScrollY) {
            $bar.addClass('is-hidden');
        } else {
            $bar.removeClass('is-hidden');
        }

        lastScrollY = currentY;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });

    var initialIndex = items.findIndex(function (item) {
        return $navLinks.filter('[data-target="' + item.target + '"]').hasClass('active');
    });
    var startIndex = initialIndex >= 0 ? initialIndex : 0;

    currentIndex = startIndex;
    pendingIndex = startIndex;
    $label.text(items[startIndex].label);
    $dots.eq(startIndex).addClass('is-active');
});