/*!
* Start Bootstrap - Agency v7.0.12 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/
// 
// GreenAiriva Universal Scripts
//

window.addEventListener('DOMContentLoaded', event => {

    // 1. Navbar shrink function (scroll ile navbar'ı koyult/şeffaf yap)
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink');
        } else {
            navbarCollapsible.classList.add('navbar-shrink');
        }
    };

    // Sayfa yüklenince ve scroll olunca fonksiyon tetiklenir
    navbarShrink();
    document.addEventListener('scroll', navbarShrink);

    // 2. Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // 3. Responsive navbar'ı mobilde linke tıklayınca kapat
    // NOT: Artık sadece dropdown-toggle OLMAYAN nav-link'lerde çalışıyor!
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link:not(.dropdown-toggle)')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // 4. GreenAiriva: ID ile scroll-to fonksiyonları (özelleştirilebilir)
    const smoothScrollButtons = [
        { buttonId: 'scrollToContact', sectionId: 'contact' },
        { buttonId: 'scrollToSolutions', sectionId: 'solutions' },
        { buttonId: 'scrollToabout', sectionId: 'about' },
        { buttonId: 'scrollToTeam', sectionId: 'team' }
        // Ekstra buton ve section burada eklenebilir
    ];
    smoothScrollButtons.forEach(({ buttonId, sectionId }) => {
        const btn = document.getElementById(buttonId);
        const section = document.getElementById(sectionId);
        if (btn && section) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                section.scrollIntoView({ behavior: 'smooth' });
                if (history.pushState) {
                    history.pushState(null, null, window.location.pathname);
                }
            });
        }
    });

    // 5. Genel: Tüm anchor (href="#...") linklerinde smooth scroll desteği
    document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
                if (history.pushState) {
                    history.pushState(null, null, window.location.pathname);
                }
            }
        });
    });

    // 6. Sayfa hash ile açıldıysa otomatik smooth scroll (örn. /about/#vision)
    if (window.location.hash) {
        var section = document.querySelector(window.location.hash);
        if (section) {
            setTimeout(function() {
                section.scrollIntoView({ behavior: "smooth" });
            }, 150); // sayfa yüklenince biraz bekleyip kaydır
        }
    }

});
// Sadece dropdown içindeki item veya gerçek nav-link'e tıklanınca menüyü kapat
document.querySelectorAll('.navbar-nav .nav-link, .navbar-nav .dropdown-item').forEach(function(element) {
  element.addEventListener('click', function(e) {
    // Eğer tıklanan element bir dropdown ana başlığı ise (yani dropdown-toggle class'ı varsa), menüyü kapatma
    if (element.classList.contains('dropdown-toggle')) {
      // Sadece dropdown'ı aç/kapat, menüyü kapatma
      return;
    }
    // Eğer tıklanan dropdown menü içindeki bir item veya menüdeki gerçek bir link ise, menüyü kapat
    var navbarCollapse = document.getElementById('navbarResponsive');
    if (navbarCollapse.classList.contains('show')) {
      var bsCollapse = new bootstrap.Collapse(navbarCollapse, {toggle: true});
    }
  });
});


// ==== DİNAMİK BLOG LİSTELEME SİSTEMİ ====
// Not: JSON dosyanın yolunu aşağıda gerekirse değiştir (örn: '/data/posts.json' veya 'posts.json')
const BLOG_JSON_PATH = 'posts.json'; // veya yoluna göre değiştir
const BLOG_POSTS_PER_PAGE = 6;
let blogPosts = [];
let blogCategories = new Set();
let blogVisibleCount = BLOG_POSTS_PER_PAGE;

async function blogFetchPosts() {
  try {
    const res = await fetch(BLOG_JSON_PATH);
    blogPosts = await res.json();
    // Tüm yazılardaki tüm kategorileri bir diziye topla (tekil)
    let allCats = [];
    blogPosts.forEach(p => {
      if (Array.isArray(p.category)) {
        allCats = allCats.concat(p.category);
      } else if (p.category) {
        allCats.push(p.category);
      }
    });
    blogCategories = new Set(allCats);
    blogRenderFilterOptions();
    blogRenderPosts();
  } catch (e) {
    document.getElementById('postList').innerHTML =
      `<div class="alert alert-danger">Blog içerikleri yüklenemedi.</div>`;
  }
}

function blogRenderFilterOptions() {
  const filter = document.getElementById('postFilter');
  filter.innerHTML = `<option value="">All Categories</option>`;
  Array.from(blogCategories).sort().forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    filter.appendChild(opt);
  });
}

function blogRenderPosts() {
  const list = document.getElementById('postList');
  const filterValue = document.getElementById('postFilter').value;
  let filtered = blogPosts.filter(p => {
    if (Array.isArray(p.category)) {
      // Eğer çoklu kategori varsa, herhangi biri filtreyle eşleşiyorsa göster
      return !filterValue || p.category.includes(filterValue);
    } else {
      // Tek kategori ise
      return !filterValue || p.category === filterValue;
    }
  });
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  const postsToShow = filtered.slice(0, blogVisibleCount);
  list.innerHTML = postsToShow
    .map(post => {
      const categoriesText = Array.isArray(post.category)
        ? post.category.join(', ')
        : (post.category || '');
      const formattedDate = post.date
        ? new Date(post.date).toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })
        : '';
      const metaText = [categoriesText, formattedDate]
        .filter(Boolean)
        .join(' • ');
      return `
    <article class="blog-card" onclick="window.location.href='article.html?slug=${post.slug}'" tabindex="0">
      <div class="blog-card-img">
        <img src="${post.image}" alt="${post.title}" loading="lazy" />
      </div>
      <div class="blog-card-body">
        <h3>${post.title}</h3>
        <div class="blog-meta">${metaText}</div>
        <p>${post.summary}</p>
        <a class="read-blog-btn" href="article.html?slug=${post.slug}" onclick="event.stopPropagation();">Yazıyı Oku</a>
      </div>
    </article>
      `;
    })
    .join('');
  // Buton yönetimi
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (filtered.length > blogVisibleCount) {
    loadMoreBtn.style.display = '';
  } else {
    loadMoreBtn.style.display = 'none';
  }
}

// Eventler
document.addEventListener('DOMContentLoaded', () => {
  if(document.getElementById('postList')) {
    blogFetchPosts();
    document.getElementById('postFilter').addEventListener('change', function() {
      blogVisibleCount = BLOG_POSTS_PER_PAGE;
      blogRenderPosts();
    });
    document.getElementById('loadMoreBtn').addEventListener('click', function() {
      blogVisibleCount += BLOG_POSTS_PER_PAGE;
      blogRenderPosts();
    });
  }
});

function gaBlogBoardInit(){
  const isIndex = /(^\/(index\.html)?$)|(^\/tr\/(index\.html)?$)/.test(location.pathname);
  if(!isIndex) return;

  const lang = location.pathname.startsWith('/tr') ? 'tr' : 'en';
  const jsonURL = lang === 'tr' ? '/tr/posts.json' : '/posts.json';
  const state = { q: '', page: 1, per: 9, rows: [] };

  const $grid = document.getElementById('gaGrid');
  const $pager = document.getElementById('gaPager');
  const $search = document.getElementById('gaSearch');

  if(!$grid || !$pager) return;

  const normaliseRows = (arr) => arr.map((item) => {
    const baseTags = Array.isArray(item.tags) ? item.tags :
      Array.isArray(item.category) ? item.category :
      item.category ? [item.category] : [];
    return {
      ...item,
      lang: item.lang || lang,
      cover: item.cover || item.image || item.thumbnail || '',
      excerpt: item.excerpt || item.summary || item.description || '',
      tags: baseTags
    };
  });

  const applyData = (rows = []) => {
    state.rows = normaliseRows(rows).filter((entry) => entry.lang === lang);
    render();
  };

  fetch(jsonURL)
    .then((r) => r.json())
    .then(applyData)
    .catch(() => {
      state.rows = [];
      render(true);
    });

  const filteredRows = () => {
    let rows = state.rows.slice();
    if(state.q){
      const q = state.q.toLowerCase();
      rows = rows.filter((p) => {
        const titleMatch = (p.title || '').toLowerCase().includes(q);
        const excerptMatch = (p.excerpt || '').toLowerCase().includes(q);
        const tagMatch = (p.tags || []).some((t) => String(t).toLowerCase().includes(q));
        return titleMatch || excerptMatch || tagMatch;
      });
    }
    rows.sort((a, b) => new Date(b.date) - new Date(a.date));
    return rows;
  };

  function render(isError){
    const rows = filteredRows();
    const pages = Math.max(1, Math.ceil(rows.length / state.per));
    if(state.page > pages) state.page = pages;
    const start = (state.page - 1) * state.per;
    const pageRows = rows.slice(start, start + state.per);

    if(pageRows.length){
      $grid.innerHTML = pageRows.map((p) => {
        const url = (p.hreflang && p.hreflang[lang]) || `${lang === 'tr' ? '/tr' : ''}/article.html?slug=${p.slug}`;
        const cover = p.cover || '';
        const title = p.title || '';
        const excerpt = p.excerpt || '';
        const dateHuman = p.date ? new Date(p.date).toLocaleDateString(lang, { year: 'numeric', month: 'short', day: '2-digit' }) : '';
        const datetimeAttr = p.date ? ` datetime="${p.date}"` : '';
        return `
      <article class="ga-card">
        <a class="ga-thumb" href="${url}">
          <img loading="lazy" src="${cover}" alt="${title} cover">
        </a>
        <div class="ga-body">
          <h3 class="ga-h3"><a href="${url}">${title}</a></h3>
          <p class="ga-excerpt">${excerpt}</p>
        </div>
        <div class="ga-meta">
          <time${datetimeAttr}>${dateHuman}</time>
        </div>
      </article>`;
      }).join('');
    } else {
      const emptyMessage = isError
        ? (lang === 'tr' ? 'Yazılar yüklenemedi.' : 'Unable to load insights.')
        : (lang === 'tr' ? 'Aramanızla eşleşen içerik bulunamadı.' : 'No insights match your search.');
      $grid.innerHTML = `<div class="ga-empty">${emptyMessage}</div>`;
    }

    $pager.innerHTML = Array.from({ length: pages }, (_, i) => `<button class="pg${i + 1 === state.page ? ' active' : ''}" data-page="${i + 1}">${i + 1}</button>`).join('');
  }

  const debounce = (fn, ms) => { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); }; };
  if($search){
    $search.addEventListener('input', debounce((e) => {
      state.q = e.target.value;
      state.page = 1;
      render();
    }, 120));
  }

  $pager.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-page]');
    if(!btn) return;
    state.page = Number(btn.dataset.page);
    render();
  });
}

document.addEventListener('DOMContentLoaded', gaBlogBoardInit);


// ==== ARTICLE PAGE ENHANCEMENTS ====
const ARTICLE_JSON_PATH = 'posts.json';
const ARTICLE_MAX_RELATED = 6;
const ARTICLE_FALLBACK_COVER = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" role="img" aria-label="Article" preserveAspectRatio="xMidYMid slice"><rect width="1200" height="800" fill="#0f172a"/><path d="M150 640h900" stroke="#1e293b" stroke-width="40" stroke-linecap="round"/><rect x="220" y="220" width="760" height="260" fill="#1e293b" rx="32"/><text x="50%" y="48%" font-family="Montserrat, sans-serif" font-size="120" fill="#334155" text-anchor="middle">GreenAiriva</text></svg>');

const articleState = {
  posts: [],
  post: null,
  slug: ''
};

const documentLangAttr = (document.documentElement.getAttribute('lang') || '').toLowerCase();
const articleLang = documentLangAttr.startsWith('tr') ? 'tr' : 'en';
const articleLocale = articleLang === 'tr' ? 'tr-TR' : 'en-US';
const ARTICLE_I18N = {
  en: {
    homeLabel: 'Home',
    blogLabel: 'Blog',
    homePath: '/',
    blogPath: '/index.html',
    byLabel: 'By ',
    defaultAuthor: 'GreenAiriva Team',
    notFound: 'Article not found.',
    loadError: 'Unable to load article. Please try again later.',
    contentError: 'Unable to load article content at the moment.',
    pageTitleSuffix: 'GreenAiriva Blog',
    tagsLinkBase: '/?tag='
  },
  tr: {
    homeLabel: 'Anasayfa',
    blogLabel: 'Blog',
    homePath: '/tr/',
    blogPath: '/tr/index.html',
    byLabel: 'Yazar: ',
    defaultAuthor: 'GreenAiriva Ekibi',
    notFound: 'Yazı bulunamadı.',
    loadError: 'Yazı yüklenemedi. Lütfen daha sonra tekrar deneyin.',
    contentError: 'İçerik şu anda yüklenemiyor.',
    pageTitleSuffix: 'GreenAiriva Blogu',
    tagsLinkBase: '/tr/?tag='
  }
};
const articleText = ARTICLE_I18N[articleLang] || ARTICLE_I18N.en;

function prefersReducedMotion() {
  return Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

function slugifyText(text, fallback = 'section') {
  const base = String(text || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-');
  return base || fallback;
}

function getArticleSlugFromLocation() {
  const params = new URLSearchParams(window.location.search);
  const querySlug = params.get('slug');
  if (querySlug) {
    return decodeURIComponent(querySlug);
  }
  const pathMatch = window.location.pathname.match(/([^/]+?)(?:\.html)?$/);
  if (pathMatch && pathMatch[1] && pathMatch[1] !== 'article') {
    return pathMatch[1];
  }
  return '';
}

function normalizePost(raw = {}) {
  const title = String(raw.title || raw.name || '').trim() || 'Untitled';
  let slug = String(raw.slug || '').trim();
  const urlCandidate = raw.url || raw.link || raw.permalink || '';
  const pathCandidate = raw.path || raw.file || '';
  if (!slug && urlCandidate) {
    const parts = urlCandidate.split('/').filter(Boolean);
    const last = parts[parts.length - 1] || '';
    slug = last.replace(/\.[^.]+$/, '');
  }
  if (!slug && pathCandidate) {
    const parts = String(pathCandidate).split('/').filter(Boolean);
    const last = parts[parts.length - 1] || '';
    slug = last.replace(/\.[^.]+$/, '');
  }
  if (!slug) {
    slug = slugifyText(title);
  }
  slug = slug.toLowerCase();

  let content = raw.content || raw.body || '';
  const isMarkdownUrl = (value) => /\.md(\?.*)?$/i.test(value || '');
  if (!content && isMarkdownUrl(urlCandidate)) {
    content = urlCandidate;
  }
  if (!content && isMarkdownUrl(pathCandidate)) {
    content = pathCandidate;
  }

  let canonicalUrl = '';
  if (urlCandidate && !isMarkdownUrl(urlCandidate)) {
    canonicalUrl = urlCandidate;
  }
  if (!canonicalUrl) {
    canonicalUrl = `article.html?slug=${encodeURIComponent(slug)}`;
  }

  const dateSource = raw.date || raw.published_at || raw.publishedAt || raw.publish_date || raw.published || '';
  const dateObj = dateSource ? new Date(dateSource) : null;
  const dateValid = dateObj && !Number.isNaN(dateObj.getTime()) ? dateObj : null;
  const dateISO = dateValid ? dateValid.toISOString() : '';

  const abstract = raw.abstract || raw.excerpt || raw.summary || raw.description || '';
  const cover = raw.cover || raw.image || raw.thumbnail || '';

  let author = '';
  if (typeof raw.author === 'string') {
    author = raw.author;
  } else if (raw.author && typeof raw.author.name === 'string') {
    author = raw.author.name;
  } else if (Array.isArray(raw.authors) && raw.authors.length) {
    const firstAuthor = raw.authors[0];
    if (typeof firstAuthor === 'string') {
      author = firstAuthor;
    } else if (firstAuthor && typeof firstAuthor.name === 'string') {
      author = firstAuthor.name;
    }
  }

  const tagsSource = raw.tags || raw.categories || raw.labels || [];
  let tags = [];
  if (Array.isArray(tagsSource)) {
    tags = tagsSource.flatMap((tag) => {
      if (typeof tag === 'string') {
        return tag;
      }
      if (tag && typeof tag.name === 'string') {
        return tag.name;
      }
      return [];
    });
  } else if (typeof tagsSource === 'string') {
    tags = tagsSource.split(',').map((item) => item.trim()).filter(Boolean);
  }
  tags = Array.from(new Set(tags.filter(Boolean)));

  return {
    title,
    slug,
    url: canonicalUrl,
    content,
    date: dateSource || '',
    dateISO,
    dateObj: dateValid || null,
    abstract,
    cover,
    author,
    tags,
    summary: abstract || raw.summary || '',
    image: cover || raw.image || '',
    raw
  };
}

function showArticleNotFound(message) {
  const finalMessage = message || articleText.notFound;
  const sectionsToHide = [
    document.querySelector('.hero-card'),
    document.querySelector('.article-layout'),
    document.getElementById('related-posts'),
    document.getElementById('post-tags'),
    document.querySelector('.article-wrapper nav[aria-label="Breadcrumb"]')
  ];
  sectionsToHide.forEach((element) => {
    if (element) {
      element.style.display = 'none';
    }
  });
  const notFound = document.getElementById('article-notfound');
  if (notFound) {
    notFound.textContent = finalMessage;
    notFound.hidden = false;
  }
}

function hideArticleNotFound() {
  const notFound = document.getElementById('article-notfound');
  if (notFound) {
    notFound.hidden = true;
  }
  const sectionsToShow = [
    document.querySelector('.article-wrapper nav[aria-label="Breadcrumb"]'),
    document.querySelector('.hero-card'),
    document.querySelector('.article-layout'),
    document.getElementById('related-posts'),
    document.getElementById('post-tags')
  ];
  sectionsToShow.forEach((element) => {
    if (element) {
      element.style.display = '';
    }
  });
}

function absoluteUrl(path) {
  try {
    return new URL(path, window.location.origin).href;
  } catch (error) {
    return path;
  }
}

async function renderArticleContent(post) {
  const container = document.querySelector('.article-content');
  if (!container || !post) {
    return;
  }
  container.innerHTML = '';
  if (!post.content) {
    return;
  }
  try {
    const response = await fetch(post.content);
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.status}`);
    }
    const markdown = await response.text();
    if (window.marked && typeof window.marked.parse === 'function') {
      container.innerHTML = window.marked.parse(markdown);
    } else {
      container.textContent = markdown;
    }
  } catch (error) {
    console.error('Unable to load article content', error);
    container.innerHTML = `<p class="alert alert-warning">${articleText.contentError}</p>`;
  }
}

function initBreadcrumb() {
  const post = articleState.post;
  if (!post) {
    return;
  }
  const breadcrumbList = document.querySelector('.breadcrumb');
  if (!breadcrumbList) {
    return;
  }
  breadcrumbList.innerHTML = '';

  const homeUrl = absoluteUrl(articleText.homePath);
  const blogUrl = absoluteUrl(articleText.blogPath);
  const articleUrl = absoluteUrl(window.location.pathname + window.location.search);

  const crumbs = [
    { label: articleText.homeLabel, href: homeUrl },
    { label: articleText.blogLabel, href: blogUrl },
    { label: post.title, href: null }
  ];

  crumbs.forEach((crumb, index) => {
    const li = document.createElement('li');
    if (crumb.href && index !== crumbs.length - 1) {
      const anchor = document.createElement('a');
      anchor.href = crumb.href;
      anchor.textContent = crumb.label;
      li.appendChild(anchor);
    } else {
      li.textContent = crumb.label;
      li.setAttribute('aria-current', 'page');
    }
    breadcrumbList.appendChild(li);
  });

  const breadcrumbJson = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: crumb.href || articleUrl
    }))
  };
  const jsonLdElement = document.getElementById('breadcrumb-jsonld');
  if (jsonLdElement) {
    jsonLdElement.textContent = JSON.stringify(breadcrumbJson, null, 2);
  }
}

function initHero() {
  const post = articleState.post;
  if (!post) {
    return;
  }
  const heroCard = document.querySelector('.hero-card');
  if (!heroCard) {
    return;
  }

  const titleEl = heroCard.querySelector('.post-title');
  if (titleEl) {
    titleEl.textContent = post.title;
  }

  const bylineEl = heroCard.querySelector('.post-byline');
  if (bylineEl) {
    const authorName = post.author || articleText.defaultAuthor;
    const authorLabel = articleText.byLabel || '';
    const segments = [];
    if (authorName) {
      segments.push({ type: 'author', value: authorName, label: authorLabel });
    }
    if (post.dateObj) {
      const formattedDate = post.dateObj.toLocaleDateString(articleLocale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      segments.push({ type: 'date', value: formattedDate, datetime: post.dateISO });
    }

    if (segments.length === 0) {
      bylineEl.style.display = 'none';
    } else {
      bylineEl.style.display = '';
      bylineEl.innerHTML = '';
      segments.forEach((segment, index) => {
        if (segment.type === 'author') {
          if (segment.label) {
            bylineEl.append(document.createTextNode(segment.label));
          }
          const authorSpan = document.createElement('span');
          authorSpan.className = 'post-author';
          authorSpan.textContent = segment.value;
          bylineEl.appendChild(authorSpan);
        }
        if (segment.type === 'date') {
          if (index > 0) {
            bylineEl.append(document.createTextNode(' · '));
          }
          const timeEl = document.createElement('time');
          timeEl.className = 'post-date';
          if (segment.datetime) {
            timeEl.setAttribute('datetime', segment.datetime);
          }
          timeEl.textContent = segment.value;
          bylineEl.appendChild(timeEl);
        }
      });
    }
  }

  const abstractEl = heroCard.querySelector('.post-abstract');
  if (abstractEl) {
    if (post.abstract) {
      abstractEl.textContent = post.abstract;
      abstractEl.style.display = '';
    } else {
      abstractEl.style.display = 'none';
    }
  }

  const heroFigure = heroCard.querySelector('.hero-cover');
  const heroImg = document.getElementById('article-hero-img');
  if (heroImg) {
    const coverSource = post.cover || post.image || '';
    if (coverSource) {
      heroImg.src = coverSource;
      heroImg.alt = post.title || '';
      heroImg.loading = 'lazy';
      if (heroFigure) {
        heroFigure.hidden = false;
        heroFigure.style.display = '';
      }
    } else {
      heroImg.removeAttribute('src');
      heroImg.alt = '';
      if (heroFigure) {
        heroFigure.hidden = true;
      }
    }
  }

  if (post.title) {
    document.title = `${post.title} – ${articleText.pageTitleSuffix}`;
  }
}

function initToc() {
  const article = document.querySelector('.article-content');
  const tocNav = document.getElementById('js-toc');
  const tocSidebar = document.querySelector('.toc-sidebar');
  if (!article || !tocNav) {
    return;
  }

  const headings = Array.from(article.querySelectorAll('h2, h3, h4'));
  if (!headings.length) {
    tocNav.innerHTML = '';
    if (tocSidebar) {
      tocSidebar.hidden = true;
    }
    return;
  }

  if (tocSidebar) {
    tocSidebar.hidden = false;
  }

  const slugRegistry = Object.create(null);
  const getHeadingId = (heading) => {
    if (heading.id) {
      return heading.id;
    }
    const base = slugifyText(heading.textContent, 'section');
    const count = slugRegistry[base] || 0;
    slugRegistry[base] = count + 1;
    const slug = count ? `${base}-${count}` : base;
    heading.id = slug;
    return slug;
  };

  const rootList = document.createElement('ul');
  const lastItems = { 2: null, 3: null, 4: null };
  const linkRegistry = new Map();

  headings.forEach((heading) => {
    const level = Number(heading.tagName.replace('H', ''));
    const headingId = getHeadingId(heading);
    const listItem = document.createElement('li');
    listItem.classList.add(`depth-${level}`);
    const link = document.createElement('a');
    link.href = `#${headingId}`;
    link.textContent = heading.textContent.trim();
    link.dataset.headingId = headingId;
    listItem.appendChild(link);

    if (level === 2) {
      rootList.appendChild(listItem);
      lastItems[2] = listItem;
      lastItems[3] = null;
      lastItems[4] = null;
    } else if (level === 3) {
      const parent = lastItems[2];
      if (parent) {
        let childList = parent.querySelector(':scope > ul');
        if (!childList) {
          childList = document.createElement('ul');
          parent.appendChild(childList);
        }
        childList.appendChild(listItem);
      } else {
        rootList.appendChild(listItem);
      }
      lastItems[3] = listItem;
      lastItems[4] = null;
    } else if (level === 4) {
      const parent = lastItems[3] || lastItems[2];
      if (parent) {
        let childList = parent.querySelector(':scope > ul');
        if (!childList) {
          childList = document.createElement('ul');
          parent.appendChild(childList);
        }
        childList.appendChild(listItem);
      } else {
        rootList.appendChild(listItem);
      }
      lastItems[4] = listItem;
    }

    linkRegistry.set(headingId, link);
  });

  tocNav.innerHTML = '';
  tocNav.appendChild(rootList);

  const setActiveLink = (id) => {
    tocNav.querySelectorAll('a[aria-current="true"]').forEach((activeLink) => {
      if (activeLink.dataset.headingId !== id) {
        activeLink.removeAttribute('aria-current');
      }
    });
    const targetLink = linkRegistry.get(id);
    if (targetLink) {
      targetLink.setAttribute('aria-current', 'true');
    }
  };

  const updateHash = (id) => {
    if (!id || window.location.hash === `#${id}` || !history.replaceState) {
      return;
    }
    history.replaceState(null, '', `#${id}`);
  };

  const scrollToHeading = (id) => {
    const heading = document.getElementById(id);
    if (!heading) {
      return;
    }
    heading.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  };

  tocNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const id = event.currentTarget.dataset.headingId;
      if (!id) {
        return;
      }
      setActiveLink(id);
      scrollToHeading(id);
      updateHash(id);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting);
    if (!visible.length) {
      return;
    }
    visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    const topEntry = visible[0];
    const id = topEntry.target.id;
    if (id) {
      setActiveLink(id);
      updateHash(id);
    }
  }, {
    rootMargin: '-20% 0px -65% 0px',
    threshold: [0, 0.1, 0.25]
  });

  headings.forEach((heading) => observer.observe(heading));

  if (window.location.hash) {
    const hashId = decodeURIComponent(window.location.hash.replace('#', ''));
    if (hashId) {
      setTimeout(() => {
        setActiveLink(hashId);
        scrollToHeading(hashId);
      }, 100);
    }
  } else if (headings[0]) {
    setActiveLink(headings[0].id);
  }
}

function initTags() {
  const post = articleState.post;
  const container = document.getElementById('post-tags');
  if (!post || !container) {
    return;
  }
  const tags = Array.isArray(post.tags) ? post.tags.filter(Boolean) : [];
  if (!tags.length) {
    container.innerHTML = '';
    container.hidden = true;
    return;
  }
  container.hidden = false;
  const tagsBase = articleText.tagsLinkBase || '/?tag=';
  container.innerHTML = tags
    .map((tag) => `<a class="tag" href="${tagsBase}${encodeURIComponent(tag)}">#${tag}</a>`)
    .join('');
}

function compareByDateDesc(a, b) {
  const aTime = a.dateObj ? a.dateObj.getTime() : 0;
  const bTime = b.dateObj ? b.dateObj.getTime() : 0;
  return bTime - aTime;
}

function createRelatedCard(post) {
  const dateText = post.dateObj
    ? post.dateObj.toLocaleDateString(articleLocale, { year: 'numeric', month: 'short', day: 'numeric' })
    : '';
  const dateISO = post.dateISO || '';
  const cover = post.cover || ARTICLE_FALLBACK_COVER;
  const abstract = post.abstract || post.summary || '';
  return `
  <article class="post-card">
    <a href="${post.url}" class="card-link">
      <img class="card-cover" src="${cover}" alt="${post.title}" loading="lazy">
      <div class="card-body">
        <h3 class="card-title">${post.title}</h3>
        <p class="card-excerpt">${abstract}</p>
        <div class="card-meta"><time datetime="${dateISO}">${dateText}</time></div>
      </div>
    </a>
  </article>
  `;
}

function initRelated() {
  const post = articleState.post;
  const posts = articleState.posts;
  const grid = document.getElementById('related-posts-grid');
  const section = document.getElementById('related-posts');
  if (!post || !grid || !section) {
    return;
  }
  const others = posts.filter((entry) => entry.slug !== post.slug);
  if (!others.length) {
    section.style.display = 'none';
    return;
  }
  const currentTags = new Set((post.tags || []).map((tag) => tag.toLowerCase()));
  const hasTags = currentTags.size > 0;
  let related = [];
  if (hasTags) {
    related = others.filter((entry) => (entry.tags || []).some((tag) => currentTags.has(tag.toLowerCase())));
  }
  if (!related.length) {
    related = others.slice().sort(compareByDateDesc).slice(0, Math.min(3, others.length));
  } else {
    related = related.slice().sort(compareByDateDesc).slice(0, ARTICLE_MAX_RELATED);
  }
  if (!related.length) {
    section.style.display = 'none';
    return;
  }
  section.style.display = '';
  grid.innerHTML = related.map((entry) => createRelatedCard(entry)).join('');
}

async function setupArticlePage() {
  const articleContainer = document.querySelector('.article-content');
  if (!articleContainer) {
    return;
  }
  const slug = getArticleSlugFromLocation();
  articleState.slug = slug;
  if (!slug) {
    showArticleNotFound(articleText.notFound);
    return;
  }

  try {
    const response = await fetch(ARTICLE_JSON_PATH);
    if (!response.ok) {
      throw new Error(`Failed to load posts: ${response.status}`);
    }
    const rawPosts = await response.json();
    const normalizedPosts = rawPosts.map((item) => normalizePost(item));
    articleState.posts = normalizedPosts;
    const slugLower = slug.toLowerCase();
    const current = normalizedPosts.find((item) => item.slug === slugLower || (item.raw && item.raw.slug && String(item.raw.slug).toLowerCase() === slugLower));
    if (!current) {
      showArticleNotFound(articleText.notFound);
      return;
    }
    articleState.post = current;
    hideArticleNotFound();
    initBreadcrumb();
    initHero();
    await renderArticleContent(current);
    initToc();
    initTags();
    initRelated();
  } catch (error) {
    console.error('Unable to set up article page', error);
    showArticleNotFound(articleText.loadError);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.article-content')) {
    setupArticlePage();
  }
});
