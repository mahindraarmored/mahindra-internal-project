/* ===============================
   MISSION DATABASE ENGINE
   Dynamic Mapping: Type -> Address -> Contact
=============================== */

const MISSION_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1RRhfYSCEpKzlbjfIWirapC0eiaJGlZ4u9P_EQZfstQM/gviz/tq?tqx=out:csv&gid=0';
let missionData = [];

window.addEventListener('load', async () => {
    try {
        const res = await fetch(MISSION_SHEET_URL);
        const text = await res.text();
        missionData = parseCSV(text);
        renderSidebar(missionData);
        setupSearch();
    } catch (e) { 
        console.error("Database Synchronization Error:", e); 
    }
});

function parseCSV(text) {
    const rows = text.split('\n').filter(r => r.trim());
    const headers = rows[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
    return rows.slice(1).map(row => {
        const values = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const obj = {};
        headers.forEach((h, i) => {
            obj[h] = values[i] ? values[i].replace(/"/g, '').trim() : "";
        });
        return obj;
    });
}

function renderSidebar(data) {
    const list = document.getElementById('sidebarList');
    if (!list) return;
    
    list.innerHTML = data.sort((a,b) => a.country.localeCompare(b.country)).map(item => `
        <div class="country-item p-4 border-b border-slate-50 cursor-pointer transition-all hover:bg-red-50" 
             onclick="showDetails('${item.country.replace(/'/g, "\\'")}')">
            <div class="text-[9px] font-black text-red-600 uppercase tracking-widest mb-0.5">${item.region || 'Global'}</div>
            <div class="font-bold text-slate-900 leading-tight">${item.country}</div>
        </div>
    `).join('');
}

function showDetails(countryName) {
    const item = missionData.find(d => d.country === countryName);
    const area = document.getElementById('detailsArea');
    if (!item || !area) return;
    
    // Update Sidebar Active State
    document.querySelectorAll('.country-item').forEach(el => {
        el.classList.toggle('active-mission', el.innerText.includes(countryName));
    });

    // BUILD DYNAMIC SECTIONS (Type, Type 2, Type 3...)
    let sectionsHtml = '';
    const keys = Object.keys(item);
    // Find all keys that start with "type" (type, type 2, type 3, etc.)
    const typeKeys = keys.filter(k => k.startsWith('type')).sort();

    typeKeys.forEach(tKey => {
        const suffix = tKey.replace('type', '').trim(); // e.g., "", "2", "3"
        const typeLabel = item[tKey];
        const addr = item['address' + (suffix ? ' ' + suffix : '')] || item['address' + suffix];
        const contact = item['contact' + (suffix ? ' ' + suffix : '')] || item['contact' + suffix];

        if (typeLabel && typeLabel.trim() !== "") {
            sectionsHtml += `
                <div class="mb-10 animate-in">
                    <h3 class="text-xs font-black text-red-600 uppercase tracking-[0.2em] mb-5 pb-2 border-b border-slate-100 flex items-center gap-2">
                        <i class="ri-government-line"></i> ${typeLabel}
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="flex gap-4">
                            <div class="w-10 h-10 rounded-lg bg-slate-50 text-slate-400 flex-shrink-0 flex items-center justify-center">
                                <i class="ri-map-pin-2-line text-lg"></i>
                            </div>
                            <div>
                                <label class="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Address</label>
                                <p class="text-sm font-semibold text-slate-700 leading-relaxed">${addr || 'No address provided'}</p>
                            </div>
                        </div>
                        <div class="flex gap-4">
                            <div class="w-10 h-10 rounded-lg bg-slate-50 text-slate-400 flex-shrink-0 flex items-center justify-center">
                                <i class="ri-phone-line text-lg"></i>
                            </div>
                            <div>
                                <label class="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Contact Details</label>
                                <p class="text-sm font-semibold text-slate-700 leading-relaxed">${contact || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    });

    area.innerHTML = `
        <div class="animate-in">
            <span class="inline-block px-3 py-1 bg-slate-900 text-white text-[9px] font-black rounded uppercase tracking-widest mb-6">${item.region || 'General'}</span>
            <h2 class="text-5xl font-black text-slate-900 mb-12 tracking-tighter">${item.country}</h2>
            
            <div class="flex flex-col">
                ${sectionsHtml}
            </div>

            <div class="mt-8 bg-slate-50 p-8 rounded-3xl border border-slate-100 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-red-500/5 -mr-16 -mt-16 rounded-full"></div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-6 border-b border-slate-200 pb-3">Critical Dates & Observations</label>
                <p class="text-sm font-bold text-red-800 leading-loose">${item['important days'] || 'No specific holiday intelligence currently tracked for this region.'}</p>
            </div>
        </div>`;
}

function setupSearch() {
    const searchInput = document.getElementById('countrySearch');
    if (!searchInput) return;
    searchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('.country-item').forEach(i => {
            i.style.display = i.innerText.toLowerCase().includes(q) ? 'block' : 'none';
        });
    });
}
function openDiplomaticTemplate(countryName, holidayInfo) {
    const codes = { "india": "in", "australia": "au", "united arab emirates": "ae", "united kingdom": "uk", "united states": "us" };
    const code = codes[countryName.toLowerCase()] || "in";
    
    const encodedHoliday = encodeURIComponent(holidayInfo);
    
    // Pass the intelligence as a URL parameter called 'intel'
    window.location.href = `./specialdays/index.html?country=${code}&intel=${encodedHoliday}`;
}
