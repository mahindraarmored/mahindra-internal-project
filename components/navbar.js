/**
 * Mahindra Emirates Internal Portal 
 * Security Gate, Navbar Injection & Regional Clocks
 */

const disclaimerHTML = `
    <div id="disclaimerOverlay">
        <div class="disclaimer-card">
            <div class="disclaimer-icon">
                <i class="ri-shield-keyhole-fill"></i>
            </div>
            <h2 style="font-weight: 900; font-size: 1.5rem; color: #0f172a; text-transform: uppercase;">Internal Access Only</h2>
            <div style="height: 4px; width: 40px; background: #dc2626; margin: 1rem auto; border-radius: 10px;"></div>
            <p style="color: #64748b; font-size: 0.875rem; line-height: 1.6; margin-bottom: 2rem;">
                This system contains confidential information of Mahindra Emirates Vehicle Armouring personnel. 
                <strong>By clicking "I Agree", you confirm you are authorized employee</strong> and agree to maintain strict confidentiality of all data contained herein.
            </p>
            <button id="agreeBtn">Agree & Continue</button>
            <p style="margin-top: 1.5rem; font-size: 10px; color: #94a3b8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;">
                Secure Gateway • v2.5.0
            </p>
        </div>
    </div>
`;

// Regional Clocks Template
const clocksHTML = `
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div class="p-4 bg-white border border-slate-200 rounded-2xl border-l-4 border-l-red-600 shadow-sm">
            <p style="font-size: 9px; font-weight: 900; color: #dc2626; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">UAE (HQ)</p>
            <p id="time-uae" style="font-family: monospace; font-size: 1.25rem; font-weight: 800; color: #0f172a;">--:--:--</p>
            <p style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Dubai GST</p>
        </div>
        <div class="p-4 bg-white border border-slate-200 rounded-2xl border-l-4 border-l-slate-300 shadow-sm">
            <p style="font-size: 9px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">Europe</p>
            <p id="time-europe" style="font-family: monospace; font-size: 1.25rem; font-weight: 800; color: #0f172a;">--:--:--</p>
            <p style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">London/Paris</p>
        </div>
        <div class="p-4 bg-white border border-slate-200 rounded-2xl border-l-4 border-l-slate-300 shadow-sm">
            <p style="font-size: 9px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">Africa</p>
            <p id="time-africa" style="font-family: monospace; font-size: 1.25rem; font-weight: 800; color: #0f172a;">--:--:--</p>
            <p style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">SAST (UTC+2)</p>
        </div>
        <div class="p-4 bg-white border border-slate-200 rounded-2xl border-l-4 border-l-slate-300 shadow-sm">
            <p style="font-size: 9px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">USA</p>
            <p id="time-usa" style="font-family: monospace; font-size: 1.25rem; font-weight: 800; color: #0f172a;">--:--:--</p>
            <p style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Eastern Time</p>
        </div>
        <div class="p-4 bg-white border border-slate-200 rounded-2xl border-l-4 border-l-slate-300 shadow-sm">
            <p style="font-size: 9px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">India</p>
            <p id="time-india" style="font-family: monospace; font-size: 1.25rem; font-weight: 800; color: #0f172a;">--:--:--</p>
            <p style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Mumbai IST</p>
        </div>
    </div>
`;

const sidebarContent = `
    <div id="sidebarOverlay" class="fixed inset-0 bg-black/60 z-40 hidden lg:hidden"></div>
    <aside id="mainSidebar" class="sidebar fixed lg:static inset-y-0 left-0 z-50 w-64 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out">
        <div class="p-6 border-b border-slate-800 flex items-center justify-between">
            <div class="w-full py-2 flex items-center justify-center">
                <img src="/siteimages/logo.png" alt="MEVA Logo" class="w-[180px] h-auto object-contain">
            </div>
            <button id="closeSidebar" class="lg:hidden text-slate-400 hover:text-white transition-colors">
                <i class="ri-close-line text-2xl"></i>
            </button>
        </div>
        <nav class="flex-1 p-4 space-y-1 overflow-y-auto mt-4">
            <a href="/index.html" class="nav-link" id="nav-dashboard"><i class="ri-dashboard-3-line"></i> Dashboard</a>
            <a href="/territory/index.html" class="nav-link" id="nav-territory"><i class="ri-map-pin-2-line"></i>Territory Map</a>
            <a href="/vehicles/index.html" class="nav-link" id="nav-vehicles"><i class="ri-truck-line"></i> Vehicle Library</a>
            <a href="/events/index.html" class="nav-link" id="nav-events"><i class="ri-calendar-event-line"></i> Global Events</a>
            <a href="/mission/index.html" class="nav-link" id="nav-mission"><i class="ri-shield-user-line"></i> Mission Database</a>
            <a href="/overview/index.html" class="nav-link" id="nav-overview"><i class="ri-customer-service-2-line"></i> Our Overview</a>
        </nav>
        <div class="p-4 border-t border-slate-800">
            <div class="bg-slate-800/40 p-4 rounded-2xl">
                <div class="flex items-center gap-3">
                    <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Systems Active</span>
                </div>
                <p class="text-[9px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">MEVA Internal v2.5.0</p>
            </div>
        </div>
    </aside>
`;

const headerContent = `
    <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-30 w-full sticky top-0">
        <div class="flex items-center gap-4">
            <button id="openSidebar" class="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                <i class="ri-menu-2-line text-2xl"></i>
            </button>
            <div class="h-6 w-[2px] bg-slate-100 hidden lg:block mr-2"></div>
            <h2 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Internal Portal</h2>
        </div>
        <div class="flex items-center gap-4">
            <div class="hidden sm:flex flex-col text-right">
                <span id="headerClock" class="text-xs font-bold text-slate-900 leading-none">--:-- --</span>
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Local Site Time</span>
            </div>
        </div>
    </header>
`;

document.addEventListener("DOMContentLoaded", () => {
    // 1. Security Disclaimer Logic
    const hasAgreed = sessionStorage.getItem('meva_agreed');
    if (!hasAgreed) {
        document.body.insertAdjacentHTML('afterbegin', disclaimerHTML);
        const overlay = document.getElementById('disclaimerOverlay');
        const btn = document.getElementById('agreeBtn');
        btn.addEventListener('click', () => {
            sessionStorage.setItem('meva_agreed', 'true');
            overlay.classList.add('disclaimer-hidden');
            setTimeout(() => overlay.remove(), 600);
        });
    }

    // 2. Inject Sidebar & Header
    const sidebarRoot = document.getElementById('sidebar-root');
    if (sidebarRoot) sidebarRoot.innerHTML = sidebarContent;

    const headerRoot = document.getElementById('header-root');
    if (headerRoot) headerRoot.innerHTML = headerContent;

    // 3. Inject Regional Clocks (if root exists on page)
    const clocksRoot = document.getElementById('global-clocks-root');
    if (clocksRoot) clocksRoot.innerHTML = clocksHTML;

    // 4. Mobile Navigation Logic
    const sidebar = document.getElementById('mainSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const openBtn = document.getElementById('openSidebar');
    const closeBtn = document.getElementById('closeSidebar');

    const toggleMenu = () => {
        sidebar.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
        document.body.style.overflow = sidebar.classList.contains('-translate-x-full') ? '' : 'hidden';
    };

    [openBtn, closeBtn, overlay].forEach(el => el?.addEventListener('click', toggleMenu));

    // 5. IMPROVED: Highlight Active Page Logic
    const currentPath = window.location.pathname;
    
    // Priority order: folders first, then files
    const navLinks = [
        { path: '/vehicles/', id: 'nav-vehicles' },
        { path: '/territory/', id: 'nav-territory' },
        { path: '/events/', id: 'nav-events' },
        { path: '/mission/', id: 'nav-mission' },
        { path: '/overview/', id: 'nav-overview' },
        { path: '/support/', id: 'nav-support' }
    ];

    let found = false;

    // Remove existing active classes to reset state
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

    // Check for folder-based matches first
    navLinks.forEach(link => {
        if (currentPath.includes(link.path)) {
            document.getElementById(link.id)?.classList.add('active');
            found = true;
        }
    });

    // Special condition for Dashboard: 
    // Only active if it's the root path or index.html at the root (not in a folder)
    if (!found && (currentPath === '/' || currentPath === '' || (currentPath.endsWith('index.html') && !currentPath.includes('/', 1)))) {
        document.getElementById('nav-dashboard')?.classList.add('active');
    }

    // 6. Clock Logic (Header & Regional)
    const updateTimes = () => {
        const clockEl = document.getElementById('headerClock');
        if (clockEl) {
            clockEl.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        }

        const zones = [
            { id: 'time-uae', tz: 'Asia/Dubai' },
            { id: 'time-europe', tz: 'Europe/London' },
            { id: 'time-africa', tz: 'Africa/Johannesburg' },
            { id: 'time-usa', tz: 'America/New_York' },
            { id: 'time-india', tz: 'Asia/Kolkata' }
        ];

        zones.forEach(zone => {
            const el = document.getElementById(zone.id);
            if (el) {
                el.textContent = new Date().toLocaleTimeString('en-GB', {
                    timeZone: zone.tz,
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
            }
        });
    };

    updateTimes();
    setInterval(updateTimes, 1000);
});
