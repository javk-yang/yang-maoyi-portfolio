const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const toast = $('.toast');
let toastTimer;
function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

const viewer = $('#viewer');
const viewerContent = $('.viewer-content', viewer);
const caseDialog = $('#caseDialog');
const caseContent = $('.case-content', caseDialog);
const cases = {
  workbench: {
    number: '01', category: 'AI APPLICATION / 2026', title: '企业 AI 工作台',
    intro: '以多角色 Agent 协作承接案件处理流程，将读取、研判、分派与记录组织在统一工作台中。',
    challenge: '业务信息分散在不同入口，判断和分派依赖人工衔接。项目需要让每一步的依据、状态和结果都能被看见。',
    approach: '以案件执行 Agent 为总控，将数据抓取、两轮研判、部门分派和台账记录拆成可追踪的步骤；通过工作台呈现任务与对话。',
    images: [
      ['assets/images/ai-workbench.png', '源一 AI 工作台对话界面'],
      ['assets/images/agent-cards.png', '多 Agent 角色与能力配置'],
      ['assets/images/case-ledger.png', '案件分派台账视图']
    ]
  },
  dispatch: {
    number: '02', category: 'AGENT WORKFLOW / 2026', title: '智能分派 Agent',
    intro: '围绕两江新区商务委案件处理场景，设计从数据读取到部门分派的五步执行流程。',
    challenge: '案件来源、判断标准与分派结果需要在一个连续流程中对应起来，便于人工复核和后续追踪。',
    approach: '读取案件 → 获取数据 → 第一次判断 → 第二次判断 → 分派与回写；各步骤分别对应专门的 Agent 或数据操作。',
    images: [
      ['assets/images/agent-flow.png', '五步 Agent 工作流'],
      ['assets/images/agent-cards.png', 'Agent 角色分工'],
      ['assets/images/case-ledger.png', '案件台账与分派记录']
    ]
  },
  lifecycle: {
    number: '03', category: 'PROCESS DESIGN / 2026', title: '工程项目 AI 化规划',
    intro: '梳理工程项目从前期准备到验收结算的全生命周期，并识别适合由 AI 协助的业务节点。',
    challenge: '跨部门项目资料、审批与台账分布在多个环节，只有先明确责任和资料流向，才能确定自动化范围。',
    approach: '先画出业务流程与部门职责，再整理各部门资料清单和阶段计划，作为 Agent 场景规划与平台建设的依据。',
    images: [
      ['assets/images/project-process.png', '项目全生命周期流程'],
      ['assets/images/material-list.png', '部门资料清单'],
      ['assets/images/project-plan.png', '第一阶段项目计划']
    ]
  }
};
function openCase(key) {
  const item = cases[key];
  if (!item) return;
  caseContent.innerHTML = `<div class="case-hero"><div class="case-meta"><span>CASE STUDY ${item.number}</span><span>${item.category}</span></div><h2>${item.title}</h2><p>${item.intro}</p></div><div class="case-columns"><div><span>01 / 业务问题</span><p>${item.challenge}</p></div><div><span>02 / 设计路径</span><p>${item.approach}</p></div></div><div class="case-gallery">${item.images.map(([src, caption], index) => `<figure><img src="${src}" alt="${caption}" loading="lazy"><figcaption><span>0${index + 1}</span>${caption}</figcaption></figure>`).join('')}</div><div class="case-ending">从流程到界面，让每一步都有依据。<span>END OF CASE ↗</span></div>`;
  caseDialog.showModal();
}
$('.case-close').addEventListener('click', () => caseDialog.close());
caseDialog.addEventListener('click', event => { if (event.target === caseDialog) caseDialog.close(); });
document.addEventListener('click', event => {
  const trigger = event.target.closest('.case-trigger');
  if (trigger && !document.body.classList.contains('editing')) openCase(trigger.dataset.case);
});
function closeViewer() {
  $('video', viewer)?.pause();
  viewer.close();
  viewerContent.replaceChildren();
}
$('.viewer-close').addEventListener('click', closeViewer);
viewer.addEventListener('click', event => { if (event.target === viewer) closeViewer(); });
document.addEventListener('click', event => {
  const imageButton = event.target.closest('.image-trigger');
  const videoButton = event.target.closest('.video-trigger');
  if (!imageButton && !videoButton) return;
  if (document.body.classList.contains('editing')) return;
  if (imageButton) {
    const image = new Image();
    image.src = imageButton.dataset.src;
    image.alt = $('img', imageButton)?.alt || '作品大图';
    viewerContent.replaceChildren(image);
  } else {
    const video = document.createElement('video');
    video.src = videoButton.dataset.video;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    viewerContent.replaceChildren(video);
  }
  viewer.showModal();
});

const manager = $('#manager');
const menuToggle = $('#menuToggle');
menuToggle.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
$$('.site-nav a').forEach(link => link.addEventListener('click', () => {
  document.body.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));
$('#openManager').addEventListener('click', () => {
  document.body.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  manager.showModal();
});
$('.manager-close').addEventListener('click', () => manager.close());
manager.addEventListener('click', event => { if (event.target === manager) manager.close(); });
$('#copyWechat').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText($('#copyWechat').dataset.copy); notify('微信号已复制'); }
  catch { notify('复制失败，请手动复制'); }
});
$('#showMoreFilms').addEventListener('click', event => {
  const expanded = $('.film-grid').classList.toggle('expanded');
  event.currentTarget.setAttribute('aria-expanded', String(expanded));
  event.currentTarget.firstChild.textContent = expanded ? '收起影像作品 ' : '查看全部影像作品 ';
});

// Keep the same database name and store as the previous version, so existing uploads survive.
const DB_NAME = 'yang-maoyi-portfolio';
const STORE = 'works';
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function dbRequest(mode, action) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, mode);
    const request = action(transaction.objectStore(STORE));
    let result;
    request.onsuccess = () => { result = request.result; };
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => { db.close(); resolve(result); };
    transaction.onerror = () => { db.close(); reject(transaction.error); };
  });
}
const getWorks = () => dbRequest('readonly', store => store.getAll());
const getWork = id => dbRequest('readonly', store => store.get(id));
const putWork = work => dbRequest('readwrite', store => store.put(work));
const removeWork = id => dbRequest('readwrite', store => store.delete(id));

const hiddenKey = 'portfolio-hidden-defaults';
function getHidden() {
  try { return JSON.parse(localStorage.getItem(hiddenKey) || '[]'); }
  catch { return []; }
}
function saveHidden(ids) { localStorage.setItem(hiddenKey, JSON.stringify(ids)); }
const defaultCards = $$('.work-card[data-source="default"]');
function syncDefaults() {
  const hidden = new Set(getHidden());
  defaultCards.forEach(card => card.classList.toggle('is-hidden', hidden.has(card.dataset.workId)));
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function mediaButton(work, className) {
  const video = work.media.type.startsWith('video/');
  const button = el('button', `${className} ${video ? 'video-trigger' : 'image-trigger'}`);
  button.type = 'button';
  button.setAttribute('aria-label', `${video ? '播放' : '查看'}${work.title}`);
  const url = URL.createObjectURL(work.media);
  button.dataset[video ? 'video' : 'src'] = url;
  const visual = video ? el('video') : new Image();
  visual.src = url;
  visual.alt = work.title;
  if (video) { visual.muted = true; visual.playsInline = true; visual.preload = 'metadata'; }
  button.append(visual);
  return button;
}
function createCustomCard(work) {
  const category = ['ai', 'video', 'photo'].includes(work.category) ? work.category : 'ai';
  const card = el('article', `work-card custom-work ${category === 'ai' ? 'ai-row' : category === 'video' ? 'film-card' : 'photo-card'}`);
  card.dataset.category = category;
  card.dataset.workId = work.id;
  card.dataset.source = 'custom';
  const badge = el('span', 'custom-badge', 'NEW');
  card.append(badge);
  if (category === 'ai') {
    card.append(el('span', 'row-num', '✳'));
    const title = el('div', 'row-title');
    title.append(el('small', '', work.meta || 'AI PROJECT'));
    title.append(el('h3', '', work.title));
    title.append(el('p', '', work.description));
    card.append(title);
    const preview = mediaButton(work, 'row-preview');
    preview.append(el('span', '', '↗'));
    card.append(preview);
  } else if (category === 'video') {
    const media = mediaButton(work, 'film-media');
    media.append(el('span', 'play-button', '▶'));
    card.append(media);
    const info = el('div', 'film-info');
    info.append(el('span', '', work.meta || 'VIDEO WORK'));
    info.append(el('h3', '', work.title));
    info.append(el('p', '', work.description));
    card.append(info);
  } else {
    const media = mediaButton(work, 'photo-media');
    media.append(el('span', 'photo-arrow', '↗'));
    card.append(media);
    const info = el('div', 'photo-info');
    info.append(el('span', '', work.meta || 'VISUAL WORK'));
    info.append(el('h3', '', work.title));
    info.append(el('p', '', work.description));
    card.append(info);
  }
  addDeleteButton(card);
  const editButton = el('button', 'edit-work', '编辑作品');
  editButton.type = 'button';
  card.append(editButton);
  return card;
}
function addDeleteButton(card) {
  if ($('.delete-work', card)) return;
  const button = el('button', 'delete-work', '删除作品');
  button.type = 'button';
  card.append(button);
}
defaultCards.forEach(addDeleteButton);
async function refreshWorks() {
  $$('.custom-work').forEach(card => card.remove());
  const works = await getWorks();
  works.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  works.forEach(work => {
    const container = $(`[data-category-container="${work.category}"]`) || $('[data-category-container="ai"]');
    container.append(createCustomCard(work));
  });
  $('#customCount').textContent = works.length;
  return works;
}

let editing = false;
let editingId = null;
$('#toggleEdit').addEventListener('click', () => {
  editing = !editing;
  document.body.classList.toggle('editing', editing);
  $('#toggleEdit').firstChild.textContent = editing ? '关闭管理模式 ' : '开启管理模式 ';
  manager.close();
  notify(editing ? '管理模式已开启，可以编辑或删除作品' : '管理模式已关闭');
});
$('#toggleEdit').firstChild.textContent = '开启管理模式 ';
document.addEventListener('click', async event => {
  const button = event.target.closest('.edit-work');
  if (!button || !editing) return;
  event.stopPropagation();
  const work = await getWork(button.closest('.work-card').dataset.workId);
  if (!work) { notify('作品未找到'); return; }
  editingId = work.id;
  const form = $('#workForm');
  form.elements.category.value = work.category;
  form.elements.title.value = work.title;
  form.elements.description.value = work.description;
  form.elements.meta.value = work.meta || '';
  form.elements.tags.value = work.tags || '';
  fileInput.required = false;
  $('.manager-header h2').textContent = '编辑作品';
  $('.submit-work').firstChild.textContent = '保存修改 ';
  const preview = $('#uploadPreview');
  preview.replaceChildren();
  const mediaURL = URL.createObjectURL(work.media);
  const visual = work.media.type.startsWith('video/') ? el('video') : new Image();
  visual.src = mediaURL;
  if (visual.tagName === 'VIDEO') visual.controls = true;
  preview.append(visual);
  manager.showModal();
});
document.addEventListener('click', async event => {
  const button = event.target.closest('.delete-work');
  if (!button || !editing) return;
  event.stopPropagation();
  const card = button.closest('.work-card');
  try {
    if (card.dataset.source === 'custom') {
      await removeWork(card.dataset.workId);
      card.remove();
      $('#customCount').textContent = (await getWorks()).length;
    } else {
      const hidden = new Set(getHidden());
      hidden.add(card.dataset.workId);
      saveHidden([...hidden]);
      card.classList.add('is-hidden');
    }
    notify('作品已删除');
  } catch { notify('删除失败，请重试'); }
});
$('#restoreDefaults').addEventListener('click', () => { saveHidden([]); syncDefaults(); notify('默认作品已恢复'); });

let previewURL;
const fileInput = $('#workForm [name="media"]');
manager.addEventListener('close', () => {
  editingId = null;
  $('#workForm').reset();
  fileInput.required = true;
  $('.manager-header h2').textContent = '作品管理';
  $('.submit-work').firstChild.textContent = '发布作品 ';
  $('#uploadPreview').textContent = '素材预览';
});
fileInput.addEventListener('change', () => {
  if (previewURL) URL.revokeObjectURL(previewURL);
  const preview = $('#uploadPreview');
  preview.replaceChildren();
  const file = fileInput.files?.[0];
  if (!file) { preview.textContent = '素材预览'; return; }
  previewURL = URL.createObjectURL(file);
  const visual = file.type.startsWith('video/') ? el('video') : new Image();
  visual.src = previewURL;
  if (visual.tagName === 'VIDEO') visual.controls = true;
  preview.append(visual);
});
$('#workForm').addEventListener('submit', async event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const selectedMedia = form.get('media');
  const previous = editingId ? await getWork(editingId) : null;
  const media = selectedMedia instanceof File && selectedMedia.size ? selectedMedia : previous?.media;
  if (!media?.size) { notify('请选择作品文件'); return; }
  if (media.size > 80 * 1024 * 1024) { notify('单个文件请控制在 80MB 内'); return; }
  const work = {
    id: previous?.id || (crypto.randomUUID ? crypto.randomUUID() : `work-${Date.now()}`),
    category: form.get('category'),
    title: String(form.get('title')).trim(),
    description: String(form.get('description')).trim(),
    meta: String(form.get('meta')).trim(),
    tags: String(form.get('tags')).trim(),
    media,
    createdAt: previous?.createdAt || Date.now()
  };
  try {
    await putWork(work);
    await refreshWorks();
    event.currentTarget.reset();
    $('#uploadPreview').textContent = '素材预览';
    manager.close();
    $(`#${work.category === 'video' ? 'film' : work.category === 'photo' ? 'photo' : 'ai'}`).scrollIntoView({ behavior: 'smooth' });
    notify(previous ? '作品已更新' : '作品已添加');
  } catch { notify('保存失败。请检查浏览器存储空间'); }
});

const blobToDataURL = blob => new Promise(resolve => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.readAsDataURL(blob); });
$('#exportData').addEventListener('click', async () => {
  try {
    const works = await getWorks();
    const portable = await Promise.all(works.map(async work => ({ ...work, media: await blobToDataURL(work.media) })));
    const data = { version: 2, exportedAt: new Date().toISOString(), hiddenDefaults: getHidden(), works: portable };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }));
    const link = el('a'); link.href = url; link.download = `yang-maoyi-portfolio-${new Date().toISOString().slice(0, 10)}.json`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify('备份已导出');
  } catch { notify('导出失败，请重试'); }
});
$('#importData').addEventListener('change', async event => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!Array.isArray(data.works)) throw new Error('Invalid backup');
    for (const item of data.works) {
      if (!item.id || !item.title || !item.media || !['ai', 'video', 'photo'].includes(item.category)) continue;
      const media = await (await fetch(item.media)).blob();
      await putWork({ ...item, media });
    }
    if (Array.isArray(data.hiddenDefaults)) { saveHidden(data.hiddenDefaults); syncDefaults(); }
    await refreshWorks();
    notify('备份已导入');
  } catch { notify('导入失败，请检查备份文件'); }
  event.target.value = '';
});

syncDefaults();
refreshWorks().catch(() => notify('本地作品加载失败'));

// A scroll-led introduction and restrained reveal for the selected works.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealTargets = $$('.chapter-heading, .work-card[data-source="default"], .about-title, .about-body, .contact-section h2');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });
  revealTargets.forEach(target => revealObserver.observe(target));
  document.body.classList.add('motion-ready');

  const story = $('.scroll-story');
  let scrollFrame = 0;
  const updateStory = () => {
    scrollFrame = 0;
    const rect = story.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (innerHeight - rect.top) / (innerHeight + rect.height * 0.35)));
    story.style.setProperty('--story-shift', `${Math.round((1 - progress) * 55)}px`);
    story.style.setProperty('--story-opacity', (0.3 + progress * 0.7).toFixed(3));
  };
  const queueStory = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateStory); };
  addEventListener('scroll', queueStory, { passive: true });
  addEventListener('resize', queueStory);
  updateStory();
}

// Brief confirmation on pointer and keyboard activation of interactive controls.
const feedbackSelector = 'button, .hero-cta, .contact-link, .manage-link, .contact-actions a';
document.addEventListener('pointerdown', event => {
  const control = event.target.closest(feedbackSelector);
  if (control) control.classList.add('is-pressing');
});
['pointerup', 'pointercancel'].forEach(type => document.addEventListener(type, () => {
  $$('.is-pressing').forEach(control => control.classList.remove('is-pressing'));
}));
document.addEventListener('click', event => {
  const control = event.target.closest(feedbackSelector);
  if (!control || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  control.classList.remove('did-click');
  void control.offsetWidth;
  control.classList.add('did-click');
  setTimeout(() => control.classList.remove('did-click'), 420);
});
