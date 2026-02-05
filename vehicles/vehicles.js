/* ===============================
   VEHICLE LIBRARY LOGIC - FINAL FIXED
=============================== */
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQk4gER-Hzbhsw1kmNd2_2-SjwUqQcAGtw6xG9h3tUS_uSpcDTfu2SxU5J4w0XA1A8Llg9cZ6eAIkwu/pub?output=csv';

let assets = [];
let currentFilter = 'ALL';

window.addEventListener('load', fetchSheetData);

async function fetchSheetData() {
    try {
        const res = await fetch(SHEET_CSV_URL);
        const csv = await res.text();
        assets = parseCSV(csv);
        renderSidebar();
        renderAssets();
        const searchBox = document.getElementById('searchInput');
        if(searchBox) searchBox.addEventListener('keyup', renderAssets);
    } catch (e) {
        console.error("Database Connection Failed:", e);
        document.getElementById('assetCount').innerText = "Sync Error - Check Console";
    }
}

function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        .map(h => h.replace(/"/g, '').trim().toLowerCase());

    return lines.slice(1).map(line => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/"/g, '').trim());
        const row = {};
        headers.forEach((h, i) => row[h] = values[i] || '');

        return {
            type: row['category'] || 'Uncategorised',      
            name: row['vehicle name'] || '',               
            chassis: row['base vehicle / chassis'] || '',  
            spec: row['sub heading'] || '',                
            gallery: row['image status'] || '',            
            datasheet: row['brochure link'] || '',         
            website: row['website'] || '',                 
            status: row['for future'] || 'Active'          
        };
    }).filter(v => v.name);
}

function renderSidebar() {
    const container = document.getElementById('sidebarFilters');
    if (!container) return;

    const categories = [...new Set(assets.map(v => v.type.toUpperCase()))].sort();

    let html = `
        <button onclick="filterType('ALL', this)" class="side-filter-btn active">
            ALL TEAM
        </button>
    `;

    categories.forEach(cat => {
        html += `
            <button onclick="filterType('${cat}', this)" class="side-filter-btn">
                ${cat}
            </button>
        `;
    });
    
    container.innerHTML = html;
}

function renderAssets() {
    const grid = document.getElementById('assetGrid');
    const search = (document.getElementById('searchInput')?.value || '').toLowerCase();
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = assets.filter(v => {
        const matchesSearch = 
            (v.name || '').toLowerCase().includes(search) || 
            (v.type || '').toLowerCase().includes(search) ||
            (v.chassis || '').toLowerCase().includes(search) ||
            (v.spec || '').toLowerCase().includes(search);
        const matchesType = currentFilter === 'ALL' || v.type.toUpperCase() === currentFilter;
        return matchesSearch && matchesType;
    });

    filtered.forEach(v => {
        const hasPDF = v.datasheet && v.datasheet.length > 5;
        const hasGallery = v.gallery && v.gallery.length > 5;
        const hasWeb = v.website && v.website.length > 3;
        const finalUrl = v.website.startsWith('http') ? v.website : `https://${v.website}`;

        const card = document.createElement('div');
        card.className = 'vehicle-card p-5 space-y-4 flex flex-col group';
        card.innerHTML = `
            <div class="flex justify-between items-start">
                <span class="text-[10px] font-black px-2 py-1 rounded ${getCategoryColor(v.type)} uppercase tracking-widest">
                    ${v.type}
                </span>
                <span class="text-[10px] font-bold ${v.status.toLowerCase() === 'active' ? 'text-green-500' : 'text-amber-500'} uppercase tracking-widest">
                    ${v.status}
                </span>
            </div>
            <div>
                <h4 class="text-lg font-black text-slate-900 leading-tight group-hover:text-red-600 transition-colors uppercase">
                    ${v.name}
                </h4>
                <p class="text-[10px] text-slate-400 font-black uppercase tracking-tighter mt-1">
                    Chassis: ${v.chassis}
                </p>
                <p class="text-xs text-slate-500 mt-3 font-medium leading-relaxed italic">
                    ${v.spec}
                </p>
            </div>
            <div class="pt-4 mt-auto border-t border-slate-50 flex items-center justify-between">
                <div class="flex gap-2">
                    <a href="${hasPDF ? v.datasheet : '#'}" target="_blank" class="icon-action ${hasPDF ? '' : 'disabled'}">
                        <i class="ri-file-list-3-line"></i>
                        <span class="tooltip">${hasPDF ? 'View Brochure' : 'No Brochure'}</span>
                    </a>
                    <a href="${hasGallery ? v.gallery : '#'}" target="_blank" class="icon-action ${hasGallery ? '' : 'disabled'}">
                        <i class="ri-gallery-line"></i>
                        <span class="tooltip">${hasGallery ? 'View Photos' : 'No Gallery'}</span>
                    </a>
                </div>
                <a href="${hasWeb ? finalUrl : '#'}" class="icon-action ${hasWeb ? '' : 'disabled'}" target="${hasWeb ? '_blank' : '_self'}">
                    <i class="ri-global-line"></i>
                    <span class="tooltip">${hasWeb ? 'View Website' : 'No Link'}</span>
                </a>
            </div>`;
        grid.appendChild(card);
    });

    const countLabel = document.getElementById('assetCount');
    if(countLabel) countLabel.innerText = `${filtered.length} Vehicles Detected`;
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
