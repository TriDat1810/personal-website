$(function () {
    var allImages = [
        { src: 'images/use/pic1.png', alt: 'Barber haircut example', desc: 'Classic taper with a clean finish.' },
        { src: 'images/use/pic2.png', alt: 'Beard styling example', desc: 'Textured beard styling with sharp shape.' },
        { src: 'images/use/pic3.png', alt: 'Shave example', desc: 'Smooth hot towel shave with crisp detailing.' },
        { src: 'images/use/pic4.png', alt: 'Face grooming example', desc: 'Precision face grooming for a polished look.' },
        { src: 'images/use/pic5.png', alt: 'Hair coloring example', desc: 'Soft color refresh with modern definition.' },
        { src: 'images/use/pic7.png', alt: 'Modern textured crop with mid fade', desc: 'Modern textured crop with a clean mid fade.' },
        { src: 'images/use/pic8.png', alt: 'Creative mohawk fade with hair design', desc: 'Creative mohawk fade with precision hair design.' },
        { src: 'images/use/pic9.png', alt: 'Classic slick back with low fade', desc: 'Classic slick back with a smooth low fade and sculpted beard.' },
        { src: 'images/use/pic10.png', alt: 'Modern quiff with high fade', desc: 'Modern quiff with a sharp high fade and defined beard.' },
        { src: 'images/use/pic11.png', alt: 'Textured fringe with skin fade', desc: 'Textured fringe with a clean skin fade and detailed beard.' },
        { src: 'images/use/pic12.png', alt: 'Undercut with disconnected top', desc: 'Undercut with a disconnected top and styled beard.' },
        { src: 'images/use/pic13.png', alt: 'Classic side part with taper fade', desc: 'Classic side part with a smooth taper fade and well-groomed beard.' },
        { src: 'images/use/pic14.png', alt: 'Faux hawk with low fade', desc: 'Faux hawk with a low fade and textured beard.' },
        { src: 'images/use/pic15.png', alt: 'Pompadour with mid fade', desc: 'Pompadour with a clean mid fade and styled beard.' }
    ];

    var PAGE_SIZE = 4;
    var GRID_SIZE = 100;

    // --- PRNG có thể lặp lại theo seed (giữ nguyên như bản trước) ---
    function mulberry32(seed) {
        return function () {
            seed |= 0;
            seed = (seed + 0x6D2B79F5) | 0;
            var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function hashStringToSeed(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return hash;
    }

    function getTodaySeedString() {
        var d = new Date();
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    }

    function seededShuffle(array, rng) {
        var a = array.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(rng() * (i + 1));
            var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    // --- THUẬT TOÁN TỰ SINH KHUNG: chia đệ quy 1 hình vuông thành N ô chữ nhật ---
    // Không bao giờ chồng lấn, không bao giờ hở — vì mỗi bước chỉ cắt đôi 1 hình chữ nhật.
    function splitRect(rect, n, rng, minRatio, maxRatio) {
        if (n === 1) {
            return [rect];
        }

        // Random số ô rơi vào nửa đầu (1..n-1) — chính chỗ này tạo ra vô số hình dạng cây khác nhau
        var n1 = 1 + Math.floor(rng() * (n - 1));
        var n2 = n - n1;

        var horizontal = rng() < 0.5;
        var ratio = minRatio + rng() * (maxRatio - minRatio);

        var rectA, rectB;
        if (horizontal) {
            var splitX = rect.x + rect.w * ratio;
            rectA = { x: rect.x, y: rect.y, w: splitX - rect.x, h: rect.h };
            rectB = { x: splitX, y: rect.y, w: rect.x + rect.w - splitX, h: rect.h };
        } else {
            var splitY = rect.y + rect.h * ratio;
            rectA = { x: rect.x, y: rect.y, w: rect.w, h: splitY - rect.y };
            rectB = { x: rect.x, y: splitY, w: rect.w, h: rect.y + rect.h - splitY };
        }

        return splitRect(rectA, n1, rng, minRatio, maxRatio)
            .concat(splitRect(rectB, n2, rng, minRatio, maxRatio));
    }

    function rectToGridLines(rect) {
        return {
            colStart: Math.round(rect.x * GRID_SIZE) + 1,
            colEnd: Math.round((rect.x + rect.w) * GRID_SIZE) + 1,
            rowStart: Math.round(rect.y * GRID_SIZE) + 1,
            rowEnd: Math.round((rect.y + rect.h) * GRID_SIZE) + 1
        };
    }

    // --- Chuẩn bị dữ liệu theo ngày (giữ nguyên cơ chế cũ) ---
    var todaySeed = hashStringToSeed(getTodaySeedString());
    var imageRng = mulberry32(todaySeed);
    var shuffledImages = seededShuffle(allImages, imageRng);

    var pages = [];
    for (var i = 0; i < shuffledImages.length; i += PAGE_SIZE) {
        pages.push(shuffledImages.slice(i, i + PAGE_SIZE));
    }

    var $mosaic = $('#gallery-mosaic');
    var $dotsWrap = $('#gallery-dots');
    var currentPage = 0;

    pages.forEach(function (_, idx) {
        $dotsWrap.append('<span class="gallery-page-dot" data-page="' + idx + '"></span>');
    });
    var $dots = $dotsWrap.find('.gallery-page-dot');

    function isMobile() {
        return window.matchMedia('(max-width: 980px)').matches;
    }

    function renderPage(pageIndex) {
        var items = pages[pageIndex];

        // Seed riêng cho từng trang (ngày + số trang) để mỗi trang có khung khác nhau, nhưng vẫn ổn định trong ngày
        var layoutRng = mulberry32(todaySeed + pageIndex * 137);

        // Mobile: giới hạn tỉ lệ chặt hơn (0.4–0.6) để tránh ô quá mỏng khó nhìn trên màn hình hẹp
        // PC: cho phép lệch nhiều hơn (0.3–0.7) để bố cục đa dạng, kịch tính hơn
        var ratioRange = isMobile() ? [0.4, 0.6] : [0.3, 0.7];

        var rects = splitRect({ x: 0, y: 0, w: 1, h: 1 }, items.length, layoutRng, ratioRange[0], ratioRange[1]);

        $mosaic.empty();

        items.forEach(function (item, i) {
            var lines = rectToGridLines(rects[i]);

            var $tile = $('<div class="mosaic-tile gallery-item"></div>')
                .css('grid-column', lines.colStart + ' / ' + lines.colEnd)
                .css('grid-row', lines.rowStart + ' / ' + lines.rowEnd)
                .attr('data-image', item.src)
                .attr('data-description', item.desc);

            $('<img>').attr('src', item.src).attr('alt', item.alt).appendTo($tile);
            $mosaic.append($tile);
        });

        $dots.removeClass('is-active');
        $dots.eq(pageIndex).addClass('is-active');
        currentPage = pageIndex;
    }

    $('#gallery-prev').on('click', function () {
        renderPage((currentPage - 1 + pages.length) % pages.length);
    });

    $('#gallery-next').on('click', function () {
        renderPage((currentPage + 1) % pages.length);
    });

    $dots.on('click', function () {
        renderPage($(this).data('page'));
    });

    var wasMobile = isMobile();
    var resizeTimer = null;
    window.addEventListener('resize', function () {
        if (resizeTimer) window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(function () {
            var nowMobile = isMobile();
            if (nowMobile !== wasMobile) {
                wasMobile = nowMobile;
                renderPage(currentPage);
            }
        }, 200);
    });

    renderPage(0);
});