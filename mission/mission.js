const MISSION_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1RRhfYSCEpKzlbjfIWirapC0eiaJGlZ4u9P_EQZfstQM/gviz/tq?tqx=out:csv&gid=0';
let missionData = [];

window.addEventListener('load', async () => {
    try {
        const res = await fetch(MISSION_SHEET_URL);
        const text = await res.text();
        missionData = parseCSV(text);
        renderSidebar(missionData);
        setupSearch();
    } catch (e) { console.error("Fetch error", e); }
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
    list.innerHTML = data.sort((a,b) => a.country.localeCompare(b.country)).map(item => `
        <div class="country-item p-4 border-b border-slate-50 cursor-pointer transition-all hover:bg-red-50" 
             onclick="showDetails('${item.country}')">
            <div class="text-[9px] font-black text-red-600 uppercase tracking-widest mb-0.5">${item.region || 'Global'}</div>
            <div class="font-bold text-slate-900 leading-tight">${item.country}</div>
        </div>
    `).join('');
}

function showDetails(countryName) {
    const item = missionData.find(d => d.country === countryName);
    const area = document.getElementById('detailsArea');
    
    // Update Active UI State
    document.querySelectorAll('.country-item').forEach(el => {
        el.classList.toggle('active-mission', el.innerText.includes(countryName));
    });

    area.innerHTML = `
        <div class="animate-in fade-in slide-in-from-bottom-2">
            <span class="inline-block px-3 py-1 bg-slate-900 text-white text-[9px] font-black rounded uppercase tracking-widest mb-6">${item.region || 'General'}</span>
            <h2 class="text-5xl font-black text-slate-900 mb-12 tracking-tighter">${item.country}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div class="space-y-8">
                    <div class="flex gap-5">
                        <div class="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center"><i class="ri-map-pin-2-line text-2xl"></i></div>
                        <div>
                            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Primary Address</label>
                            <p class="text-sm font-semibold text-slate-700">${item.address || 'N/A'}</p>
                        </div>
                    </div>
                    <div class="flex gap-5">
                        <div class="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center"><i class="ri-phone-line text-2xl"></i></div>
                        <div>
                            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Communications</label>
                            <p class="text-sm font-semibold text-slate-700">${item.contact || 'N/A'}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-6 border-b pb-3">Critical Dates & Observations</label>
                    <p class="text-sm font-bold text-red-800 leading-loose">${item['important days'] || 'No specific holiday intelligence currently tracked.'}</p>
                </div>
            </div>
        </div>`;
}

function setupSearch() {
    document.getElementById('countrySearch').addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('.country-item').forEach(i => {
            i.style.display = i.innerText.toLowerCase().includes(q) ? 'block' : 'none';
        });
    });
}
