/* ===============================
   ORDER BOARD LOGIC
=============================== */
const ORDER_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR9IyfBSWNxFFbSyPnci8ddRJHpCe8AFTkkjYBlsTD_MUJSDYiT6m98FXKF8Rouj3qHoGBTKqMePkLc/pub?output=csv';

let orders = [];
let currentFilter = 'ALL';

window.addEventListener('load', fetchOrderData);

async function fetchOrderData() {
    try {
        const res = await fetch(ORDER_SHEET_URL);
        const csv = await res.text();
        orders = parseCSV(csv);
        renderFilters();
        renderTable();
        
        const searchBox = document.getElementById('searchInput');
        if(searchBox) searchBox.addEventListener('keyup', renderTable);
    } catch (e) {
        console.error("Connection Failed:", e);
        document.getElementById('orderCount').innerText = "Sync Error - Check Console";
    }
}

// Reusing the robust CSV parser from vehicles.js
function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        .map(h => h.replace(/"/g, '').trim().toLowerCase());

    return lines.slice(1).map(line => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/"/g, '').trim());
        const row = {};
        headers.forEach((h, i) => row[h] = values[i] || '');

        // Mapping CSV columns to internal keys
        return {
            id: row['job no'] || row['order id'] || 'N/A',
            client: row['client'] || row['client name'] || 'Unknown',
            vehicle: row['vehicle'] || row['vehicle model'] || 'Unspecified',
            status: row['status'] || row['current status'] || 'Pending',
            delivery: row['delivery date'] || row['completion date'] || 'TBD'
        };
    }).filter(o => o.client !== 'Unknown'); // Filter out empty rows
}

function renderFilters() {
    const container = document.getElementById('sidebarFilters');
    if (!container) return;

    // Get unique statuses
    const statuses = [...new Set(orders.map(o => o.status.toUpperCase()))].sort();

    let html = `
        <button onclick="filterStatus('ALL', this)" class="side-filter-btn active">
            ALL ORDERS
        </button>
    `;

    statuses.forEach(status => {
        if(status) {
            html += `
                <button onclick="filterStatus('${status}', this)" class="side-filter-btn">
                    ${status}
                </button>
            `;
        }
    });
    container.innerHTML = html;
}

function renderTable() {
    const tableBody = document.getElementById('orderTableBody');
    const search = (document.getElementById('searchInput')?.value || '').toLowerCase();
    if (!tableBody) return;
    tableBody.innerHTML = '';

    const filtered = orders.filter(o => {
        const matchesSearch = 
            o.client.toLowerCase().includes(search) || 
            o.id.toLowerCase().includes(search) ||
            o.vehicle.toLowerCase().includes(search);
        
        const matchesStatus = currentFilter === 'ALL' || o.status.toUpperCase() === currentFilter;
        return matchesSearch && matchesStatus;
    });

    filtered.forEach(o => {
        const row = document.createElement('tr');
        row.className = "hover:bg-slate-50 transition-colors group cursor-default";
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-xs font-bold text-slate-400">#${o.id}</span>
            </td>
            <td class="px-6 py-4">
                <div class="flex flex-col">
                    <span class="text-sm font-black text-slate-900 uppercase leading-tight">${o.client}</span>
                    <span class="text-[10px] text-red-600 font-bold uppercase tracking-wide mt-0.5">${o.vehicle}</span>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusClass(o.status)}">
                    ${o.status}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-xs font-medium text-slate-600 italic">${o.delivery}</span>
            </td>
            <td class="px-6 py-4 text-right whitespace-nowrap">
                <button class="icon-action inline-flex mx-auto" title="View Details">
                    <i class="ri-eye-line"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    const countLabel = document.getElementById('orderCount');
    if(countLabel) countLabel.innerText = `${filtered.length} Orders Listed`;
}

function getStatusClass(status) {
    const s = (status || '').toUpperCase();
    if (s.includes('DONE') || s.includes('READY') || s.includes('DELIVERED')) return 'bg-green-50 text-green-600 border-green-100';
    if (s.includes('PROD') || s.includes('WORK') || s.includes('PROCESS')) return 'bg-blue-50 text-blue-600 border-blue-100';
    if (s.includes('HOLD') || s.includes('DELAY') || s.includes('STOP')) return 'bg-red-50 text-red-600 border-red-100';
    return 'bg-slate-50 text-slate-500 border-slate-200';
}

function filterStatus(status, btn) {
    document.querySelectorAll('.side-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = status;
    renderTable();
}
