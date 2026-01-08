/* =========================================
   EVENTS ENGINE – ENTERPRISE PRODUCTION GRADE
   ========================================= */

const SHEET_MISSION = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRN0N7BjlpK9kjL923oPBw3mpreD9ofgLMP5YX8_yTQXDwuzw_PPMsLZOKnyZnZzJVBS4KmTD07tyXx/pub?output=csv';
const SHEET_CORPORATE = 'https://docs.google.com/spreadsheets/d/1RRhfYSCEpKzlbjfIWirapC0eiaJGlZ4u9P_EQZfstQM/gviz/tq?tqx=out:csv&gid=258527421';

let eventStore = [];       
let filteredStore = [];    
let calDate = new Date(); // Defaults to current system date (Jan 2026)
let viewMode = 'grid';
let currentCategory = 'ALL';

const MONTHS = {
  jan: 0, february: 1, feb: 1, mar: 2, march: 2, apr: 3, april: 3, may: 4, 
  jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7, sep: 8, sept: 8, 
  oct: 9, nov: 10, dec: 11
};

/**
 * 1. INITIALIZATION
 */
window.addEventListener('load', initCalendar);

async function initCalendar() {
  try {
    console.log("Synchronizing Global Database...");
    const [mRes, cRes] = await Promise.all([fetch(SHEET_MISSION), fetch(SHEET_CORPORATE)]);
    const missionRows = parseCSV(await mRes.text());
    const corporateRows = parseCSV(await cRes.text());

    eventStore = [
      ...missionRows.flatMap(expandMissionRow),
      ...corporateRows.flatMap(expandCorporateRow)
    ];

    filteredStore = [...eventStore]; 

    bindUI();
    renderSidebar(); 
    updateNavLabel();
    updateEventCount();
    renderCalendar(); 
  } catch (err) {
    console.error('Portal Sync Failed:', err);
  }
}

/* --- CSV PARSER --- */
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').replace(/\s+/g, '').toLowerCase());
  return lines.slice(1).map(row => {
    const cells = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (cells[i] || '').replace(/"/g, '').trim(); });
    return obj;
  });
}

/* --- DATA EXPANSION (REGEX POWERED) --- */
function expandMissionRow(row) {
  const src = row.importantdays;
  if (!src) return [];
  return src.split(',').map(chunk => {
    if (!chunk.includes(':')) return null;
    const [label, dateStr] = chunk.split(':');
    
    const dayMatch = dateStr.match(/\d+/);
    const monthMatch = dateStr.match(/[a-zA-Z]+/);
    
    if (!dayMatch || !monthMatch) return null;
    
    const day = parseInt(dayMatch[0], 10);
    const monthStr = monthMatch[0].toLowerCase().substring(0, 3);
    const month = MONTHS[monthStr];
    
    if (isNaN(day) || month === undefined) return null;
    return { label: label.trim(), day, month, type: 'mission', raw: row };
  }).filter(Boolean);
}

function expandCorporateRow(row) {
  const src = row.eventdate1;
  if (!src) return [];
  return src.split(',').map(d => {
    const dayMatch = d.match(/\d+/);
    const monthMatch = d.match(/[a-zA-Z]+/);
    
    if (!dayMatch || !monthMatch) return null;

    const day = parseInt(dayMatch[0], 10);
    const monthStr = monthMatch[0].toLowerCase().substring(0, 3);
    const month = MONTHS[monthStr];

    if (month === undefined || isNaN(day)) return null;
    return { label: row.event1 || 'Corporate Event', day, month, type: 'corporate', raw: row };
  }).filter(Boolean);
}

/* --- CORE RENDERING --- */
function renderCalendar() {
  if (viewMode === 'grid') renderGrid();
  else renderList();
}

function renderGrid() {
  const grid = document.getElementById('calGridContainer');
  if (!grid) return;
  grid.innerHTML = '';

  const m = calDate.getMonth();
  const y = calDate.getFullYear();
  const today = new Date();

  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
    grid.insertAdjacentHTML('beforeend', `<div class="cal-day-label">${d}</div>`);
  });

  const start = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  for (let i = 0; i < start; i++) {
    grid.insertAdjacentHTML('beforeend', `<div class="cal-day-cell empty"></div>`);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === today.getDate() && m === today.getMonth() && y === today.getFullYear();
    let cellHTML = `<div class="cal-day-cell ${isToday ? 'is-today' : ''}">
                      <span class="cal-day-num">${day}</span>
                      <div class="flex flex-col gap-1">`;
    
    // Strict match using Numbers to ensure Mission events appear
    const dayEvents = filteredStore.filter(e => Number(e.day) === day && Number(e.month) === m);
    
    dayEvents.forEach(ev => {
      const idx = eventStore.indexOf(ev);
      cellHTML += `<button class="cal-event-chip ${ev.type}" onclick="openEnterpriseModal(${idx})" title="${escapeAttr(ev.label)}">${escapeHtml(ev.label)}</button>`;
    });

    grid.insertAdjacentHTML('beforeend', cellHTML + `</div></div>`);
  }
}

function renderList() {
  const list = document.getElementById('calListView');
  if (!list) return;
  list.innerHTML = '';
  const m = calDate.getMonth();
  const monthName = calDate.toLocaleString('default', { month: 'short' });
  const daysInMonth = new Date(calDate.getFullYear(), m + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const events = filteredStore.filter(e => Number(e.day) === day && Number(e.month) === m);
    if (!events.length) continue;
    let block = `<div class="p-6 border-b border-slate-100 bg-white mb-4 rounded-2xl shadow-sm">
                   <div class="text-[10px] font-black text-red-500 uppercase tracking-widest mb-4">${monthName} ${day}</div>`;
    events.forEach(ev => {
      const idx = eventStore.indexOf(ev);
      block += `<div class="flex items-center justify-between py-3 hover:bg-slate-50 rounded-xl px-4 cursor-pointer transition-all" onclick="openEnterpriseModal(${idx})">
                  <span class="text-sm font-bold text-slate-700">${escapeHtml(ev.label)}</span>
                  <span class="ent-badge ${ev.type === 'corporate' ? 'badge-corporate' : 'badge-mission'} scale-75">${ev.type}</span>
                </div>`;
    });
    list.insertAdjacentHTML('beforeend', block + `</div>`);
  }
}

/* --- SIDEBAR & FILTERS --- */
function renderSidebar() {
  const container = document.getElementById('eventSidebarFilters');
  if (!container) return;
  const types = [...new Set(eventStore.map(e => e.type))];
  let html = `<button onclick="filterByType('ALL', this)" class="side-filter-btn active w-full"><span>All Activities</span><span class="count-pill">${eventStore.length}</span></button>`;
  types.forEach(t => {
    const count = eventStore.filter(e => e.type === t).length;
    html += `<button onclick="filterByType('${t}', this)" class="side-filter-btn w-full"><span>${t}</span><span class="count-pill">${count}</span></button>`;
  });
  container.innerHTML = html;
}

function filterByType(type, btn) {
  document.querySelectorAll('.side-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentCategory = type;
  applyFilters();
}

function applyFilters() {
  const search = (document.getElementById('eventSearchInput')?.value || '').toLowerCase();
  filteredStore = eventStore.filter(ev => {
    const matchesType = currentCategory === 'ALL' || ev.type === currentCategory;
    const matchesSearch = ev.label.toLowerCase().includes(search) || 
                          (ev.raw?.country || '').toLowerCase().includes(search) ||
                          (ev.raw?.region || '').toLowerCase().includes(search);
    return matchesType && matchesSearch;
  });
  renderCalendar();
  updateEventCount();
}

/* --- MODAL ENGINE --- */
function openEnterpriseModal(idx) {
  const ev = eventStore[idx];
  if (!ev) return;

  const overlay = document.getElementById('enterpriseModal');
  const body = document.getElementById('mDateContainer');
  document.getElementById('mTitle').textContent = ev.label;

  const dateLabel = new Date(2026, ev.month, ev.day).toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' });

  let html = `<div class="flex items-center gap-3 mb-6">
                <span class="ent-badge ${ev.type === 'corporate' ? 'badge-corporate' : 'badge-mission'}">${ev.type.toUpperCase()}</span>
                <span class="text-slate-400 text-[11px] font-black uppercase tracking-widest">${dateLabel}</span>
              </div>`;

  if (ev.type === 'corporate') {
    if (ev.raw?.region || ev.raw?.location) {
      html += `<div class="flex gap-8 mb-6">
                ${ev.raw.region ? `<div><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Region</p><p class="text-sm font-bold">${escapeHtml(ev.raw.region)}</p></div>` : ''}
                ${ev.raw.location ? `<div><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Location</p><p class="text-sm font-bold">${escapeHtml(ev.raw.location)}</p></div>` : ''}
              </div>`;
    }
    if (ev.raw?.details1) {
      html += `<div class="mb-6"><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Details</p><p class="text-sm text-slate-600 leading-relaxed">${escapeHtml(ev.raw.details1)}</p></div>`;
    }
    const safeLink = sanitizeUrl(ev.raw?.eventlink1);
    if (safeLink) {
      html += `<a href="${safeLink}" target="_blank" class="modal-cta-btn"><i class="ri-external-link-line"></i> ${escapeHtml(ev.raw.cta1 || 'View Details')}</a>`;
    }
  } else {
    // Mission Layout
    if (ev.raw?.country) html += `<div class="text-xl font-black text-slate-900 mb-4">${escapeHtml(ev.raw.country)}</div>`;
    const addr = ev.raw?.address || ev.raw?.address2 || ev.raw?.address3;
    if (addr) html += `<div class="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex gap-3"><i class="ri-map-pin-2-fill text-red-600"></i><p class="text-sm text-slate-600">${escapeHtml(addr)}</p></div>`;
  }

  body.innerHTML = html;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  const modalBox = overlay.querySelector('.ent-modal');
  setTimeout(() => { modalBox.classList.remove('opacity-0', 'scale-95'); modalBox.classList.add('opacity-100', 'scale-100'); }, 10);
}

function closeEnterpriseModal() {
  const overlay = document.getElementById('enterpriseModal');
  const modalBox = overlay.querySelector('.ent-modal');
  modalBox.classList.add('opacity-0', 'scale-95');
  setTimeout(() => { overlay.style.display = 'none'; document.body.style.overflow = ''; }, 200);
}

/* --- HELPERS & UI --- */
function bindUI() {
  document.getElementById('btnPrev')?.addEventListener('click', () => changeMonth(-1));
  document.getElementById('btnNext')?.addEventListener('click', () => changeMonth(1));
  document.getElementById('btnToday')?.addEventListener('click', goToToday);
  document.getElementById('btnGrid')?.addEventListener('click', () => toggleCalView('grid'));
  document.getElementById('btnList')?.addEventListener('click', () => toggleCalView('list'));
  document.getElementById('eventSearchInput')?.addEventListener('keyup', applyFilters);
  document.getElementById('btnCloseModal')?.addEventListener('click', closeEnterpriseModal);
}

function changeMonth(d) { calDate.setMonth(calDate.getMonth() + d); updateNavLabel(); renderCalendar(); }
function goToToday() { calDate = new Date(); updateNavLabel(); renderCalendar(); }
function toggleCalView(v) { 
  viewMode = v; 
  document.querySelectorAll('.ent-seg-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(v === 'grid' ? 'btnGrid' : 'btnList')?.classList.add('active');
  document.getElementById('calGridContainer').style.display = v === 'grid' ? 'grid' : 'none'; 
  document.getElementById('calListView').style.display = v === 'list' ? 'block' : 'none'; 
  renderCalendar(); 
}

function updateNavLabel() { 
  const m = ['January','February','March','April','May','June','July','August','September','October','November','December']; 
  document.getElementById('curDateLabel').innerText = `${m[calDate.getMonth()]} ${calDate.getFullYear()}`; 
}

function updateEventCount() { 
  const el = document.getElementById('eventsCount'); 
  if (el) el.innerText = `${filteredStore.length} Global Activities Detected`; 
}

function escapeHtml(s) { return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
function escapeAttr(s) { return escapeHtml(s).replace(/`/g,'&#96;'); }
function sanitizeUrl(u) { try { const res = new URL(String(u), window.location.href); return (res.protocol==='http:'||res.protocol==='https:') ? res.href : ''; } catch { return ''; } }
