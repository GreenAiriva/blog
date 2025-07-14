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
const BLOG_JSON_PATH = 'posts.json';

let blogPosts = [];
let blogCategories = new Set();

async function blogFetchPosts() {
  try {
    const res = await fetch(BLOG_JSON_PATH);
    blogPosts = await res.json();

    // Kategorileri bul
    blogCategories = new Set(blogPosts.map(p => p.category));
    blogRenderFilterOptions();
    blogRenderPosts();
  } catch (e) {
    document.getElementById('postList').innerHTML = `<div class="alert alert-danger">Blog içerikleri yüklenemedi.</div>`;
  }
}

function blogRenderFilterOptions() {
  const filter = document.getElementById('postFilter');
  // Mevcut seçenekleri sil, sadece "Tümü" kalsın
  filter.innerHTML = `<option value="">Tümü</option>`;
  Array.from(blogCategories).sort().forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat.replace(/^kategori/i, "Kategori ");
    filter.appendChild(opt);
  });
}

function blogRenderPosts() {
  const list = document.getElementById('postList');
  const filterValue = document.getElementById('postFilter').value;
  let filtered = blogPosts.filter(p => !filterValue || p.category === filterValue);
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  list.innerHTML = filtered.map((post, idx) => `
    <div class="row mb-4 post-item ${(idx % 2 === 0) ? 'bg-light' : 'bg-secondary text-white'} p-3 rounded align-items-center">
      <div class="col-md-3">
        <a href="${post.url}">
          <img src="${post.image}" class="img-fluid rounded" alt="${post.title} Görseli">
        </a>
      </div>
      <div class="col-md-9">
        <a href="${post.url}" class="text-decoration-none ${((idx % 2) ? 'text-white' : 'text-dark')}">
          <h4>${post.title}</h4>
          <p>${post.summary}</p>
          <small>${post.category.replace(/^kategori/i, "Kategori ")} - ${new Date(post.date).toLocaleDateString('tr-TR', {day: '2-digit', month: 'long', year: 'numeric'})}</small>
        </a>
      </div>
    </div>
  `).join('');
  // loadMoreBtn gizle
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) loadMoreBtn.style.display = 'none';
}

// Eventler:
document.addEventListener('DOMContentLoaded', () => {
  // Ana sayfa blog alanı varsa başlat
  if(document.getElementById('postList')) {
    blogFetchPosts();
    document.getElementById('postFilter').addEventListener('change', function() {
      blogRenderPosts();
    });
  }
});
