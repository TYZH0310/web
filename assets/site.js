/* 四方向筛选：渐进增强，无 JS 时所有条目依然可见可读 */
(function () {
  'use strict';

  function apply(dir) {
    document.querySelectorAll('.card[data-dir]').forEach(function (card) {
      card.hidden = dir !== 'all' && card.getAttribute('data-dir') !== dir;
    });
    document.querySelectorAll('.filter').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-dir') === dir);
      btn.setAttribute('aria-pressed', btn.getAttribute('data-dir') === dir ? 'true' : 'false');
    });
  }

  function currentDir() {
    var v = new URLSearchParams(window.location.search).get('dir');
    return ['all', 'design', 'mfg', 'packaging', 'equipment'].indexOf(v) >= 0 ? v : 'all';
  }

  document.querySelectorAll('.filter').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dir = btn.getAttribute('data-dir') || 'all';
      apply(dir);
      try {
        var url = new URL(window.location.href);
        if (dir === 'all') { url.searchParams.delete('dir'); }
        else { url.searchParams.set('dir', dir); }
        window.history.replaceState(null, '', url.pathname + url.search + url.hash);
      } catch (e) { /* 忽略不支持 History API 的环境 */ }
    });
  });

  apply(currentDir());
})();
