$(function () {
    // Chỉ cần liệt kê ảnh 1 lần — bao nhiêu ảnh cũng được, JS tự chia trang 4 ảnh/trang
    var allImages = [
        { src: 'images/use/pic1.png', alt: 'Barber haircut example', desc: 'Classic taper with a clean finish.' },
        { src: 'images/use/pic2.png', alt: 'Beard styling example', desc: 'Textured beard styling with sharp shape.' },
        { src: 'images/use/pic3.png', alt: 'Shave example', desc: 'Smooth hot towel shave with crisp detailing.' },
        { src: 'images/use/pic4.png', alt: 'Face grooming example', desc: 'Precision face grooming for a polished look.' },
        { src: 'images/use/pic5.png', alt: 'Hair coloring example', desc: 'Soft color refresh with modern definition.' },
        { src: 'images/use/pic7.png', alt: 'Modern textured crop with mid fade', desc: 'Modern textured crop with a clean mid fade.' },
        { src: 'images/use/pic8.png', alt: 'Creative mohawk fade with hair design', desc: 'Creative mohawk fade with precision hair design.' },
        { src: 'images/use/pic9.png', alt: 'Classic slick back with low fade', desc: 'Classic slick back with a smooth low fade and sculpted beard.' },
        { src: 'images/use/pic10.png', alt: 'Short textured crop with skin fade', desc: 'Short textured crop with a sharp skin fade and defined beard.' },
        { src: 'images/use/pic11.png', alt: 'Long layered haircut with highlights', desc: 'Long layered haircut with subtle highlights for dimension.' },
        { src: 'images/use/pic12.png', alt: 'Undercut with disconnected top', desc: 'Undercut with a disconnected top and clean lines.' },
        { src: 'images/use/pic13.png', alt: 'Curly hair with fade', desc: 'Curly hair styled with a fade for a natural look.' },
        { src: 'images/use/pic14.png', alt: 'Pompadour with hard part', desc: 'Classic pompadour with a sharp hard part and clean finish.' },
        { src: 'images/use/pic15.png', alt: 'Buzz cut with beard', desc: 'Simple buzz cut paired with a well-groomed beard.' }

    ];

    var PAGE_SIZE = 4;
    var AREA_LETTERS = ['a', 'b', 'c', 'd'];

    var pages = [];
    for (var i = 0; i < allImages.length; i += PAGE_SIZE) {
        pages.push(allImages.slice(i, i + PAGE_SIZE));
    }

    var $mosaic = $('#gallery-mosaic');
    var $dotsWrap = $('#gallery-dots');
    var currentPage = 0;

    pages.forEach(function (_, i) {
        $dotsWrap.append('<span class="gallery-page-dot" data-page="' + i + '"></span>');
    });
    var $dots = $dotsWrap.find('.gallery-page-dot');

    function renderPage(pageIndex) {
        var items = pages[pageIndex];

        $mosaic
            .removeClass('layout-1 layout-2 layout-3 layout-4')
            .addClass('layout-' + items.length)
            .empty();

        items.forEach(function (item, i) {
            var $tile = $('<div class="mosaic-tile gallery-item"></div>')
                .css('grid-area', AREA_LETTERS[i])
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

    renderPage(0);
});