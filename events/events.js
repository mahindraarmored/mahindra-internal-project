/* ===============================
   EVENTS ENGINE – FINAL
   =============================== */

/* === CSV SOURCES === */
const SHEET_MISSION =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRN0N7BjlpK9kjL923oPBw3mpreD9ofgLMP5YX8_yTQXDwuzw_PPMsLZOKnyZnZzJVBS4KmTD07tyXx/pub?output=csv';

const SHEET_CORPORATE =
  'https://docs.google.com/spreadsheets/d/1RRhfYSCEpKzlbjfIWirapC0eiaJGlZ4u9P_EQZfstQM/gviz/tq?tqx=out:csv&gid=258527421';

/* === INTERNAL STATE === */
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

    updateNavLabel();
    renderCalendar();

  } catch (err) {
    console.error('Calendar init failed:', err);
  }
}

/* ===============================
   CSV PARSER
   =============================== */
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const headers = lines[0]
    .split(',')
    .map(h => h.replace(/"/g, '').trim().toLowerCase());

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

/* --- Sheet 1: Mission / Embassy --- */
function expandMissionRow(row) {
  const src = row['important days'];
  if (!src) return [];

  return src.split(',').map(chunk => {
    const parts = chunk.split(':');
    if (parts.length < 2) return null;

    const label = parts[0].trim();
    const dateParts = parts[1].trim().split(' ');
    const day = parseInt(dateParts[0]);
    const month = MONTHS[dateParts[1]?.toLowerCase()];

    if (isNaN(day) || month === undefined) return null;

    return {
      label,
      day,
      month,
      type: 'mission',
      raw: row
    };
  }).filter(Boolean);
}

/* --- Sheet 2: Corporate --- */
function expandCorporateRow(row) {
  const src = row.eventdate1;
  if (!src) return [];

  return src.split(',').map(d => {
    const parts = d.trim().split(' ');
    const month = MONTHS[parts[0]?.toLowerCase()];
    const day = parseInt(parts[1]);

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
   CALENDAR RENDERING
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

  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d =>
    grid.insertAdjacentHTML('beforeend', `<div class="cal-day-label">${d}</div>`)
  );

  const start = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();

  for (let i = 0; i < start; i++) {
    grid.insertAdjacentHTML('beforeend', `<div class="cal-day-cell empty"></div>`);
  }

  for (let day = 1; day <= days; day++) {
    const isToday =
      day === today.getDate() &&
      m === today.getMonth() &&
      y === today.getFullYear();

    let cell = `<div class="cal-day-cell ${isToday ? 'is-today' : ''}">
                  <span class="cal-day-num">${day}</span>`;

    eventsForDay(day, m).forEach(ev => {
      const idx = eventStore.indexOf(ev);
      cell += `<button class="cal-event-chip ${ev.type}"
                 onclick="openEnterpriseModal(${idx})">
                 ${ev.label}
               </button>`;
    });

    grid.insertAdjacentHTML('beforeend', cell + '</div>');
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
        </div>
    `;

    events.forEach(ev => {
      const idx = eventStore.indexOf(ev);
      block += `
        <div class="list-event-item" onclick="openEnterpriseModal(${idx})">
          <div class="list-master-row">
            <div class="list-country-title">${ev.label}</div>
            <span class="ent-badge ${ev.type === 'corporate' ? 'badge-corporate' : 'badge-mission'}">
              ${ev.type.toUpperCase()}
            </span>
          </div>
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
  document.getElementById('btnGrid')?.classList.toggle('active', v === 'grid');
  document.getElementById('btnList')?.classList.toggle('active', v === 'list');
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
