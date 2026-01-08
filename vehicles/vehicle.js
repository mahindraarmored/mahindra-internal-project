/* ===============================
   VEHICLE LIBRARY LOGIC - ROBUST
=============================== */
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQk4gER-Hzbhsw1kmNd2_2-SjwUqQcAGtw6xG9h3tUS_uSpcDTfu2SxU5J4w0XA1A8Llg9cZ6eAIkwu/pub?output=csv';

let assets = [];
let currentFilter = 'ALL';

// Fix 6: Use addEventListener instead of window.onload
window.addEventListener('load', fetchSheetData);

async function fetchSheetData() {
    try {
        const res = await fetch(SHEET_CSV_URL);
        const csv = await res.text();
        assets = parseCSV(csv);
        renderSidebar();
        renderAssets();
        
        // Fix 3: Add event listener for search instead of inline HTML attribute
        document.getElementById('searchInput').addEventListener('keyup', renderAssets);
    } catch (e) {
        console.error("Database Connection Failed:", e);
    }
}

function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    // Fix 4: Improved header parsing to handle quoted commas in headers
    const headers = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        .map(h => h.replace(/"/g, '').trim().toLowerCase());

    return lines.slice(1).map(line => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/"/g, '').trim());
        const row = {};
        headers.forEach((h, i) => row[h] = values[i] || '');

        return {
            name: row['vehicle name'] || 'Unknown Model',
            // Fix 2: Provide fallback for missing categories
            type: row['category'] || 'Uncategorised',
            // Fix 1: Ensure spec is always at least an empty string
            spec: row['specification'] || row['sub heading'] || '',
            status: row['status'] || 'Active',
            // Fix 5: Cleaner website logic
            website: row['website'] || ''
        };
    }).filter(v => v.name !== 'Unknown Model');
}

function renderSidebar() {
    const container = document.getElementById('sidebarFilters');
    if (!container) return;

    const categories = [...new Set(assets.map(v => v.type.toUpperCase()))].sort();

    let html = `
        <button id="btn-all" onclick="filterType('ALL', this)" class="side-filter-btn active w-full">
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
    const search = (document.getElementById('searchInput')?.value || '').toLowerCase();
    grid.innerHTML = '';

    const filtered = assets.filter(v => {
        // Fix 1: Null-safe search logic
        const nameVal = (v.name || '').toLowerCase();
        const typeVal = (v.type || '').toLowerCase();
        const specVal = (v.spec || '').toLowerCase();

        const matchesSearch = nameVal.includes(search) || 
                              typeVal.includes(search) ||
                              specVal.includes(search);

        const matchesType = currentFilter === 'ALL' || v.type.toUpperCase() === currentFilter;
        return matchesSearch && matchesType;
    });

    filtered.forEach(v => {
        // Fix 5: Correct boolean check for website
        const hasWeb = v.website.startsWith('http') || v.website.includes('.');
        const finalUrl = v.website.startsWith('http') ? v.website : `https://${v.website}`;

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
                <h4 class="text-lg font-bold text-slate-900 leading-tight">${v.name}</h4>
                <p class="text-xs text-slate-500 mt-2 font-medium leading-relaxed">${v.spec}</p>
            </div>
            <div class="pt-4 mt-auto border-t flex items-center justify-between">
                <div class="flex gap-2">
                    <button class="icon-action"><i class="ri-file-list-3-line"></i><span class="tooltip">Datasheet</span></button>
                    <button class="icon-action"><i class="ri-gallery-line"></i><span class="tooltip">Gallery</span></button>
                </div>
                <a href="${hasWeb ? finalUrl : '#'}" class="icon-action ${hasWeb ? '' : 'disabled'}" 
                   target="${hasWeb ? '_blank' : '_self'}">
                    <i class="ri-global-line"></i><span class="tooltip">${hasWeb ? 'View Online' : 'No Link'}</span>
                </a>
            </div>
        `;
        grid.appendChild(card);
    });

    document.getElementById('assetCount').innerText = `${filtered.length} Vehicles Detected`;
}

function getCategoryColor(type) {
    const t = (type || '').toUpperCase();
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
