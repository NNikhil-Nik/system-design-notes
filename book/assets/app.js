const CHAPTERS = [
  {n:1, title:'Scale From Zero to Millions of Users', blurb:'Grow a single server into a global system, one building block at a time.', group:'Foundations', level:'Beginner'},
  {n:2, title:'Back-of-the-Envelope Estimation', blurb:'Quick math for QPS, storage and bandwidth — and the numbers every engineer should know.', group:'Foundations', level:'Beginner'},
  {n:3, title:'A Framework for System Design Interviews', blurb:'The 4-step recipe for running a 45-minute design interview with confidence.', group:'Foundations', level:'Beginner'},
  {n:4, title:'Design a Rate Limiter', blurb:'Stop abuse by capping how many requests a client can make.', group:'Building Blocks', level:'Intermediate'},
  {n:5, title:'Design Consistent Hashing', blurb:'Spread data across servers so adding a server barely moves anything.', group:'Building Blocks', level:'Intermediate'},
  {n:6, title:'Design a Key-Value Store', blurb:'Build a DynamoDB-style database: replication, quorum, conflicts and failures.', group:'Building Blocks', level:'Advanced'},
  {n:7, title:'Design a Unique ID Generator', blurb:'Generate billions of unique, sortable IDs across many machines.', group:'Building Blocks', level:'Intermediate'},
  {n:8, title:'Design a URL Shortener', blurb:'Turn long links into short ones — hashing, base62 and redirects.', group:'Real Systems', level:'Beginner'},
  {n:9, title:'Design a Web Crawler', blurb:'Download the web politely: frontier queues, dedup and traps.', group:'Real Systems', level:'Intermediate'},
  {n:10, title:'Design a Notification System', blurb:'Push, SMS and email at scale with queues, retries and opt-outs.', group:'Real Systems', level:'Intermediate'},
  {n:11, title:'Design a News Feed System', blurb:'Build a Facebook-style feed: fanout on write vs fanout on read.', group:'Real Systems', level:'Intermediate'},
  {n:12, title:'Design a Chat System', blurb:'Real-time messaging with WebSockets, presence and message sync.', group:'Real Systems', level:'Advanced'},
  {n:13, title:'Design a Search Autocomplete System', blurb:'Suggest top searches as you type, using tries and data pipelines.', group:'Real Systems', level:'Advanced'},
  {n:14, title:'Design YouTube', blurb:'Upload, transcode and stream video worldwide with CDNs.', group:'Real Systems', level:'Advanced'},
  {n:15, title:'Design Google Drive', blurb:'File sync across devices: block storage, deltas and conflicts.', group:'Real Systems', level:'Advanced'},
  {n:16, title:'The Learning Continues', blurb:'Where to go next: real-world architectures and engineering blogs.', group:'Wrap Up', level:'Beginner'},
];
const pad = n => String(n).padStart(2,'0');
const href = n => `ch${pad(n)}.html`;
const DONE_KEY = 'sd-done';
const getDone = () => new Set(JSON.parse(localStorage.getItem(DONE_KEY) || '[]'));
const saveDone = s => localStorage.setItem(DONE_KEY, JSON.stringify([...s]));

const savedTheme = localStorage.getItem('sd-theme');
if (savedTheme) document.documentElement.dataset.theme = savedTheme;

function buildSidebar(current) {
  const done = getDone();
  let html = `<div class="sb-head"><a class="sb-brand" href="index.html">System Design <span>Interview</span></a>
    <div class="sb-sub">Alex Xu · Volume 1 · Beginner's guide</div>
    <div class="sb-progress">${done.size} of ${CHAPTERS.length} chapters done<div class="sb-bar"><div style="width:${done.size/CHAPTERS.length*100}%"></div></div></div></div><nav class="sb-nav">`;
  let group = '';
  for (const c of CHAPTERS) {
    if (c.group !== group) { group = c.group; html += `<div class="sb-group">${group}</div>`; }
    const cls = ['sb-link', c.n === current ? 'active' : '', done.has(c.n) ? 'done' : ''].join(' ');
    html += `<a class="${cls}" href="${href(c.n)}"><span class="sb-num">${done.has(c.n) ? '✓' : c.n}</span>${c.title}</a>`;
  }
  html += `</nav><div class="sb-foot"><a class="btn" href="index.html">Home</a><button class="btn" id="theme-btn">Toggle theme</button></div>`;
  const aside = document.createElement('aside');
  aside.className = 'sidebar';
  aside.innerHTML = html;
  return aside;
}

function slugify(t) { return t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }

function buildToc(main) {
  const heads = main.querySelectorAll('h2');
  if (!heads.length) return null;
  const toc = document.createElement('aside');
  toc.className = 'toc';
  toc.innerHTML = '<div class="toc-title">On this page</div>';
  heads.forEach(h => {
    if (!h.id) h.id = slugify(h.textContent);
    const a = document.createElement('a');
    a.href = '#' + h.id; a.textContent = h.textContent;
    toc.appendChild(a);
  });
  const links = [...toc.querySelectorAll('a')];
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, {rootMargin: '0px 0px -70% 0px'});
  heads.forEach(h => obs.observe(h));
  return toc;
}

function buildFooter(n) {
  const done = getDone();
  const prev = CHAPTERS.find(c => c.n === n - 1);
  const next = CHAPTERS.find(c => c.n === n + 1);
  const f = document.createElement('div');
  f.className = 'ch-footer';
  f.innerHTML = `<div class="complete-box"><div><strong>Finished this chapter?</strong><div class="muted" style="font-size:14px">Mark it done to track your progress in the sidebar.</div></div>
    <button class="btn ${done.has(n) ? 'success' : 'primary'}" id="done-btn">${done.has(n) ? '✓ Completed' : 'Mark as complete'}</button></div>
    <div class="pager">${prev ? `<a class="prev" href="${href(prev.n)}"><small>← Previous</small>${prev.n}. ${prev.title}</a>` : ''}
    ${next ? `<a class="next" href="${href(next.n)}"><small>Next →</small>${next.n}. ${next.title}</a>` : ''}</div>`;
  f.querySelector('#done-btn').addEventListener('click', e => {
    const s = getDone();
    s.has(n) ? s.delete(n) : s.add(n);
    saveDone(s);
    location.reload();
  });
  return f;
}

function init() {
  const n = Number(document.body.dataset.chapter || 0);
  const main = document.querySelector('main');
  const page = document.createElement('div');
  page.className = 'page';
  main.parentNode.insertBefore(page, main);
  page.appendChild(main);
  main.classList.add('content');

  const bar = document.createElement('div');
  bar.id = 'read-progress';
  document.body.prepend(bar);
  document.body.prepend(buildSidebar(n));

  const mobile = document.createElement('div');
  mobile.className = 'mobile-bar';
  mobile.innerHTML = `<button class="btn" id="menu-btn">☰</button><span>${n ? `Ch ${n} · ${CHAPTERS[n-1].title}` : 'System Design Interview'}</span>`;
  page.before(mobile);
  mobile.querySelector('#menu-btn').addEventListener('click', () => document.body.classList.toggle('sb-open'));
  page.addEventListener('click', () => document.body.classList.remove('sb-open'));

  if (n) {
    const toc = buildToc(main);
    if (toc) page.appendChild(toc);
    main.appendChild(buildFooter(n));
    document.title = `Ch ${n} · ${CHAPTERS[n-1].title} — System Design`;
  } else {
    const grid = document.getElementById('chapter-grid');
    if (grid) {
      const done = getDone();
      grid.innerHTML = CHAPTERS.map(c => `<a class="ch-card ${done.has(c.n) ? 'done' : ''}" href="${href(c.n)}">
        <div class="n">CHAPTER ${pad(c.n)}</div><h3>${c.title}</h3><p>${c.blurb}</p><span class="lvl">${c.level}</span></a>`).join('');
    }
  }

  document.getElementById('theme-btn').addEventListener('click', () => {
    const t = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = t;
    localStorage.setItem('sd-theme', t);
  });
  addEventListener('scroll', () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
  }, {passive: true});
}
init();
