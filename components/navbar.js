// components/navbar.js
const sidebarHTML = `
    <aside class="sidebar w-64 flex-shrink-0 flex flex-col">
        <div class="p-6 border-b border-slate-800">
            <div class="flex items-center justify-center">
                <div class="w-full h-12 flex items-center">
                    <img src="../assets/MEVA LOGO.png" alt="Mahindra Logo" class="h-full w-auto object-contain">
                </div>
            </div>
        </div>
    
    
    
    
        <nav class="flex-1 p-4 space-y-1">
            <a href="/index.html" class="nav-link" id="nav-dashboard"><i class="ri-dashboard-line"></i> Dashboard</a>
            <a href="/vehicles/index.html" class="nav-link" id="nav-vehicles"><i class="ri-truck-line"></i> Vehicle Library</a>
            <a href="/events/index.html" class="nav-link" id="nav-events"><i class="ri-calendar-event-line"></i> Global Events</a>
            <a href="/mission/index.html" class="nav-link" id="nav-mission"><i class="ri-government-line"></i> Mission Database</a>
            <a href="/support/index.html" class="nav-link" id="nav-support"><i class="ri-information-line"></i> Support Info</a>
        </nav>
        <div class="p-4 mt-auto border-t border-slate-800">
            <div class="bg-slate-800/50 p-3 rounded-xl flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-xs">M</div>
                <div class="text-[10px] font-bold uppercase tracking-widest text-slate-400">System Ready</div>
            </div>
        </div>
    </aside>
`;

const headerHTML = `
    <header class="h-16 bg-white border-b flex items-center justify-between px-8 z-10">
        <h2 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">INTERNAL PORTAL</h2>
        <div class="flex items-center gap-4">
            <span class="text-[11px] font-bold text-slate-500 uppercase">Version 2.5</span>
        </div>
    </header>
`;

document.addEventListener("DOMContentLoaded", () => {
    // Inject Sidebar (assumes a <div id="sidebar-root"></div> exists)
    const sidebarRoot = document.getElementById('sidebar-root');
    if (sidebarRoot) sidebarRoot.innerHTML = sidebarHTML;

    // Inject Header (assumes a <div id="header-root"></div> exists)
    const headerRoot = document.getElementById('header-root');
    if (headerRoot) headerRoot.innerHTML = headerHTML;

    // Highlight active link based on current URL
    const currentPath = window.location.pathname;
    if (currentPath.includes('vehicles')) document.getElementById('nav-vehicles')?.classList.add('active');
    else if (currentPath.includes('events')) document.getElementById('nav-events')?.classList.add('active');
    else if (currentPath.includes('mission')) document.getElementById('nav-mission')?.classList.add('active');
    else if (currentPath.includes('support')) document.getElementById('nav-support')?.classList.add('active');
    else document.getElementById('nav-dashboard')?.classList.add('active');
});
