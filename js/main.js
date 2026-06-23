/* =========================================================
   基元合生 官网 · 交互脚本
   ========================================================= */

// ---------- 进场动画(本会话只显示一次,1.5s) ----------
window.addEventListener('load', () => {
  const intro = document.getElementById('intro');
  if (!intro) return;

  const seen = sessionStorage.getItem('motif-intro-seen');

  if (seen) {
    // 同会话已看过:立即跳过
    intro.classList.add('done');
    document.body.classList.add('nav-ready');
    setTimeout(() => intro.remove(), 100);
    return;
  }

  sessionStorage.setItem('motif-intro-seen', '1');
  setTimeout(() => {
    intro.classList.add('done');
    document.body.classList.add('nav-ready');
    setTimeout(() => intro.remove(), 500);
  }, 1500);
});

// ---------- Hero 分子网格:节点 & 连线微浮动 ----------
(function initGridFloat() {
  const svg = document.querySelector('.hero-bg-svg');
  if (!svg) return;

  const circles = Array.from(svg.querySelectorAll('.grid-base circle'));
  const lines   = Array.from(svg.querySelectorAll('.grid-base line'));
  const glows   = Array.from(svg.querySelectorAll('.glow-layer circle'));
  if (!circles.length) return;

  // 为每个节点生成独立的浮动参数
  const nodes = circles.map(c => {
    const cx0 = +c.getAttribute('cx');
    const cy0 = +c.getAttribute('cy');
    return {
      el: c,
      cx0, cy0,
      x: cx0, y: cy0,
      phX: Math.random() * Math.PI * 2,
      phY: Math.random() * Math.PI * 2,
      spX: 0.25 + Math.random() * 0.20,   // 节点 X 速度 rad/s
      spY: 0.25 + Math.random() * 0.20,
      ampX: 4 + Math.random() * 4,         // 浮动幅度 4-8px
      ampY: 4 + Math.random() * 4
    };
  });

  // 给每条连线找两个端点节点(按坐标完全匹配)
  const lineMap = lines.map(line => {
    const x1 = +line.getAttribute('x1');
    const y1 = +line.getAttribute('y1');
    const x2 = +line.getAttribute('x2');
    const y2 = +line.getAttribute('y2');
    return {
      el: line,
      a: nodes.findIndex(n => n.cx0 === x1 && n.cy0 === y1),
      b: nodes.findIndex(n => n.cx0 === x2 && n.cy0 === y2)
    };
  });

  // 给每个发光节点找对应的网格节点(同步位置)
  const glowMap = glows.map(g => {
    const gx = +g.getAttribute('cx');
    const gy = +g.getAttribute('cy');
    return {
      el: g,
      idx: nodes.findIndex(n => n.cx0 === gx && n.cy0 === gy)
    };
  });

  let rafId = 0;
  let running = true;

  function tick(t) {
    if (!running) return;
    const s = t / 1000;
    // 更新每个节点位置
    for (const n of nodes) {
      n.x = n.cx0 + n.ampX * Math.sin(s * n.spX + n.phX);
      n.y = n.cy0 + n.ampY * Math.cos(s * n.spY + n.phY);
      n.el.setAttribute('cx', n.x);
      n.el.setAttribute('cy', n.y);
    }
    // 更新连线端点
    for (const l of lineMap) {
      if (l.a < 0 || l.b < 0) continue;
      l.el.setAttribute('x1', nodes[l.a].x);
      l.el.setAttribute('y1', nodes[l.a].y);
      l.el.setAttribute('x2', nodes[l.b].x);
      l.el.setAttribute('y2', nodes[l.b].y);
    }
    // 同步发光节点
    for (const g of glowMap) {
      if (g.idx < 0) continue;
      g.el.setAttribute('cx', nodes[g.idx].x);
      g.el.setAttribute('cy', nodes[g.idx].y);
    }
    rafId = requestAnimationFrame(tick);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(rafId);
    } else {
      running = true;
      rafId = requestAnimationFrame(tick);
    }
  });

  rafId = requestAnimationFrame(tick);
})();

// ---------- Hero Canvas 粒子连线(已弃用,保留逻辑供切换) ----------
(function initParticles() {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const COLOR = '199, 230, 183';   // 薄荷
  const MAX_DISTANCE = 140;
  const TARGET_DENSITY = 16000;    // 每多少像素 1 粒子

  let particles = [];
  let w = 0, h = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let rafId = 0;
  let running = true;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  function init() {
    particles = [];
    const count = Math.max(20, Math.min(70, Math.floor((w * h) / TARGET_DENSITY)));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.2 + 0.7,
        a: Math.random() * 0.35 + 0.45
      });
    }
  }

  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);

    // 更新 & 绘制粒子
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10)     p.x = w + 10;
      if (p.x > w + 10)  p.x = -10;
      if (p.y < -10)     p.y = h + 10;
      if (p.y > h + 10)  p.y = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COLOR}, ${p.a})`;
      ctx.fill();
    }

    // 连线
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < MAX_DISTANCE * MAX_DISTANCE) {
          const d = Math.sqrt(d2);
          const alpha = (1 - d / MAX_DISTANCE) * 0.22;
          ctx.strokeStyle = `rgba(${COLOR}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    rafId = requestAnimationFrame(draw);
  }

  function start() {
    resize();
    init();
    cancelAnimationFrame(rafId);
    running = true;
    rafId = requestAnimationFrame(draw);
  }

  // 页面切到后台时暂停,省电
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(rafId);
    } else {
      running = true;
      rafId = requestAnimationFrame(draw);
    }
  });

  // resize 防抖
  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(start, 200);
  });

  start();
})();

// ---------- 导航滚动磨砂 ----------
const nav = document.querySelector('.nav');
const onScroll = () => {
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- 移动端菜单 ----------
const toggle = document.querySelector('.nav-toggle');
const links  = document.querySelector('.nav-links');
toggle?.addEventListener('click', () => links.classList.toggle('open'));
links?.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => links.classList.remove('open'))
);

// ---------- 厂房 Carousel(左右滚动) ----------
(function initCarousel() {
  const track = document.getElementById('facility-track');
  if (!track) return;

  document.querySelectorAll('.carousel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const dir = btn.dataset.dir;
      const first = track.querySelector('.carousel-item');
      if (!first) return;
      const step = first.offsetWidth + 20; // gap=20
      track.scrollBy({
        left: dir === 'next' ? step : -step,
        behavior: 'smooth'
      });
    });
  });
})();

// ---------- Scroll reveal ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- 数字滚动 ----------
const counters = document.querySelectorAll('[data-count]');
const countIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.count;
    const dur = 1400;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    countIO.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => countIO.observe(c));

// ---------- 新闻数据(全站共用一份) ----------
const newsPromise = fetch('data/news.json').then(r => r.json());

const escapeHtml = (s = '') => s.replace(/[&<>"']/g, c => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[c]));

// 卡片模板(首页 + 列表页都用)
const newsCardHTML = (n, i = 0) => `
  <a class="news-card reveal d-${Math.min(i, 4)}" href="news-detail.html?id=${encodeURIComponent(n.id)}">
    <div class="news-card-cover">
      ${n.cover
        ? `<img src="${n.cover}" alt="">`
        : `<img class="news-card-logo" src="assets/logo/logo-mark.png" alt="">`}
    </div>
    <div class="news-card-body">
      <div class="news-card-meta">
        <span class="news-tag">${escapeHtml(n.tag)}</span>
        <span class="news-date">${escapeHtml(n.date)}</span>
      </div>
      <h3 class="news-card-title">${escapeHtml(n.title)}</h3>
      <p class="news-card-sum">${escapeHtml(n.summary)}</p>
      <span class="news-card-more">阅读全文 →</span>
    </div>
  </a>
`;

// 首页:最新 3 条卡片
const previewEl = document.getElementById('news-preview');
if (previewEl) {
  newsPromise.then(list => {
    const sorted = list.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
    previewEl.innerHTML = sorted.slice(0, 3).map((n, i) => newsCardHTML(n, i)).join('');
    previewEl.querySelectorAll('.reveal').forEach(el => io.observe(el));
  });
}

// 新闻列表页:全部新闻 + tag 筛选
const fullEl = document.getElementById('news-full');
if (fullEl) {
  newsPromise.then(list => {
    const sorted = list.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
    // 注入分类按钮
    const filtersEl = document.getElementById('filters');
    const tags = [...new Set(sorted.map(n => n.tag))];
    tags.forEach(t => {
      const b = document.createElement('button');
      b.className = 'filter';
      b.dataset.tag = t;
      b.textContent = t;
      filtersEl.appendChild(b);
    });
    const render = (tag) => {
      const data = tag === 'all' ? sorted : sorted.filter(n => n.tag === tag);
      fullEl.innerHTML = data.map((n, i) => newsCardHTML(n, i)).join('');
      fullEl.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('in'); // 列表页直接显示,不等滚动
      });
    };
    render('all');
    filtersEl.addEventListener('click', e => {
      const btn = e.target.closest('.filter');
      if (!btn) return;
      filtersEl.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.tag);
    });
  });
}

// 新闻详情页:根据 ?id= 加载
const articleEl = document.getElementById('article-content');
if (articleEl) {
  const id = new URLSearchParams(location.search).get('id');
  newsPromise.then(list => {
    const n = list.find(x => x.id === id);
    if (!n) {
      articleEl.innerHTML = `
        <h1 class="h-title">未找到该新闻</h1>
        <p>请返回 <a href="news.html" style="color:var(--c-deep);text-decoration:underline">新闻列表</a> 重新选择。</p>`;
      return;
    }
    document.getElementById('page-title').textContent = `${n.title} · 基元合生`;
    document.getElementById('crumb-title').textContent = n.title;
    articleEl.innerHTML = `
      <div class="article-meta">
        <span class="news-tag">${escapeHtml(n.tag)}</span>
        <span class="article-date">${escapeHtml(n.date)}</span>
      </div>
      <h1 class="article-title">${escapeHtml(n.title)}</h1>
      <p class="article-summary">${escapeHtml(n.summary)}</p>
      ${n.cover ? `<div class="article-cover"><img src="${n.cover}" alt=""></div>` : ''}
      <div class="article-body">${n.body || ''}</div>
    `;
  });
}

// ---------- 联系表单(占位提示) ----------
document.getElementById('contact-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('感谢您的留言!后续将接入后端处理。');
  e.target.reset();
});

// ---------- 平滑滚动(给非锚点的偏移修正) ----------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const tgt = document.querySelector(id);
    if (!tgt) return;
    e.preventDefault();
    const top = tgt.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
