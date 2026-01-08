/* ===============================
   VEHICLE LIBRARY LOGIC
=============================== */
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQk4gER-Hzbhsw1kmNd2_2-SjwUqQcAGtw6xG9h3tUS_uSpcDTfu2SxU5J4w0XA1A8Llg9cZ6eAIkwu/pub?output=csv';

let assets = [];
let currentFilter = 'ALL';

window.onload = fetchSheetData;

async function fetchSheetData() {
    try {
        const res = await fetch(SHEET_CSV_URL);
        const csv = await res.text();
        assets = parseCSV(csv);
        renderSidebar(); // Generates categories from data
        renderAssets();
    } catch (e) {
        console.error("Data Sync Error:", e);
    }
}

function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());

    return lines.slice(1).map(line => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/"/g, '').trim());
        const row = {};
        headers.forEach((h, i) => row[h] = values[i] || '');

        return {
            name: row['vehicle name'],
            type: row['category'],
            spec: row['specification'] || row['sub heading'],
            status: row['status'] || 'Active',
            website: row['website']?.startsWith('http') ? row['website'] : row['website'] ? `https://${row['website']}` : '#'
        };
    }).filter(v => v.name);
}

function renderSidebar() {
    const container = document.getElementById('sidebarFilters');
    if (!container) return;

    // Extract unique categories directly from your data
    const categories = [...new Set(assets.map(v => v.type.toUpperCase()))].sort();

    let html = `
        <button onclick="filterType('ALL', this)" class="side-filter-btn active w-full">
            <span>All Assets</span>
            <span class="count-pill">${assets.length}</span>
        </button>
    `;

    categories.forEach(cat => {
        const count = assets.filter(v => v.type.toUpperCase() === cat).length;
        html += `
            <button onclick="filterType('${cat}', this)" class="side-filter-btn w-full">
                <span>${cat}</span>
                <span class="count-pill">${count}</span>
            </button>
        `;
    });
    container.innerHTML = html;
}

function renderAssets() {
    const grid = document.getElementById('assetGrid');
    const search = document.getElementById('searchInput').value.toLowerCase();
    grid.innerHTML = '';

    const filtered = assets.filter(v => {
        // Global search: Checks name, type, and specs
        const matchesSearch = v.name.toLowerCase().includes(search) || 
                              v.type.toLowerCase().includes(search) ||
                              v.spec.toLowerCase().includes(search);

        const matchesType = currentFilter === 'ALL' || v.type.toUpperCase() === currentFilter;
        return matchesSearch && matchesType;
    });

    filtered.forEach(v => {
        const hasWeb = v.website.startsWith('http');
        const card = document.createElement('div');
        card.className = 'vehicle-card p-5 space-y-4 flex flex-col';

        card.innerHTML = `
            <div class="flex justify-between items-start">
                <span class="text-[10px] font-black px-2 py-1 rounded ${getCategoryColor(v.type)} uppercase tracking-widest">
                    ${v.type}
                </span>
                <span class="text-[10px] font-bold ${v.status === 'Active' ? 'text-green-500' : 'text-amber-500'} uppercase tracking-widest">
                    ${v.status}
                </span>
            </div>
            <div>
                <h4 class="text-lg font-bold text-slate-900 leading-tight group-hover:text-red-600 transition-colors">${v.name}</h4>
                <p class="text-xs text-slate-500 mt-2 font-medium leading-relaxed">${v.spec}</p>
            </div>
            <div class="pt-4 mt-auto border-t flex items-center justify-between">
                <div class="flex gap-2">
                    <button class="icon-action"><i class="ri-file-list-3-line"></i><span class="tooltip">Datasheet</span></button>
                    <button class="icon-action"><i class="ri-gallery-line"></i><span class="tooltip">Gallery</span></button>
                </div>
                <a href="${hasWeb ? v.website : '#'}" class="icon-action ${hasWeb ? '' : 'disabled'}" target="_blank">
                    <i class="ri-global-line"></i><span class="tooltip">${hasWeb ? 'View Online' : 'No Link'}</span>
                </a>
            </div>
        `;
        grid.appendChild(card);
    });

    document.getElementById('assetCount').innerText = `${filtered.length} Vehicles Detected`;
}

function getCategoryColor(type) {
    const t = type.toUpperCase();
    if (t.includes('CAV')) return 'bg-blue-50 text-blue-600';
    if (t.includes('APC')) return 'bg-red-50 text-red-600';
    if (t.includes('PICKUP')) return 'bg-slate-100 text-slate-600';
    if (t.includes('MEDICAL')) return 'bg-green-50 text-green-600';
    return 'bg-slate-100 text-slate-600';
}

function filterType(type, btn) {
    document.querySelectorAll('.side-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = type;
    renderAssets();
}
