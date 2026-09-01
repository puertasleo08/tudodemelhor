/**
 * Lazy-load hero review videos via Intersection Observer.
 * Autoplay muted on scroll; optional unmute via overlay button.
 */
(function () {
  const ICON_MUTED =
    '<svg class="hero-video-unmute-icon hero-video-unmute-icon--muted h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
  const ICON_UNMUTED =
    '<svg class="hero-video-unmute-icon hero-video-unmute-icon--unmuted hidden h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';

  function ensureUnmuteButton(wrap, video) {
    if (wrap.querySelector('.hero-video-unmute')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className =
      'hero-video-unmute absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50';
    btn.setAttribute('aria-label', 'Ativar som do vídeo');
    btn.setAttribute('aria-pressed', 'false');
    btn.innerHTML = ICON_MUTED + ICON_UNMUTED;

    btn.addEventListener('click', function () {
      video.muted = !video.muted;
      const isMuted = video.muted;
      btn.setAttribute('aria-pressed', isMuted ? 'false' : 'true');
      btn.setAttribute('aria-label', isMuted ? 'Ativar som do vídeo' : 'Silenciar vídeo');
      btn.querySelector('.hero-video-unmute-icon--muted').classList.toggle('hidden', !isMuted);
      btn.querySelector('.hero-video-unmute-icon--unmuted').classList.toggle('hidden', isMuted);
      if (!isMuted) {
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {});
        }
      }
    });

    wrap.appendChild(btn);
  }

  const videos = document.querySelectorAll('video.lazy-hero-video[data-src]');
  if (!videos.length) return;

  videos.forEach(function (video) {
    const wrap = video.closest('.hero-video-wrap');
    if (wrap) ensureUnmuteButton(wrap, video);
  });

  function loadVideo(video) {
    if (video.dataset.loaded === 'true') return;
    const src = video.dataset.src;
    if (!src) return;

    video.dataset.loaded = 'true';
    video.src = src;
    video.load();
  }

  function playVideo(video) {
    loadVideo(video);
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  function pauseVideo(video) {
    if (video.dataset.loaded !== 'true') return;
    video.pause();
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          const video = entry.target;
          if (entry.isIntersecting) {
            playVideo(video);
          } else {
            pauseVideo(video);
          }
        });
      },
      { root: null, rootMargin: '80px 0px', threshold: 0.2 }
    );

    videos.forEach(function (video) {
      observer.observe(video);
    });
  } else {
    videos.forEach(playVideo);
  }
})();
