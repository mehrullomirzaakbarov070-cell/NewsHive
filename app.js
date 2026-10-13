const state = {
  category: 'general',
  query: '',
  page: 1,
  pageSize: 9,
  totalResults: 0,
  loading: false,
  loadingMore: false,
  hasMore: true,
  currentArticles: []
};

const CACHE_TTL = 5 * 60 * 1000;
const CATEGORY_MAP = {
  general: 'Barchasi',
  business: 'Biznes',
  technology: 'Texnologiya',
  sports: 'Sport',
  health: 'Sog\'liq',
  science: 'Fan',
  entertainment: 'Ko\'ngilochar'
};

const categoryKeys = Object.keys(CATEGORY_MAP);

const app = {
  header: document.getElementById('siteHeader'),
  categoryTabs: document.getElementById('categoryTabs'),
  heroCard: document.getElementById('heroCard'),
  newsGrid: document.getElementById('newsGrid'),
  skeletonGrid: document.getElementById('skeletonGrid'),
  loadMoreBtn: document.getElementById('loadMoreBtn'),
  themeToggle: document.getElementById('themeToggle'),
  searchInput: document.getElementById('searchInput'),
  toast: document.getElementById('toast'),
  scrollTopBtn: document.getElementById('scrollTopBtn')
};

let searchDebounceTimer;
let revealObserver;
let infiniteObserver;

document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  renderCategoryTabs();
  bindEvents();
  initializeCanvasParticles();
  initializeRevealObserver();
  initializeInfiniteScroll();
  loadTopHeadlines(true);
  updateScrollTopButton();
});

function bindEvents() {
  app.themeToggle.addEventListener('click', toggleTheme);
  app.loadMoreBtn.addEventListener('click', () => {
    if (state.loading || !state.hasMore) return;

    state.page += 1;

    if (state.query.trim()) {
      loadSearchResults(false, state.query.trim());
      return;
    }

    loadTopHeadlines(false);
  });

  app.searchInput.addEventListener('input', (event) => {
    const value = event.target.value.trim();
    clearTimeout(searchDebounceTimer);

    searchDebounceTimer = setTimeout(() => {
      if (!value) {
        state.query = '';
        state.page = 1;
        state.hasMore = true;
        state.category = 'general';
        renderCategoryTabs();
        loadTopHeadlines(true);
        return;
      }

      state.query = value;
      state.page = 1;
      state.hasMore = true;
      loadSearchResults(true, value);
    }, 400);
  });

  window.addEventListener('scroll', handleScroll);
  app.scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initializeRevealObserver() {
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
}

function initializeInfiniteScroll() {
  const sentinel = document.getElementById('loadMoreSentinel');
  if (!sentinel) return;

  infiniteObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry || !entry.isIntersecting || state.loading || !state.hasMore) return;

      if (state.query.trim()) {
        state.page += 1;
        loadSearchResults(false, state.query.trim());
        return;
      }

      state.page += 1;
      loadTopHeadlines(false);
    },
    { rootMargin: '200px 0px' }
  );

  infiniteObserver.observe(sentinel);
}

function renderCategoryTabs() {
  app.categoryTabs.innerHTML = categoryKeys
    .map((key) => {
      const isActive = state.category === key && !state.query.trim();
      return `
        <button
          class="tab ${isActive ? 'active' : ''}"
          type="button"
          data-category="${key}"
          aria-label="${CATEGORY_MAP[key]} kategoriyasi"
          aria-pressed="${isActive}"
        >
          ${CATEGORY_MAP[key]}
        </button>
      `;
    })
    .join('');

  app.categoryTabs.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const selected = tab.dataset.category;
      state.category = selected;
      state.query = '';
      state.page = 1;
      app.searchInput.value = '';
      renderCategoryTabs();
      loadTopHeadlines(true);
    });
  });
}

function initializeTheme() {
  const savedTheme = localStorage.getItem('news-theme') || 'dark';
  document.body.dataset.theme = savedTheme;
  app.themeToggle.setAttribute('aria-label', savedTheme === 'dark' ? 'Yorug rejimga o\'tish' : 'Qora rejimga o\'tish');
}

function toggleTheme() {
  const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  document.body.dataset.theme = nextTheme;
  localStorage.setItem('news-theme', nextTheme);
  app.themeToggle.setAttribute('aria-label', nextTheme === 'dark' ? 'Yorug rejimga o\'tish' : 'Qora rejimga o\'tish');
}

function handleScroll() {
  if (window.scrollY > 18) {
    app.header.classList.add('scrolled');
  } else {
    app.header.classList.remove('scrolled');
  }

  updateScrollTopButton();
}

function updateScrollTopButton() {
  if (window.scrollY > 360) {
    app.scrollTopBtn.classList.add('visible');
  } else {
    app.scrollTopBtn.classList.remove('visible');
  }
}

function loadTopHeadlines(reset = true) {
  if (state.loading) return;

  if (reset) {
    state.page = 1;
    state.hasMore = true;
    state.currentArticles = [];
    app.heroCard.innerHTML = '';
  }

  state.loading = true;
  renderSkeleton(true, reset);

  const params = {
    country: 'us',
    category: state.category,
    page: state.page,
    pageSize: state.pageSize
  };

  fetchNews({ endpoint: 'top-headlines', params, cacheKey: `top-headlines-${state.category}-${state.page}` })
    .then((data) => {
      const articles = sanitizeArticles(data.articles || []);

      if (reset) {
        renderHero(articles[0]);
        state.currentArticles = articles.slice(1);
        renderNewsCards(state.currentArticles);
      } else {
        state.currentArticles = [...state.currentArticles, ...articles];
        renderNewsCards(state.currentArticles);
      }

      state.totalResults = data.totalResults || 0;
      state.hasMore = state.currentArticles.length < state.totalResults;
      updateLoadMoreButton();
    })
    .catch((error) => {
      showToast(error.message || 'Yangiliklar yuklanmadi.', true);
    })
    .finally(() => {
      state.loading = false;
      renderSkeleton(false, reset);
    });
}

function loadSearchResults(reset = true, query = state.query.trim()) {
  if (!query || state.loading) return;

  if (reset) {
    state.page = 1;
    state.hasMore = true;
    state.currentArticles = [];
    app.heroCard.innerHTML = '';
  }

  state.loading = true;
  renderSkeleton(true, reset);

  const params = {
    q: query,
    sortBy: 'publishedAt',
    language: 'en',
    page: state.page,
    pageSize: state.pageSize
  };

  fetchNews({ endpoint: 'everything', params, cacheKey: `everything-${query}-${state.page}` })
    .then((data) => {
      const articles = sanitizeArticles(data.articles || []);

      if (reset) {
        renderHero(articles[0]);
        state.currentArticles = articles.slice(1);
        renderNewsCards(state.currentArticles);
      } else {
        state.currentArticles = [...state.currentArticles, ...articles];
        renderNewsCards(state.currentArticles);
      }

      state.totalResults = data.totalResults || 0;
      state.hasMore = state.currentArticles.length < state.totalResults;
      updateLoadMoreButton();
    })
    .catch((error) => {
      showToast(error.message || 'Qidiruv natijalari yuklanmadi.', true);
    })
    .finally(() => {
      state.loading = false;
      renderSkeleton(false, reset);
    });
}

async function fetchNews({ endpoint, params, cacheKey }) {
  const url = new URL(`${CONFIG.BASE_URL}/${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  url.searchParams.set('apiKey', CONFIG.API_KEY);

  const cached = getCachedResponse(cacheKey);
  if (cached) {
    return cached;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  });

  if (response.status === 429) {
    throw new Error('So\'rovlar limiti tugadi. Bir daqiqadan keyin urinib ko\'ring.');
  }

  if (!response.ok) {
    let message = 'Yangiliklar taqdim etilmoqda, lekin server xatosi yuz berdi.';
    try {
      const errorBody = await response.json();
      if (errorBody && errorBody.message) {
        message = errorBody.message;
      }
    } catch (error) {
      // Ignore JSON parse issues and fall back to the default message.
    }

    throw new Error(formatApiErrorMessage(message));
  }

  const data = await response.json();
  if (!data || data.status !== 'ok') {
    throw new Error('Yangiliklar ma\'lumoti olinmadi. Iltimos, keyinroq qayta urining.');
  }

  setCachedResponse(cacheKey, data);
  return data;
}

function formatApiErrorMessage(message) {
  const normalized = String(message || '').toLowerCase();

  if (normalized.includes('rate limit') || normalized.includes('too many requests') || normalized.includes('429')) {
    return 'So\'rovlar limiti tugadi. Bir daqiqadan keyin urinib ko\'ring.';
  }

  if (normalized.includes('api key') || normalized.includes('unauthorized') || normalized.includes('invalid api')) {
    return 'API kaliti noto\'g\'ri yoki ishlamayapti. Konfiguratsiyani tekshiring.';
  }

  if (normalized.includes('not found')) {
    return 'Talab qilingan ma\'lumot topilmadi.';
  }

  if (normalized.includes('network') || normalized.includes('failed to fetch')) {
    return 'Internet ulanishi mavjud emas yoki server javob bermayapti.';
  }

  return 'Yangiliklar ma\'lumoti olinmadi. Iltimos, keyinroq qayta urining.';
}

function getCachedResponse(key) {
  try {
    const value = sessionStorage.getItem(key);
    if (!value) return null;

    const parsed = JSON.parse(value);
    if (!parsed || !parsed.expiresAt) return null;

    if (Date.now() > parsed.expiresAt) {
      sessionStorage.removeItem(key);
      return null;
    }

    return parsed.data;
  } catch (error) {
    return null;
  }
}

function setCachedResponse(key, data) {
  try {
    sessionStorage.setItem(
      key,
      JSON.stringify({
        expiresAt: Date.now() + CACHE_TTL,
        data
      })
    );
  } catch (error) {
    // Ignore quota issues in the browser and proceed without cache.
  }
}

function renderHero(article) {
  if (!article) {
    app.heroCard.innerHTML = `
      <div class="hero-card empty-state">
        <p>Hozircha mavjud yangiliklar yo\'q.</p>
      </div>
    `;
    return;
  }

  const source = article.source?.name || 'Unknown';
  const timeAgo = formatTimeAgo(article.publishedAt);
  const title = article.title ? escapeHtml(article.title) : 'Noma\'lum sarlavha';
  const description = article.description ? escapeHtml(article.description) : 'Bu maqola haqida batafsil ma\'lumot mavjud emas.';

  const imageUrl = article.image || article.urlToImage || '';
  app.heroCard.innerHTML = `
    <div class="hero-media">
      <img
        src="${escapeAttribute(imageUrl)}"
        alt="${escapeAttribute(article.title || 'Yangilik surati')}"
        loading="eager"
        referrerpolicy="no-referrer"
        onerror="this.style.display='none'; this.parentElement.classList.add('hero-media--fallback');"
      />
    </div>
    <div class="hero-content">
      <span class="hero-tag">Top story</span>
      <h1 class="hero-title">${title}</h1>
      <p class="hero-summary">${description}</p>
      <div class="hero-meta">
        <span>${escapeHtml(source)}</span>
        <span>${escapeHtml(timeAgo)}</span>
      </div>
      <div class="hero-actions">
        <a class="primary-button" href="${escapeAttribute(article.url)}" target="_blank" rel="noreferrer noopener">Batafsil</a>
        <button class="secondary-button" type="button" onclick="window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })">Ko'proq</button>
      </div>
    </div>
  `;
}

function renderNewsCards(articles) {
  if (!articles.length) {
    app.newsGrid.innerHTML = `
      <div class="empty-state">
        <h3>Natija topilmadi</h3>
        <p>Ushbu so\'rov bo\'yicha ma\'lumot yo\'q. Boshqa kalit so\'z bilan qidiring.</p>
      </div>
    `;
    return;
  }

  app.newsGrid.innerHTML = articles
    .map((article, index) => {
      const source = article.source?.name || 'Anonymous';
      const title = article.title ? escapeHtml(article.title) : 'Sarlavha mavjud emas';
      const desc = article.description ? escapeHtml(article.description) : 'Ta\'rif mavjud emas.';
      const imageUrl = article.image || article.urlToImage || '';

      return `
        <article class="news-card reveal" style="transition-delay:${Math.min(index * 60, 300)}ms">
          <div class="news-media ${!imageUrl ? 'news-media--fallback' : ''}">
            ${imageUrl ? `<img src="${escapeAttribute(imageUrl)}" alt="${escapeAttribute(article.title || 'Yangilik surati')}" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none'; this.parentElement.classList.add('news-media--fallback');" />` : ''}
          </div>
          <div class="news-content">
            <div class="news-meta">
              <span>${escapeHtml(source)}</span>
              <span>${escapeHtml(formatTimeAgo(article.publishedAt))}</span>
            </div>
            <h3>${title}</h3>
            <p>${desc}</p>
            <a class="read-more" href="${escapeAttribute(article.url)}" target="_blank" rel="noreferrer noopener">Batafsil</a>
          </div>
        </article>
      `;
    })
    .join('');

  app.newsGrid.querySelectorAll('.reveal').forEach((card) => {
    revealObserver.observe(card);
  });
}

function renderSkeleton(visible, reset) {
  if (visible) {
    app.skeletonGrid.classList.add('visible');
    app.skeletonGrid.innerHTML = Array.from({ length: 6 }, () => `
      <div class="skeleton-card">
        <div class="skeleton-media"></div>
        <div class="skeleton-content">
          <div class="skeleton-line short"></div>
          <div class="skeleton-line long"></div>
          <div class="skeleton-line long"></div>
          <div class="skeleton-button"></div>
        </div>
      </div>
    `).join('');

    if (reset) {
      app.newsGrid.innerHTML = '';
    }
    return;
  }

  app.skeletonGrid.classList.remove('visible');
  app.skeletonGrid.innerHTML = '';
}

function updateLoadMoreButton() {
  if (state.hasMore) {
    app.loadMoreBtn.hidden = false;
    app.loadMoreBtn.textContent = state.query.trim() ? 'Ko\'proq natija' : 'Ko\'proq yuklash';
  } else {
    app.loadMoreBtn.hidden = true;
  }
}

function showToast(message, isError = false) {
  app.toast.textContent = message;
  app.toast.classList.toggle('error', isError);
  app.toast.classList.add('show');

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    app.toast.classList.remove('show');
  }, 2600);
}

function sanitizeArticles(articles) {
  return (articles || [])
    .filter((article) => article && article.title)
    .map((article) => ({
      ...article,
      title: stripHtml(article.title || ''),
      description: stripHtml(article.description || ''),
      source: {
        name: stripHtml(article.source?.name || 'Unknown')
      },
      image: article.urlToImage || '',
      url: article.url || '#'
    }));
}

function stripHtml(value) {
  return String(value || '').replace(/<[^>]*>/g, '').trim();
}

function formatTimeAgo(dateString) {
  if (!dateString) return 'Yaqinda';

  const time = new Date(dateString).getTime();
  if (Number.isNaN(time)) return 'Yaqinda';

  const diffMs = Date.now() - time;
  const diffMinutes = Math.max(1, Math.round(diffMs / 60000));

  if (diffMinutes < 60) return `${diffMinutes} min oldin`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} soat oldin`;

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} kun oldin`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttribute(value) {
  return escapeHtml(value || '').replace(/`/g, '&#96;');
}

function initializeCanvasParticles() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  const particles = [];
  const maxParticles = 60;

  function resizeCanvas() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  function createParticle() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2.4 + 1,
      alpha: Math.random() * 0.8 + 0.2,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3
    };
  }

  function initParticles() {
    particles.length = 0;
    const total = Math.min(maxParticles, Math.floor((window.innerWidth * window.innerHeight) / 18));
    for (let index = 0; index < total; index += 1) {
      particles.push(createParticle());
    }
  }

  function draw() {
    if (document.hidden) return;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((particle) => {
      particle.x += particle.dx;
      particle.y += particle.dy;

      if (particle.x < 0 || particle.x > window.innerWidth) particle.dx *= -1;
      if (particle.y < 0 || particle.y > window.innerHeight) particle.dy *= -1;

      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(139, 92, 246, 0.5)';
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      requestAnimationFrame(draw);
    }
  });

  resizeCanvas();
  initParticles();
  requestAnimationFrame(draw);
}
