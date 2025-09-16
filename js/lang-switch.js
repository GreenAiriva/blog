// js/lang-switch.js
// NOT: Bu dosya, header.html ve header_tr.html içindeki dil geçişi kurallarını 1:1 korur.

// --- Ortak slug eşleştirme ---
// EN<->TR job slug mapping (slug-eşleştirme + opsiyonel tablo)
function getSlugMapping(slug, fromLang, toLang, callback) {
  const toJson = toLang === 'tr' ? '/career/tr/jobs.json' : '/career/jobs.json';

  fetch(toJson)
    .then(res => res.json())
    .then(toJobs => {
      // Önce hedef JSON'da bire bir slug var mı bak (case-insensitive)
      const direct = toJobs.find(j => j.slug && j.slug.toLowerCase() === slug.toLowerCase());
      if (direct) { callback(direct.slug); return; }

      // Özelleştirilmiş eşleştirme tablosu (gerekirse doldurulabilir)
      const customMap = {
        en: {
          // 'en-slug': 'tr-slug'
        },
        tr: {
          // 'tr-slug': 'en-slug'
        }
      };
      const directionMap = fromLang === 'en' ? customMap.en : customMap.tr;
      const mapped = directionMap[slug];
      // Bulunamazsa mevcut slug ile devam et
      callback(mapped || slug);
    });
}

// --- Dil butonları davranışı ---
// Orijinal header.html & header_tr.html’deki path kurallarını korur.
document.addEventListener('DOMContentLoaded', function () {
  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  // TR'ye geçiş
  document.querySelectorAll('.lang-switch.tr').forEach(btn => {
    btn.addEventListener('click', function () {
      let newPath = '';

      // About (EN -> TR) veya TR'de About'ta kalma
      if (path === '/about/' || path === '/about/index.html') {
        newPath = '/about/tr/';
      } else if (path === '/about/tr/' || path === '/about/tr/index.html') {
        newPath = '/about/tr/';
      }
      // Career (EN -> TR) veya TR'de Career'da kalma
      else if (path === '/career/career.html') {
        newPath = '/career/tr/career.html';
      } else if (path === '/career/tr/career.html') {
        newPath = '/career/tr/career.html';
      }
      // Job detayındaysan (EN -> TR mapping)
      else if (path === '/career/vacancies.html' && slug) {
        getSlugMapping(slug, 'en', 'tr', function(mappedSlug) {
          if (mappedSlug) {
            window.location.href = '/career/tr/vacancies.html?slug=' + mappedSlug;
          } else {
            window.location.href = '/career/tr/career.html';
          }
        });
        return;
      }
      // Çift /tr hatalarını önle (yol segmentlerinde zaten 'tr' varsa ekleme)
      else if (path.split('/').includes('tr')) {
        newPath = path;
      }
      // Kök ya da anasayfa ise
      else if (path === '/' || path === '/index.html') {
        newPath = '/tr/';
      }
      // Diğer tüm path'lerde öne /tr ekle
      else {
        newPath = '/tr' + path;
      }

      window.location.href = newPath + window.location.search;
    });
  });

  // EN'ye geçiş
  document.querySelectorAll('.lang-switch.en').forEach(btn => {
    btn.addEventListener('click', function () {
      // Varsayılan: /tr önekini çıkar
      let newPath = path.replace(/^\/tr/, '');

      // About (TR -> EN)
      if (path === '/about/tr/' || path === '/about/tr/index.html') {
        newPath = '/about/';
      }
      // Career (TR -> EN)
      else if (path === '/career/tr/career.html') {
        newPath = '/career/career.html';
      }
      // Job detayındaysan (TR -> EN mapping)
      else if (path === '/career/tr/vacancies.html' && slug) {
        getSlugMapping(slug, 'tr', 'en', function(mappedSlug) {
          if (mappedSlug) {
            window.location.href = '/career/vacancies.html?slug=' + mappedSlug;
          } else {
            window.location.href = '/career/career.html';
          }
        });
        return;
      }
      // Kökte ya da index'te normalize et
      else if (newPath === '' || newPath === '/' || newPath === '/index.html') {
        newPath = '/';
      }

      window.location.href = newPath + window.location.search;
    });
  });
});
