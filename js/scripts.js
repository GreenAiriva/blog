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
// === Blog Listesinde "Daha Fazla İçerik" ve Filtreleme ===
document.addEventListener('DOMContentLoaded', function () {
  // Daha fazla içerik fonksiyonu
  let postCount = 6;
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const postList = document.getElementById('postList');
  if (loadMoreBtn && postList) {
    loadMoreBtn.addEventListener('click', function () {
      for (let i = 1; i <= 3; i++) {
        postCount++;
        const bg = (postCount % 2 === 1) ? 'bg-light' : 'bg-secondary text-white';
        const post = document.createElement('div');
        post.className = `row mb-4 post-item ${bg} p-3 rounded align-items-center`;
        post.innerHTML = `
          <div class="col-md-3">
            <a href="/blog/assays/assays_tr/assay${postCount}/index.html">
              <img src="assets/img/blog${postCount}.jpg" class="img-fluid rounded" alt="Post ${postCount} Görseli">
            </a>
          </div>
          <div class="col-md-9">
            <a href="/blog/assays/assays_tr/assay${postCount}/index.html" class="text-decoration-none ${bg.includes('secondary') ? 'text-white' : 'text-dark'}">
              <h4>Assay ${postCount} Başlık</h4>
              <p>Kısa özet veya giriş cümlesi burada olacak.</p>
              <small>Kategori ${((postCount - 1) % 2) + 1} - 2025</small>
            </a>
          </div>
        `;
        postList.appendChild(post);
      }
    });
  }

  // Filtreleme fonksiyonu (kategoriye göre)
  const postFilter = document.getElementById('postFilter');
  if (postFilter && postList) {
    postFilter.addEventListener('change', function () {
      const selected = this.value;
      document.querySelectorAll('#postList .post-item').forEach(post => {
        if (!selected || post.innerHTML.includes(selected)) {
          post.style.display = '';
        } else {
          post.style.display = 'none';
        }
      });
    });
  }
});
