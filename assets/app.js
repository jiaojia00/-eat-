(function () {
  'use strict';

  const DISHES = window.CHILEME_DISHES || [];
  const DISH_BY_ID = new Map(DISHES.map((d) => [d.id, d]));
  const APP_VERSION = '1.0.0';

  const CATEGORIES = [
    { id: 'all', label: '全部' },
    { id: 'meat', label: '荤菜' },
    { id: 'veg', label: '素菜' },
    { id: 'soup', label: '汤羹' },
    { id: 'staple', label: '主食' }
  ];
  const CATEGORY_LABEL = { meat: '荤菜', veg: '素菜', soup: '汤羹', staple: '主食' };
  const TASTES = [
    { id: '不限', emoji: '✨', hint: '都行' },
    { id: '清淡', emoji: '🌿', hint: '少油少辣' },
    { id: '香辣', emoji: '🌶️', hint: '下饭带劲' },
    { id: '酸甜', emoji: '🍋', hint: '开胃解腻' },
    { id: '家常', emoji: '🏠', hint: '熟悉的味道' }
  ];
  const AVOID_OPTIONS = ['不吃辣', '不吃海鲜', '不吃牛肉', '不吃猪肉', '不吃香菜', '不吃花生'];
  const ING_ORDER = ['主料', '配料', '香料', '调料', '其他'];

  const DEFAULT_SETTINGS = { taste: '不限', dishes: 3, people: 2, avoid: [] };
  const KEYS = {
    settings: 'chileme.settings.v1',
    favorites: 'chileme.favorites.v1',
    menu: 'chileme.menu.v1',
    checked: 'chileme.shopping.v1'
  };

  const ICONS = {
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 1.8"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4 4"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    shuffle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3h4v4"/><path d="M3 7h3.5c2 0 3.2 1 4.3 2.7l.4.6c1.1 1.7 2.3 2.7 4.3 2.7H21"/><path d="M17 21h4v-4"/><path d="M3 17h3.5c2 0 3.2-1 4.3-2.7l.4-.6C12.3 12 13.5 11 15.5 11H21"/></svg>',
    basket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h16l-1.5 9.2a2 2 0 0 1-2 1.8H7.5a2 2 0 0 1-2-1.8L4 9Z"/><path d="M8 9 12 3l4 6"/><path d="M9.5 13v3M14.5 13v3"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m4 10 8-6 8 6v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19v-9Z"/><path d="M9.5 20.5v-6h5v6"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z"/><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20"/><path d="M8 7h8M8 10.5h5"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c.8-3.6 3.8-5.5 7.5-5.5s6.7 1.9 7.5 5.5"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5c.6 4.8 2.7 6.9 7.5 7.5-4.8.6-6.9 2.7-7.5 7.5-.6-4.8-2.7-6.9-7.5-7.5 4.8-.6 6.9-2.7 7.5-7.5Z"/></svg>',
    flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c3.6 0 6-2.4 6-5.7 0-2.3-1.2-4.1-2.8-5.8-1.1 1.1-1.7 1.8-1.9 3.1-.1.8-.6 1.3-1.2 1.3-.5 0-.9-.4-.9-1 0-2.5 1.1-4.6 2.5-6.4C10.5 6.9 6 10.2 6 15.3 6 18.6 8.4 21 12 21Z"/></svg>'
  };

  function logoMark(size) {
    const px = size || 30;
    return '<svg class="logo-mark" width="' + px + '" height="' + px + '" viewBox="0 0 40 40" aria-hidden="true">' +
      '<circle cx="20" cy="20" r="20" fill="#2F3E32"/>' +
      '<path d="M10.2 21.5h19.6c0 5.4-4.1 9.2-9.8 9.2s-9.8-3.8-9.8-9.2Z" fill="#F6E7C8"/>' +
      '<path d="M13 21.5c0-4.1 3.1-7.2 7-7.2s7 3.1 7 7.2" fill="#FFF8EA"/>' +
      '<path d="M16 9.5c-1.1 1.8.9 2.7 0 4.6M20 7.8c-1.1 1.8.9 2.7 0 4.6M24 9.5c-1.1 1.8.9 2.7 0 4.6" fill="none" stroke="#F6E7C8" stroke-width="1.3" stroke-linecap="round"/>' +
      '<path d="M27.3 14.2 31.8 9.7" stroke="#D9A25A" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M29.1 16.4 34 13" stroke="#D9A25A" stroke-width="1.5" stroke-linecap="round"/>' +
      '</svg>';
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function escapeAttr(s) { return escapeHtml(s); }
  function escapeRegExp(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function safeRead(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function safeWrite(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage may be unavailable */ }
  }

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function normalizeSettings(raw) {
    const src = raw && typeof raw === 'object' ? raw : {};
    const taste = TASTES.some((t) => t.id === src.taste) ? src.taste : DEFAULT_SETTINGS.taste;
    const dishes = clamp(Math.round(Number(src.dishes) || DEFAULT_SETTINGS.dishes), 1, 5);
    const people = clamp(Math.round(Number(src.people) || DEFAULT_SETTINGS.people), 1, 8);
    const avoid = Array.isArray(src.avoid) ? src.avoid.filter((a) => AVOID_OPTIONS.includes(a)) : [];
    return { taste, dishes, people, avoid };
  }

  function dateKey(d) {
    const x = d || new Date();
    return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
  }
  function dateLabel(d) {
    const x = d || new Date();
    return { md: (x.getMonth() + 1) + '月' + x.getDate() + '日', week: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][x.getDay()] };
  }
  function greeting() {
    const h = new Date().getHours();
    if (h < 5) return '夜深了';
    if (h < 11) return '早上好';
    if (h < 14) return '中午好';
    if (h < 18) return '下午好';
    return '晚上好';
  }
  function menuLabel(n) {
    return ['零', '一', '两', '三', '四', '五'][n] + '菜一汤';
  }
  function formatTime(min) {
    const n = Math.max(1, Math.round(Number(min) || 1));
    if (n < 60) return n + ' 分钟';
    const h = Math.floor(n / 60);
    const m = n % 60;
    return h + ' 小时' + (m ? ' ' + m + ' 分' : '');
  }
  function formatNumber(n) {
    if (!isFinite(n)) return '';
    const rounded = Math.round(n * 10) / 10;
    return String(rounded).replace(/\.0$/, '');
  }
  function formatAmount(q, unit) {
    if (q == null || q === '') return '适量';
    let val = Number(q);
    if (!isFinite(val)) return '适量';
    if (unit === 'g' || unit === 'ml') {
      if (val >= 100) val = Math.round(val / 5) * 5;
      else if (val >= 10) val = Math.round(val);
      else val = Math.round(val * 2) / 2;
    } else if (unit === '个' || unit === '根') {
      val = Math.round(val * 10) / 10;
    } else {
      val = Math.round(val * 2) / 2;
    }
    return formatNumber(val) + ' ' + unit;
  }
  function scaledAmount(q, unit, scale) {
    if (q == null) return '适量';
    return formatAmount(Number(q) * scale, unit);
  }

  function hashString(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  DISHES.forEach((d) => {
    const first = d.variants[0];
    d._primary = first && first.ingredients[0] ? first.ingredients[0].n : d.name;
    d._search = [d.name, d.aliases || [], d.tastes || [], d.intro, d.category,
      ...d.variants.map((v) => [v.name, v.tag, v.desc, ...v.ingredients.map((i) => i.n)].join(' '))].join(' ').toLowerCase();
    d._allText = [d.name, ...(d.aliases || []), ...d.variants.flatMap((v) => v.ingredients.map((i) => i.n))].join(' ');
  });

  function isBlocked(dish, avoid) {
    if (!avoid || !avoid.length) return false;
    const tastes = dish.tastes || [];
    const text = dish._allText || dish.name;
    if (avoid.includes('不吃辣') && tastes.some((t) => t === '香辣' || t === '微辣')) return true;
    if (avoid.includes('不吃海鲜') && /(虾|鱼|鲈|紫菜|虾皮|蛤蜊|鱿鱼|海鲜)/.test(text)) return true;
    if (avoid.includes('不吃牛肉') && /(牛腩|牛肉)/.test(text)) return true;
    if (avoid.includes('不吃猪肉') && /(猪肉|五花肉|猪肋排|排骨|猪里脊|猪油|火腿)/.test(text)) return true;
    if (avoid.includes('不吃香菜') && /香菜/.test(text)) return true;
    if (avoid.includes('不吃花生') && /花生/.test(text)) return true;
    return false;
  }
  function tasteMatch(dish, taste) {
    return taste === '不限' || (dish.tastes || []).includes(taste);
  }

  function pickFrom(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }

  function composeMenu(options, seed, previous) {
    const rng = mulberry32(hashString(dateKey() + '|' + JSON.stringify(options) + '|' + seed));
    const prevIds = new Set(previous ? [...(previous.dishes || []), previous.soup] : []);
    const pool = DISHES.filter((d) => (d.category === 'meat' || d.category === 'veg') && !isBlocked(d, options.avoid));
    const n = options.dishes;
    const meatTarget = n <= 2 ? 1 : Math.ceil(n / 2);
    const vegTarget = n - meatTarget;
    const gaps = [];
    for (let i = 0; i < meatTarget; i++) gaps.push('meat');
    for (let i = 0; i < vegTarget; i++) gaps.push('veg');

    const picks = [];
    gaps.forEach((cat) => {
      let candidates = pool.filter((d) => !picks.includes(d) && d.category === cat);
      if (!candidates.length) candidates = pool.filter((d) => !picks.includes(d));
      if (!candidates.length) return;
      const preferred = candidates.filter((d) => tasteMatch(d, options.taste));
      let from = preferred.length ? preferred : candidates;
      const fresh = from.filter((d) => !prevIds.has(d.id));
      if (fresh.length) from = fresh;
      const unique = from.filter((d) => !picks.some((p) => p._primary === d._primary));
      if (unique.length) from = unique;
      picks.push(pickFrom(from, rng));
    });

    if (picks.length < n) {
      const rest = pool.filter((d) => !picks.includes(d));
      while (picks.length < n && rest.length) picks.push(rest.splice(Math.floor(rng() * rest.length), 1)[0]);
    }

    const soupPool = DISHES.filter((d) => d.category === 'soup' && !isBlocked(d, options.avoid));
    let soupCandidates = soupPool.filter((d) => tasteMatch(d, options.taste));
    if (!soupCandidates.length) soupCandidates = soupPool;
    let freshSoup = soupCandidates.filter((d) => !prevIds.has(d.id));
    if (freshSoup.length) soupCandidates = freshSoup;
    const soup = soupCandidates.length ? pickFrom(soupCandidates, rng) : DISH_BY_ID.get('fanqiedanhuatang');

    return {
      date: dateKey(),
      seed: seed,
      options: { ...options, avoid: [...options.avoid] },
      dishes: picks.map((d) => d.id),
      soup: soup.id,
      sig: picks.map((d) => d.id).sort().join(',') + '|' + soup.id,
      createdAt: Date.now()
    };
  }

  function buildMenu(options, seed, previous) {
    const opts = normalizeSettings(options);
    let result = composeMenu(opts, seed, previous);
    if (previous) {
      for (let i = 1; i < 18; i++) {
        if (result.sig !== previous.sig) break;
        result = composeMenu(opts, seed + i, previous);
      }
    }
    return result;
  }

  function getMenuDishes(menu) {
    return (menu.dishes || []).map((id) => DISH_BY_ID.get(id)).filter(Boolean);
  }
  function getMenuSoup(menu) { return DISH_BY_ID.get(menu.soup); }
  function menuDishTime(d) { const v = d.variants[0]; return v ? v.time : 0; }
  function menuTotalTime(menu) {
    const times = getMenuDishes(menu).map(menuDishTime).concat(getMenuSoup(menu) ? [menuDishTime(getMenuSoup(menu))] : []);
    return times.length ? Math.max(...times) + 10 : 30;
  }

  const storeSettings = normalizeSettings(safeRead(KEYS.settings, DEFAULT_SETTINGS));
  let settings = storeSettings;
  let favorites = Array.isArray(safeRead(KEYS.favorites, [])) ? safeRead(KEYS.favorites, []).filter((id) => DISH_BY_ID.has(id)) : [];
  let currentMenu = null;
  let shoppingChecked = safeRead(KEYS.checked, {}) || {};

  function persistFavorites() { safeWrite(KEYS.favorites, favorites); }
  function persistSettings() { safeWrite(KEYS.settings, settings); }
  function persistMenu() { if (currentMenu) safeWrite(KEYS.menu, currentMenu); }

  function isFavorite(id) { return favorites.includes(id); }

  function ensureMenu() {
    const stored = safeRead(KEYS.menu, null);
    if (stored && stored.date === dateKey() && Array.isArray(stored.dishes) &&
      stored.dishes.length && DISH_BY_ID.has(stored.soup) && stored.dishes.every((id) => DISH_BY_ID.has(id))) {
      currentMenu = {
        ...stored,
        options: normalizeSettings(stored.options),
        seed: Number(stored.seed) || 0
      };
      return;
    }
    currentMenu = buildMenu(settings, 0, null);
    persistMenu();
  }

  function toggleFavorite(id) {
    if (!DISH_BY_ID.has(id)) return;
    if (favorites.includes(id)) favorites = favorites.filter((x) => x !== id);
    else favorites = favorites.concat(id);
    persistFavorites();
    document.querySelectorAll('[data-fav="' + id + '"]').forEach((btn) => {
      const active = isFavorite(id);
      btn.classList.toggle('is-fav', active);
      btn.setAttribute('aria-pressed', String(active));
      btn.setAttribute('aria-label', (active ? '取消收藏' : '收藏') + DISH_BY_ID.get(id).name);
    });
    if (sheetType === 'settings') refreshFavoritesSection();
  }

  function tasteChipsHtml(selected, attrName) {
    return TASTES.map((t) => {
      const on = selected === t.id;
      return '<button type="button" class="choice-chip ' + (on ? 'is-active' : '') + '" ' + attrName + '="' + escapeAttr(t.id) + '" aria-pressed="' + on + '">' +
        '<span class="chip-emoji">' + t.emoji + '</span><span>' + t.id + '</span></button>';
    }).join('');
  }
  function avoidChipsHtml(selected, attrName) {
    return AVOID_OPTIONS.map((a) => {
      const on = selected.includes(a);
      return '<button type="button" class="avoid-chip ' + (on ? 'is-active' : '') + '" ' + attrName + '="' + escapeAttr(a) + '" aria-pressed="' + on + '">' +
        '<span class="avoid-check">' + (on ? ICONS.check : '+') + '</span>' + escapeHtml(a) + '</button>';
    }).join('');
  }

  function tabbar(active) {
    const items = [
      { id: 'home', href: '#/home', label: '今日', icon: ICONS.home },
      { id: 'recipes', href: '#/recipes', label: '菜谱', icon: ICONS.book },
      { id: 'settings', href: '#/settings', label: '我的', icon: ICONS.user }
    ];
    return '<nav class="tabbar" aria-label="主导航">' + items.map((it) =>
      '<a class="tab ' + (active === it.id ? 'is-active' : '') + '" href="' + it.href + '" ' + (active === it.id ? 'aria-current="page"' : '') + '>' +
      '<span class="tab-icon">' + it.icon + '</span><span class="tab-label">' + it.label + '</span></a>'
    ).join('') + '</nav>';
  }

  function favoriteButton(id, extraClass) {
    const active = isFavorite(id);
    return '<button type="button" class="fav-btn ' + (extraClass || '') + (active ? ' is-fav' : '') + '" data-fav="' + escapeAttr(id) + '" aria-pressed="' + active + '" aria-label="' + (active ? '取消收藏' : '收藏') + escapeAttr(DISH_BY_ID.get(id).name) + '">' + ICONS.heart + '</button>';
  }

  function tasteLine() {
    const taste = currentMenu.options.taste;
    const lines = {
      '不限': ['今天，吃点好的。', '好好吃饭，最重要。', '一桌热饭，小确幸。'],
      '清淡': ['今天，清爽一点。', '清淡一点，也很鲜美。'],
      '香辣': ['今天，来点带劲的。', '一口香辣，赶走疲惫。'],
      '酸甜': ['今天，酸甜开胃。', '酸酸甜甜，唤醒胃口。'],
      '家常': ['今天，家常最抚胃。', '熟悉的香味，像回家。']
    };
    const arr = lines[taste] || lines['不限'];
    return arr[new Date().getDate() % arr.length];
  }

  function highlight(text, query) {
    const safe = escapeHtml(text);
    const terms = String(query || '').trim().split(/\s+/).filter(Boolean);
    if (!terms.length) return safe;
    try {
      const re = new RegExp('(' + terms.map(escapeRegExp).join('|') + ')', 'gi');
      return safe.replace(re, '<mark>$1</mark>');
    } catch (e) { return safe; }
  }

  function renderHomePage() {
    const menu = currentMenu;
    const dishes = getMenuDishes(menu);
    const soup = getMenuSoup(menu);
    const opts = menu.options;
    const today = dateLabel();
    const total = menuTotalTime(menu);
    const shopCount = buildShoppingItems(menu).length;
    const rows = dishes.map((d, i) => dishRowHtml(d, i, false)).join('');
    const soupRow = soup ? dishRowHtml(soup, 0, true) : '';

    app.innerHTML = '<div class="page page-home">' +
      '<header class="topline">' +
        '<a class="brand" href="#/home" aria-label="吃了么首页">' + logoMark(30) + '<span class="brand-word">吃了么</span></a>' +
        '<span class="topline-date">' + today.md + ' · ' + today.week + '</span>' +
      '</header>' +
      '<section class="home-intro">' +
        '<p class="eyebrow"><span class="eyebrow-dot"></span>' + greeting() + '，今天也好好吃饭</p>' +
        '<h1>' + escapeHtml(tasteLine()) + '</h1>' +
        '<p class="intro-sub">按你的口味，配好了' + menuLabel(opts.dishes) + '，' + opts.people + ' 人份。</p>' +
      '</section>' +
      '<div class="pref-row">' +
        '<button type="button" class="pref-chip" data-action="options"><span>' + tasteEmoji(opts.taste) + '</span>' + escapeHtml(opts.taste) + '</button>' +
        '<button type="button" class="pref-chip" data-action="options"><span>🍽️</span>' + opts.dishes + ' 道菜</button>' +
        '<button type="button" class="pref-chip" data-action="options"><span>👥</span>' + opts.people + ' 人</button>' +
        (opts.avoid.length ? '<button type="button" class="pref-chip pref-chip-warn" data-action="options"><span>!</span>忌口 ' + opts.avoid.length + '</button>' : '') +
        '<button type="button" class="pref-adjust" data-action="options">调整 <span class="tiny-chevron">' + ICONS.chevron + '</span></button>' +
      '</div>' +
      '<section class="menu-hero" aria-labelledby="menuTitle">' +
        '<div class="hero-top">' +
          '<div><p class="hero-kicker">今日推荐 · ' + opts.dishes + ' 菜 + 汤</p><h2 id="menuTitle">' + menuLabel(opts.dishes) + '</h2></div>' +
          '<button type="button" class="shuffle-btn" data-action="shuffle">' + ICONS.shuffle + '<span>换一桌</span></button>' +
        '</div>' +
        '<p class="hero-sub">' + escapeHtml(opts.taste) + '口味 · ' + opts.people + ' 人 · 固定配一道汤</p>' +
        '<div class="dish-stack">' + rows +
          (soupRow ? '<div class="soup-divider"><span>汤</span><i></i><small>今天也要喝汤</small></div>' + soupRow : '') +
        '</div>' +
        '<div class="hero-foot"><span>' + ICONS.clock + '约 ' + formatTime(total) + '</span><span>先炖汤 · 再备菜 · 最后快炒</span></div>' +
      '</section>' +
      '<button type="button" class="shop-cta" data-action="shopping">' +
        '<span class="shop-cta-icon">' + ICONS.basket + '</span>' +
        '<span class="shop-cta-text"><b>采购清单</b><small>' + shopCount + ' 样食材 · 已按 ' + opts.people + ' 人份换算</small></span>' +
        '<span class="shop-cta-arrow">' + ICONS.arrow + '</span>' +
      '</button>' +
      '<div class="cook-tip">' +
        '<span class="cook-tip-icon">' + ICONS.flame + '</span>' +
        '<p><b>下厨顺序</b>先把' + escapeHtml(soup ? soup.name : '汤') + '炖上，再腌需要入味的肉，最后大火快炒；电饭煲的米饭可以同时开煮。</p>' +
      '</div>' +
      '<p class="home-note">每日 0 点更新菜单 · 所有菜谱均可离线查看</p>' +
      tabbar('home') +
    '</div>';
  }

  function tasteEmoji(taste) {
    const t = TASTES.find((x) => x.id === taste);
    return t ? t.emoji : '✨';
  }

  function dishRowHtml(d, index, isSoup) {
    const v = d.variants[0];
    const badge = isSoup ? '汤' : String(index + 1).padStart(2, '0');
    return '<a class="dish-row" href="#/dish/' + escapeAttr(d.id) + '" style="--accent:' + escapeAttr(d.accent) + '">' +
      '<span class="dish-index' + (isSoup ? ' is-soup' : '') + '">' + badge + '</span>' +
      '<span class="dish-emoji">' + d.emoji + '</span>' +
      '<span class="dish-main"><span class="dish-name">' + escapeHtml(d.name) + '</span><span class="dish-sub">' + escapeHtml(v.name) + ' · ' + formatTime(v.time) + '</span></span>' +
      '<span class="dish-row-tag">' + escapeHtml((d.tastes || [])[0] || '') + '</span>' +
      '<span class="dish-chevron">' + ICONS.chevron + '</span>' +
    '</a>';
  }

  function filteredDishes() {
    const terms = ui.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const list = DISHES.filter((d) => {
      if (ui.category !== 'all' && d.category !== ui.category) return false;
      return terms.every((t) => d._search.includes(t));
    });
    if (terms.length) {
      list.sort((a, b) => {
        const an = a.name.toLowerCase();
        const bn = b.name.toLowerCase();
        const aExact = an === terms[0] ? 3 : an.startsWith(terms[0]) ? 2 : an.includes(terms[0]) ? 1 : 0;
        const bExact = bn === terms[0] ? 3 : bn.startsWith(terms[0]) ? 2 : bn.includes(terms[0]) ? 1 : 0;
        return bExact - aExact;
      });
    }
    return list;
  }

  function recipeCardHtml(d) {
    const v = d.variants[0];
    const tags = (d.tastes || []).slice(0, 2).map((t) => '<span class="mini-tag">' + escapeHtml(t) + '</span>').join('');
    return '<article class="recipe-card" style="--accent:' + escapeAttr(d.accent) + '">' +
      '<a class="card-link" href="#/dish/' + escapeAttr(d.id) + '" aria-label="查看' + escapeAttr(d.name) + '的菜谱">' +
        '<div class="card-visual"><span class="card-emoji">' + d.emoji + '</span><span class="variant-badge">' + d.variants.length + ' 种做法</span></div>' +
        '<div class="card-body">' +
          '<h3>' + highlight(d.name, ui.query) + '</h3>' +
          '<div class="mini-tags">' + tags + '</div>' +
          '<p class="card-meta">' + ICONS.clock + '<span>' + formatTime(v.time) + '</span><i>·</i><span>' + escapeHtml(v.level) + '</span></p>' +
        '</div>' +
      '</a>' +
      favoriteButton(d.id, 'card-fav') +
    '</article>';
  }

  function recipesResultsHtml() {
    const list = filteredDishes();
    const variants = list.reduce((sum, d) => sum + d.variants.length, 0);
    const meta = ui.query.trim()
      ? '找到 <b>' + list.length + '</b> 道菜 · ' + variants + ' 种做法'
      : '共 <b>' + list.length + '</b> 道菜 · ' + variants + ' 种做法';
    const grid = list.length
      ? '<div class="recipe-grid">' + list.map(recipeCardHtml).join('') + '</div>'
      : '<div class="empty-state"><div class="empty-bowl">' + logoMark(64) + '</div><h3>没找到这道菜</h3><p>换个关键词试试，比如「土豆」「番茄」「汤」。</p><button type="button" class="ghost-btn" data-action="clear-search">看看全部菜谱</button></div>';
    return { meta, grid };
  }

  function updateRecipeResults() {
    const r = recipesResultsHtml();
    const meta = document.getElementById('resultMeta');
    const grid = document.getElementById('recipeResults');
    if (meta) meta.innerHTML = r.meta;
    if (grid) grid.innerHTML = r.grid;
    const clear = document.getElementById('searchClear');
    if (clear) clear.classList.toggle('is-visible', !!ui.query.trim());
    const input = document.getElementById('searchInput');
    if (input && input.value !== ui.query) input.value = ui.query;
    document.querySelectorAll('[data-cat]').forEach((btn) => {
      const on = btn.getAttribute('data-cat') === ui.category;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', String(on));
    });
  }

  function renderRecipesPage() {
    const counts = { all: DISHES.length };
    DISHES.forEach((d) => { counts[d.category] = (counts[d.category] || 0) + 1; });
    const chips = CATEGORIES.map((c) =>
      '<button type="button" class="filter-chip ' + (ui.category === c.id ? 'is-active' : '') + '" data-cat="' + c.id + '" aria-pressed="' + (ui.category === c.id) + '">' +
      escapeHtml(c.label) + '<span>' + (counts[c.id] || 0) + '</span></button>'
    ).join('');

    app.innerHTML = '<div class="page page-recipes">' +
      '<header class="page-head">' +
        '<div class="head-top"><p class="eyebrow">RECIPE LIBRARY</p><span class="count-pill">' + DISHES.reduce((s, d) => s + d.variants.length, 0) + ' 种做法</span></div>' +
        '<h1>菜谱库</h1>' +
        '<p class="page-sub">每道菜，都不止一种做法。</p>' +
      '</header>' +
      '<div class="search-sticky">' +
        '<div class="search-box">' +
          '<span class="search-icon">' + ICONS.search + '</span>' +
          '<input id="searchInput" type="text" inputmode="search" enterkeyhint="search" autocomplete="off" placeholder="搜菜名、食材，比如 土豆" value="' + escapeAttr(ui.query) + '" aria-label="搜索菜谱">' +
          '<button type="button" id="searchClear" class="search-clear ' + (ui.query.trim() ? 'is-visible' : '') + '" data-action="clear-search" aria-label="清空搜索">' + ICONS.close + '</button>' +
        '</div>' +
        '<div class="filter-scroll">' + chips + '</div>' +
      '</div>' +
      '<div class="result-head"><span id="resultMeta"></span></div>' +
      '<div id="recipeResults"></div>' +
      tabbar('recipes') +
    '</div>';
    updateRecipeResults();
  }

  function getDetailState(id) {
    const d = DISH_BY_ID.get(id);
    if (!d) return null;
    if (!detailState || detailState.dishId !== id) {
      detailState = {
        dishId: id,
        variantId: d.variants[0].id,
        servings: currentMenu ? currentMenu.options.people : settings.people,
        checkedIng: new Set(),
        checkedSteps: new Set()
      };
    }
    const v = d.variants.find((x) => x.id === detailState.variantId) || d.variants[0];
    detailState.variantId = v.id;
    return { dish: d, variant: v };
  }

  function currentVariant() {
    if (!detailState) return null;
    const d = DISH_BY_ID.get(detailState.dishId);
    return d ? (d.variants.find((v) => v.id === detailState.variantId) || d.variants[0]) : null;
  }

  function renderDishPage(id) {
    const got = getDetailState(id);
    if (!got) { location.hash = '#/recipes'; return; }
    const d = got.dish;
    const v = got.variant;
    const today = dateLabel();
    const meta = '<span>' + ICONS.clock + formatTime(v.time) + '</span><span>' + ICONS.flame + escapeHtml(v.level) + '</span><span>' + d.variants.length + ' 种做法</span>';

    app.innerHTML = '<div class="detail-page">' +
      '<header class="detail-hero" style="--accent:' + escapeAttr(d.accent) + '">' +
        '<div class="detail-topbar">' +
          '<button type="button" class="round-btn" data-action="back" aria-label="返回">' + ICONS.back + '</button>' +
          '<div class="detail-date">' + today.md + '</div>' +
          favoriteButton(d.id, 'round-btn detail-fav') +
        '</div>' +
        '<div class="detail-hero-art"><span class="detail-emoji">' + d.emoji + '</span><span class="detail-orbit"></span></div>' +
        '<div class="detail-hero-copy">' +
          '<p class="eyebrow">' + CATEGORY_LABEL[d.category] + ' · ' + escapeHtml((d.tastes || []).join(' / ')) + '</p>' +
          '<h1>' + escapeHtml(d.name) + '</h1>' +
          '<p class="detail-intro">' + escapeHtml(d.intro) + '</p>' +
        '</div>' +
        '<div class="detail-meta" id="detailMeta">' + meta + '</div>' +
      '</header>' +
      '<main class="detail-body" id="recipeBody"></main>' +
      '<div class="detail-bar">' +
        '<button type="button" class="primary-btn detail-start" data-action="start-cook">开始烹饪</button>' +
      '</div>' +
    '</div>';
    renderRecipeBody();
  }

  function renderRecipeBody() {
    const body = document.getElementById('recipeBody');
    if (!body || !detailState) return;
    const d = DISH_BY_ID.get(detailState.dishId);
    const v = currentVariant();
    if (!d || !v) return;
    const scale = detailState.servings / v.serves;

    const variantTabs = d.variants.map((x) =>
      '<button type="button" class="variant-tab ' + (x.id === v.id ? 'is-active' : '') + '" data-variant="' + escapeAttr(x.id) + '" aria-pressed="' + (x.id === v.id) + '">' +
        '<span>' + escapeHtml(x.name) + '</span><small>' + formatTime(x.time) + '</small></button>'
    ).join('');

    const groups = {};
    v.ingredients.forEach((ing) => {
      const cat = ING_ORDER.includes(ing.c) ? ing.c : '其他';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(ing);
    });
    const ingHtml = ING_ORDER.filter((c) => groups[c] && groups[c].length).map((cat) =>
      '<div class="ing-group"><h4>' + cat + '</h4>' + groups[cat].map((ing) => {
        const key = d.id + '|' + v.id + '|' + ing.n;
        const checked = detailState.checkedIng.has(key);
        return '<label class="ing-row ' + (checked ? 'is-checked' : '') + '">' +
          '<input type="checkbox" class="ing-box" data-ing="' + escapeAttr(key) + '" ' + (checked ? 'checked' : '') + '>' +
          '<span class="ing-name">' + escapeHtml(ing.n) + (ing.note ? '<em>' + escapeHtml(ing.note) + '</em>' : '') + '</span>' +
          '<span class="ing-amount">' + scaledAmount(ing.q, ing.u, scale) + '</span>' +
        '</label>';
      }).join('') + '</div>'
    ).join('');

    const stepsHtml = v.steps.map((s, i) => {
      const key = d.id + '|' + v.id + '|' + i;
      const done = detailState.checkedSteps.has(key);
      return '<div class="step-row ' + (done ? 'is-done' : '') + '">' +
        '<button type="button" class="step-mark" data-step-check="' + escapeAttr(key) + '" aria-pressed="' + done + '" aria-label="标记第 ' + (i + 1) + ' 步完成">' + ICONS.check + '</button>' +
        '<div class="step-content">' +
          '<div class="step-title"><span class="step-no">' + String(i + 1).padStart(2, '0') + '</span><h3>' + escapeHtml(s.t) + '</h3></div>' +
          '<p>' + escapeHtml(s.d) + '</p>' +
          ((s.time || s.heat) ? '<div class="step-meta">' + (s.time ? '<span>' + ICONS.clock + escapeHtml(s.time) + '</span>' : '') + (s.heat ? '<span>' + ICONS.flame + escapeHtml(s.heat) + '</span>' : '') + '</div>' : '') +
        '</div>' +
      '</div>';
    }).join('');

    const allergens = detectAllergens(v);
    const allergenText = allergens.length ? '本做法含：' + allergens.join('、') + '。' : '本做法未识别出常见致敏原。';
    const tools = (v.tools || []).map((t) => '<span class="tool-chip">' + escapeHtml(t) + '</span>').join('');

    body.innerHTML = '<section class="detail-section variant-section">' +
      '<div class="section-title"><h2>选择做法</h2><span>' + d.variants.length + ' 种</span></div>' +
      '<div class="variant-tabs" role="tablist" aria-label="做法选择">' + variantTabs + '</div>' +
      '<div class="variant-note"><p>' + escapeHtml(v.desc) + '</p><div class="variant-badges">' + tools + '<span class="tool-chip">' + escapeHtml(v.tag) + '</span></div></div>' +
    '</section>' +
    '<section class="detail-section serving-section">' +
      '<div class="serving-copy"><h2>食材用量</h2><p>' + detailState.servings + ' 人份 · 已按「' + escapeHtml(v.name) + '」换算</p></div>' +
      '<div class="stepper" aria-label="调整人份"><button type="button" data-serv="-1" aria-label="减少一人份" ' + (detailState.servings <= 1 ? 'disabled' : '') + '>−</button><b>' + detailState.servings + ' 人</b><button type="button" data-serv="1" aria-label="增加一人份" ' + (detailState.servings >= 8 ? 'disabled' : '') + '>+</button></div>' +
    '</section>' +
    '<section class="ingredients-card" aria-label="食材清单">' + ingHtml + '</section>' +
    '<section class="detail-section steps-section">' +
      '<div class="section-title"><h2>做法步骤</h2><span>' + v.steps.length + ' 步 · ' + formatTime(v.time) + '</span></div>' +
      '<div class="steps-list">' + stepsHtml + '</div>' +
      '<p class="step-scale-note">步骤中的用量按 ' + v.serves + ' 人份标注；上方食材表已按 ' + detailState.servings + ' 人份换算。份量加大时，请适当延长加热时间。</p>' +
    '</section>' +
    '<section class="tips-card"><div class="tips-head"><span>💡</span><h3>做好这道菜的关键</h3></div><ul>' + v.tips.map((t) => '<li>' + escapeHtml(t) + '</li>').join('') + '</ul></section>' +
    '<p class="allergen-note"><b>过敏提示</b>' + escapeHtml(allergenText) + '如有严重过敏，请以实际购买产品的配料表为准。</p>';

    const meta = document.getElementById('detailMeta');
    if (meta) meta.innerHTML = '<span>' + ICONS.clock + formatTime(v.time) + '</span><span>' + ICONS.flame + escapeHtml(v.level) + '</span><span>' + d.variants.length + ' 种做法</span>';
    const start = document.querySelector('.detail-start');
    if (start) start.textContent = '开始烹饪 · ' + v.name;
  }

  function detectAllergens(v) {
    const text = v.ingredients.map((i) => i.n).join(' ');
    const out = [];
    if (/花生/.test(text)) out.push('花生');
    if (/(虾|鱼|鲈|虾皮|紫菜|蛤蜊|鱿鱼)/.test(text)) out.push('海鲜');
    if (/鸡蛋|蛋液|蛋花/.test(text)) out.push('蛋');
    if (/(豆腐|豆瓣|豆豉|生抽|酱油|黄豆酱|甜面酱)/.test(text)) out.push('大豆');
    if (/(面粉|面条|面包糠)/.test(text)) out.push('麸质');
    if (/(牛奶|黄油|奶酪)/.test(text)) out.push('乳制品');
    return out;
  }

  function buildShoppingItems(menu) {
    const items = [];
    const addDish = (d) => {
      if (!d) return;
      const v = d.variants[0];
      const scale = menu.options.people / v.serves;
      v.ingredients.forEach((ing) => {
        const key = ing.n + '|' + ing.u;
        const found = items.find((x) => x.key === key);
        if (found) {
          if (found.q == null || ing.q == null) found.q = null;
          else found.q += Number(ing.q) * scale;
          if (!found.from.includes(d.name)) found.from.push(d.name);
        } else {
          items.push({
            key: key, n: ing.n, u: ing.u, c: ING_ORDER.includes(ing.c) ? ing.c : '其他',
            q: ing.q == null ? null : Number(ing.q) * scale,
            note: ing.note || '', from: [d.name]
          });
        }
      });
    };
    getMenuDishes(menu).forEach(addDish);
    addDish(getMenuSoup(menu));
    return items;
  }

  function shoppingMenuKey() {
    if (!currentMenu) return '';
    return [currentMenu.date, currentMenu.dishes.join('-'), currentMenu.soup, currentMenu.options.people].join('|');
  }

  function shoppingAmount(item) {
    return item.q == null ? '适量' : formatAmount(item.q, item.u);
  }

  function shoppingListHtml(menu) {
    const items = buildShoppingItems(menu);
    const groups = {};
    items.forEach((item) => {
      const cat = item.c || '其他';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    const menuKey = shoppingMenuKey();
    const groupsHtml = ING_ORDER.filter((c) => groups[c] && groups[c].length).map((cat) =>
      '<div class="shop-group"><h3>' + cat + '<span>' + groups[cat].length + '</span></h3>' + groups[cat].map((item) => {
        const key = menuKey + '|' + item.key;
        const checked = !!shoppingChecked[key];
        return '<label class="shop-row ' + (checked ? 'is-checked' : '') + '">' +
          '<input type="checkbox" data-shop-item="' + escapeAttr(key) + '" ' + (checked ? 'checked' : '') + '>' +
          '<span class="shop-name">' + escapeHtml(item.n) + (item.note ? '<em>' + escapeHtml(item.note) + '</em>' : '') + '</span>' +
          '<span class="shop-amount">' + shoppingAmount(item) + '</span>' +
        '</label>';
      }).join('') + '</div>'
    ).join('');
    return { items, html: groupsHtml };
  }

  function renderSettingsPage() {
    const favDishes = favorites.map((id) => DISH_BY_ID.get(id)).filter(Boolean);
    const variantTotal = DISHES.reduce((s, d) => s + d.variants.length, 0);
    const favorHtml = favDishes.length
      ? favDishes.map((d) => '<a class="fav-row" href="#/dish/' + escapeAttr(d.id) + '"><span class="fav-emoji">' + d.emoji + '</span><span><b>' + escapeHtml(d.name) + '</b><small>' + d.variants.length + ' 种做法 · ' + formatTime(d.variants[0].time) + '</small></span><span class="fav-arrow">' + ICONS.chevron + '</span></a>').join('')
      : '<div class="fav-empty"><span>🤍</span><p>还没有收藏的菜谱<br><small>在菜谱卡片或详情页点心形即可收藏</small></p></div>';

    app.innerHTML = '<div class="page page-settings">' +
      '<header class="page-head"><div class="head-top"><p class="eyebrow">MY TABLE</p><span class="count-pill">v' + APP_VERSION + '</span></div><h1>我的</h1><p class="page-sub">把默认口味，调成你的习惯。</p></header>' +
      '<section class="profile-card">' +
        '<div class="profile-logo">' + logoMark(46) + '</div>' +
        '<div class="profile-copy"><b>吃了么</b><small>今天，也好好吃饭。</small></div>' +
        '<span class="profile-stamp">离线可用</span>' +
      '</section>' +
      '<section class="settings-card">' +
        '<div class="section-title"><h2>默认推荐</h2><button type="button" class="text-btn" data-action="reset-settings">恢复默认</button></div>' +
        '<div class="setting-block"><div class="setting-label"><b>口味</b><small>决定每日推荐的偏好</small></div><div class="chip-wrap taste-grid">' + tasteChipsHtml(settings.taste, 'data-setting-taste') + '</div></div>' +
        '<div class="setting-row"><div class="setting-label"><b>菜品数量</b><small>不含汤，固定配 1 道汤</small></div><div class="stepper"><button type="button" data-setting-step="dishes" data-delta="-1" aria-label="减少菜数" ' + (settings.dishes <= 1 ? 'disabled' : '') + '>−</button><b id="settingDishes">' + settings.dishes + ' 道</b><button type="button" data-setting-step="dishes" data-delta="1" aria-label="增加菜数" ' + (settings.dishes >= 5 ? 'disabled' : '') + '>+</button></div></div>' +
        '<div class="setting-row"><div class="setting-label"><b>用餐人数</b><small>食材用量会按人数换算</small></div><div class="stepper"><button type="button" data-setting-step="people" data-delta="-1" aria-label="减少人数" ' + (settings.people <= 1 ? 'disabled' : '') + '>−</button><b id="settingPeople">' + settings.people + ' 人</b><button type="button" data-setting-step="people" data-delta="1" aria-label="增加人数" ' + (settings.people >= 8 ? 'disabled' : '') + '>+</button></div></div>' +
        '<div class="setting-block"><div class="setting-label"><b>忌口</b><small>推荐时会自动避开这些食材</small></div><div class="chip-wrap avoid-grid">' + avoidChipsHtml(settings.avoid, 'data-setting-avoid') + '</div></div>' +
        '<p class="setting-footnote">修改后，今日菜单会立即按新设置重新搭配。</p>' +
      '</section>' +
      '<section class="favorites-card"><div class="section-title"><h2>我的收藏</h2><span>' + favDishes.length + ' 道</span></div><div id="favoritesList">' + favorHtml + '</div></section>' +
      '<section class="offline-card">' +
        '<div class="offline-top"><span class="online-dot"></span><div><b>离线也能用</b><small>全部菜谱保存在本机，无需账号和网络</small></div></div>' +
        '<div class="offline-actions"><button type="button" class="small-btn" data-action="install">安装到手机</button><button type="button" class="small-btn is-ghost" data-action="offline-help">离线说明</button></div>' +
      '</section>' +
      '<section class="about-card"><div class="section-title"><h2>关于吃了么</h2><span>v' + APP_VERSION + '</span></div><p>' + DISHES.length + ' 道家常菜、' + variantTotal + ' 种做法，全部离线可用。生熟分开、肉类彻底加热，好好吃饭。</p><div class="about-stats"><div><b>' + DISHES.length + '</b><span>道菜</span></div><div><b>' + variantTotal + '</b><span>种做法</span></div><div><b>0</b><span>广告</span></div></div></section>' +
      '<button type="button" class="reset-data" data-action="reset-data">清空收藏与本地设置</button>' +
      '<p class="app-footnote">吃了么 · 好好吃饭，慢慢生活</p>' +
      tabbar('settings') +
    '</div>';
  }

  function refreshFavoritesSection() {
    const list = document.getElementById('favoritesList');
    if (!list) return;
    const favDishes = favorites.map((id) => DISH_BY_ID.get(id)).filter(Boolean);
    list.innerHTML = favDishes.length
      ? favDishes.map((d) => '<a class="fav-row" href="#/dish/' + escapeAttr(d.id) + '"><span class="fav-emoji">' + d.emoji + '</span><span><b>' + escapeHtml(d.name) + '</b><small>' + d.variants.length + ' 种做法 · ' + formatTime(d.variants[0].time) + '</small></span><span class="fav-arrow">' + ICONS.chevron + '</span></a>').join('')
      : '<div class="fav-empty"><span>🤍</span><p>还没有收藏的菜谱<br><small>在菜谱卡片或详情页点心形即可收藏</small></p></div>';
  }

  function refreshSettingButtons() {
    document.querySelectorAll('[data-setting-step]').forEach((btn) => {
      const field = btn.getAttribute('data-setting-step');
      const delta = Number(btn.getAttribute('data-delta'));
      const val = settings[field];
      btn.disabled = delta < 0 ? val <= 1 : val >= (field === 'dishes' ? 5 : 8);
    });
    const d = document.getElementById('settingDishes');
    const p = document.getElementById('settingPeople');
    if (d) d.textContent = settings.dishes + ' 道';
    if (p) p.textContent = settings.people + ' 人';
    document.querySelectorAll('[data-setting-taste]').forEach((btn) => {
      const on = btn.getAttribute('data-setting-taste') === settings.taste;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', String(on));
    });
    document.querySelectorAll('[data-setting-avoid]').forEach((btn) => {
      const val = btn.getAttribute('data-setting-avoid');
      const on = settings.avoid.includes(val);
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', String(on));
      btn.querySelector('.avoid-check').innerHTML = on ? ICONS.check : '+';
    });
  }

  function regenerateForSettings() {
    currentMenu = buildMenu(settings, 0, currentMenu);
    persistMenu();
  }

  function setSettingsTaste(taste) {
    if (!TASTES.some((t) => t.id === taste)) return;
    settings.taste = taste;
    if (taste === '香辣' && settings.avoid.includes('不吃辣')) {
      settings.avoid = settings.avoid.filter((a) => a !== '不吃辣');
      showToast('想吃辣，已自动取消「不吃辣」');
    }
    persistSettings();
    regenerateForSettings();
    refreshSettingButtons();
  }

  function setSettingsStep(field, delta) {
    if (field !== 'dishes' && field !== 'people') return;
    const max = field === 'dishes' ? 5 : 8;
    settings[field] = clamp(settings[field] + delta, 1, max);
    persistSettings();
    if (field === 'people' && currentMenu) {
      currentMenu.options.people = settings.people;
      persistMenu();
    } else {
      regenerateForSettings();
    }
    refreshSettingButtons();
  }

  function toggleSettingsAvoid(value) {
    if (!AVOID_OPTIONS.includes(value)) return;
    if (settings.avoid.includes(value)) settings.avoid = settings.avoid.filter((a) => a !== value);
    else settings.avoid = settings.avoid.concat(value);
    if (settings.avoid.includes('不吃辣') && settings.taste === '香辣') {
      settings.taste = '不限';
      showToast('已切换为不限口味');
    }
    persistSettings();
    regenerateForSettings();
    refreshSettingButtons();
  }

  // ---------- overlays ----------
  let sheetType = null;
  let draft = null;
  let overlayReturnFocus = null;
  let toastTimer = null;

  function showToast(message) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-show'), 2400);
  }

  function lockBody() { document.body.classList.add('is-locked'); }
  function unlockBody() { if (!sheetType && !cookState.open) document.body.classList.remove('is-locked'); }

  function openOverlay(html) {
    overlayReturnFocus = document.activeElement;
    overlayRoot.innerHTML = html;
    lockBody();
    requestAnimationFrame(() => {
      const dialog = overlayRoot.querySelector('[role="dialog"]');
      if (dialog) {
        if (!dialog.hasAttribute('tabindex')) dialog.setAttribute('tabindex', '-1');
        dialog.focus({ preventScroll: true });
      }
    });
  }

  function closeOverlay() {
    overlayRoot.innerHTML = '';
    sheetType = null;
    draft = null;
    unlockBody();
    if (overlayReturnFocus && typeof overlayReturnFocus.focus === 'function') {
      try { overlayReturnFocus.focus({ preventScroll: true }); } catch (e) { /* noop */ }
    }
  }

  function optionsSheetHtml() {
    return '<div class="overlay" data-action="close-sheet">' +
      '<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheetTitle">' +
        '<div class="sheet-grab"></div>' +
        '<div class="sheet-head"><div><p class="eyebrow">TODAY\'S PREFERENCES</p><h2 id="sheetTitle">调整这桌菜</h2></div><button type="button" class="sheet-close" data-action="close-sheet" aria-label="关闭">' + ICONS.close + '</button></div>' +
        '<p class="sheet-sub">只影响今天；默认设置可在「我的」里修改。</p>' +
        '<section class="sheet-section"><div class="sheet-label"><h3>口味</h3><span>按偏好优先匹配</span></div><div class="chip-wrap">' + tasteChipsHtml(draft.taste, 'data-draft-taste') + '</div></section>' +
        '<section class="sheet-row"><div class="sheet-label"><b>菜品数量</b><small>不含汤，固定配 1 道汤</small></div><div class="stepper"><button type="button" data-draft-step="dishes" data-delta="-1" aria-label="减少菜数" ' + (draft.dishes <= 1 ? 'disabled' : '') + '>−</button><b id="draftDishes">' + draft.dishes + ' 道</b><button type="button" data-draft-step="dishes" data-delta="1" aria-label="增加菜数" ' + (draft.dishes >= 5 ? 'disabled' : '') + '>+</button></div></section>' +
        '<section class="sheet-row"><div class="sheet-label"><b>用餐人数</b><small>食材用量按人数换算</small></div><div class="stepper"><button type="button" data-draft-step="people" data-delta="-1" aria-label="减少人数" ' + (draft.people <= 1 ? 'disabled' : '') + '>−</button><b id="draftPeople">' + draft.people + ' 人</b><button type="button" data-draft-step="people" data-delta="1" aria-label="增加人数" ' + (draft.people >= 8 ? 'disabled' : '') + '>+</button></div></section>' +
        '<section class="sheet-section"><div class="sheet-label"><h3>忌口</h3><span>可多选</span></div><div class="chip-wrap avoid-grid">' + avoidChipsHtml(draft.avoid, 'data-draft-avoid') + '</div></section>' +
        '<div class="sheet-actions"><button type="button" class="primary-btn" data-action="apply-options">生成这桌菜</button><button type="button" class="ghost-btn" data-action="save-default">保存为默认</button></div>' +
      '</div>' +
    '</div>';
  }

  function openOptionsSheet() {
    if (!currentMenu) ensureMenu();
    draft = { ...currentMenu.options, avoid: [...currentMenu.options.avoid] };
    sheetType = 'options';
    openOverlay(optionsSheetHtml());
  }

  function refreshOptionsSheet() {
    if (!draft) return;
    document.querySelectorAll('[data-draft-taste]').forEach((btn) => {
      const on = btn.getAttribute('data-draft-taste') === draft.taste;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', String(on));
    });
    document.querySelectorAll('[data-draft-avoid]').forEach((btn) => {
      const val = btn.getAttribute('data-draft-avoid');
      const on = draft.avoid.includes(val);
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', String(on));
      btn.querySelector('.avoid-check').innerHTML = on ? ICONS.check : '+';
    });
    const d = document.getElementById('draftDishes');
    const p = document.getElementById('draftPeople');
    if (d) d.textContent = draft.dishes + ' 道';
    if (p) p.textContent = draft.people + ' 人';
    document.querySelectorAll('[data-draft-step]').forEach((btn) => {
      const field = btn.getAttribute('data-draft-step');
      const delta = Number(btn.getAttribute('data-delta'));
      const val = draft[field];
      btn.disabled = delta < 0 ? val <= 1 : val >= (field === 'dishes' ? 5 : 8);
    });
  }

  function applyOptions(saveAsDefault) {
    if (!draft) return;
    draft = normalizeSettings(draft);
    if (draft.taste === '香辣' && draft.avoid.includes('不吃辣')) draft.avoid = draft.avoid.filter((a) => a !== '不吃辣');
    currentMenu = buildMenu(draft, 0, currentMenu);
    persistMenu();
    if (saveAsDefault) {
      settings = normalizeSettings(draft);
      persistSettings();
    }
    closeOverlay();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(saveAsDefault ? '已保存为默认，以后都按这个来' : '菜单已重新搭配');
  }

  function shoppingSheetHtml() {
    const menu = currentMenu;
    const list = shoppingListHtml(menu);
    const dishes = getMenuDishes(menu);
    const soup = getMenuSoup(menu);
    const menuKey = shoppingMenuKey();
    const checkedCount = list.items.filter((item) => shoppingChecked[menuKey + '|' + item.key]).length;
    return '<div class="overlay" data-action="close-sheet">' +
      '<div class="sheet sheet-tall" role="dialog" aria-modal="true" aria-labelledby="shopTitle">' +
        '<div class="sheet-grab"></div>' +
        '<div class="sheet-head"><div><p class="eyebrow">SHOPPING LIST</p><h2 id="shopTitle">采购清单</h2></div><button type="button" class="sheet-close" data-action="close-sheet" aria-label="关闭">' + ICONS.close + '</button></div>' +
        '<p class="sheet-sub">' + menuLabel(menu.options.dishes) + ' · ' + menu.options.people + ' 人份 · 共 ' + list.items.length + ' 样食材</p>' +
        '<div class="shop-summary"><span>' + dishes.map((d) => d.name).join('、') + (soup ? '、' + soup.name : '') + '</span><em id="shopProgress">已买 ' + checkedCount + ' / ' + list.items.length + '</em></div>' +
        '<div class="shop-list" id="shopList">' + list.html + '</div>' +
        '<p class="shop-note">调料按家里现有情况增减，用量可按口味微调。主食别忘了：米饭或面条按人数准备。</p>' +
        '<div class="sheet-actions sticky-actions"><button type="button" class="primary-btn" data-action="copy-list">复制清单</button><button type="button" class="ghost-btn" data-action="close-sheet">继续做菜</button></div>' +
      '</div>' +
    '</div>';
  }

  function openShoppingSheet() {
    if (!currentMenu) ensureMenu();
    sheetType = 'shopping';
    openOverlay(shoppingSheetHtml());
  }

  function updateShopCheckedUI(input) {
    const label = input.closest('.shop-row');
    if (label) label.classList.toggle('is-checked', input.checked);
    const checked = document.querySelectorAll('[data-shop-item]:checked').length;
    const total = document.querySelectorAll('[data-shop-item]').length;
    const progress = document.getElementById('shopProgress');
    if (progress) progress.textContent = '已买 ' + checked + ' / ' + total;
  }

  function toggleShopItem(input) {
    const key = input.getAttribute('data-shop-item');
    if (!key) return;
    if (input.checked) shoppingChecked[key] = true;
    else delete shoppingChecked[key];
    safeWrite(KEYS.checked, shoppingChecked);
    updateShopCheckedUI(input);
  }

  function copyShoppingList() {
    const menu = currentMenu;
    const items = buildShoppingItems(menu);
    const checked = shoppingChecked;
    const menuKey = shoppingMenuKey();
    const groups = {};
    items.forEach((item) => {
      const cat = item.c || '其他';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    let text = '吃了么 · 采购清单\n' + menu.options.people + ' 人份 · ' + menuLabel(menu.options.dishes) + '\n\n';
    ING_ORDER.filter((c) => groups[c] && groups[c].length).forEach((cat) => {
      text += '【' + cat + '】\n';
      groups[cat].forEach((item) => {
        const done = checked[menuKey + '|' + item.key] ? '✓ ' : '□ ';
        text += done + item.n + '  ' + shoppingAmount(item) + '\n';
      });
      text += '\n';
    });
    copyText(text.trim()).then(() => showToast('采购清单已复制')).catch(() => showToast('复制失败，请手动截屏保存'));
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    if (!ok) throw new Error('copy failed');
  }

  function installSheetHtml() {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const body = standalone
      ? '<div class="install-done"><span>✓</span><h3>已经在手机上运行</h3><p>你现在使用的是独立应用窗口，所有菜谱都可离线查看。</p></div>'
      : '<div class="install-steps">' +
          '<div class="install-step"><span>1</span><div><b>用手机浏览器打开本页面</b><small>Android 推荐 Chrome，iPhone 推荐 Safari</small></div></div>' +
          '<div class="install-step"><span>2</span><div><b>添加到主屏幕</b><small>Chrome：右上角菜单 →「安装应用」或「添加到主屏幕」<br>Safari：分享按钮 →「添加到主屏幕」</small></div></div>' +
          '<div class="install-step"><span>3</span><div><b>从桌面打开「吃了么」</b><small>首次打开后会自动缓存，之后断网也能用</small></div></div>' +
        '</div>' +
        (standalone ? '' : '<div class="sheet-actions"><button type="button" class="primary-btn" data-action="do-install" ' + (deferredInstallPrompt ? '' : 'disabled') + '>' + (deferredInstallPrompt ? '立即安装' : '请按上方步骤添加') + '</button></div>');
    return '<div class="overlay" data-action="close-sheet">' +
      '<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="installTitle">' +
        '<div class="sheet-grab"></div>' +
        '<div class="sheet-head"><div><p class="eyebrow">OFFLINE APP</p><h2 id="installTitle">把吃了么装进手机</h2></div><button type="button" class="sheet-close" data-action="close-sheet" aria-label="关闭">' + ICONS.close + '</button></div>' +
        '<p class="sheet-sub">安装后像普通 App 一样从桌面打开，不联网也能看菜谱。</p>' +
        body +
        '<p class="install-note">如果无法安装，也可以使用附带的「吃了么-离线版.html」：复制到手机，用浏览器打开即可，所有菜谱都在文件里。</p>' +
      '</div>' +
    '</div>';
  }

  function openInstallSheet() {
    sheetType = 'install';
    openOverlay(installSheetHtml());
  }

  function openOfflineHelp() {
    sheetType = 'install';
    openOverlay('<div class="overlay" data-action="close-sheet"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="offlineTitle">' +
      '<div class="sheet-grab"></div>' +
      '<div class="sheet-head"><div><p class="eyebrow">OFFLINE</p><h2 id="offlineTitle">离线说明</h2></div><button type="button" class="sheet-close" data-action="close-sheet" aria-label="关闭">' + ICONS.close + '</button></div>' +
      '<div class="offline-help"><p><b>这个 App 不依赖网络。</b>菜谱、做法、用量都内置在应用里，搜索和每日推荐也全部在本机完成。</p><p><b>PWA 安装版：</b>首次打开需要联网加载，缓存完成后可断网使用。更新应用时重新联网打开一次即可。</p><p><b>单文件版：</b>把「吃了么-离线版.html」保存到手机文件里，用浏览器打开就能用。它没有 Service Worker，但数据同样全部内置。</p><p><b>你的数据：</b>收藏、默认设置和采购勾选只保存在本机 localStorage，不会上传。</p></div>' +
      '<div class="sheet-actions"><button type="button" class="primary-btn" data-action="close-sheet">知道了</button></div>' +
    '</div></div>');
  }

  // ---------- cooking mode ----------
  let cookState = { open: false, index: 0, dishId: null, variantId: null, wakeLock: null };

  function startCooking() {
    if (!detailState) return;
    const d = DISH_BY_ID.get(detailState.dishId);
    const v = currentVariant();
    if (!d || !v) return;
    cookState = { open: true, index: 0, dishId: d.id, variantId: v.id, wakeLock: null };
    sheetType = null;
    lockBody();
    renderCookScreen();
    requestWakeLock();
  }

  function renderCookScreen() {
    const d = DISH_BY_ID.get(cookState.dishId);
    const v = d && d.variants.find((x) => x.id === cookState.variantId);
    if (!d || !v) return;
    const step = v.steps[cookState.index];
    const pct = ((cookState.index + 1) / v.steps.length) * 100;
    const isLast = cookState.index === v.steps.length - 1;
    overlayRoot.innerHTML = '<div class="cook-screen" role="dialog" aria-modal="true" aria-labelledby="cookTitle">' +
      '<header class="cook-top"><button type="button" class="cook-close" data-action="close-cook" aria-label="退出烹饪模式">' + ICONS.close + '</button><div class="cook-top-copy"><small>' + escapeHtml(d.name) + ' · ' + escapeHtml(v.name) + '</small><b>第 ' + (cookState.index + 1) + ' / ' + v.steps.length + ' 步</b></div><button type="button" class="cook-tip-btn" data-action="cook-tip" aria-label="查看小贴士">💡</button></header>' +
      '<div class="cook-progress"><span style="width:' + pct + '%"></span></div>' +
      '<main class="cook-main">' +
        '<p class="eyebrow">STEP ' + String(cookState.index + 1).padStart(2, '0') + '</p>' +
        '<h1 id="cookTitle">' + escapeHtml(step.t) + '</h1>' +
        '<p class="cook-text">' + escapeHtml(step.d) + '</p>' +
        ((step.time || step.heat) ? '<div class="cook-meta">' + (step.time ? '<span>' + ICONS.clock + escapeHtml(step.time) + '</span>' : '') + (step.heat ? '<span>' + ICONS.flame + escapeHtml(step.heat) + '</span>' : '') + '</div>' : '') +
        '<div class="cook-ingredients"><b>本菜用料 · ' + detailState.servings + ' 人份</b><div>' + v.ingredients.map((i) => '<span>' + escapeHtml(i.n) + ' ' + scaledAmount(i.q, i.u, detailState.servings / v.serves) + '</span>').join('') + '</div></div>' +
      '</main>' +
      '<footer class="cook-foot"><button type="button" class="ghost-btn" data-action="cook-prev" ' + (cookState.index === 0 ? 'disabled' : '') + '>上一步</button><button type="button" class="primary-btn" data-action="cook-next">' + (isLast ? '完成，开饭' : '下一步') + '</button></footer>' +
    '</div>';
    requestAnimationFrame(() => {
      const next = overlayRoot.querySelector('[data-action="cook-next"]');
      if (next) next.focus({ preventScroll: true });
    });
  }

  function cookNext() {
    const d = DISH_BY_ID.get(cookState.dishId);
    const v = d && d.variants.find((x) => x.id === cookState.variantId);
    if (!v) return;
    if (cookState.index >= v.steps.length - 1) {
      closeCook();
      showToast('开饭啦，记得趁热吃。');
      return;
    }
    cookState.index += 1;
    renderCookScreen();
  }
  function cookPrev() {
    if (cookState.index <= 0) return;
    cookState.index -= 1;
    renderCookScreen();
  }
  function closeCook() {
    if (cookState.wakeLock && cookState.wakeLock.release) {
      try { cookState.wakeLock.release(); } catch (e) { /* noop */ }
    }
    cookState = { open: false, index: 0, dishId: null, variantId: null, wakeLock: null };
    overlayRoot.innerHTML = '';
    unlockBody();
  }
  async function requestWakeLock() {
    if (!('wakeLock' in navigator)) return;
    try {
      cookState.wakeLock = await navigator.wakeLock.request('screen');
    } catch (e) { /* user may have denied */ }
  }
  function cookTip() {
    const d = DISH_BY_ID.get(cookState.dishId);
    const v = d && d.variants.find((x) => x.id === cookState.variantId);
    if (!v) return;
    showToast(v.tips[0] || '按步骤来，别着急。');
  }

  // ---------- routing ----------
  const app = document.getElementById('app');
  const overlayRoot = document.getElementById('overlayRoot');
  let detailState = null;
  let ui = { query: '', category: 'all' };
  let currentRouteKey = '';
  const routeScroll = {};
  const routeStack = [];
  let deferredInstallPrompt = null;

  function parseRoute() {
    const raw = (location.hash || '#/home').replace(/^#/, '') || '/home';
    const parts = raw.split('/').filter(Boolean);
    if (parts[0] === 'dish' && parts[1]) {
      let dishId = parts[1];
      try { dishId = decodeURIComponent(parts[1]); } catch (e) { /* keep raw */ }
      return { name: 'dish', id: dishId, key: 'dish/' + parts[1] };
    }
    if (parts[0] === 'recipes') return { name: 'recipes', key: 'recipes' };
    if (parts[0] === 'settings') return { name: 'settings', key: 'settings' };
    return { name: 'home', key: 'home' };
  }

  function render() {
    const route = parseRoute();
    if (route.name === 'dish') renderDishPage(route.id);
    else if (route.name === 'recipes') renderRecipesPage();
    else if (route.name === 'settings') renderSettingsPage();
    else renderHomePage();
  }

  function handleRoute(initial) {
    const route = parseRoute();
    if (!initial && currentRouteKey) routeScroll[currentRouteKey] = window.scrollY;
    if (initial) {
      routeStack.length = 0;
      routeStack.push(route.key);
    } else if (routeStack.length >= 2 && routeStack[routeStack.length - 2] === route.key) {
      routeStack.pop();
    } else if (routeStack[routeStack.length - 1] !== route.key) {
      routeStack.push(route.key);
    }
    currentRouteKey = route.key;
    render();
    const target = initial ? 0 : (route.name === 'dish' ? 0 : (routeScroll[route.key] || 0));
    requestAnimationFrame(() => window.scrollTo({ top: target, behavior: 'auto' }));
  }

  function goBack() {
    if (routeStack.length > 1) history.back();
    else location.hash = '#/home';
  }

  // ---------- events ----------
  document.addEventListener('click', function (e) {
    const overlay = e.target.closest('.overlay');
    if (overlay && e.target === overlay) {
      closeOverlay();
      return;
    }
    const closeBtn = e.target.closest('[data-action="close-sheet"]');
    if (closeBtn && !closeBtn.classList.contains('overlay')) {
      closeOverlay();
      return;
    }

    const actionEl = e.target.closest('[data-action]');
    if (actionEl) {
      const action = actionEl.getAttribute('data-action');
      if (action === 'shuffle') {
        currentMenu = buildMenu(currentMenu.options, (currentMenu.seed || 0) + 1, currentMenu);
        persistMenu();
        const y = window.scrollY;
        render();
        requestAnimationFrame(() => window.scrollTo({ top: y, behavior: 'auto' }));
        showToast('换了一桌，看看合不合胃口');
        return;
      }
      if (action === 'options') { openOptionsSheet(); return; }
      if (action === 'shopping') { openShoppingSheet(); return; }
      if (action === 'back') { goBack(); return; }
      if (action === 'clear-search') {
        ui.query = '';
        updateRecipeResults();
        const input = document.getElementById('searchInput');
        if (input) input.focus();
        return;
      }
      if (action === 'apply-options') { applyOptions(false); return; }
      if (action === 'save-default') { applyOptions(true); return; }
      if (action === 'copy-list') { copyShoppingList(); return; }
      if (action === 'install') { openInstallSheet(); return; }
      if (action === 'offline-help') { openOfflineHelp(); return; }
      if (action === 'do-install') {
        if (deferredInstallPrompt) {
          deferredInstallPrompt.prompt();
          deferredInstallPrompt.userChoice.finally(() => { deferredInstallPrompt = null; });
        }
        return;
      }
      if (action === 'start-cook') { startCooking(); return; }
      if (action === 'close-cook') { closeCook(); return; }
      if (action === 'cook-next') { cookNext(); return; }
      if (action === 'cook-prev') { cookPrev(); return; }
      if (action === 'cook-tip') { cookTip(); return; }
      if (action === 'reset-settings') {
        settings = normalizeSettings(DEFAULT_SETTINGS);
        persistSettings();
        regenerateForSettings();
        const y = window.scrollY;
        renderSettingsPage();
        requestAnimationFrame(() => window.scrollTo({ top: y, behavior: 'auto' }));
        showToast('已恢复默认设置');
        return;
      }
      if (action === 'reset-data') {
        if (actionEl.getAttribute('data-confirm') !== '1') {
          actionEl.setAttribute('data-confirm', '1');
          actionEl.textContent = '再点一次确认清空';
          setTimeout(() => {
            if (actionEl && actionEl.isConnected) {
              actionEl.removeAttribute('data-confirm');
              actionEl.textContent = '清空收藏与本地设置';
            }
          }, 3000);
          return;
        }
        favorites = [];
        settings = normalizeSettings(DEFAULT_SETTINGS);
        shoppingChecked = {};
        persistFavorites();
        persistSettings();
        safeWrite(KEYS.checked, {});
        currentMenu = buildMenu(settings, 0, currentMenu);
        persistMenu();
        renderSettingsPage();
        showToast('已清空本地数据');
        return;
      }
    }

    const fav = e.target.closest('[data-fav]');
    if (fav) {
      e.preventDefault();
      toggleFavorite(fav.getAttribute('data-fav'));
      return;
    }

    const catBtn = e.target.closest('[data-cat]');
    if (catBtn) {
      ui.category = catBtn.getAttribute('data-cat');
      updateRecipeResults();
      return;
    }

    const tasteBtn = e.target.closest('[data-setting-taste]');
    if (tasteBtn) { setSettingsTaste(tasteBtn.getAttribute('data-setting-taste')); return; }
    const settingStep = e.target.closest('[data-setting-step]');
    if (settingStep) {
      setSettingsStep(settingStep.getAttribute('data-setting-step'), Number(settingStep.getAttribute('data-delta')));
      return;
    }
    const avoidBtn = e.target.closest('[data-setting-avoid]');
    if (avoidBtn) { toggleSettingsAvoid(avoidBtn.getAttribute('data-setting-avoid')); return; }

    const draftTaste = e.target.closest('[data-draft-taste]');
    if (draftTaste) {
      draft.taste = draftTaste.getAttribute('data-draft-taste');
      if (draft.taste === '香辣' && draft.avoid.includes('不吃辣')) {
        draft.avoid = draft.avoid.filter((a) => a !== '不吃辣');
        showToast('想吃辣，已自动取消「不吃辣」');
      }
      refreshOptionsSheet();
      return;
    }
    const draftStep = e.target.closest('[data-draft-step]');
    if (draftStep) {
      const field = draftStep.getAttribute('data-draft-step');
      const delta = Number(draftStep.getAttribute('data-delta'));
      draft[field] = clamp(draft[field] + delta, 1, field === 'dishes' ? 5 : 8);
      refreshOptionsSheet();
      return;
    }
    const draftAvoid = e.target.closest('[data-draft-avoid]');
    if (draftAvoid) {
      const val = draftAvoid.getAttribute('data-draft-avoid');
      if (draft.avoid.includes(val)) draft.avoid = draft.avoid.filter((a) => a !== val);
      else draft.avoid = draft.avoid.concat(val);
      if (draft.avoid.includes('不吃辣') && draft.taste === '香辣') {
        draft.taste = '不限';
        showToast('已切换为不限口味');
      }
      refreshOptionsSheet();
      return;
    }

    const variantBtn = e.target.closest('[data-variant]');
    if (variantBtn) {
      if (!detailState) return;
      detailState.variantId = variantBtn.getAttribute('data-variant');
      renderRecipeBody();
      return;
    }
    const servBtn = e.target.closest('[data-serv]');
    if (servBtn) {
      if (!detailState) return;
      detailState.servings = clamp(detailState.servings + Number(servBtn.getAttribute('data-serv')), 1, 8);
      renderRecipeBody();
      return;
    }
    const stepCheck = e.target.closest('[data-step-check]');
    if (stepCheck) {
      const key = stepCheck.getAttribute('data-step-check');
      if (detailState.checkedSteps.has(key)) detailState.checkedSteps.delete(key);
      else detailState.checkedSteps.add(key);
      const done = detailState.checkedSteps.has(key);
      stepCheck.setAttribute('aria-pressed', String(done));
      stepCheck.closest('.step-row').classList.toggle('is-done', done);
      return;
    }
  });

  document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'searchInput') {
      ui.query = e.target.value;
      updateRecipeResults();
      const clear = document.getElementById('searchClear');
      if (clear) clear.classList.toggle('is-visible', !!ui.query.trim());
    }
  });

  document.addEventListener('change', function (e) {
    if (e.target && e.target.matches('[data-shop-item]')) toggleShopItem(e.target);
    if (e.target && e.target.matches('[data-ing]')) {
      const key = e.target.getAttribute('data-ing');
      if (e.target.checked) detailState.checkedIng.add(key);
      else detailState.checkedIng.delete(key);
      e.target.closest('.ing-row').classList.toggle('is-checked', e.target.checked);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (cookState.open) { closeCook(); return; }
      if (sheetType) { closeOverlay(); return; }
    }
  });

  window.addEventListener('hashchange', function () { handleRoute(false); });
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredInstallPrompt = e;
  });
  window.addEventListener('appinstalled', function () {
    deferredInstallPrompt = null;
    showToast('安装成功，桌面上见');
  });
  window.addEventListener('offline', function () { showToast('已进入离线模式，菜谱仍然可用'); });
  window.addEventListener('online', function () { showToast('网络已恢复'); });

  function init() {
    ensureMenu();
    if (!location.hash) {
      try { history.replaceState(null, '', '#/home'); } catch (e) { location.hash = '#/home'; }
    }
    handleRoute(true);
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('./sw.js').catch(function () { /* ignore */ });
      });
    }
    setInterval(function () {
      if (currentMenu && currentMenu.date !== dateKey()) {
        currentMenu = null;
        ensureMenu();
        if (parseRoute().name === 'home') render();
      }
    }, 60000);
  }

  window.__CHILEME__ = {
    getMenu: function () { return currentMenu; },
    getSettings: function () { return settings; },
    buildMenu: buildMenu,
    dishes: DISHES
  };

  init();
})();
