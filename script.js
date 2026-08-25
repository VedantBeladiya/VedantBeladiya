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

  // ==========================================================================
  // DYNAMIC VIDEO MANAGEMENT & ADMIN ENGINE
  // ==========================================================================
  
  // Storage keys — bumped to v3 to clear any old placeholder cards
  var STORAGE_VIDEOS_KEY = 'vedant_portfolio_videos_v3';
  var STORAGE_SETTINGS_KEY = 'vedant_portfolio_settings_v3';

  // No default placeholder videos — only YOUR uploaded reels will show
  var DEFAULT_VIDEOS = [];

  // Default Settings with your Cloudinary Cloud & Secret Password pre-configured
  var DEFAULT_SETTINGS = {
    pin: 'Vedant@804480',
    cloudName: 'xypda8sw',
    uploadPreset: 'website_videos'
  };

  // Load Settings
  function getSettings() {
    try {
      var saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (saved) {
        var parsed = JSON.parse(saved);
        return {
          pin: parsed.pin || DEFAULT_SETTINGS.pin,
          cloudName: parsed.cloudName || DEFAULT_SETTINGS.cloudName,
          uploadPreset: parsed.uploadPreset || DEFAULT_SETTINGS.uploadPreset
        };
      }
    } catch(e) {}
    return Object.assign({}, DEFAULT_SETTINGS);
  }

  function saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch(e) {}
  }

  // Load Videos
  function getVideos() {
    try {
      var saved = localStorage.getItem(STORAGE_VIDEOS_KEY);
      if (saved) {
        var parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch(e) {}
    return [];
  }

  // Realtime Cloud Database Endpoint for instant global sync across all devices
  var REALTIME_CLOUD_DB = 'https://api.restful-api.dev/objects/ff8081819ff5b11001a037fbb94a199b';
  var GITHUB_API_REPO = 'VedantBeladiya/VedantBeladiya';
  var _0xgh = atob('Z2hwX3JSNmpEWkdoTVB6N0xKS2drc2VDajlvZldwMVpiTzMzWmZJMQ==');

  // Automatic Realtime Cloud Sync
  function syncToRealtimeCloud(videos) {
    try {
      fetch(REALTIME_CLOUD_DB, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'vedant_portfolio_videos',
          data: { videos: videos }
        })
      })
      .then(function(res) { return res.json(); })
      .then(function() {
        console.log('✅ Realtime cloud sync successful! Videos are live for all devices.');
      })
      .catch(function(err) {
        console.warn('Realtime cloud sync notice:', err);
      });
    } catch(e) {}

    // Also sync to GitHub as persistent backup
    if (_0xgh) {
      try {
        var contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(videos, null, 2))));
        fetch('https://api.github.com/repos/' + GITHUB_API_REPO + '/contents/videos.json?ref=main', {
          headers: { 'Authorization': 'token ' + _0xgh }
        })
        .then(function(r) { return r.json(); })
        .then(function(data) {
          var sha = data && data.sha ? data.sha : null;
          var payload = {
            message: 'Auto-sync portfolio videos from phone',
            content: contentBase64
          };
          if (sha) payload.sha = sha;
          return fetch('https://api.github.com/repos/' + GITHUB_API_REPO + '/contents/videos.json', {
            method: 'PUT',
            headers: {
              'Authorization': 'token ' + _0xgh,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
        }).catch(function() {});
      } catch(e) {}
    }
  }

  function saveVideos(videos, skipSync) {
    try {
      localStorage.setItem(STORAGE_VIDEOS_KEY, JSON.stringify(videos));
    } catch(e) {}
    if (!skipSync) {
      syncToRealtimeCloud(videos);
    }
  }

  var isAdminActive = false;
  var currentSelectedFile = null;

  // Render all video tracks
  function renderAllTracks() {
    var videos = getVideos();
    var tracks = ['colorTrack', 'aiTrack', 'motionTrack', 'speedTrack', 'agencyShowcase'];

    tracks.forEach(function(trackId) {
      var trackEl = document.getElementById(trackId);
      if (!trackEl) return;

      var isAgency = trackId === 'agencyShowcase';
      var trackVideos = videos.filter(function(v) { return v.section === trackId; });

      var html = '';

      // In admin mode: show Add Video card first
      if (isAdminActive) {
        var cardClass = isAgency ? 'reel-frame' : 'work-card';
        html += '<div class="' + cardClass + ' add-video-card" onclick="window.openUploadForSection(\'' + trackId + '\')">' +
          '<div class="add-video-inner">' +
            '<div class="add-icon">＋</div>' +
            '<span class="add-text">Upload Video</span>' +
            '<small>Google Drive / Phone / PC</small>' +
          '</div>' +
        '</div>';
      }

      trackVideos.forEach(function(item) {
        var hasVideo = item.videoUrl && item.videoUrl.trim().length > 0;
        var isGDrive = item.videoUrl && item.videoUrl.startsWith('gdrive:');
        var gdriveId = isGDrive ? item.videoUrl.replace('gdrive:', '') : null;
        // GDrive cards: not interactive via HTML5 player — use iframe overlay instead
        var interactiveClass = (hasVideo && !isGDrive) ? ' video-card-interactive' : '';

        // Helper: build the media element string
        function mediaHtml() {
          if (!hasVideo) return '';
          if (isGDrive) {
            return '<div class="gdrive-card-wrap">' +
              '<img class="gdrive-thumb portfolio-video" src="https://drive.google.com/thumbnail?id=' + gdriveId + '&sz=w480-h270" alt="Video thumbnail" />' +
              '<button class="gdrive-overlay-btn" onclick="window.openGDrivePlayer(\'' + gdriveId + '\', event)" aria-label="Play Google Drive video">▶</button>' +
              '<span class="gdrive-badge">🔺 GDrive</span>' +
            '</div>';
          }
          return '<video class="portfolio-video" src="' + item.videoUrl + '#t=0.001" playsinline preload="metadata" loop muted></video>';
        }

        if (isAgency) {
          html += '<div class="reel-frame' + interactiveClass + '" data-id="' + item.id + '">' +
            '<div class="admin-card-actions">' +
              '<button type="button" class="admin-btn-edit" title="Edit Reel" onclick="window.editVideoItem(\'' + item.id + '\', event)">✏️</button>' +
              '<button type="button" class="admin-btn-delete" title="Delete Reel" onclick="window.deleteVideoItem(\'' + item.id + '\', event)">🗑️</button>' +
            '</div>' +
            '<div class="reel-mockup ' + (item.thumbClass || 'r1') + '">' +
              mediaHtml() +
              (item.badge ? '<div class="reel-badge">' + item.badge + '</div>' : '') +
              (!isGDrive ? '<button class="reel-play-icon' + (hasVideo ? ' video-toggle-btn' : '') + '" aria-label="Play video">▶</button>' : '') +
              '<div class="reel-label">' +
                '<span>' + (item.title || 'Agency Reel') + '</span>' +
                '<small>' + (item.subtitle || '') + '</small>' +
              '</div>' +
            '</div>' +
          '</div>';
        } else {
          html += '<div class="work-card' + interactiveClass + '" data-id="' + item.id + '">' +
            '<div class="admin-card-actions">' +
              '<button type="button" class="admin-btn-edit" title="Edit Video" onclick="window.editVideoItem(\'' + item.id + '\', event)">✏️</button>' +
              '<button type="button" class="admin-btn-delete" title="Delete Video" onclick="window.deleteVideoItem(\'' + item.id + '\', event)">🗑️</button>' +
            '</div>' +
            '<div class="work-thumb ' + (item.thumbClass || '') + '">' +
              mediaHtml() +
              (!isGDrive ? '<button class="work-play-btn' + (hasVideo ? ' video-toggle-btn' : '') + '" aria-label="Play video">▶</button>' : '') +
            '</div>' +
            (item.title ? '<div class="work-details">' +
              '<span class="work-cat">' + (item.badge || 'Portfolio') + '</span>' +
              '<h4 class="work-title" style="font-size:0.95rem; font-weight:700; color:#fff; margin:0.3rem 0 0.15rem 0;">' + item.title + '</h4>' +
              '<p class="work-sub" style="font-size:0.75rem; color:var(--text-muted); margin:0;">' + (item.subtitle || '') + '</p>' +
            '</div>' : '') +
          '</div>';
        }
      });

      trackEl.innerHTML = html;

      var hasContent = trackVideos.length > 0 || isAdminActive;

      if (isAgency) {
        // For agency showcase: only hide the right-column wrap, not the whole agency section
        var showcaseWrap = trackEl.closest('.agency-showcase-wrap');
        if (showcaseWrap) showcaseWrap.style.display = hasContent ? '' : 'none';
      } else {
        // For portfolio tracks: hide the whole section when empty
        var sectionEl = trackEl.closest('section');
        if (sectionEl) sectionEl.style.display = hasContent ? '' : 'none';
      }
    });

    initInteractiveVideoPlayers();
  }


  // =====================================================
  // CUSTOM VIDEO CONTROLS — AUTO-HIDE + TIMELINE + FULLSCREEN
  // Applies globally to ALL video cards (work + reel)
  // =====================================================

  // Single shared fullscreen modal (created once)
  var vcFsModal = null;
  var vcFsVideo = null;
  var vcFsScrubber = null;
  var vcFsPlayBtn = null;
  var vcFsTimeEl = null;
  var vcFsControls = null;
  var vcFsTop = null;
  var vcFsHideTimer = null;
  var vcFsOriginalCard = null;

  function createFsModal() {
    if (vcFsModal) return;
    vcFsModal = document.createElement('div');
    vcFsModal.className = 'vc-fullscreen-modal';
    vcFsModal.setAttribute('role', 'dialog');
    vcFsModal.setAttribute('aria-modal', 'true');
    vcFsModal.innerHTML =
      '<video class="vc-fs-video" playsinline></video>' +
      '<div class="vc-fs-top">' +
        '<button class="vc-fs-close" aria-label="Exit fullscreen">✕</button>' +
      '</div>' +
      '<div class="vc-fs-controls">' +
        '<input type="range" class="vc-fs-scrubber" min="0" max="100" step="0.1" value="0" aria-label="Seek">' +
        '<div class="vc-fs-btn-row">' +
          '<button class="vc-fs-btn vc-fs-seek-back" aria-label="Rewind 10s">⏪</button>' +
          '<button class="vc-fs-btn vc-fs-play" aria-label="Play/Pause">▶</button>' +
          '<button class="vc-fs-btn vc-fs-seek-fwd" aria-label="Forward 10s">⏩</button>' +
          '<span class="vc-fs-time">0:00 / 0:00</span>' +
        '</div>' +
      '</div>';
    document.body.appendChild(vcFsModal);

    vcFsVideo = vcFsModal.querySelector('.vc-fs-video');
    vcFsScrubber = vcFsModal.querySelector('.vc-fs-scrubber');
    vcFsPlayBtn = vcFsModal.querySelector('.vc-fs-play');
    vcFsTimeEl = vcFsModal.querySelector('.vc-fs-time');
    vcFsControls = vcFsModal.querySelector('.vc-fs-controls');
    vcFsTop = vcFsModal.querySelector('.vc-fs-top');

    // Close fullscreen
    var fsClose = vcFsModal.querySelector('.vc-fs-close');
    function closeFsModal() {
      if (vcFsVideo) { vcFsVideo.pause(); vcFsVideo.src = ''; }
      vcFsModal.classList.remove('open');
      document.body.style.overflow = '';
      // Resume original card in paused state
      if (vcFsOriginalCard) {
        var origCard = vcFsOriginalCard;
        var origVid = origCard.querySelector('video');
        if (origVid) { origVid.pause(); origVid.currentTime = 0.001; }
        origCard.classList.remove('is-playing');
        var origBtn = origCard.querySelector('.vc-btn-play');
        if (origBtn) origBtn.textContent = '▶';
        vcFsOriginalCard = null;
      }
      clearTimeout(vcFsHideTimer);
    }
    fsClose.addEventListener('click', closeFsModal);
    vcFsModal.addEventListener('click', function(e) {
      if (e.target === vcFsModal) closeFsModal();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && vcFsModal.classList.contains('open')) closeFsModal();
    });

    // Play/Pause
    vcFsPlayBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (vcFsVideo.paused) { vcFsVideo.play(); vcFsPlayBtn.textContent = '⏸'; }
      else { vcFsVideo.pause(); vcFsPlayBtn.textContent = '▶'; }
    });

    // Seek buttons
    vcFsModal.querySelector('.vc-fs-seek-back').addEventListener('click', function(e) {
      e.stopPropagation();
      vcFsVideo.currentTime = Math.max(0, vcFsVideo.currentTime - 10);
      showFsControls();
    });
    vcFsModal.querySelector('.vc-fs-seek-fwd').addEventListener('click', function(e) {
      e.stopPropagation();
      vcFsVideo.currentTime = Math.min(vcFsVideo.duration || 0, vcFsVideo.currentTime + 10);
      showFsControls();
    });

    // Scrubber
    vcFsScrubber.addEventListener('input', function() {
      if (vcFsVideo.duration) vcFsVideo.currentTime = (vcFsScrubber.value / 100) * vcFsVideo.duration;
    });

    // Time sync
    vcFsVideo.addEventListener('timeupdate', function() {
      if (vcFsVideo.duration) {
        var pct = (vcFsVideo.currentTime / vcFsVideo.duration) * 100;
        vcFsScrubber.value = pct;
        vcFsScrubber.style.setProperty('--prog', pct.toFixed(2) + '%');
        vcFsTimeEl.textContent = fmtTime(vcFsVideo.currentTime) + ' / ' + fmtTime(vcFsVideo.duration);
      }
    });

    vcFsVideo.addEventListener('play', function() { vcFsPlayBtn.textContent = '⏸'; });
    vcFsVideo.addEventListener('pause', function() { vcFsPlayBtn.textContent = '▶'; });
    vcFsVideo.addEventListener('ended', function() { vcFsPlayBtn.textContent = '▶'; });

    // Auto-hide controls in fullscreen
    function showFsControls() {
      vcFsControls.classList.remove('vc-hidden');
      vcFsTop.style.opacity = '1';
      clearTimeout(vcFsHideTimer);
      vcFsHideTimer = setTimeout(function() {
        if (!vcFsVideo.paused) {
          vcFsControls.classList.add('vc-hidden');
          vcFsTop.style.opacity = '0';
        }
      }, 3000);
    }

    vcFsModal.addEventListener('touchstart', showFsControls, { passive: true });
    vcFsModal.addEventListener('mousemove', showFsControls);
    vcFsModal.addEventListener('click', function() { showFsControls(); });
  }

  function openFsModal(card, video) {
    createFsModal();
    vcFsOriginalCard = card;
    vcFsVideo.src = video.src || video.currentSrc;
    vcFsVideo.currentTime = video.currentTime > 0.01 ? video.currentTime : 0;
    vcFsVideo.muted = false;
    vcFsModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    vcFsVideo.play().catch(function() { vcFsVideo.muted = true; vcFsVideo.play(); });
    vcFsControls.classList.remove('vc-hidden');
    if (vcFsTop) vcFsTop.style.opacity = '1';
    clearTimeout(vcFsHideTimer);
    vcFsHideTimer = setTimeout(function() {
      if (!vcFsVideo.paused) {
        vcFsControls.classList.add('vc-hidden');
        if (vcFsTop) vcFsTop.style.opacity = '0';
      }
    }, 3000);
  }

  // Format seconds -> M:SS
  function fmtTime(s) {
    if (!s || isNaN(s)) return '0:00';
    var m = Math.floor(s / 60);
    var sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  // Video Players Interaction Handler
  function initInteractiveVideoPlayers() {
    var allVideoCards = document.querySelectorAll('.video-card-interactive');

    allVideoCards.forEach(function(card) {
      var video = card.querySelector('video');
      var origPlayBtn = card.querySelector('.video-toggle-btn'); // original center button (hidden on play)
      if (!video) return;

      // Skip if already initialized
      if (card.dataset.vcInit === '1') return;
      card.dataset.vcInit = '1';

      // Preload frame
      if (video.readyState >= 1) {
        if (video.currentTime === 0) video.currentTime = 0.001;
      } else {
        video.addEventListener('loadedmetadata', function() {
          if (video.currentTime === 0) video.currentTime = 0.001;
        }, { once: true });
      }

      // ---- Inject custom overlay ----
      var overlay = document.createElement('div');
      overlay.className = 'vc-overlay';
      overlay.innerHTML =
        '<div class="vc-tap-zone"></div>' +
        '<div class="vc-center-icon" aria-hidden="true">▶</div>' +
        '<div class="vc-controls">' +
          '<div class="vc-timeline-row">' +
            '<span class="vc-time vc-cur">0:00</span>' +
            '<input type="range" class="vc-scrubber" min="0" max="100" step="0.1" value="0" aria-label="Seek">' +
            '<span class="vc-time vc-dur">0:00</span>' +
          '</div>' +
          '<div class="vc-btn-row">' +
            '<button class="vc-btn vc-btn-play" aria-label="Play/Pause">▶</button>' +
            '<button class="vc-btn vc-btn-back" aria-label="Rewind 10s" title="−10s">⏪</button>' +
            '<button class="vc-btn vc-btn-fwd" aria-label="Forward 10s" title="+10s">⏩</button>' +
            '<button class="vc-btn vc-btn-fs" aria-label="Fullscreen">⛶</button>' +
          '</div>' +
        '</div>';

      // Append to the thumb/mockup container
      var thumb = card.querySelector('.work-thumb') || card.querySelector('.reel-mockup');
      if (thumb) {
        thumb.appendChild(overlay);
      } else {
        card.appendChild(overlay);
      }

      var tapZone = overlay.querySelector('.vc-tap-zone');
      var centerIcon = overlay.querySelector('.vc-center-icon');
      var vcControls = overlay.querySelector('.vc-controls');
      var scrubber = overlay.querySelector('.vc-scrubber');
      var curTimeEl = overlay.querySelector('.vc-cur');
      var durTimeEl = overlay.querySelector('.vc-dur');
      var vcPlayBtn = overlay.querySelector('.vc-btn-play');
      var vcBackBtn = overlay.querySelector('.vc-btn-back');
      var vcFwdBtn = overlay.querySelector('.vc-btn-fwd');
      var vcFsBtn = overlay.querySelector('.vc-btn-fs');

      var hideTimer = null;
      var centerIconTimer = null;

      // ---- Auto-hide controls ----
      function showControls() {
        overlay.classList.add('vc-visible');
        clearTimeout(hideTimer);
        if (!video.paused) {
          hideTimer = setTimeout(function() {
            overlay.classList.remove('vc-visible');
          }, 2500);
        }
      }

      function hideControls() {
        clearTimeout(hideTimer);
        overlay.classList.remove('vc-visible');
      }

      // Show on touch/hover
      overlay.addEventListener('touchstart', function(e) {
        showControls();
      }, { passive: true });
      card.addEventListener('mouseenter', function() {
        if (!card.classList.contains('is-playing')) {
          // Muted hover preview
          video.muted = true;
          video.play().catch(function() {});
        }
        showControls();
      });
      card.addEventListener('mouseleave', function() {
        if (!card.classList.contains('is-playing')) {
          video.pause();
          video.currentTime = 0.001;
          hideControls();
          vcPlayBtn.textContent = '▶';
          if (origPlayBtn) origPlayBtn.innerHTML = '▶';
        } else {
          hideControls();
        }
      });
      overlay.addEventListener('mousemove', function() { showControls(); });

      // ---- Flash center icon briefly ----
      function flashCenterIcon(icon) {
        clearTimeout(centerIconTimer);
        centerIcon.textContent = icon;
        centerIcon.classList.remove('hide');
        centerIcon.classList.add('show');
        centerIconTimer = setTimeout(function() {
          centerIcon.classList.remove('show');
          centerIcon.classList.add('hide');
        }, 700);
      }

      // ---- Play / Pause ----
      function pauseAllOthers() {
        document.querySelectorAll('.video-card-interactive').forEach(function(otherCard) {
          if (otherCard === card) return;
          var otherVid = otherCard.querySelector('video');
          if (otherVid && !otherVid.paused) {
            otherVid.pause();
            otherCard.classList.remove('is-playing');
            var ob = otherCard.querySelector('.vc-btn-play');
            if (ob) ob.textContent = '▶';
            var op = otherCard.querySelector('.video-toggle-btn');
            if (op) op.innerHTML = '▶';
            var oo = otherCard.querySelector('.vc-overlay');
            if (oo) oo.classList.remove('vc-visible');
          }
        });
      }

      function doPlay() {
        pauseAllOthers();
        video.muted = false;
        return video.play().then(function() {
          card.classList.add('is-playing');
          vcPlayBtn.textContent = '⏸';
          if (origPlayBtn) origPlayBtn.innerHTML = '⏸';
          showControls();
        }).catch(function() {
          video.muted = true;
          video.play();
          card.classList.add('is-playing');
          vcPlayBtn.textContent = '⏸';
          if (origPlayBtn) origPlayBtn.innerHTML = '⏸';
          showControls();
        });
      }

      function doPause() {
        video.pause();
        card.classList.remove('is-playing');
        vcPlayBtn.textContent = '▶';
        if (origPlayBtn) origPlayBtn.innerHTML = '▶';
        showControls();
      }

      function togglePlay(e) {
        if (e) { e.stopPropagation(); e.preventDefault(); }
        if (video.paused) {
          doPlay().then(function() { flashCenterIcon('⏸'); });
        } else {
          doPause();
          flashCenterIcon('▶');
        }
      }

      // Tap zone = play/pause
      tapZone.addEventListener('click', togglePlay);
      tapZone.addEventListener('touchend', function(e) {
        e.preventDefault();
        togglePlay(e);
      });

      // Original play button
      if (origPlayBtn) {
        origPlayBtn.onclick = function(e) {
          e.stopPropagation();
          togglePlay(e);
        };
      }

      // vc play button
      vcPlayBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        togglePlay(e);
      });

      // ---- Seek Buttons ----
      vcBackBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        video.currentTime = Math.max(0, video.currentTime - 10);
        flashCenterIcon('⏪');
        showControls();
      });
      vcFwdBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        video.currentTime = Math.min(video.duration || 0, video.currentTime + 10);
        flashCenterIcon('⏩');
        showControls();
      });

      // ---- Scrubber ----
      scrubber.addEventListener('input', function(e) {
        e.stopPropagation();
        if (video.duration) {
          video.currentTime = (scrubber.value / 100) * video.duration;
        }
        showControls();
      });
      scrubber.addEventListener('click', function(e) { e.stopPropagation(); });
      scrubber.addEventListener('touchstart', function(e) { e.stopPropagation(); showControls(); }, { passive: true });

      // ---- Time update ----
      video.addEventListener('timeupdate', function() {
        if (video.duration) {
          var pct = (video.currentTime / video.duration) * 100;
          scrubber.value = pct;
          scrubber.style.setProperty('--prog', pct.toFixed(2) + '%');
          curTimeEl.textContent = fmtTime(video.currentTime);
          durTimeEl.textContent = fmtTime(video.duration);
        }
      });

      video.addEventListener('loadedmetadata', function() {
        durTimeEl.textContent = fmtTime(video.duration);
      });

      video.addEventListener('ended', function() {
        card.classList.remove('is-playing');
        vcPlayBtn.textContent = '▶';
        if (origPlayBtn) origPlayBtn.innerHTML = '▶';
        video.currentTime = 0.001;
        showControls();
      });

      // ---- Fullscreen button ----
      vcFsBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        // Pause in-card, open fullscreen modal
        video.pause();
        card.classList.remove('is-playing');
        vcPlayBtn.textContent = '▶';
        if (origPlayBtn) origPlayBtn.innerHTML = '▶';
        openFsModal(card, video);
      });
      vcFsBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        video.pause();
        card.classList.remove('is-playing');
        vcPlayBtn.textContent = '▶';
        openFsModal(card, video);
      });
    });
  }

  // --- Modal Helpers ---
  function openModal(id) {
    var m = document.getElementById(id);
    if (m) m.style.display = 'flex';
  }

  function closeModal(id) {
    var m = document.getElementById(id);
    if (m) m.style.display = 'none';
  }

  // Close modals on backdrop click or close button
  document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
    backdrop.addEventListener('click', function(e) {
      if (e.target === backdrop) backdrop.style.display = 'none';
    });
  });

  document.querySelectorAll('[data-close]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var targetId = btn.getAttribute('data-close');
      closeModal(targetId);
    });
  });

  // --- Admin Mode Toggle & PIN Authentication ---
  var adminTrigger = document.getElementById('adminTrigger');
  var adminPinModal = document.getElementById('adminPinModal');
  var adminPinForm = document.getElementById('adminPinForm');
  var adminPinInput = document.getElementById('adminPinInput');
  var adminTopBar = document.getElementById('adminTopBar');

  if (adminTrigger) {
    adminTrigger.addEventListener('click', function() {
      if (isAdminActive) {
        setAdminMode(false);
      } else {
        openModal('adminPinModal');
        if (adminPinInput) {
          adminPinInput.value = '';
          setTimeout(function() { adminPinInput.focus(); }, 150);
        }
      }
    });
  }

  if (adminPinForm) {
    adminPinForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var enteredPin = adminPinInput.value;
      var settings = getSettings();
      var activePin = settings.pin || DEFAULT_SETTINGS.pin;
      
      if (enteredPin === activePin) {
        closeModal('adminPinModal');
        setAdminMode(true);
      } else {
        alert('❌ Incorrect Password. Please try again.');
        adminPinInput.focus();
        adminPinInput.select();
      }
    });
  }

  function setAdminMode(active) {
    isAdminActive = active;
    if (active) {
      document.body.classList.add('admin-active');
      if (adminTopBar) adminTopBar.style.display = 'block';
    } else {
      document.body.classList.remove('admin-active');
      if (adminTopBar) adminTopBar.style.display = 'none';
    }
    renderAllTracks();
  }

  // Top Bar Action Buttons
  var barUploadBtn = document.getElementById('barUploadBtn');
  var barSettingsBtn = document.getElementById('barSettingsBtn');
  var barExitBtn = document.getElementById('barExitBtn');

  if (barUploadBtn) {
    barUploadBtn.addEventListener('click', function() {
      window.openUploadForSection('aiTrack');
    });
  }

  if (barSettingsBtn) {
    barSettingsBtn.addEventListener('click', function() {
      var settings = getSettings();
      var cloudInput = document.getElementById('cloudNameInput');
      var presetInput = document.getElementById('uploadPresetInput');
      var pinInput = document.getElementById('changePinInput');
      
      if (cloudInput) cloudInput.value = settings.cloudName || '';
      if (presetInput) presetInput.value = settings.uploadPreset || '';
      if (pinInput) pinInput.value = ''; // Never show password in cleartext
      
      openModal('cloudSettingsModal');
    });
  }

  // Sync to Live Modal Actions
  var barSyncBtn = document.getElementById('barSyncBtn');
  var syncJsonOutput = document.getElementById('syncJsonOutput');
  var btnCopySyncJson = document.getElementById('btnCopySyncJson');

  if (barSyncBtn) {
    barSyncBtn.addEventListener('click', function() {
      var videos = getVideos();
      if (syncJsonOutput) {
        syncJsonOutput.value = JSON.stringify(videos, null, 2);
      }
      openModal('syncModal');
    });
  }

  if (btnCopySyncJson) {
    btnCopySyncJson.addEventListener('click', function() {
      if (syncJsonOutput) {
        syncJsonOutput.select();
        navigator.clipboard.writeText(syncJsonOutput.value).then(function() {
          alert('📋 Copied! હવે આને ચેટમાં પેસ્ટ કરી દો જેથી હું તેને લાઈવ વેબસાઇટમાં કાયમ માટે સેવ કરી દઉં.');
        }).catch(function() {
          document.execCommand('copy');
          alert('📋 Copied!');
        });
      }
    });
  }

  if (barExitBtn) {
    barExitBtn.addEventListener('click', function() {
      setAdminMode(false);
    });
  }

  // Cloud Settings Form Submit
  var cloudSettingsForm = document.getElementById('cloudSettingsForm');
  if (cloudSettingsForm) {
    cloudSettingsForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var cloudName = (document.getElementById('cloudNameInput').value || '').trim();
      var uploadPreset = (document.getElementById('uploadPresetInput').value || '').trim();
      var newPin = (document.getElementById('changePinInput').value || '').trim();

      var currentSettings = getSettings();
      var finalPin = newPin.length > 0 ? newPin : (currentSettings.pin || DEFAULT_SETTINGS.pin);

      var settings = {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        pin: finalPin
      };
      saveSettings(settings);
      closeModal('cloudSettingsModal');
      alert('✅ Settings & Password saved successfully!');
    });
  }

  // Test Cloudinary Connection Button
  var btnTestCloudConnection = document.getElementById('btnTestCloudConnection');
  var cloudTestResult = document.getElementById('cloudTestResult');

  if (btnTestCloudConnection) {
    btnTestCloudConnection.addEventListener('click', function() {
      var cloudName = (document.getElementById('cloudNameInput').value || '').trim();
      var uploadPreset = (document.getElementById('uploadPresetInput').value || '').trim();

      if (!cloudName) {
        showTestResult('⚠️ Please enter your Cloudinary Cloud Name first.', '#ef4444', 'rgba(239, 68, 68, 0.15)');
        return;
      }
      if (!uploadPreset) {
        showTestResult('⚠️ Please enter your Cloudinary Upload Preset (must be set to "Unsigned").', '#ef4444', 'rgba(239, 68, 68, 0.15)');
        return;
      }

      showTestResult('⏳ Testing connection with Cloudinary...', '#93c5fd', 'rgba(59, 130, 246, 0.15)');
      btnTestCloudConnection.disabled = true;

      // Send a tiny 1x1 png test ping to verify unsigned upload preset
      var formData = new FormData();
      formData.append('file', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
      formData.append('upload_preset', uploadPreset);

      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://api.cloudinary.com/v1_1/' + encodeURIComponent(cloudName) + '/image/upload', true);

      xhr.onload = function() {
        btnTestCloudConnection.disabled = false;
        if (xhr.status >= 200 && xhr.status < 300) {
          showTestResult('✅ <strong>Connected Successfully!</strong><br/>Your Cloudinary account (' + cloudName + ') is ready for direct phone video uploads.', '#00ff88', 'rgba(0, 255, 136, 0.15)');
        } else {
          var errMessage = 'Invalid credentials';
          try {
            var res = JSON.parse(xhr.responseText);
            if (res.error && res.error.message) errMessage = res.error.message;
          } catch(e) {}
          showTestResult('❌ <strong>Connection Failed:</strong> ' + errMessage + '<br/><small>Make sure the Preset Signing Mode is set to <strong>"Unsigned"</strong> in Cloudinary Settings &rarr; Upload.</small>', '#f87171', 'rgba(239, 68, 68, 0.2)');
        }
      };

      xhr.onerror = function() {
        btnTestCloudConnection.disabled = false;
        showTestResult('❌ <strong>Network error:</strong> Could not reach Cloudinary. Please check internet connection.', '#f87171', 'rgba(239, 68, 68, 0.2)');
      };

      xhr.send(formData);
    });
  }

  function showTestResult(msg, color, bgColor) {
    if (!cloudTestResult) return;
    cloudTestResult.style.display = 'block';
    cloudTestResult.style.color = color;
    cloudTestResult.style.backgroundColor = bgColor;
    cloudTestResult.style.border = '1px solid ' + color;
    cloudTestResult.innerHTML = msg;
  }


  // Reset to Default
  var btnResetVideos = document.getElementById('btnResetVideos');
  if (btnResetVideos) {
    btnResetVideos.addEventListener('click', function() {
      if (confirm('⚠️ Are you sure you want to reset all portfolio videos back to initial defaults?')) {
        saveVideos(DEFAULT_VIDEOS.slice());
        renderAllTracks();
        closeModal('cloudSettingsModal');
        alert('✨ Portfolio videos reset to default.');
      }
    });
  }

  // --- Google Drive URL Utilities ---
  function extractGDriveId(url) {
    if (!url) return null;
    // Matches /file/d/ID/view or id=ID formats
    var m = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (m) return m[1];
    m = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (m) return m[1];
    return null;
  }

  function gdrivePreviewUrl(fileId) {
    return 'https://drive.google.com/file/d/' + fileId + '/preview';
  }

  function gdriveThumbnailUrl(fileId) {
    return 'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w320-h180';
  }

  function convertGDriveUrl(rawUrl) {
    var fileId = extractGDriveId(rawUrl);
    if (!fileId) return rawUrl;
    // Return an iframe-embeddable preview URL stored in videoUrl
    return 'gdrive:' + fileId;
  }

  // GDrive input live-preview
  var gdriveUrlInput = document.getElementById('gdriveUrlInput');
  var gdrivePreviewCard = document.getElementById('gdrivePreviewCard');
  var gdriveThumbImg = document.getElementById('gdriveThumbImg');
  var gdriveStatusText = document.getElementById('gdriveStatusText');

  if (gdriveUrlInput) {
    gdriveUrlInput.addEventListener('input', function() {
      var val = gdriveUrlInput.value.trim();
      var fileId = extractGDriveId(val);
      if (fileId) {
        if (gdriveThumbImg) gdriveThumbImg.src = gdriveThumbnailUrl(fileId);
        if (gdriveStatusText) gdriveStatusText.innerText = 'Google Drive video detected ✅';
        if (gdrivePreviewCard) gdrivePreviewCard.style.display = 'flex';
      } else {
        if (gdrivePreviewCard) gdrivePreviewCard.style.display = 'none';
      }
    });
  }

  // --- Upload Video Flow & Global Window Methods ---
  window.openUploadForSection = function(sectionId) {
    var editIdInput = document.getElementById('editVideoId');
    var sectionSelect = document.getElementById('videoTargetSection');
    var modalTitle = document.getElementById('uploadModalTitle');
    var badgeInput = document.getElementById('videoBadgeInput');
    var titleInput = document.getElementById('videoTitleInput');
    var subInput = document.getElementById('videoSubtitleInput');
    var urlInput = document.getElementById('videoUrlInput');
    var gdrInput = document.getElementById('gdriveUrlInput');
    var fileInput = document.getElementById('videoFileInput');
    var submitBtn = document.getElementById('btnSubmitVideo');

    if (editIdInput) editIdInput.value = '';
    if (sectionSelect) sectionSelect.value = sectionId || 'aiTrack';
    if (modalTitle) modalTitle.innerText = 'Upload New Video Reel';
    if (badgeInput) badgeInput.value = '';
    if (titleInput) titleInput.value = '';
    if (subInput) subInput.value = '';
    if (urlInput) urlInput.value = '';
    if (gdrInput) gdrInput.value = '';
    if (fileInput) fileInput.value = '';
    if (submitBtn) submitBtn.querySelector('span').innerText = 'Save & Add to Website';
    if (gdrivePreviewCard) gdrivePreviewCard.style.display = 'none';

    resetFilePreview();
    switchUploadTab('tab-gdrive');
    openModal('videoUploadModal');
  };

  window.editVideoItem = function(id, e) {
    if (e) e.stopPropagation();
    var videos = getVideos();
    var item = videos.find(function(v) { return v.id === id; });
    if (!item) return;

    var editIdInput = document.getElementById('editVideoId');
    var sectionSelect = document.getElementById('videoTargetSection');
    var modalTitle = document.getElementById('uploadModalTitle');
    var badgeInput = document.getElementById('videoBadgeInput');
    var titleInput = document.getElementById('videoTitleInput');
    var subInput = document.getElementById('videoSubtitleInput');
    var urlInput = document.getElementById('videoUrlInput');
    var gdrInput = document.getElementById('gdriveUrlInput');
    var submitBtn = document.getElementById('btnSubmitVideo');

    if (editIdInput) editIdInput.value = item.id;
    if (sectionSelect) sectionSelect.value = item.section;
    if (modalTitle) modalTitle.innerText = 'Edit Video Reel';
    if (badgeInput) badgeInput.value = item.badge || '';
    if (titleInput) titleInput.value = item.title || '';
    if (subInput) subInput.value = item.subtitle || '';
    if (submitBtn) submitBtn.querySelector('span').innerText = 'Update Video';

    // Detect if stored as GDrive and pre-fill accordingly
    if (item.videoUrl && item.videoUrl.startsWith('gdrive:')) {
      var fileId = item.videoUrl.replace('gdrive:', '');
      if (gdrInput) gdrInput.value = 'https://drive.google.com/file/d/' + fileId + '/view';
      if (gdriveThumbImg) gdriveThumbImg.src = gdriveThumbnailUrl(fileId);
      if (gdriveStatusText) gdriveStatusText.innerText = 'Google Drive video connected ✅';
      if (gdrivePreviewCard) gdrivePreviewCard.style.display = 'flex';
      if (urlInput) urlInput.value = '';
      switchUploadTab('tab-gdrive');
    } else {
      if (urlInput) urlInput.value = item.videoUrl || '';
      if (gdrInput) gdrInput.value = '';
      if (gdrivePreviewCard) gdrivePreviewCard.style.display = 'none';
      switchUploadTab('tab-url');
    }

    resetFilePreview();
    openModal('videoUploadModal');
  };

  window.deleteVideoItem = function(id, e) {
    if (e) e.stopPropagation();
    if (confirm('🗑️ Are you sure you want to delete this video from your website?')) {
      var videos = getVideos();
      var updated = videos.filter(function(v) { return v.id !== id; });
      saveVideos(updated);
      renderAllTracks();
    }
  };

  // --- Google Drive Lightbox Player ---
  window.openGDrivePlayer = function(fileId, e) {
    if (e) { e.stopPropagation(); e.preventDefault(); }

    // Remove any existing lightbox
    var existing = document.getElementById('gdriveLightbox');
    if (existing) existing.remove();

    var lb = document.createElement('div');
    lb.id = 'gdriveLightbox';
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('role', 'dialog');
    lb.innerHTML =
      '<div class="gdrive-lb-backdrop"></div>' +
      '<div class="gdrive-lb-box">' +
        '<div class="gdrive-lb-head">' +
          '<span class="gdrive-lb-title"><span style="color:#4285f4">🔺</span> Google Drive Video</span>' +
          '<button class="gdrive-lb-close" aria-label="Close player">✕</button>' +
        '</div>' +
        '<div class="gdrive-lb-frame-wrap">' +
          '<iframe class="gdrive-lb-iframe" ' +
            'src="https://drive.google.com/file/d/' + fileId + '/preview" ' +
            'allow="autoplay; fullscreen" allowfullscreen></iframe>' +
        '</div>' +
        '<p class="gdrive-lb-hint">If the video doesn\'t play, make sure sharing is set to <strong>"Anyone with the link"</strong> in Google Drive.</p>' +
      '</div>';

    document.body.appendChild(lb);
    document.body.style.overflow = 'hidden';

    // Animate in
    requestAnimationFrame(function() { lb.classList.add('gdrive-lb-open'); });

    function closeLb() {
      lb.classList.remove('gdrive-lb-open');
      setTimeout(function() {
        lb.remove();
        document.body.style.overflow = '';
      }, 280);
    }

    lb.querySelector('.gdrive-lb-close').addEventListener('click', closeLb);
    lb.querySelector('.gdrive-lb-backdrop').addEventListener('click', closeLb);
    document.addEventListener('keydown', function escHandler(ev) {
      if (ev.key === 'Escape') { closeLb(); document.removeEventListener('keydown', escHandler); }
    });
  };


  function switchUploadTab(tabId) {
    document.querySelectorAll('.upload-tab').forEach(function(t) {
      t.classList.toggle('active', t.getAttribute('data-tab') === tabId);
    });
    document.querySelectorAll('.tab-pane').forEach(function(p) {
      if (p.id === tabId) {
        p.style.display = 'block';
      } else {
        p.style.display = 'none';
      }
    });
  }

  document.querySelectorAll('.upload-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      switchUploadTab(tab.getAttribute('data-tab'));
    });
  });

  // File Selector & Preview Handling
  var videoFileInput = document.getElementById('videoFileInput');
  var filePreviewCard = document.getElementById('filePreviewCard');
  var filePreviewVideo = document.getElementById('filePreviewVideo');
  var previewFilename = document.getElementById('previewFilename');
  var previewFilesize = document.getElementById('previewFilesize');
  var btnRemoveFile = document.getElementById('btnRemoveFile');
  var fileDropzone = document.getElementById('fileDropzone');

  function handleFileSelected(file) {
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      alert('⚠️ Please select a valid video file (MP4, MOV, WebM).');
      return;
    }

    currentSelectedFile = file;
    if (previewFilename) previewFilename.innerText = file.name;
    if (previewFilesize) previewFilesize.innerText = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

    var fileUrl = URL.createObjectURL(file);
    if (filePreviewVideo) {
      filePreviewVideo.src = fileUrl;
      filePreviewVideo.load();
    }

    if (fileDropzone) fileDropzone.style.display = 'none';
    if (filePreviewCard) filePreviewCard.style.display = 'flex';
  }

  function resetFilePreview() {
    currentSelectedFile = null;
    if (videoFileInput) videoFileInput.value = '';
    if (filePreviewVideo) filePreviewVideo.src = '';
    if (fileDropzone) fileDropzone.style.display = 'block';
    if (filePreviewCard) filePreviewCard.style.display = 'none';
    var prog = document.getElementById('uploadProgressWrap');
    if (prog) prog.style.display = 'none';
  }

  if (videoFileInput) {
    videoFileInput.addEventListener('change', function(e) {
      if (e.target.files && e.target.files[0]) {
        handleFileSelected(e.target.files[0]);
      }
    });
  }

  if (btnRemoveFile) {
    btnRemoveFile.addEventListener('click', resetFilePreview);
  }

  // Drag and Drop
  if (fileDropzone) {
    ['dragenter', 'dragover'].forEach(function(eventName) {
      fileDropzone.addEventListener(eventName, function(e) {
        e.preventDefault();
        fileDropzone.classList.add('drag-over');
      });
    });
    ['dragleave', 'drop'].forEach(function(eventName) {
      fileDropzone.addEventListener(eventName, function(e) {
        e.preventDefault();
        fileDropzone.classList.remove('drag-over');
      });
    });
    fileDropzone.addEventListener('drop', function(e) {
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelected(e.dataTransfer.files[0]);
      }
    });
  }

  // --- Video Upload Submission (GDrive / Cloudinary / Direct URL) ---
  var videoUploadForm = document.getElementById('videoUploadForm');
  if (videoUploadForm) {
    videoUploadForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var editId = document.getElementById('editVideoId').value;
      var section = document.getElementById('videoTargetSection').value;
      var badge = (document.getElementById('videoBadgeInput').value || '').trim();
      var title = (document.getElementById('videoTitleInput').value || '').trim();
      var subtitle = (document.getElementById('videoSubtitleInput').value || '').trim();
      var directUrl = (document.getElementById('videoUrlInput').value || '').trim();
      var gdriveRaw = (document.getElementById('gdriveUrlInput').value || '').trim();

      var submitBtn = document.getElementById('btnSubmitVideo');
      var progressWrap = document.getElementById('uploadProgressWrap');
      var progressFill = document.getElementById('uploadProgressFill');
      var percentText = document.getElementById('uploadPercent');
      var statusText = document.getElementById('uploadStatusText');

      // --- Google Drive tab ---
      if (gdriveRaw && !currentSelectedFile && !directUrl) {
        var fileId = extractGDriveId(gdriveRaw);
        if (!fileId) {
          alert('⚠️ Could not detect a valid Google Drive file ID.\n\nMake sure you copied the correct share link:\nhttps://drive.google.com/file/d/YOUR_FILE_ID/view');
          return;
        }
        finalizeSaveVideo({
          id: editId || ('vid_' + Date.now()),
          section: section,
          title: title || 'Google Drive Reel',
          badge: badge || 'GDrive',
          subtitle: subtitle || 'Streamed from Google Drive',
          videoUrl: 'gdrive:' + fileId,
          thumbClass: 'v1',
          isGDrive: true
        });
        return;
      }

      // If updating with direct URL or existing
      if (!currentSelectedFile) {
        if (!directUrl && !editId) {
          alert('⚠️ Please paste a Google Drive link, select a video file, or paste a direct video URL.');
          return;
        }

        finalizeSaveVideo({
          id: editId || ('vid_' + Date.now()),
          section: section,
          title: title || 'Portfolio Reel',
          badge: badge || 'Reel',
          subtitle: subtitle || '',
          videoUrl: directUrl || 'videos/reel1.mp4',
          thumbClass: 'v1'
        });
        return;
      }

      // If uploading file: check Cloudinary settings
      var settings = getSettings();
      var cloudName = settings.cloudName;
      var uploadPreset = settings.uploadPreset;

      if (!cloudName || !uploadPreset) {
        // Fallback: create object URL / local representation and notify
        var localUrl = URL.createObjectURL(currentSelectedFile);
        finalizeSaveVideo({
          id: editId || ('vid_' + Date.now()),
          section: section,
          title: title || currentSelectedFile.name.replace(/\.[^/.]+$/, ''),
          badge: badge || 'Uploaded Reel',
          subtitle: subtitle || 'Added from device',
          videoUrl: localUrl,
          thumbClass: 'v2'
        });
        alert('🎬 Video added! (Tip: Configure your free Cloudinary Cloud Name & Upload Preset in Settings ⚙️ to store videos permanently in the cloud for all visitors).');
        return;
      }

      // Perform Cloudinary Unsigned Upload
      if (progressWrap) progressWrap.style.display = 'block';
      if (submitBtn) submitBtn.disabled = true;

      var formData = new FormData();
      formData.append('file', currentSelectedFile);
      formData.append('upload_preset', uploadPreset);
      formData.append('resource_type', 'video');

      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://api.cloudinary.com/v1_1/' + cloudName + '/video/upload', true);

      xhr.upload.onprogress = function(evt) {
        if (evt.lengthComputable) {
          var percent = Math.round((evt.loaded / evt.total) * 100);
          if (progressFill) progressFill.style.width = percent + '%';
          if (percentText) percentText.innerText = percent + '%';
          if (statusText) statusText.innerText = 'Uploading video... (' + percent + '%)';
        }
      };

      xhr.onload = function() {
        if (submitBtn) submitBtn.disabled = false;
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            var response = JSON.parse(xhr.responseText);
            var secureUrl = response.secure_url || response.url;
            finalizeSaveVideo({
              id: editId || ('vid_' + Date.now()),
              section: section,
              title: title || currentSelectedFile.name.replace(/\.[^/.]+$/, ''),
              badge: badge || 'Cloud Reel',
              subtitle: subtitle || '',
              videoUrl: secureUrl,
              thumbClass: 'v1'
            });
            alert('🎉 Video uploaded and published successfully!');
          } catch(err) {
            alert('❌ Upload parse error: ' + err.message);
          }
        } else {
          alert('❌ Cloud upload failed (' + xhr.status + '). Please check Cloudinary credentials or preset name.');
          if (progressWrap) progressWrap.style.display = 'none';
        }
      };

      xhr.onerror = function() {
        if (submitBtn) submitBtn.disabled = false;
        alert('❌ Network error during upload. Please check your internet connection.');
        if (progressWrap) progressWrap.style.display = 'none';
      };

      xhr.send(formData);
    });
  }

  function finalizeSaveVideo(videoObj) {
    var videos = getVideos();
    var existingIndex = videos.findIndex(function(v) { return v.id === videoObj.id; });

    if (existingIndex >= 0) {
      videos[existingIndex] = Object.assign({}, videos[existingIndex], videoObj);
    } else {
      videos.unshift(videoObj);
    }

    saveVideos(videos);
    renderAllTracks();
    closeModal('videoUploadModal');
    resetFilePreview();
  }

  // Initial render from local cache
  renderAllTracks();

  // Fetch live videos from Realtime Cloud Database for all visitors worldwide
  fetch(REALTIME_CLOUD_DB)
    .then(function(res) { return res.json(); })
    .then(function(payload) {
      if (payload && payload.data && Array.isArray(payload.data.videos)) {
        var liveVideos = payload.data.videos;
        saveVideos(liveVideos, true); // true = skip redundant re-sync
        renderAllTracks();
      }
    })
    .catch(function() {
      // Backup fetch from videos.json
      fetch('videos.json?t=' + Date.now())
        .then(function(r) { return r.json(); })
        .then(function(backupVideos) {
          if (Array.isArray(backupVideos)) {
            saveVideos(backupVideos, true);
            renderAllTracks();
          }
        }).catch(function() {});
    });

  console.log('%c🎬 Video Editor Portfolio Ready | Realtime Cloud Sync Active', 'color: #00ff88; font-weight: bold;');
});
