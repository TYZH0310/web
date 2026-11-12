/* 栏目切换 + 四方向筛选：渐进增强，无 JS 时两个栏目依次堆叠、所有条目依然可读 */
(function () {
  'use strict';

  /* ---------- 四方向筛选（半导体面板内） ---------- */
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

  /* ---------- 栏目切换：半导体日报 / 历史上的今天 ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab[data-pane-target]'));
  var panes = Array.prototype.slice.call(document.querySelectorAll('.pane[data-pane]'));
  if (!tabs.length || !panes.length) return;

  function valid(name) { return name === 'semi' || name === 'history'; }

  function fromUrl() {
    var v = new URLSearchParams(window.location.search).get('tab');
    return valid(v) ? v : 'semi';
  }

  function select(name, push) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-pane-target') === name;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    panes.forEach(function (p) {
      p.hidden = p.getAttribute('data-pane') !== name;
    });
    if (push) {
      try {
        var url = new URL(window.location.href);
        if (name === 'semi') { url.searchParams.delete('tab'); }
        else { url.searchParams.set('tab', name); }
        window.history.replaceState(null, '', url.pathname + url.search + url.hash);
      } catch (e) { /* 忽略不支持 History API 的环境 */ }
    }
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      select(t.getAttribute('data-pane-target'), true);
    });
  });

  window.addEventListener('popstate', function () {
    select(fromUrl(), false);
  });

  select(fromUrl(), false);
})();
