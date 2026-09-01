/**
 * Product gallery lightbox — opens images in-page (no new tab).
 */
(function () {
  const galleries = document.querySelectorAll('.product-gallery[data-gallery-images]');
  if (!galleries.length) return;

  let items = [];
  let index = 0;
  let lastFocus = null;

  const modal = document.createElement('div');
  modal.id = 'product-gallery-lightbox';
  modal.className = 'fixed inset-0 z-[100] hidden items-center justify-center p-4';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Galeria de fotos ampliada');
  modal.innerHTML = `
    <div class="gallery-lightbox-backdrop absolute inset-0 bg-black/85 backdrop-blur-sm" data-close></div>
    <button type="button" class="gallery-lightbox-close absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-2xl leading-none text-white transition hover:bg-black/70" aria-label="Fechar galeria">&times;</button>
    <button type="button" class="gallery-lightbox-prev absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:bg-black/70 md:left-6" aria-label="Foto anterior">&#8249;</button>
    <button type="button" class="gallery-lightbox-next absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:bg-black/70 md:right-6" aria-label="Próxima foto">&#8250;</button>
    <figure class="relative z-[1] flex max-h-[85vh] max-w-[min(100%,900px)] flex-col items-center">
      <img class="gallery-lightbox-image max-h-[78vh] w-auto max-w-full rounded-lg object-contain shadow-2xl" src="" alt="" referrerpolicy="no-referrer">
      <figcaption class="gallery-lightbox-caption mt-3 max-w-prose text-center text-sm text-brand-muted"></figcaption>
    </figure>
  `;
  document.body.appendChild(modal);

  const backdrop = modal.querySelector('.gallery-lightbox-backdrop');
  const closeBtn = modal.querySelector('.gallery-lightbox-close');
  const prevBtn = modal.querySelector('.gallery-lightbox-prev');
  const nextBtn = modal.querySelector('.gallery-lightbox-next');
  const imgEl = modal.querySelector('.gallery-lightbox-image');
  const captionEl = modal.querySelector('.gallery-lightbox-caption');

  function parseGallery(el) {
    try {
      return JSON.parse(el.getAttribute('data-gallery-images') || '[]');
    } catch {
      return [];
    }
  }

  function show(i) {
    if (!items.length) return;
    index = (i + items.length) % items.length;
    const item = items[index];
    imgEl.src = item.url;
    imgEl.alt = item.alt || '';
    captionEl.textContent = item.alt || '';
    prevBtn.style.display = items.length > 1 ? '' : 'none';
    nextBtn.style.display = items.length > 1 ? '' : 'none';
  }

  function open(startIndex, galleryItems) {
    items = galleryItems;
    if (!items.length) return;
    lastFocus = document.activeElement;
    show(startIndex);
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
    imgEl.src = '';
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  galleries.forEach((gallery) => {
    const galleryItems = parseGallery(gallery);
    gallery.querySelectorAll('img.product-gallery-thumb').forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const i = Number(thumb.getAttribute('data-index') || 0);
        open(i, galleryItems);
      });
    });
  });

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(index - 1));
  nextBtn.addEventListener('click', () => show(index + 1));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('hidden')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
})();
