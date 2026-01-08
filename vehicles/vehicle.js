const ASSET_SHEET = 'https://docs.google.com/spreadsheets/d/1RRhfYSCEpKzlbjfIWirapC0eiaJGlZ4u9P_EQZfstQM/gviz/tq?tqx=out:csv&gid=1114093933';

let assetStore = [];
let currentFilter = 'ALL';

window.addEventListener('load', fetchAssets);

async function fetchAssets() {
    try {
        const res = await fetch(ASSET_SHEET);
        const text = await res.text();
        assetStore = parseCSV(text);
        renderSidebar(); 
        renderAssets();
        setupSearch();
    } catch (e) {
        console.error("Database Sync Error:", e);
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

function renderSidebar() {
    const container = document.getElementById('sidebarFilters');
    if (!container) return;

    const categories = [...new Set(assetStore.map(v => v.type.toUpperCase()))].sort();

    let html = `
        <button onclick="filterType('ALL', this)" class="side-filter-btn active w-full">
            <span>All Assets</span>
            <span class="count-pill">${assetStore.length}</span>
        </button>
    `;

    categories.forEach(cat => {
        const count = assetStore.filter(v => v.type.toUpperCase() === cat).length;
        html += `
            <button onclick="filterType('${cat}', this)" class="side-filter-btn w-full">
                <span>${cat}</span>
                <span class="count-pill">${count}</span>
            </button>
        `;
    });
    container.innerHTML = html;
}

function setupSearch() {
    document.getElementById('vehicleSearch').addEventListener('input', (e) => {
        renderAssets(e.target.value.toLowerCase());
    });
}

function renderAssets(query = '') {
    const grid = document.getElementById('assetGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = assetStore.filter(v => {
        const matchesQuery = 
            v.model.toLowerCase().includes(query) || 
            v.type.toLowerCase().includes(query) || 
            v.protection.toLowerCase().includes(query) ||
            (v.engine && v.engine.toLowerCase().includes(query));

        const matchesType = currentFilter === 'ALL' || v.type.toUpperCase() === currentFilter;
        return matchesQuery && matchesType;
    });

    filtered.forEach(v => {
        const card = document.createElement('div');
        card.className = 'vehicle-card group';
        const hasWeb = v.website && v.website !== "";
        
        card.innerHTML = `
            <div class="aspect-video bg-slate-100 relative">
                <img src="${v.image || 'https://placehold.co/600x400?text=No+Image'}" 
                     class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                <div class="absolute top-3 left-3">
                    <span class="category-badge text-[9px] font-black uppercase tracking-widest ${getCategoryColor(v.type)} px-2 py-1 rounded shadow-sm">
                        ${v.type}
                    </span>
                </div>
            </div>
            <div class="p-5 border-t border-slate-100">
                <h3 class="font-bold text-slate-900 group-hover:text-red-600 transition-colors leading-tight">${v.model}</h3>
                <div class="flex flex-wrap gap-2 mt-3">
                    <div class="spec-chip"><i class="ri-shield-check-line"></i> ${v.protection || 'TBA'}</div>
                    ${v.engine ? `<div class="spec-chip"><i class="ri-settings-3-line"></i> ${v.engine}</div>` : ''}
                </div>
                <div class="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                    <div class="flex gap-2">
                        <button class="icon-action" title="View PDF"><i class="ri-file-pdf-line"></i></button>
                        <button class="icon-action" title="Gallery"><i class="ri-gallery-line"></i></button>
                    </div>
                    <a href="${hasWeb ? v.website : '#'}" target="_blank" class="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600">
                        Specs →
                    </a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    document.getElementById('assetCount').innerText = filtered.length;
}

function filterType(type, btn) {
    document.querySelectorAll('.side-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = type;
    renderAssets(document.getElementById('vehicleSearch').value.toLowerCase());
}

function getCategoryColor(type) {
    const t = type.toUpperCase();
    if (t.includes('CAV')) return 'bg-blue-50 text-blue-600';
    if (t.includes('APC')) return 'bg-red-50 text-red-600';
    if (t.includes('PICKUP')) return 'bg-slate-100 text-slate-600';
    if (t.includes('MEDICAL')) return 'bg-green-50 text-green-600';
    return 'bg-slate-100 text-slate-600';
}
