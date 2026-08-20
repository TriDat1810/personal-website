$(function () {

    /* =========================================================
       1. MAIN NAV
       ========================================================= */

    var $navLinks = $('.nav-link');

    var items = $navLinks.map(function () {
        return {
            target: $(this).data('target'),
            label: $(this).text().trim()
        };
    }).get();

    var iconMap = {
        services: 'fa-cut',
        gallery: 'fa-images',
        faq: 'fa-question-circle',
        contact: 'fa-map-marker-alt'
    };

    if (!items.length) {
        return;
    }


    /* =========================================================
       2. MOBILE NAV
       ========================================================= */

    var $bar = $(
        '<div id="mobile-nav-bar">' +

            '<img class="mobile-nav-logo" ' +
                'src="images/use/Main-Logo.png" ' +
                'alt="Tierrasanta Barber logo" />' +

            '<div class="mobile-nav-center" id="mobile-nav-center">' +

                '<div class="mobile-nav-label-row" id="mobile-nav-label-row">' +
                    '<i class="icon solid mobile-nav-icon" id="mobile-nav-icon"></i>' +
                    '<span class="mobile-nav-label" id="mobile-nav-label"></span>' +
                '</div>' +

                '<div class="mobile-nav-dots" id="mobile-nav-dots"></div>' +

            '</div>' +

            '<a class="mobile-nav-call" ' +
                'href="tel:+18582629221" ' +
                'aria-label="Call the shop">' +
                '<i class="icon solid fa-phone"></i>' +
            '</a>' +

        '</div>'
    ).prependTo('#wrapper');


    var $icon = $bar.find('#mobile-nav-icon');
    var $label = $bar.find('#mobile-nav-label');
    var $dotsWrap = $bar.find('#mobile-nav-dots');


    /* =========================================================
       3. DOTS
       ========================================================= */

    items.forEach(function (_, i) {
        $dotsWrap.append(
            '<span class="mobile-nav-dot" data-index="' + i + '"></span>'
        );
    });

    var $dots = $dotsWrap.find('.mobile-nav-dot');


    /* =========================================================
       4. STATE
       ========================================================= */

    var currentIndex = 0;
    var pendingIndex = 0;

    var COMMIT_DELAY = 500;

    var commitTimer = null;
    var labelAnimTimer = null;


    /* =========================================================
       5. TÌM INDEX TỪ TARGET
       ========================================================= */

    function getIndexByTarget(target) {

        return items.findIndex(function (item) {
            return item.target === target;
        });

    }


    /* =========================================================
       6. ĐỒNG BỘ MOBILE NAV
       
       Ví dụ:
       
       syncMobileNav('gallery')
       
       sẽ biến:
       
       Our Services
       
       thành:
       
       Gallery
       ========================================================= */

    function syncMobileNav(target, animate) {

        var index = getIndexByTarget(target);

        if (index < 0) {
            return;
        }

        var previousIndex = currentIndex;

        currentIndex = index;
        pendingIndex = index;


        if (commitTimer) {
            window.clearTimeout(commitTimer);
            commitTimer = null;
        }

        if (labelAnimTimer) {
            window.clearTimeout(labelAnimTimer);
        }


        var item = items[index];


        if (!animate || previousIndex === index) {

            $label
                .text(item.label)
                .css({
                    transform: 'translateX(0)',
                    opacity: 1
                });

            $icon
                .attr(
                    'class',
                    'icon solid mobile-nav-icon ' +
                    (iconMap[item.target] || '')
                )
                .css({
                    transform: 'translateX(0)',
                    opacity: 1
                });

        } else {

            var direction =
                index > previousIndex ? 1 : -1;

            var exitX =
                direction === 1 ? '-100%' : '100%';

            var enterX =
                direction === 1 ? '100%' : '-100%';

            var $animated = $label.add($icon);


            $animated
                .css(
                    'transition',
                    'transform 0.18s ease, opacity 0.18s ease'
                )
                .css(
                    'transform',
                    'translateX(' + exitX + ')'
                )
                .css('opacity', 0);


            labelAnimTimer = window.setTimeout(function () {

                $label.text(item.label);

                $icon.attr(
                    'class',
                    'icon solid mobile-nav-icon ' +
                    (iconMap[item.target] || '')
                );


                $animated
                    .css('transition', 'none')
                    .css(
                        'transform',
                        'translateX(' + enterX + ')'
                    );


                void $label[0].offsetWidth;


                $animated
                    .css(
                        'transition',
                        'transform 0.18s ease, opacity 0.18s ease'
                    )
                    .css(
                        'transform',
                        'translateX(0)'
                    )
                    .css('opacity', 1);

            }, 180);
        }


        $dots
            .removeClass('is-active')
            .eq(index)
            .addClass('is-active');
    }


    /* =========================================================
       7. SCROLL ĐẾN SECTION
       
       Đây là phần quan trọng cho BOOK NOW / VIEW WORK.
       ========================================================= */

    function scrollToTarget(target) {

        var $target = $('#' + target);

        if (!$target.length) {
            return;
        }


        /*
         * Nếu website có fixed header/nav,
         * có thể chỉnh OFFSET ở đây.
         */

        var offset = 0;

        /*
         * Nếu mobile nav đang fixed ở phía trên,
         * lấy chiều cao của nó để section không bị che.
         */

        if ($('#mobile-nav-bar').is(':visible')) {
            offset = $('#mobile-nav-bar').outerHeight() || 0;
        }


        var targetTop =
            $target.offset().top - offset;


        $('html, body').stop(true).animate({
            scrollTop: targetTop
        }, 500);
    }


    /* =========================================================
       8. NAVIGATE TO TARGET
       
       Đây là HÀM TRUNG TÂM.
       
       Book Now
       View Work
       Mobile Swipe
       Main Nav
       
       đều đi qua đây.
       ========================================================= */

    function navigateToTarget(target, animateMobile) {

        if (!target) {
            return;
        }

        // Kiểm tra section thực sự tồn tại
        var $target = $('#' + target);

        if (!$target.length) {
            console.warn('Target không tồn tại:', target);
            return;
        }

        // Nếu target có trong mobile nav thì sync
        var index = getIndexByTarget(target);

        if (index >= 0) {
            syncMobileNav(
                target,
                animateMobile !== false
            );
        }

        // Active main nav nếu có
        $navLinks
            .removeClass('active')
            .filter('[data-target="' + target + '"]')
            .addClass('active');

        // Nếu có nav link tương ứng thì trigger
        var $navLink = $navLinks.filter(
            '[data-target="' + target + '"]'
        );

        if ($navLink.length) {
            $navLink.first().trigger('click');
        }

        // Cuối cùng scroll trực tiếp
        window.setTimeout(function () {
            scrollToTarget(target);
        }, 450);
    }


    /* =========================================================
       9. BOOK NOW + VIEW WORK
       ========================================================= */

    $(document).on(
        'click',
        '.hero-cta[data-target]',
        function (e) {

            e.preventDefault();

            var target = $(this).data('target');

            navigateToTarget(target, true);
        }
    );


    /* =========================================================
       10. PREVIEW KHI SWIPE
       ========================================================= */

    function previewIndex(index, direction) {

        var item = items[index];

        if (labelAnimTimer) {
            window.clearTimeout(labelAnimTimer);
        }


        var exitX =
            direction === 1 ? '-100%' : '100%';

        var enterX =
            direction === 1 ? '100%' : '-100%';


        var $animated = $label.add($icon);


        $animated
            .css(
                'transition',
                'transform 0.18s ease, opacity 0.18s ease'
            )
            .css(
                'transform',
                'translateX(' + exitX + ')'
            )
            .css('opacity', 0);


        labelAnimTimer = window.setTimeout(function () {

            $label.text(item.label);

            $icon.attr(
                'class',
                'icon solid mobile-nav-icon ' +
                (iconMap[item.target] || '')
            );


            $animated
                .css('transition', 'none')
                .css(
                    'transform',
                    'translateX(' + enterX + ')'
                );


            void $label[0].offsetWidth;


            $animated
                .css(
                    'transition',
                    'transform 0.18s ease, opacity 0.18s ease'
                )
                .css(
                    'transform',
                    'translateX(0)'
                )
                .css('opacity', 1);

        }, 180);


        /* Dot */

        $dots
            .removeClass('is-active')
            .eq(index)
            .addClass('is-active');


        pendingIndex = index;


        /* Reset timer */

        if (commitTimer) {
            window.clearTimeout(commitTimer);
        }


        commitTimer = window.setTimeout(function () {

            commitNavigation(pendingIndex);

        }, COMMIT_DELAY);
    }


    /* =========================================================
       11. COMMIT SWIPE
       ========================================================= */

    function commitNavigation(index) {

        var item = items[index];

        navigateToTarget(
            item.target,
            false
        );

        currentIndex = index;
        pendingIndex = index;
    }


    function goNext() {

        previewIndex(
            (pendingIndex + 1) % items.length,
            1
        );
    }


    function goPrev() {

        previewIndex(
            (pendingIndex - 1 + items.length) % items.length,
            -1
        );
    }


    /* =========================================================
       12. TOUCH
       ========================================================= */

    var touchStartX = 0;
    var touchStartY = 0;


    $bar.on('touchstart', function (e) {

        touchStartX =
            e.originalEvent.touches[0].clientX;

        touchStartY =
            e.originalEvent.touches[0].clientY;

    });


    $bar.on('touchend', function (e) {

        var deltaX =
            e.originalEvent.changedTouches[0].clientX -
            touchStartX;

        var deltaY =
            e.originalEvent.changedTouches[0].clientY -
            touchStartY;


        if (
            Math.abs(deltaX) < 35 ||
            Math.abs(deltaX) < Math.abs(deltaY)
        ) {
            return;
        }


        if (deltaX < 0) {
            goNext();
        } else {
            goPrev();
        }

    });


    /* =========================================================
       13. INITIAL STATE
       ========================================================= */

    var initialIndex = items.findIndex(function (item) {

        return $navLinks
            .filter(
                '[data-target="' +
                item.target +
                '"]'
            )
            .hasClass('active');

    });


    var startIndex =
        initialIndex >= 0
            ? initialIndex
            : 0;


    currentIndex = startIndex;
    pendingIndex = startIndex;


    var startItem = items[startIndex];


    $label.text(startItem.label);

    $icon.attr(
        'class',
        'icon solid mobile-nav-icon ' +
        (iconMap[startItem.target] || '')
    );

    $dots
        .removeClass('is-active')
        .eq(startIndex)
        .addClass('is-active');


    /* =========================================================
       14. HINT
       ========================================================= */

    window.setTimeout(function () {

        $bar
            .find('#mobile-nav-label-row')
            .addClass('is-hinting');

    }, 700);

});