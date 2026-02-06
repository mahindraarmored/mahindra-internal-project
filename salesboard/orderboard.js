/* ===============================
   ORDER BOARD LOGIC
   Sheet 1: Inhand (Orders)
   Sheet 2: Comments (Department Status)
=============================== */

// 1. LINK FOR "INHAND" TAB (First tab = Entire Document link is OK)
const INHAND_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR9IyfBSWNxFFbSyPnci8ddRJHpCe8AFTkkjYBlsTD_MUJSDYiT6m98FXKF8Rouj3qHoGBTKqMePkLc/pub?output=csv';

// 2. LINK FOR "COMMENTS" TAB 
// CRITICAL: You must change "Entire document" -> "Comments" in the publish menu to get this link!
const COMMENTS_SHEET_URL = 'PASTE_YOUR_UNIQUE_COMMENTS_LINK_HERE';

let orders = [];
let commentsDB = [];
let currentFilter = 'ALL';
let activePWO = null; 

window.addEventListener('load', initDashboard);

async function initDashboard() {
    try {
        const [inhandRes, commentsRes] = await Promise.all([
            fetch(INHAND_SHEET_URL),
            fetch(COMMENTS_SHEET_URL).catch(e => null)
        ]);

        const inhandCsv = await inhandRes.text();
        orders = parseInhandCSV(inhandCsv);

        if (commentsRes && commentsRes.ok) {
            const commentsCsv = await commentsRes.text();
            commentsDB = parseCommentsCSV(commentsCsv);
        }

        renderFilters();
        renderTable();
        
        const searchBox = document.getElementById('searchInput');
        if(searchBox) searchBox.addEventListener('keyup', renderTable);
        
    } catch (e) {
        console.error("Sync Failed:", e);
        document.getElementById('orderCount').innerText = "Sync Error - Check Console";
    }
}

// --- PARSER 1: INHAND SHEET (Updated for your specific headers) ---
function parseInhandCSV(csv) {
    const lines = csv.trim().split('\n');
    // Clean headers to lowercase for easier matching
    const headers = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(h => h.replace(/"/g, '').trim().toLowerCase());

    return lines.slice(1).map(line => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/"/g, '').trim());
        const row = {};
        headers.forEach((h, i) => row[h] = values[i] || '');

        // LOGIC: Map your specific sheet columns to our internal names
        const pwoStart = row['pwo number (start)'] || row['pwo number'] || 'N/A';
        const pwoEnd = row['pwo number (leave blank for 1 unit)'] || '';
        
        // Create a visual range if End exists (e.g. "1382-1393")
        const displayID = (pwoEnd && pwoEnd !== pwoStart) ? `${pwoStart} - ${pwoEnd}` : pwoStart;

        return {
            pwo: pwoStart, // The technical ID for linking
            displayID: displayID, // What we show on screen
            client: row['end user'] || 'Unknown User',
            vehicle: row['vehicle type'] || 'Unspecified',
            armour: row['armour level'] || '',
            qty: row['quantity'] || '1',
            status: row['production status'] || 'Pending',
            // Use 'Committed Delivery' first, fallback to 'Expected Dispatch'
            delivery: row['committed delivery date'] || row['expected dispatch date'] || 'TBD',
            notes: row['notes'] || ''
        };
    }).filter(o => o.pwo !== 'N/A');
}

// --- PARSER 2: COMMENTS SHEET (Standard Dept Columns) ---
function parseCommentsCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(h => h.replace(/"/g, '').trim().toLowerCase());

    const comments = [];
    
    // Exact column names for Departments
    const departments = {
        'sales support': 'Sales Support',
        'bdm': 'BDM',
        'production': 'Production Team',
        'qc': 'Quality Control',
        'store': 'Store / Inventory',
        'purchase': 'Purchasing',
        'logistics': 'Logistics',
        'accounts': 'Accounts',
        'client': 'Client Feedback',
        'cfo': 'CFO Office',
        'ceo': 'CEO Office'
    };

    lines.slice(1).forEach(line => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/"/g, '').trim());
        const row = {};
        headers.forEach((h, i) => row[h] = values[i] || '');

        const pwo = row['pwo number']; // Must match PWO Start from Inhand
        if (!pwo) return;

        for (const [key, label] of Object.entries(departments)) {
            if (row[key] && row[key].length > 0) {
                comments.push({
                    pwo: pwo,
                    user: label,
                    text: row[key],
                    date: 'Dept Update' 
                });
            }
        }
    });

    return comments;
}

function renderFilters() {
    const container = document.getElementById('sidebarFilters');
    if (!container) return;
    const statuses = [...new Set(orders.map(o => o.status.toUpperCase()))].sort();
    let html = `<button onclick="filterStatus('ALL', this)" class="side-filter-btn active">ALL ORDERS</button>`;
    statuses.forEach(status => {
        if(status && status !== 'PENDING') {
            html += `<button onclick="filterStatus('${status}', this)" class="side-filter-btn">${status}</button>`;
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
        // Search allows finding by Client or PWO Start
        const matchesSearch = o.client.toLowerCase().includes(search) || o.pwo.toLowerCase().includes(search);
        const matchesStatus = currentFilter === 'ALL' || o.status.toUpperCase() === currentFilter;
        return matchesSearch && matchesStatus;
    });

    filtered.forEach(o => {
        const row = document.createElement('tr');
        row.onclick = (e) => {
            if(e.target.closest('button')) return;
            openModal(o.pwo);
        };
        
        const vehicleDisplay = o.armour ? `${o.vehicle} <span class="text-slate-400 font-bold ml-1">(${o.armour})</span>` : o.vehicle;

        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-col">
                    <span class="text-xs font-bold text-slate-500">#${o.displayID}</span>
                    ${o.qty > 1 ? `<span class="text-[9px] font-black text-slate-300 uppercase tracking-wider mt-0.5">${o.qty} UNITS</span>` : ''}
                </div>
            </td>
            <td class="px-6 py-4">
                <div class="flex flex-col">
                    <span class="text-sm font-black text-slate-900 uppercase leading-tight">${o.client}</span>
                    <span class="text-[10px] text-red-600 font-bold uppercase tracking-wide mt-1">${vehicleDisplay}</span>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusClass(o.status)}">${o.status}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap"><span class="text-xs font-medium text-slate-600 italic">${o.delivery}</span></td>
            <td class="px-6 py-4 text-right whitespace-nowrap">
                <i class="ri-arrow-right-circle-line text-slate-300 text-xl group-hover:text-red-600 transition-colors"></i>
            </td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('orderCount').innerText = `${filtered.length} Active Jobs`;
}

// --- MODAL LOGIC ---
function openModal(pwo) {
    activePWO = pwo;
    const order = orders.find(o => o.pwo === pwo);
    if (!order) return;

    document.getElementById('modalTitle').innerText = `PWO #${order.displayID}`; // Shows range in title
    document.getElementById('modalSubtitle').innerText = order.client;
    document.getElementById('modalVehicle').innerText = order.armour ? `${order.vehicle} (${order.armour})` : order.vehicle;
    document.getElementById('modalDate').innerText = order.delivery;
    document.getElementById('modalNotes').innerText = order.notes || 'No internal notes.';

    renderModalComments(pwo);
    document.getElementById('orderModal').classList.remove('hidden');
}

function renderModalComments(pwo) {
    const timeline = document.getElementById('modalTimeline');
    timeline.innerHTML = '';
    
    // Filter comments matching the PWO Start ID
    const relatedComments = commentsDB.filter(c => c.pwo === pwo);

    if (relatedComments.length === 0) {
        timeline.innerHTML = `<div class="text-xs text-slate-400 italic">No department updates found.</div>`;
    } else {
        relatedComments.forEach(c => {
            const formattedText = c.text.replace(/\n/g, '<br>');
            const item = document.createElement('div');
            item.className = "relative mb-8 last:mb-0";
            item.innerHTML = `
                <div class="absolute -left-[31px] bg-white border-2 border-slate-200 w-4 h-4 rounded-full mt-1.5"></div>
                <div class="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <span class="text-[11px] font-black text-slate-900 uppercase tracking-wide bg-slate-100 px-2 py-1 rounded">${c.user}</span>
                </div>
                <div class="text-xs text-slate-700 leading-relaxed bg-white border-l-2 border-slate-200 pl-4 py-1 max-h-64 overflow-y-auto">
                    ${formattedText}
                </div>
            `;
            timeline.appendChild(item);
        });
    }
}

function closeModal() {
    document.getElementById('orderModal').classList.add('hidden');
    activePWO = null;
}

// --- REFRESH LOGIC ---
async function refreshComments() {
    if (!activePWO) return;

    const btn = document.getElementById('refreshBtn');
    const icon = document.getElementById('refreshIcon');
    
    icon.classList.add('animate-spin');
    btn.classList.add('opacity-75', 'cursor-not-allowed');

    try {
        const res = await fetch(COMMENTS_SHEET_URL + '&t=' + new Date().getTime());
        if (res.ok) {
            const csv = await res.text();
            commentsDB = parseCommentsCSV(csv);
            renderModalComments(activePWO);
        }
    } catch (e) {
        console.error("Refresh failed", e);
    } finally {
        icon.classList.remove('animate-spin');
        btn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
}

function getStatusClass(status) {
    const s = (status || '').toUpperCase();
    if (s.includes('DONE') || s.includes('READY') || s.includes('DELIVERED')) return 'bg-green-50 text-green-600 border-green-100';
    if (s.includes('PROD') || s.includes('WORK') || s.includes('PROCESS')) return 'bg-blue-50 text-blue-600 border-blue-100';
    if (s.includes('HOLD') || s.includes('DELAY')) return 'bg-red-50 text-red-600 border-red-100';
    return 'bg-slate-50 text-slate-500 border-slate-200';
}

function filterStatus(status, btn) {
    document.querySelectorAll('.side-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = status;
    renderTable();
}
