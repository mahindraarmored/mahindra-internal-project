/**
 * Mahindra Emirates Internal Portal 
 * Navbar & Sidebar Injection Logic
 */

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
            <a href="/index.html" class="nav-link" id="nav-dashboard">
                <i class="ri-dashboard-3-line"></i> Dashboard
            </a>
            <a href="/vehicles/index.html" class="nav-link" id="nav-vehicles">
                <i class="ri-truck-line"></i> Vehicle Library
            </a>
            <a href="/events/index.html" class="nav-link" id="nav-events">
                <i class="ri-calendar-event-line"></i> Global Events
            </a>
            <a href="/mission/index.html" class="nav-link" id="nav-mission">
                <i class="ri-shield-user-line"></i> Mission Database
            </a>
            <a href="/support/index.html" class="nav-link" id="nav-support">
                <i class="ri-customer-service-2-line"></i> Technical Support
            </a>
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
    // 1. Inject Sidebar
    const sidebarRoot = document.getElementById('sidebar-root');
    if (sidebarRoot) sidebarRoot.innerHTML = sidebarContent;

    // 2. Inject Header
    const headerRoot = document.getElementById('header-root');
    if (headerRoot) headerRoot.innerHTML = headerContent;

    // 3. Mobile Navigation Logic
    const sidebar = document.getElementById('mainSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const openBtn = document.getElementById('openSidebar');
    const closeBtn = document.getElementById('closeSidebar');

    const toggleMenu = () => {
        sidebar.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
        document.body.style.overflow = sidebar.classList.contains('-translate-x-full') ? '' : 'hidden';
    };

    [openBtn, closeBtn, overlay].forEach(el => {
        el?.addEventListener('click', toggleMenu);
    });

    // 4. Highlight Active Page
    const currentPath = window.location.pathname;
    const navLinks = [
        { path: 'vehicles', id: 'nav-vehicles' },
        { path: 'events', id: 'nav-events' },
        { path: 'mission', id: 'nav-mission' },
        { path: 'support', id: 'nav-support' },
        { path: 'index.html', id: 'nav-dashboard' }
    ];

    let found = false;
    navLinks.forEach(link => {
        if (currentPath.includes(link.path)) {
            document.getElementById(link.id)?.classList.add('active');
            found = true;
        }
    });

    // Handle home directory default (/)
    if (!found || currentPath === '/' || currentPath === '') {
        document.getElementById('nav-dashboard')?.classList.add('active');
    }

    // 5. Header Clock (Internal Utility)
    const updateClock = () => {
        const clockEl = document.getElementById('headerClock');
        if (clockEl) {
            const now = new Date();
            clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        }
    };
    updateClock();
    setInterval(updateClock, 30000);
});
