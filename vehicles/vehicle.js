/* ===============================
   VEHICLE LIBRARY ENGINE
=============================== */

const ASSET_SHEET = 'https://docs.google.com/spreadsheets/d/1RRhfYSCEpKzlbjfIWirapC0eiaJGlZ4u9P_EQZfstQM/gviz/tq?tqx=out:csv&gid=1114093933';

let assetStore = [];
let currentFilter = 'ALL';

window.addEventListener('load', fetchAssets);

async function fetchAssets() {
    try {
        const res = await fetch(ASSET_SHEET);
        const text = await res.text();
        assetStore = parseCSV(text);
        renderAssets();
        setupSearch();
    } catch (e) {
        console.error("Asset Database Sync Error:", e);
    }
}

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

function setupSearch() {
    document.getElementById('vehicleSearch').addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        renderAssets(q);
    });
}

function renderAssets(query = '') {
    const grid = document.getElementById('assetGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = assetStore.filter(v => {
        const matchesQuery = v.model.toLowerCase().includes(query) || v.type.toLowerCase().includes(query);
        const matchesType = currentFilter === 'ALL' || v.type.toUpperCase().includes(currentFilter);
        return matchesQuery && matchesType;
    });

    filtered.forEach(v => {
        const card = document.createElement('div');
        card.className = 'vehicle-card group';
        
        const hasWeb = v.website && v.website !== "";
        
        card.innerHTML = `
            <div class="aspect-video bg-slate-100 rounded-t-xl overflow-hidden relative">
                <img src="${v.image || '/assets/placeholder-car.jpg'}" 
                     class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                     onerror="this.src='https://placehold.co/600x400?text=No+Image'">
                <div class="absolute top-3 left-3">
                    <span class="text-[9px] font-black uppercase tracking-widest ${getCategoryColor(v.type)} px-2 py-1 rounded shadow-sm">
                        ${v.type}
                    </span>
                </div>
            </div>
            
            <div class="p-5 border-x border-b border-slate-100 rounded-b-xl">
                <h3 class="font-bold text-slate-900 group-hover:text-red-600 transition-colors">${v.model}</h3>
                <p class="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">${v.protection || 'Specs Pending'}</p>
                
                <div class="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                    <div class="flex gap-2">
                        <button class="icon-action">
                            <i class="ri-information-line"></i>
                            <span class="tooltip">Details</span>
                        </button>
                        <button class="icon-action">
                            <i class="ri-gallery-line"></i>
                            <span class="tooltip">Gallery</span>
                        </button>
                    </div>
                    <a href="${hasWeb ? v.website : '#'}"
                       class="icon-action ${hasWeb ? '' : 'disabled'}"
                       target="_blank">
                        <i class="ri-global-line"></i>
                        <span class="tooltip">${hasWeb ? 'View Online' : 'No Link'}</span>
                    </a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    document.getElementById('assetCount').innerText = `${filtered.length} Vehicles Detected`;
}

/* =========================
   HELPERS
========================= */
function getCategoryColor(type) {
    const t = type.toUpperCase();
    if (t.includes('CAV')) return 'bg-blue-50 text-blue-600';
    if (t.includes('APC')) return 'bg-red-50 text-red-600';
    if (t.includes('PICKUP')) return 'bg-slate-100 text-slate-600';
    if (t.includes('MEDICAL')) return 'bg-green-50 text-green-600';
    return 'bg-slate-100 text-slate-600';
}

function filterType(type, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = type;
    renderAssets();
}
