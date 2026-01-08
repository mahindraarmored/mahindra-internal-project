// components/navbar.js
const sidebarHTML = `
    <div id="sidebarOverlay" class="fixed inset-0 bg-black/50 z-40 hidden lg:hidden transition-opacity duration-300"></div>
    
    <aside id="mainSidebar" class="sidebar fixed lg:static inset-y-0 left-0 z-50 w-64 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col h-full shadow-2xl lg:shadow-none">
        <div class="p-6 border-b border-slate-800 flex items-center justify-between">
            <div class="w-full py-2 flex items-center justify-center">
                <img src="/siteimages/logo.png" 
                     alt="Mahindra Logo" 
                     class="w-[180px] h-auto object-contain">
            </div>
            <button id="closeSidebar" class="lg:hidden text-slate-400 hover:text-white p-1">
                <i class="ri-close-line text-2xl"></i>
            </button>
        </div>

        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
            <a href="/index.html" class="nav-link" id="nav-dashboard">
                <i class="ri-dashboard-line"></i> Dashboard
            </a>
            <a href="/vehicles/index.html" class="nav-link" id="nav-vehicles">
                <i class="ri-truck-line"></i> Vehicle Library
            </a>
            <a href="/events/index.html" class="nav-link" id="nav-events">
                <i class="ri-calendar-event-line"></i> Global Events
            </a>
            <a href="/mission/index.html" class="nav-link" id="nav-mission">
                <i class="ri-government-line"></i> Mission Database
            </a>
            <a href="/support/index.html" class="nav-link" id="nav-support">
                <i class="ri-information-line"></i> Support Info
            </a>
        </nav>

        <div class="p-4 mt-auto border-t border-slate-800">
            <div class="bg-slate-800/50 p-3 rounded-xl flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-xs text-white">M</div>
                <div class="text-[10px] font-bold uppercase tracking-widest text-slate-400">System Ready</div>
            </div>
        </div>
    </aside>
`;

const headerHTML = `
    <header class="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8 z-10 w-full">
        <div class="flex items-center gap-4">
            <button id="openSidebar" class="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <i class="ri-menu-2-line text-2xl"></i>
            </button>
            <h2 class="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400">INTERNAL PORTAL</h2>
        </div>
        <div class="flex items-center gap-4">
            <span class="hidden sm:block text-[11px] font-bold text-slate-500 uppercase">Version 2.5</span>
        </div>
    </header>
`;

document.addEventListener("DOMContentLoaded", () => {
    // Inject components
    const sidebarRoot = document.getElementById('sidebar-root');
    if (sidebarRoot) sidebarRoot.innerHTML = sidebarHTML;

    const headerRoot = document.getElementById('header-root');
    if (headerRoot) headerRoot.innerHTML = headerHTML;

    // --- MOBILE NAVIGATION LOGIC ---
    const sidebar = document.getElementById('mainSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const openBtn = document.getElementById('openSidebar');
    const closeBtn = document.getElementById('closeSidebar');

    function toggleMenu() {
        sidebar.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
        // Prevents page from scrolling behind the menu
        document.body.classList.toggle('overflow-hidden'); 
    }

    [openBtn, closeBtn, overlay].forEach(btn => {
        btn?.addEventListener('click', toggleMenu);
    });

    // --- ACTIVE LINK HIGHLIGHTING ---
    const currentPath = window.location.pathname;
    const links = [
        { path: 'vehicles', id: 'nav-vehicles' },
        { path: 'events', id: 'nav-events' },
        { path: 'mission', id: 'nav-mission' },
        { path: 'support', id: 'nav-support' }
    ];

    let found = false;
    links.forEach(link => {
        if (currentPath.includes(link.path)) {
            document.getElementById(link.id)?.classList.add('active');
            found = true;
        }
    });

    // Default to Dashboard if no other match found
    if (!found) {
        document.getElementById('nav-dashboard')?.classList.add('active');
    }
});
