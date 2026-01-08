/* =========================
   DATA SOURCES
========================= */
const EMBASSY_CSV =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQk4gER-Hzbhsw1kmNd2_2-SjwUqQcAGtw6xG9h3tUS_uSpcDTfu2SxU5J4w0XA1A8Llg9cZ6eAIkwu/pub?output=csv';

const CORPORATE_CSV =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRN0N7BjlpK9kjL923oPBw3mpreD9ofgLMP5YX8_yTQXDwuzw_PPMsLZOKnyZnZzJVBS4KmTD07tyXx/pub?output=csv';

/* =========================
   STATE
========================= */
let eventStore = [];
let calDate = new Date();
let viewMode = window.innerWidth <= 768 ? 'list' : 'grid';

const monthMap = {
  jan:0,feb:1,mar:2,apr:3,may:4,jun:5,
  jul:6,aug:7,sep:8,oct:9,nov:10,dec:11
};

/* =========================
   INIT
========================= */
window.addEventListener('load', initCalendar);

async function initCalendar(){
  try{
    const [eRes, cRes] = await Promise.all([
      fetch(EMBASSY_CSV),
      fetch(CORPORATE_CSV)
    ]);

    const embassyRows = parseCSV(await eRes.text());
    const corpRows = parseCSV(await cRes.text());

    eventStore = [
      ...mapEmbassyEvents(embassyRows),
      ...mapCorporateEvents(corpRows)
    ];

    bindUI();
    updateNavLabel();
    render();
  }catch(err){
    console.error('Events load failed:', err);
  }
}

/* =========================
   CSV PARSER
========================= */
function parseCSV(text){
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  const headers = lines[0].split(',').map(h => h.replace(/"/g,'').trim().toLowerCase());

  return lines.slice(1).map(line => {
    const cells = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const obj = {};
    headers.forEach((h,i)=> obj[h]=(cells[i]||'').replace(/"/g,'').trim());
    return obj;
  });
}

/* =========================
   DATA MAPPING
========================= */
function mapEmbassyEvents(rows){
  return rows
    .filter(r => r['important days'])
    .map(r => ({
      label: r.country,
      date: r['important days'],
      type: 'mission',
      raw: r
    }));
}

function mapCorporateEvents(rows){
  return rows
    .filter(r => r.event1 && r.eventdate1)
    .map(r => ({
      label: r.event1,
      date: r.eventdate1,
      type: 'corporate',
      raw: r
    }));
}

/* =========================
   DATE MATCHING
========================= */
function matchesDate(dateString, day, monthIdx){
  if(!dateString) return false;
  const s = dateString.toLowerCase();

  const entries = s.split(/[,;&]+/).map(e=>e.trim());
  return entries.some(e=>{
    const m =
      e.includes(Object.keys(monthMap)[monthIdx]) ||
      e.includes(`/${monthIdx+1}`);
    if(!m) return false;
    const nums = e.match(/\b\d{1,2}\b/g);
    return nums && nums.some(n=>parseInt(n)===day);
  });
}

/* =========================
   RENDER CONTROLLER
========================= */
function render(){
  viewMode === 'grid' ? renderGrid() : renderList();
  document.getElementById('eventsCount').innerText =
    `${eventStore.length} Events Loaded`;
}

/* =========================
   GRID VIEW
========================= */
function renderGrid(){
  const grid = document.getElementById('calGridContainer');
  const list = document.getElementById('calListView');
  grid.style.display = 'grid';
  list.style.display = 'none';
  grid.innerHTML = '';

  const m = calDate.getMonth(), y = calDate.getFullYear();
  const today = new Date();

  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    .forEach(d => grid.insertAdjacentHTML('beforeend',
      `<div class="cal-day-label">${d}</div>`));

  const start = new Date(y,m,1).getDay();
  const days = new Date(y,m+1,0).getDate();

  for(let i=0;i<start;i++)
    grid.insertAdjacentHTML('beforeend','<div class="cal-day-cell empty"></div>');

  for(let d=1; d<=days; d++){
    const isToday =
      d===today.getDate() && m===today.getMonth() && y===today.getFullYear();
    let cell = `<div class="cal-day-cell ${isToday?'is-today':''}">
      <span class="cal-day-num">${d}</span>`;

    eventStore.forEach((ev,idx)=>{
      if(matchesDate(ev.date,d,m)){
        cell += `<button class="cal-event-chip ${ev.type}"
          onclick="openModal(${idx})">${ev.label}</button>`;
      }
    });

    grid.insertAdjacentHTML('beforeend', cell+'</div>');
  }
}

/* =========================
   LIST VIEW
========================= */
function renderList(){
  const grid = document.getElementById('calGridContainer');
  const list = document.getElementById('calListView');
  grid.style.display = 'none';
  list.style.display = 'block';
  list.innerHTML = '';

  const m = calDate.getMonth();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  for(let d=1; d<=31; d++){
    const items = eventStore.filter(e=>matchesDate(e.date,d,m));
    if(!items.length) continue;

    let html = `
      <div class="list-date-group">
        <div class="list-date-header">
          <span class="date-badge">${months[m]} ${d}</span>
        </div>
        <div>`;

    items.forEach(ev=>{
      const idx = eventStore.indexOf(ev);
      html += `
        <div class="list-event-item" onclick="openModal(${idx})">
          <div class="list-country-title">${ev.label}</div>
          <span class="ent-badge ${ev.type==='corporate'?'badge-corporate':'badge-mission'}">
            ${ev.type}
          </span>
        </div>`;
    });

    list.insertAdjacentHTML('beforeend', html+'</div></div>');
  }
}

/* =========================
   MODAL
========================= */
function openModal(idx){
  const ev = eventStore[idx];
  const m = document.getElementById('enterpriseModal');
  if(!m) return;

  m.setAttribute('data-ent-type', ev.type);
  document.getElementById('mTitle').innerText = ev.label;

  const dates = document.getElementById('mDateContainer');
  dates.innerHTML = '';

  if(ev.type==='mission' && ev.date.includes(':')){
    ev.date.split(',').forEach(p=>{
      const [name,date] = p.split(':').map(x=>x.trim());
      dates.insertAdjacentHTML('beforeend',
        `<div class="event-item-date-bubble">${date}</div>
         <div class="event-item-name">${name}</div>`);
    });
  }else{
    dates.innerHTML =
      `<div class="event-item-date-bubble">${ev.date}</div>`;
  }

  m.style.display = 'flex';
}

/* =========================
   UI BINDINGS
========================= */
function bindUI(){
  document.getElementById('btnPrev').onclick = ()=>changeMonth(-1);
  document.getElementById('btnNext').onclick = ()=>changeMonth(1);
  document.getElementById('btnToday').onclick = goToday;

  document.getElementById('btnGrid').onclick = ()=>{
    viewMode='grid'; render();
    toggleBtns('grid');
  };
  document.getElementById('btnList').onclick = ()=>{
    viewMode='list'; render();
    toggleBtns('list');
  };

  document.getElementById('btnCloseModal').onclick =
    ()=> document.getElementById('enterpriseModal').style.display='none';
}

function toggleBtns(v){
  document.getElementById('btnGrid').classList.toggle('active',v==='grid');
  document.getElementById('btnList').classList.toggle('active',v==='list');
}

/* =========================
   NAV
========================= */
function changeMonth(d){
  calDate.setMonth(calDate.getMonth()+d);
  updateNavLabel(); render();
}
function goToday(){
  calDate = new Date();
  updateNavLabel(); render();
}
function updateNavLabel(){
  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  document.getElementById('curDateLabel').innerText =
    `${months[calDate.getMonth()]} ${calDate.getFullYear()}`;
}
