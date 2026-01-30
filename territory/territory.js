/**
 * Mahindra Emirates Territory - Google Sheets & Google Maps Integration
 */

// Your published BDM Google Sheet CSV URL
const BDM_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/YOUR_BDM_SHEET_ID/pub?output=csv';

let map;
const hoverWindow = new google.maps.InfoWindow();

async function initMap() {
    const mapOptions = {
        zoom: 3,
        center: { lat: 24, lng: 45 }, // Focused near MEVA HQ
        styles: [
            { "featureType": "water", "stylers": [{ "color": "#e2e8f0" }] },
            { "featureType": "landscape", "stylers": [{ "color": "#ffffff" }] },
            { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#64748b" }] }
        ],
        disableDefaultUI: true,
        zoomControl: true
    };

    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    fetchBDMData();
}

async function fetchBDMData() {
    try {
        const res = await fetch(BDM_SHEET_URL);
        const csvText = await res.text();
        const bdms = parseCSV(csvText);
        
        bdms.forEach(bdm => {
            const marker = new google.maps.Marker({
                position: { lat: parseFloat(bdm.latitude), lng: parseFloat(bdm.longitude) },
                map: map,
                title: bdm['bdm name'],
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: "#dc2626", // Mahindra Red
                    fillOpacity: 1,
                    strokeWeight: 4,
                    strokeColor: "#ffffff"
                }
            });

            // 1. ON HOVER: Display the 'onhover' field content
            marker.addListener("mouseover", () => {
                hoverWindow.setContent(`
                    <div style="padding: 12px; font-family: 'Inter', sans-serif; max-width: 200px;">
                        <p style="font-size: 9px; font-weight: 900; color: #dc2626; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.1em;">Territory Insight</p>
                        <p style="font-size: 13px; font-weight: 700; color: #0f172a; line-height: 1.4;">${bdm.onhover || 'Operational Zone'}</p>
                    </div>
                `);
                hoverWindow.open(map, marker);
            });

            marker.addListener("mouseout", () => hoverWindow.close());

            // 2. ON CLICK: Update the floating BDM panel
            marker.addListener("click", () => {
                map.panTo(marker.getPosition());
                showBDMDetails(bdm);
            });
        });
    } catch (e) {
        console.error("Territory Sync Error:", e);
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
        return row;
    });
}

function showBDMDetails(bdm) {
    const infoBox = document.getElementById('bdm-info-display');
    infoBox.innerHTML = `
        <div class="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span class="bg-red-50 text-red-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                ${bdm.region}
            </span>
            <h3 class="text-3xl font-black text-slate-900 mt-4 leading-tight uppercase">${bdm['bdm name']}</h3>
            
            <div class="space-y-3 mt-6">
                <div class="flex items-center gap-3 text-slate-600 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <i class="ri-mail-send-line text-lg text-red-600"></i>
                    <span class="text-xs font-bold tracking-tight">${bdm.email}</span>
                </div>
                <div class="flex items-center gap-3 text-slate-600 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <i class="ri-shield-check-line text-lg text-red-600"></i>
                    <span class="text-[10px] font-black uppercase">Status: ${bdm.status}</span>
                </div>
            </div>

            <button class="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-600 transition-all shadow-lg hover:shadow-red-200">
                View CRM Portfolio
            </button>
        </div>
    `;
}
