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
  const jsonURL = lang==='tr' ? '/tr/posts.json' : '/posts.json';
  const state = { q:'', tag:null, page:1, per:9, rows:[] };

  const $grid = document.getElementById('gaGrid');
  const $pager = document.getElementById('gaPager');
  const $tagBar = document.getElementById('gaTagBar');
  const $search = document.getElementById('gaSearch');

  if(!$grid || !$pager || !$tagBar) return;

  const GA_TAGS_FALLBACK = [
    'greenairiva','urban-air','air-quality','methane','nitrous-oxide',
    'device','prototype','adsorbent','solar','field-test','policy','r-and-d'
  ];

  const icons = {
    eye:`<svg viewBox="0 0 24 24" fill="none"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/></svg>`,
    cmt:`<svg viewBox="0 0 24 24" fill="none"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
    like:`<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.35-9-8c-2-3.65 1-8 5-8 3 0 4 2 4 2s1-2 4-2c4 0 7 4.35 5 8-2 3.65-9 8-9 8Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  };

  const brandifyTag = (value) => {
    const base = String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return base ? `greenairiva-${base}` : 'greenairiva';
  };

  const normaliseRows = (arr) => arr.map((item) => {
    const baseTags = Array.isArray(item.tags) ? item.tags :
      Array.isArray(item.category) ? item.category :
      item.category ? [item.category] : [];
    const slugDerived = (item.slug || '')
      .split(/[^a-z0-9]+/i)
      .filter(Boolean)
      .slice(0, 3);
    const tagsSource = baseTags.length ? baseTags : slugDerived;
    const tags = tagsSource.length ? tagsSource.map(brandifyTag) : ['greenairiva'];
    const uniqueTags = [...new Set(tags)];
    const minutesCandidate = parseInt(item.readingMinutes || item.reading_minutes || item.reading || item.minutes, 10);
    return {
      ...item,
      lang: item.lang || lang,
      cover: item.cover || item.image || item.thumbnail || '',
      excerpt: item.excerpt || item.summary || item.description || '',
      tags: uniqueTags,
      readingMinutes: Number.isFinite(minutesCandidate) && minutesCandidate > 0 ? minutesCandidate : 5
    };
  });

  const applyData = (rows = []) => {
    state.rows = normaliseRows(rows).filter((entry) => entry.lang === lang);
    buildTags();
    render();
  };

  fetch(jsonURL)
    .then((r) => r.json())
    .then(applyData)
    .catch(() => {
      state.rows = [];
      buildTags();
      render(true);
    });

  function buildTags(){
    const fromData = [...new Set(state.rows.flatMap((p) => p.tags || []))];
    const tags = (fromData.length ? fromData : GA_TAGS_FALLBACK).slice(0, 12);
    $tagBar.innerHTML = tags.map((t) => `<button class="ga-pill${state.tag===t ? ' active' : ''}" data-tag="${t}">#${t}</button>`).join('');
  }

  function render(isError){
    let rows = state.rows.slice();
    if(state.q){
      const q = state.q.toLowerCase();
      rows = rows.filter((p) =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.excerpt || '').toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    if(state.tag) rows = rows.filter((p) => (p.tags || []).includes(state.tag));
    rows.sort((a, b) => new Date(b.date) - new Date(a.date));

    const pages = Math.max(1, Math.ceil(rows.length / state.per));
    if(state.page > pages) state.page = pages;
    const start = (state.page - 1) * state.per;
    const pageRows = rows.slice(start, start + state.per);

    if(pageRows.length){
      $grid.innerHTML = pageRows.map((p) => {
        const url = (p.hreflang && p.hreflang[lang]) || `${lang==='tr'?'/tr':''}/article.html?slug=${p.slug}`;
        const cover = p.cover || '';
        const title = p.title || '';
        const excerpt = p.excerpt || '';
        const dateHuman = p.date ? new Date(p.date).toLocaleDateString(lang, {year:'numeric', month:'short', day:'2-digit'}) : '';
        const firstTag = (p.tags && p.tags[0]) ? `#${p.tags[0]}` : '#greenairiva';
        const datetimeAttr = p.date ? ` datetime="${p.date}"` : '';
        const minutesText = `${p.readingMinutes || 5} ${lang==='tr' ? 'dk' : 'min'}`;
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
          <div class="ga-meta-left">
            <span class="ga-badge">${firstTag}</span>
            <span class="ga-dot"></span>
            <time${datetimeAttr}>${dateHuman}</time>
            <span class="ga-sep">·</span>
            <span class="ga-read">${minutesText}</span>
          </div>
          <div class="ga-meta-right">
            <span class="ga-stat">${icons.eye}<b>0</b></span>
            <span class="ga-stat">${icons.cmt}<b>0</b></span>
            <span class="ga-stat">${icons.like}<b>0</b></span>
          </div>
        </div>
      </article>`;
      }).join('');
    } else {
      const emptyMessage = isError
        ? (lang==='tr' ? 'Yazılar yüklenemedi.' : 'Unable to load insights.')
        : (lang==='tr' ? 'Seçilen filtrelerle eşleşen yazı yok.' : 'No insights match your filters.');
      $grid.innerHTML = `<div class="ga-empty">${emptyMessage}</div>`;
    }

    $pager.innerHTML = Array.from({length: pages}, (_, i) => `<button class="pg${i + 1 === state.page ? ' active' : ''}" data-page="${i + 1}">${i + 1}</button>`).join('');
  }

  document.addEventListener('click', (e) => {
    const tag = e.target?.dataset?.tag;
    const pg = e.target?.dataset?.page;
    if(tag){
      state.tag = (state.tag === tag ? null : tag);
      state.page = 1;
      buildTags();
      render();
    }
    if(pg){
      state.page = Number(pg);
      render();
    }
  });

  const debounce = (fn, ms) => { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); }; };
  if($search){
    $search.addEventListener('input', debounce((e) => {
      state.q = e.target.value;
      state.page = 1;
      render();
    }, 120));
  }
}
document.addEventListener('DOMContentLoaded', gaBlogBoardInit);

