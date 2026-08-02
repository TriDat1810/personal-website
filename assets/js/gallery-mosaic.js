$(function () {
    var pages = [
        [
            { src: 'images/use/pic1.png', alt: 'Barber haircut example', desc: 'Classic taper with a clean finish.' },
            { src: 'images/use/pic2.png', alt: 'Beard styling example', desc: 'Textured beard styling with sharp shape.' },
            { src: 'images/use/pic3.png', alt: 'Shave example', desc: 'Smooth hot towel shave with crisp detailing.' },
            { src: 'images/use/pic4.png', alt: 'Face grooming example', desc: 'Precision face grooming for a polished look.' }
        ],
        [
            { src: 'images/use/pic5.png', alt: 'Hair coloring example', desc: 'Soft color refresh with modern definition.' },
            { src: 'images/use/pic7.png', alt: 'Modern textured crop with mid fade', desc: 'Modern textured crop with a clean mid fade.' },
            { src: 'images/use/pic8.png', alt: 'Creative mohawk fade with hair design', desc: 'Creative mohawk fade with precision hair design.' },
            { src: 'images/use/pic9.png', alt: 'Classic slick back with low fade', desc: 'Classic slick back with a smooth low fade and sculpted beard.' }
        ]
    ];

    var $tiles = $('#gallery-mosaic .mosaic-tile');
    var $dotsWrap = $('#gallery-dots');
    var currentPage = 0;

    pages.forEach(function (_, i) {
        $dotsWrap.append('<span class="gallery-page-dot" data-page="' + i + '"></span>');
    });
    var $dots = $dotsWrap.find('.gallery-page-dot');

    function renderPage(pageIndex) {
        var items = pages[pageIndex];
        $tiles.each(function (i) {
            var $tile = $(this);
            var item = items[i];
            if (!item) return;
            $tile.find('img').attr('src', item.src).attr('alt', item.alt);
            $tile.data('image', item.src);
            $tile.data('description', item.desc);
            $tile.removeClass('is-selected is-dimmed');
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

    renderPage(0);
});