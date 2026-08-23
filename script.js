// =========================================================
// PORTFOLIO SCRIPT — ULTRA FAST, SNAPPY & INSTANT RESPONSE
// =========================================================

document.addEventListener('DOMContentLoaded', function() {

  // --- FAST LOADER ---
  var loader = document.getElementById('loader');
  var fill = document.querySelector('.loader-fill');
  var progress = 0;
  
  var interval = setInterval(function() {
    progress += 40;
    if (progress > 100) progress = 100;
    if (fill) fill.style.width = progress + '%';
    
    if (progress === 100) {
      clearInterval(interval);
      setTimeout(function() {
        if (loader) loader.classList.add('done');
      }, 100);
    }
  }, 20);

  // --- MOBILE DRAWER MENU ---
  var mobileToggle = document.getElementById('mobileToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  var mobileClose = document.getElementById('mobileClose');
  var mobileBackdrop = document.getElementById('mobileMenuBackdrop');
  var mobileLinks = document.querySelectorAll('.mobile-link');

  function openMobileMenu() {
    if (mobileMenu) mobileMenu.classList.add('open');
    if (mobileToggle) mobileToggle.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (mobileToggle) mobileToggle.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);

  mobileLinks.forEach(function(link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // --- REVEAL ON SCROLL ---
  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  document.querySelectorAll('.reveal').forEach(function(el) {
    revealObserver.observe(el);
  });

  // --- NAV AUTO-HIDE ON SCROLL (THROTTLED WITH rAF) ---
  var lastScrollY = window.scrollY;
  var nav = document.getElementById('nav');
  var scrollTicking = false;

  window.addEventListener('scroll', function() {
    if (!scrollTicking) {
      window.requestAnimationFrame(function() {
        var y = window.scrollY;
        if (nav) {
          if (y > 220 && y > lastScrollY && (!mobileMenu || !mobileMenu.classList.contains('open'))) {
            nav.classList.add('hidden');
          } else {
            nav.classList.remove('hidden');
          }
        }
        lastScrollY = y;
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // --- COUNTER NUMBER ANIMATION ---
  var counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-target'), 10);
        var duration = 1200;
        var start = performance.now();

        function step(now) {
          var progress = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(target * eased);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target;
          }
        }
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.counter-num').forEach(function(el) {
    counterObserver.observe(el);
  });

  // --- UNIVERSAL HORIZONTAL SECTION SLIDERS ---
  window.scrollSection = function(trackId, direction) {
    var track = document.getElementById(trackId);
    if (track) {
      var card = track.querySelector('.work-card') || track.querySelector('.reel-frame');
      var width = card ? card.offsetWidth + 20 : 280;
      track.scrollBy({ left: width * direction, behavior: 'smooth' });
    }
  };

  window.scrollAgency = function(direction) {
    window.scrollSection('agencyShowcase', direction);
  };

  // Drag-to-scroll on desktop mouse (rAF Throttled for smooth 60fps)
  var allTracks = document.querySelectorAll('.works-track, .reels-showcase');
  allTracks.forEach(function(track) {
    var isDown = false;
    var startX, scrollLeft;
    var dragTicking = false;

    track.addEventListener('mousedown', function(e) {
      isDown = true;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    track.addEventListener('mouseleave', function() { isDown = false; });
    track.addEventListener('mouseup', function() { isDown = false; });
    track.addEventListener('mousemove', function(e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - track.offsetLeft;
      var walk = (x - startX) * 1.5;
      if (!dragTicking) {
        window.requestAnimationFrame(function() {
          track.scrollLeft = scrollLeft - walk;
          dragTicking = false;
        });
        dragTicking = true;
      }
    });
  });

  // --- FAQ ACCORDION ---
  document.querySelectorAll('.faq-item').forEach(function(item) {
    item.addEventListener('toggle', function() {
      if (item.open) {
        document.querySelectorAll('.faq-item').forEach(function(other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  // --- CONTACT FORM & WHATSAPP REDIRECT ---
  var form = document.getElementById('contactForm');
  var WHATSAPP_NUMBER = "919409904904";

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');

      var name = (form.querySelector('input[name="name"]') || {}).value || '';
      var email = (form.querySelector('input[name="email"]') || {}).value || '';
      var phone = (form.querySelector('input[name="phone"]') || {}).value || 'Not provided';
      var project = (form.querySelector('select[name="project"]') || {}).value || 'General Video Project';
      var message = (form.querySelector('textarea[name="message"]') || {}).value || '';

      var waText = "👋 *Hello! I would like to hire you for a project.*\n\n" +
                   "👤 *Name:* " + name + "\n" +
                   "✉️ *Email:* " + email + "\n" +
                   "📞 *Phone:* " + phone + "\n" +
                   "🎬 *Project Type:* " + project + "\n\n" +
                   "📝 *Project Details & Vision:*\n" + message;

      var waUrl = "https://wa.me/" + (WHATSAPP_NUMBER ? WHATSAPP_NUMBER : "") + "?text=" + encodeURIComponent(waText);

      if (btn) {
        var original = btn.innerHTML;
        btn.innerHTML = '<span>Opening WhatsApp... 💬</span>';
        btn.disabled = true;

        setTimeout(function() {
          btn.innerHTML = original;
          btn.disabled = false;
          window.open(waUrl, '_blank');
        }, 400);
      } else {
        window.open(waUrl, '_blank');
      }
    });
  }

  // --- UNIVERSAL SMOOTH SCROLL FOR ALL ANCHOR LINKS ---
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      e.preventDefault();
      closeMobileMenu();

      if (targetId === '#contact' || targetId === '#contactForm') {
        var formCard = document.getElementById('contactForm') || document.getElementById('contact');
        if (formCard) {
          formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(function() {
            var nameInput = formCard.querySelector('input[name="name"]');
            if (nameInput) nameInput.focus();
          }, 600);
          return;
        }
      }

      var target = document.querySelector(targetId);
      if (target) {
        var offset = window.innerWidth < 768 ? 60 : 75;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // --- INTERACTIVE VIDEO PLAYERS ---
  var allVideoCards = document.querySelectorAll('.video-card-interactive');
  
  allVideoCards.forEach(function(card) {
    var video = card.querySelector('video');
    var playBtn = card.querySelector('.video-toggle-btn');
    if (!video) return;

    // Hover preview (muted)
    card.addEventListener('mouseenter', function() {
      if (video.paused && !card.classList.contains('is-playing')) {
        video.muted = true;
        var playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(function() {});
        }
      }
    });

    card.addEventListener('mouseleave', function() {
      if (!card.classList.contains('is-playing')) {
        video.pause();
        video.currentTime = 0;
      }
    });

    // Click play button or card to toggle full playback with audio
    function togglePlay(e) {
      if (e) e.stopPropagation();

      // If already playing, pause it
      if (card.classList.contains('is-playing')) {
        video.pause();
        card.classList.remove('is-playing');
        if (playBtn) playBtn.innerHTML = '▶';
      } else {
        // Pause all other videos
        allVideoCards.forEach(function(otherCard) {
          var otherVid = otherCard.querySelector('video');
          var otherBtn = otherCard.querySelector('.video-toggle-btn');
          if (otherVid && otherCard !== card) {
            otherVid.pause();
            otherCard.classList.remove('is-playing');
            if (otherBtn) otherBtn.innerHTML = '▶';
          }
        });

        video.muted = false;
        var playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.then(function() {
            card.classList.add('is-playing');
            if (playBtn) playBtn.innerHTML = '❚❚';
          }).catch(function() {
            video.muted = true;
            video.play();
            card.classList.add('is-playing');
            if (playBtn) playBtn.innerHTML = '❚❚';
          });
        }
      }
    }

    if (playBtn) {
      playBtn.addEventListener('click', togglePlay);
    }
  });

  console.log('%c🎬 Video Editor Portfolio Ready | Snappy, Smooth & Fast', 'color: #00ff88; font-weight: bold;');
});
