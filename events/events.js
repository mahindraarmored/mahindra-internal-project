/* ===============================
   EVENTS ENGINE – AUDITED & REFINED
=============================== */

const SHEET_MISSION = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRN0N7BjlpK9kjL923oPBw3mpreD9ofgLMP5YX8_yTQXDwuzw_PPMsLZOKnyZnZzJVBS4KmTD07tyXx/pub?output=csv';
const SHEET_CORPORATE = 'https://docs.google.com/spreadsheets/d/1RRhfYSCEpKzlbjfIWirapC0eiaJGlZ4u9P_EQZfstQM/gviz/tq?tqx=out:csv&gid=258527421';

let eventStore = [];       // The "Source of Truth"
let filteredStore = [];    // What the user actually sees (after search/filter)
let calDate = new Date();
let viewMode = 'grid';
let currentCategory = 'ALL';
let lastActiveEl = null;

const MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11
};

window.addEventListener('load', initCalendar);

/* --- Update your init function to this exact sequence --- */
async function initCalendar() {
  try {
    const [mRes, cRes] = await Promise.all([fetch(SHEET_MISSION), fetch(SHEET_CORPORATE)]);
    const missionRows = parseCSV(await mRes.text());
    const corporateRows = parseCSV(await cRes.text());

    // 1. Process data
    eventStore = [
      ...missionRows.flatMap(expandMissionRow),
      ...corporateRows.flatMap(expandCorporateRow)
    ];

    // 2. IMPORTANT: Initialize filteredStore immediately
    filteredStore = [...eventStore]; 

    // 3. Bind UI and Render
    bindUI();
    renderSidebar(); 
    updateNavLabel();
    updateEventCount();
    renderCalendar(); // Now this will have data to draw
  } catch (err) {
    console.error('Calendar init failed:', err);
  }
}

/* --- RETAINED: Your specific CSV Regex --- */
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

/* --- NEW: Sidebar & Filter Logic --- */
function renderSidebar() {
    const container = document.getElementById('eventSidebarFilters');
    if (!container) return;
    const types = [...new Set(eventStore.map(e => e.type))];
    let html = `<button onclick="filterByType('ALL', this)" class="side-filter-btn active w-full"><span>All Events</span><span class="count-pill">${eventStore.length}</span></button>`;
    types.forEach(t => {
        const count = eventStore.filter(e => e.type === t).length;
        html += `<button onclick="filterByType('${t}', this)" class="side-filter-btn w-full"><span>${t}</span><span class="count-pill">${count}</span></button>`;
    });
    container.innerHTML = html;
}

function applyFilters() {
    const search = (document.getElementById('eventSearchInput')?.value || '').toLowerCase();
    filteredStore = eventStore.filter(ev => {
        const matchesType = currentCategory === 'ALL' || ev.type === currentCategory;
        const matchesSearch = ev.label.toLowerCase().includes(search) || 
                              (ev.raw?.country || '').toLowerCase().includes(search);
        return matchesType && matchesSearch;
    });
    renderCalendar();
    updateEventCount();
}

function filterByType(type, btn) {
    document.querySelectorAll('.side-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = type;
    applyFilters();
}

/* --- RETAINED: Expansion Logic --- */
function expandMissionRow(row) {
  const src = row.importantdays;
  if (!src) return [];
  return src.split(',').map(chunk => {
    const [label, dateStr] = chunk.split(':');
    if (!label || !dateStr) return null;
    const [dayStr, monthStr] = dateStr.trim().split(' ');
    const day = parseInt(dayStr, 10);
    const month = MONTHS[monthStr?.toLowerCase()];
    if (isNaN(day) || month === undefined) return null;
    return { label: label.trim(), day, month, type: 'mission', raw: row };
  }).filter(Boolean);
}

function expandCorporateRow(row) {
  const src = row.eventdate1;
  if (!src) return [];
  return src.split(',').map(d => {
    const [monthStr, dayStr] = d.trim().split(' ');
    const month = MONTHS[monthStr?.toLowerCase()];
    const day = parseInt(dayStr, 10);
    if (month === undefined || isNaN(day)) return null;
    return { label: row.event1 || 'Corporate Event', day, month, type: 'corporate', raw: row };
  }).filter(Boolean);
}
/* --- The missing Master Renderer --- */
function renderCalendar() {
  if (viewMode === 'grid') {
    renderGrid();
  } else {
    renderList();
  }
}
/* --- UPDATED: Renderers now use filteredStore --- */
function renderGrid() {
  const grid = document.getElementById('calGridContainer');
  if (!grid) return;
  grid.innerHTML = '';

  const m = calDate.getMonth();
  const y = calDate.getFullYear();
  const today = new Date();

  // Draw Day Labels
  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
    grid.insertAdjacentHTML('beforeend', `<div class="cal-day-label">${d}</div>`);
  });

  const start = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  // Empty cells for previous month padding
  for (let i = 0; i < start; i++) {
    grid.insertAdjacentHTML('beforeend', `<div class="cal-day-cell empty"></div>`);
  }

  // Draw actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === today.getDate() && m === today.getMonth() && y === today.getFullYear();
    let cellHTML = `<div class="cal-day-cell ${isToday ? 'is-today' : ''}"><span class="cal-day-num">${day}</span>`;
    
    // Check filteredStore for events on this specific day
    const dayEvents = filteredStore.filter(e => e.day === day && e.month === m);
    
    dayEvents.forEach(ev => {
      const idx = eventStore.indexOf(ev);
      cellHTML += `<button class="cal-event-chip ${ev.type}" onclick="openEnterpriseModal(${idx})" title="${escapeAttr(ev.label)}">${escapeHtml(ev.label)}</button>`;
    });

    grid.insertAdjacentHTML('beforeend', cellHTML + `</div>`);
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
    const events = filteredStore.filter(e => e.day === day && e.month === m);
    if (!events.length) continue;
    let block = `<div class="list-date-group"><div class="list-date-header"><span class="date-badge">${monthName} ${day}</span></div>`;
    events.forEach(ev => {
      const idx = eventStore.indexOf(ev);
      block += `<div class="list-event-item" role="button" onclick="openEnterpriseModal(${idx})"><div class="list-country-title">${escapeHtml(ev.label)}</div></div>`;
    });
    list.insertAdjacentHTML('beforeend', block + `</div>`);
  }
}

/* --- RETAINED: Modal, Navigation, and Helpers --- */
function bindUI() {
  document.getElementById('btnPrev')?.addEventListener('click', () => changeMonth(-1));
  document.getElementById('btnNext')?.addEventListener('click', () => changeMonth(1));
  document.getElementById('btnToday')?.addEventListener('click', goToToday);
  document.getElementById('btnGrid')?.addEventListener('click', () => toggleCalView('grid'));
  document.getElementById('btnList')?.addEventListener('click', () => toggleCalView('list'));
  document.getElementById('eventSearchInput')?.addEventListener('keyup', applyFilters);
  document.getElementById('btnCloseModal')?.addEventListener('click', closeEnterpriseModal);
  document.getElementById('enterpriseModal')?.addEventListener('click', e => { if (e.target?.id === 'enterpriseModal') closeEnterpriseModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeEnterpriseModal(); });
}

function openEnterpriseModal(idx) {
  const ev = eventStore[idx];
  if (!ev) return;
  lastActiveEl = document.activeElement;
  const overlay = document.getElementById('enterpriseModal');
  const body = document.getElementById('mDateContainer');
  const monthName = new Date(2024, ev.month, 1).toLocaleString('default', { month: 'long' });
  document.getElementById('mTitle').textContent = ev.label;

  let html = `<div class="flex items-center gap-3 mb-6"><span class="ent-badge ${ev.type === 'corporate' ? 'badge-corporate' : 'badge-mission'}">${ev.type.toUpperCase()}</span><span class="text-slate-400 text-xs font-bold uppercase tracking-widest">${monthName} ${ev.day}</span></div>`;

  if (ev.type === 'mission') {
    if (ev.raw?.country) html += `<div class="text-sm font-bold mt-4">${escapeHtml(ev.raw.country)}</div>`;
    const addr = ev.raw?.address || ev.raw?.address2 || ev.raw?.address3;
    if (addr) html += `<div class="bg-slate-50 p-4 rounded-xl border mt-4 text-sm text-slate-600"><i class="ri-map-pin-2-line text-red-600 mr-1"></i> ${escapeHtml(addr)}</div>`;
  }

  if (ev.type === 'corporate') {
    if (ev.raw?.details1) html += `<p class="text-sm text-slate-700 mt-4 leading-relaxed">${escapeHtml(ev.raw.details1)}</p>`;
    const safeLink = sanitizeUrl(ev.raw?.eventlink1);
    if (safeLink) html += `<a href="${safeLink}" target="_blank" class="modal-cta-btn"><i class="ri-external-link-line"></i> View Documentation</a>`;
  }

  body.innerHTML = html;
  overlay.style.display = 'flex';
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  overlay.querySelector('.ent-modal').focus();
  overlay.addEventListener('keydown', trapFocus);
}

function closeEnterpriseModal() {
  const overlay = document.getElementById('enterpriseModal');
  if (!overlay) return;
  overlay.style.display = 'none';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  overlay.removeEventListener('keydown', trapFocus);
  if (lastActiveEl) lastActiveEl.focus();
}

function trapFocus(e) {
  if (e.key !== 'Tab') return;
  const modal = document.querySelector('.ent-modal');
  const focusables = Array.from(modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
  const first = focusables[0], last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
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
function updateNavLabel() { const m = ['January','February','March','April','May','June','July','August','September','October','November','December']; document.getElementById('curDateLabel').innerText = `${m[calDate.getMonth()]} ${calDate.getFullYear()}`; }
function updateEventCount() { const el = document.getElementById('eventsCount'); if (el) el.innerText = `${filteredStore.length} activities detected`; }
function escapeHtml(s) { return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
function escapeAttr(s) { return escapeHtml(s).replace(/`/g,'&#96;'); }
function sanitizeUrl(u) { try { const res = new URL(String(u), window.location.href); return (res.protocol==='http:'||res.protocol==='https:') ? res.href : ''; } catch { return ''; } }
