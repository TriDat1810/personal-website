$(function () {
  var reviewsData = [
    { name: "Javier Soto", stars: 5, text: "Finding a great barber is like dating — it takes time to build trust. Uyen is amazing, every haircut gets better because she listens and takes real pride in her craft." },
    { name: "Jose Aispuro", stars: 5, text: "I've been coming with Uyen now for 2 years. The razor shave and hot towel are great. She always makes time to take care of you and always does a phenomenal job!" },
    { name: "Cody Hubbard", stars: 5, text: "Great establishment! As a military member I'm required to get a haircut once a week and this barber shop does the best fades in the area." },
    { name: "Kyle", stars: 5, text: "This place is super clean and the staff is excellent! Highly recommend." },
    { name: "Christopher Arnold", stars: 5, text: "Love Uyen! Always gets me in when I need an appointment, and the perfect cut/fade every time. Never disappoints!" },
    { name: "Jessica D.", stars: 5, text: "Absolutely amazing service. We accidentally came super close to closing time and the barber gave my husband a great haircut, was so fun and kind." },
    { name: "Lee J", stars: 5, text: "Been coming here now for a couple of years and I always have a great experience. If you're in need of a proper, professional haircut, you'll definitely get it here." },
    { name: "Edgar Holland", stars: 5, text: "My favorite place to get a haircut. Amazing service. I come down from Washington to get my haircut, that should say enough." },
    { name: "Rolando Duran", stars: 5, text: "Outstanding service." }
  ];

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function renderReviews() {
    var shuffled = shuffle(reviewsData);
    var doubled = shuffled.concat(shuffled);
    var html = doubled.map(function (r) {
      return '<div class="review-card">' +
        '<div class="review-stars">' + '★'.repeat(r.stars) + '</div>' +
        '<div class="review-name">' + r.name + '</div>' +
        '<div class="review-text">' + r.text + '</div>' +
        '</div>';
    }).join('');
    $('#reviews-track').html(html);
  }

  renderReviews();

  var $reviewModal = $('#review-modal-overlay');
  var $modalStars = $reviewModal.find('.review-modal-stars');
  var $modalName = $reviewModal.find('.review-modal-name');
  var $modalText = $reviewModal.find('.review-modal-text');

  function openReviewModal(name, stars, text) {
    $modalStars.text('★'.repeat(stars));
    $modalName.text(name);
    $modalText.text(text);
    $reviewModal.addClass('is-visible').attr('aria-hidden', 'false');
  }
  function closeReviewModal() {
    $reviewModal.removeClass('is-visible').attr('aria-hidden', 'true');
  }

  // event delegation — vì .review-card được render động (renderReviews chạy sau khi trang load)
  $('#reviews-track').on('click', '.review-card', function () {
    openReviewModal(
      $(this).find('.review-name').text(),
      $(this).find('.review-stars').text().length,
      $(this).find('.review-text').text()
    );
  });

  $reviewModal.find('.review-modal-close').on('click', closeReviewModal);
  $reviewModal.on('click', function (e) {
    if (e.target === this) closeReviewModal();
  });
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') closeReviewModal();
  });
});  