/* 栏目切换 + 分面板筛选：渐进增强，无 JS 时三个栏目依次堆叠、所有条目依然可读 */
(function () {
  'use strict';

  /* 每个面板各自的筛选白名单，互不串扰 */
  var FILTER_DIRS = {
    semi: ['all', 'design', 'mfg', 'packaging', 'equipment'],
    economy: ['all', 'domestic', 'overseas']
  };

  /* ---------- 筛选（限定在所属面板内） ---------- */
  function apply(paneName, dir) {
    var pane = document.querySelector('.pane[data-pane="' + paneName + '"]');
    if (!pane) return;
    var allowed = FILTER_DIRS[paneName] || ['all'];
    if (allowed.indexOf(dir) < 0) dir = 'all';
    pane.querySelectorAll('.card[data-dir]').forEach(function (card) {
      card.hidden = dir !== 'all' && card.getAttribute('data-dir') !== dir;
    });
    pane.querySelectorAll('.filter').forEach(function (btn) {
      var on = btn.getAttribute('data-dir') === dir;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function dirFromUrl(paneName) {
    var v = new URLSearchParams(window.location.search).get('dir');
    var allowed = FILTER_DIRS[paneName] || ['all'];
    return allowed.indexOf(v) >= 0 ? v : 'all';
  }

  document.querySelectorAll('.filter').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pane = btn.closest('.pane');
      var paneName = pane ? pane.getAttribute('data-pane') : 'semi';
      var dir = btn.getAttribute('data-dir') || 'all';
      apply(paneName, dir);
      try {
        var url = new URL(window.location.href);
        if (dir === 'all') { url.searchParams.delete('dir'); }
        else { url.searchParams.set('dir', dir); }
        window.history.replaceState(null, '', url.pathname + url.search + url.hash);
      } catch (e) { /* 忽略不支持 History API 的环境 */ }
    });
  });

  /* ---------- 栏目切换：半导体日报 / 经济日报 / 历史上的今天 ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab[data-pane-target]'));
  var panes = Array.prototype.slice.call(document.querySelectorAll('.pane[data-pane]'));
  if (!tabs.length || !panes.length) return;

  function valid(name) { return name === 'semi' || name === 'economy' || name === 'history'; }

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
    apply(name, dirFromUrl(name));
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

  /* 初始化：各面板先各自套用筛选，再按 URL 选中栏目 */
  ['semi', 'economy'].forEach(function (p) { apply(p, dirFromUrl(p)); });
  select(fromUrl(), false);
})();
