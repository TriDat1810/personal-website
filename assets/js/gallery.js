$(document).ready(function () {
					$('.reveal-nav').on('click', function (e) {
						e.preventDefault();
						$('html, body').animate({ scrollTop: $('#nav').offset().top - 80 }, 500);
					});

					var transitionDuration = 400;
					var $navItems = $('#nav li');
					var $navLinks = $('.nav-link');
					var activePanelId = 'services';

					function setActiveNav(targetId) {
						$navItems.removeClass('active current-page-item');
						$navLinks.removeClass('active current');
						var $clickedLink = $('.nav-link[data-target="' + targetId + '"]');
						var $clickedItem = $clickedLink.closest('li');
						$clickedLink.addClass('active current');
						$clickedItem.addClass('active current-page-item');
					}

					function activatePanel(targetId) {
						if (targetId === activePanelId) {
							setActiveNav(targetId);
							return;
						}

						var $currentPanel = $('.panel.active');
						var $nextPanel = $('#' + targetId);

						if (!$currentPanel.length || !$nextPanel.length) {
							return;
						}

						setActiveNav(targetId);
						$currentPanel.addClass('slide-out-left').removeClass('active');
						$nextPanel.addClass('slide-in-right').css('display', 'block');

						window.setTimeout(function () {
							$currentPanel.removeClass('slide-out-left').css('display', 'none');
							$nextPanel.removeClass('slide-in-right').addClass('active');
							activePanelId = targetId;
						}, transitionDuration);
					}

					$navLinks.on('click', function (e) {
						e.preventDefault();
						activatePanel($(this).data('target'));
					});

					var $galleryGrid = $('.gallery-grid');
					var $galleryItems = $('.gallery-item').not('.gallery-instagram');
					var $featured = $('#gallery-featured');
					var $featuredImage = $featured.find('img');
					var $featuredText = $featured.find('.gallery-description');
					var activeGalleryImage = null;

					function closeGallery() {
						if (!activeGalleryImage) {
							return;
						}

						$featured.addClass('is-closing');
						window.setTimeout(function () {
							$galleryItems.removeClass('is-selected is-dimmed');
							$featured.removeClass('is-visible is-closing');
							activeGalleryImage = null;
						}, 300);
					}

					function openGalleryItem($item) {
						if (activeGalleryImage === $item.data('image')) {
							closeGallery();
							return;
						}

						$galleryItems.removeClass('is-selected is-dimmed');
						$item.addClass('is-selected');
						$galleryItems.not('.is-selected').addClass('is-dimmed');
						$featuredImage.attr('src', $item.data('image'));
						$featuredText.text($item.data('description'));
						$featured.addClass('is-visible');
						$featured.removeClass('is-closing');
						activeGalleryImage = $item.data('image');
					}

					$galleryItems.on('click', function () {
						openGalleryItem($(this));
					});

					$featured.on('click', function () {
						closeGallery();
					});

					if (window.innerWidth > 768) {
						$('.gallery-item img').each(function () {
							this.addEventListener('mousemove', function (e) {
								var rect = this.getBoundingClientRect();
								var x = ((e.clientX - rect.left) / rect.width) * 100;
								var y = ((e.clientY - rect.top) / rect.height) * 100;
								this.style.transformOrigin = x + '% ' + y + '%';
							});
							this.addEventListener('mouseleave', function () {
								this.style.transformOrigin = 'center center';
							});
						});
					}

					var $contactForm = $('.contact-layout form');
					var $contactName = $('#name');
					var $contactEmail = $('#email');
					var $contactMessage = $('#message');
					var $messageCounter = $('#message-counter');
					var $contactSubmit = $('#contact-submit');
					var $formStatus = $('#form-status');
					var $popupOverlay = $('#contact-success-popup');
					var $popupClose = $popupOverlay.find('.contact-popup-close');
					var MAX_SUBMISSIONS = 3;
					var LIMIT_STORAGE_KEY = 'contact_submit_count';
					var LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;

					function getStoredLimit() {
						try {
							var raw = localStorage.getItem(LIMIT_STORAGE_KEY);
							if (!raw) {
								return { count: 0, reset: null };
							}
							var stored = JSON.parse(raw);
							if (stored.reset && Date.now() > stored.reset) {
								localStorage.removeItem(LIMIT_STORAGE_KEY);
								return { count: 0, reset: null };
							}
							return { count: stored.count || 0, reset: stored.reset || null };
						} catch (e) {
							return { count: 0, reset: null };
						}
					}

					function saveStoredLimit(count, reset) {
						try {
							localStorage.setItem(LIMIT_STORAGE_KEY, JSON.stringify({ count: count, reset: reset }));
						} catch (e) {}
					}

					function setSubmitBusy(isBusy) {
						$contactSubmit.prop('disabled', isBusy);
						$contactSubmit.val(isBusy ? 'Sending...' : 'Send Message');
					}

					function updateMessageCounter() {
						$messageCounter.text($contactMessage.val().length + ' / 500');
					}

					function clearFieldErrors() {
						$contactForm.find('.field-error').removeClass('is-visible').text('');
						$contactForm.find('input, textarea').removeClass('is-invalid');
					}

					function showFieldError($field, message) {
						$field.addClass('is-invalid');
						var fieldId = $field.attr('id');
						var $error = $contactForm.find('.field-error[data-error-for="' + fieldId + '"]');
						$error.text(message).addClass('is-visible');
					}

					function updateLimitState() {
						var state = getStoredLimit();
						if (state.count >= MAX_SUBMISSIONS) {
							$contactSubmit.prop('disabled', true);
							$formStatus.text("You've reached the maximum number of messages. Please call us directly at (619) 555-0148.").addClass('is-visible');
							return false;
						}

						$contactSubmit.prop('disabled', false).val('Send Message');
						$formStatus.removeClass('is-visible').text('');
						return true;
					}

					function validateForm() {
						clearFieldErrors();

						var nameValue = $contactName.val().trim();
						var emailValue = $contactEmail.val().trim();
						var messageValue = $contactMessage.val().trim();
						var firstErrorField = null;

						if (nameValue.length < 2 || nameValue.length > 60 || !/^[a-zA-Z\s-]+$/.test(nameValue)) {
							showFieldError($contactName, 'Please enter a valid name (letters only, 2–60 characters)');
							firstErrorField = firstErrorField || $contactName;
						}

						if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue) || emailValue.length > 100) {
							showFieldError($contactEmail, 'Please enter a valid email address');
							firstErrorField = firstErrorField || $contactEmail;
						}

						if (messageValue.length < 10) {
							showFieldError($contactMessage, 'Message must be at least 10 characters');
							firstErrorField = firstErrorField || $contactMessage;
						}

						if (firstErrorField) {
							firstErrorField.get(0).scrollIntoView({ behavior: 'smooth', block: 'center' });
							return false;
						}

						return true;
					}

					function showSuccessPopup() {
						$popupOverlay.addClass('is-visible').attr('aria-hidden', 'false');
					}

					function hideSuccessPopup() {
						$popupOverlay.removeClass('is-visible').attr('aria-hidden', 'true');
					}

					$contactMessage.on('input', updateMessageCounter);
					$popupClose.on('click', hideSuccessPopup);
					$popupOverlay.on('click', function (e) {
						if (e.target === this) {
							hideSuccessPopup();
						}
					});
					$(document).on('keydown', function (e) {
						if (e.key === 'Escape') {
							hideSuccessPopup();
						}
					});

					updateMessageCounter();
					updateLimitState();

					$contactForm.on('submit', async function (e) {
						e.preventDefault();

						if (!updateLimitState()) {
							return;
						}

						if (!validateForm()) {
							return;
						}

						setSubmitBusy(true);

						try {
							var formData = new FormData(this);
							var response = await fetch(this.action, {
								method: 'POST',
								body: formData,
								headers: {
									'Accept': 'application/json'
								}
							});

							if (response.ok) {
								showSuccessPopup();
								var state = getStoredLimit();
								var nextCount = (state.count || 0) + 1;
								var nextReset = state.reset || (Date.now() + LIMIT_WINDOW_MS);
								saveStoredLimit(nextCount, nextReset);
								this.reset();
								updateMessageCounter();
								clearFieldErrors();
								updateLimitState();
							} else {
								$formStatus.text('Unable to send your message right now. Please try again later.').addClass('is-visible');
							}
						} catch (error) {
							$formStatus.text('Unable to send your message right now. Please try again later.').addClass('is-visible');
						} finally {
							if (getStoredLimit().count < MAX_SUBMISSIONS) {
								setSubmitBusy(false);
							}
						}
					});
				});