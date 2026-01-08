/* ===============================
   EVENTS ENGINE – FIXED
=============================== */

/* === CSV SOURCES === */
const SHEET_MISSION =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRN0N7BjlpK9kjL923oPBw3mpreD9ofgLMP5YX8_yTQXDwuzw_PPMsLZOKnyZnZzJVBS4KmTD07tyXx/pub?output=csv';

const SHEET_CORPORATE =
  'https://docs.google.com/spreadsheets/d/1RRhfYSCEpKzlbjfIWirapC0eiaJGlZ4u9P_EQZfstQM/gviz/tq?tqx=out:csv&gid=258527421';

/* === STATE === */
let eventStore = [];
let calDate = new Date();
let viewMode = 'grid';

/* === CONSTANTS === */
const MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11
};

/* ===============================
   INIT
=============================== */
window.addEventListener('load', initCalendar);

async function initCalendar() {
  try {
    const [mRes, cRes] = await Promise.all([
      fetch(SHEET_MISSION),
      fetch(SHEET_CORPORATE)
    ]);

    const missionRows = parseCSV(await mRes.text());
    const corporateRows = parseCSV(await cRes.text());

    eventStore = [
      ...missionRows.flatMap(expandMissionRow),
      ...corporateRows.flatMap(expandCorporateRow)
    ];

    bindUI();
    updateNavLabel();
    updateEventCount();
    renderCalendar();

  } catch (err) {
    console.error('Calendar init failed:', err);
  }
}

/* ===============================
   CSV PARSER (FIXED)
=============================== */
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const headers = lines[0]
    .split(',')
    .map(h =>
      h.replace(/"/g, '')
       .replace(/\s+/g, '')
       .toLowerCase()
    );

  return lines.slice(1).map(row => {
    const cells = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = (cells[i] || '').replace(/"/g, '').trim();
    });
    return obj;
  });
}

/* ===============================
   DATA EXPANSION
=============================== */
function expandMissionRow(row) {
  const src = row.importantdays;
  if (!src) return [];

  return src.split(',').map(chunk => {
    const [label, dateStr] = chunk.split(':');
    if (!label || !dateStr) return null;

    const [dayStr, monthStr] = dateStr.trim().split(' ');
    const day = parseInt(dayStr);
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
    const day = parseInt(dayStr);

    if (month === undefined || isNaN(day)) return null;

    return {
      label: row.event1 || 'Corporate Event',
      day,
      month,
      type: 'corporate',
      raw: row
    };
  }).filter(Boolean);
}

/* ===============================
   UI BINDINGS (FIXED)
=============================== */
function bindUI() {
  document.getElementById('btnPrev')?.addEventListener('click', () => changeMonth(-1));
  document.getElementById('btnNext')?.addEventListener('click', () => changeMonth(1));
  document.getElementById('btnToday')?.addEventListener('click', goToToday);
  document.getElementById('btnGrid')?.addEventListener('click', () => toggleCalView('grid'));
  document.getElementById('btnList')?.addEventListener('click', () => toggleCalView('list'));
}

/* ===============================
   RENDERING
=============================== */
function renderCalendar() {
  viewMode === 'grid' ? renderGrid() : renderList();
}

function renderGrid() {
  const grid = document.getElementById('calGridContainer');
  if (!grid) return;

  grid.innerHTML = '';

  const m = calDate.getMonth();
  const y = calDate.getFullYear();
  const today = new Date();

  // Day headers
  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
    grid.insertAdjacentHTML(
      'beforeend',
      `<div class="cal-day-label">${d}</div>`
    );
  });

  const start = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  // Empty cells before first day
  for (let i = 0; i < start; i++) {
    grid.insertAdjacentHTML(
      'beforeend',
      `<div class="cal-day-cell empty"></div>`
    );
  }

  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday =
      day === today.getDate() &&
      m === today.getMonth() &&
      y === today.getFullYear();

    let cellHTML = `
      <div class="cal-day-cell ${isToday ? 'is-today' : ''}">
        <span class="cal-day-num">${day}</span>
    `;

    eventsForDay(day, m).forEach(ev => {
      const idx = eventStore.indexOf(ev);

      cellHTML += `
        <button
          class="cal-event-chip ${ev.type}"
          onclick="openEnterpriseModal(${idx})"
          aria-haspopup="dialog"
          title="${ev.label}">
          ${ev.label}
        </button>
      `;
    });

    cellHTML += `</div>`;

    grid.insertAdjacentHTML('beforeend', cellHTML);
  }
}


function renderList() {
  const list = document.getElementById('calListView');
  if (!list) return;
  list.innerHTML = '';

  const m = calDate.getMonth();
  const monthName = calDate.toLocaleString('default', { month: 'short' });

  for (let day = 1; day <= 31; day++) {
    const events = eventsForDay(day, m);
    if (!events.length) continue;

    let block = `
      <div class="list-date-group">
        <div class="list-date-header">
          <span class="date-badge">${monthName} ${day}</span>
        </div>`;

    events.forEach(ev => {
  const idx = eventStore.indexOf(ev);
  block += `
    <div class="list-event-item"
         role="button"
         tabindex="0"
         onclick="openEnterpriseModal(${idx})">
      <div class="list-country-title">${ev.label}</div>
    </div>
  `;
});


    list.insertAdjacentHTML('beforeend', block + '</div>');
  }
}

/* ===============================
   HELPERS
=============================== */
function eventsForDay(day, month) {
  return eventStore.filter(e => e.day === day && e.month === month);
}

function changeMonth(d) {
  calDate.setMonth(calDate.getMonth() + d);
  updateNavLabel();
  renderCalendar();
}

function goToToday() {
  calDate = new Date();
  updateNavLabel();
  renderCalendar();
}

function toggleCalView(v) {
  viewMode = v;
  document.getElementById('calGridContainer').style.display = v === 'grid' ? 'grid' : 'none';
  document.getElementById('calListView').style.display = v === 'list' ? 'block' : 'none';
  renderCalendar();
}

function updateNavLabel() {
  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  document.getElementById('curDateLabel').innerText =
    `${months[calDate.getMonth()]} ${calDate.getFullYear()}`;
}

function updateEventCount() {
  const el = document.getElementById('eventsCount');
  if (el) el.innerText = `${eventStore.length} events`;
}





function openEnterpriseModal(idx) {
  const ev = eventStore[idx];
  if (!ev) return;

  const modal = document.getElementById('enterpriseModal');
  const title = document.getElementById('mTitle');
  const body = document.getElementById('mDateContainer');

  const monthName = new Date(2024, ev.month, 1)
    .toLocaleString('default', { month: 'long' });

  title.textContent = ev.label;

  let html = `
    <div class="event-item-date-bubble">
      ${monthName} ${ev.day}
    </div>

    <span class="ent-badge ${
      ev.type === 'corporate' ? 'badge-corporate' : 'badge-mission'
    } mt-3 inline-block">
      ${ev.type.toUpperCase()}
    </span>
  `;

  /* ===== MISSION (Sheet 1) ===== */
  if (ev.type === 'mission') {
    if (ev.raw?.country) {
      html += `<div class="text-sm font-bold mt-4">${ev.raw.country}</div>`;
    }

    const address =
      ev.raw.address ||
      ev.raw.address2 ||
      ev.raw.address3 ||
      ev.raw.address4;

    if (address) {
      html += `
        <div class="text-sm text-slate-600 mt-2">
          ${address}
        </div>`;
    }
  }

  /* ===== CORPORATE (Sheet 2) ===== */
  if (ev.type === 'corporate') {
    if (ev.raw?.details1) {
      html += `
        <div class="text-sm text-slate-700 mt-4">
          ${ev.raw.details1}
        </div>`;
    }

    if (ev.raw?.eventlink1) {
      html += `
        <a href="${ev.raw.eventlink1}"
           target="_blank"
           rel="noopener"
           class="text-sm text-blue-600 font-bold mt-4 inline-block">
          View more →
        </a>`;
    }
  }

  body.innerHTML = html;

  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeEnterpriseModal() {
  const modal = document.getElementById('enterpriseModal');
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
