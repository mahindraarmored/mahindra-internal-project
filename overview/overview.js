document.addEventListener('DOMContentLoaded', function() {
    const viewport = document.getElementById('ppt-viewport');
    const placeholder = document.getElementById('ppt-placeholder');
    const loader = document.getElementById('ppt-loader');

    // 1. PPT Loading Logic
    function loadPowerPoint() {
        placeholder.classList.add('hidden');
        loader.classList.remove('hidden');

        const iframe = document.createElement('iframe');
        iframe.src = "https://1drv.ms/p/c/f91e71cf4403fa00/IQRya5vMebbKSZw0OkCifpxpAenffHhH_DgdE_BmUo9rOlA?em=2&wdAr=1.7777777777777777&wdEaaCheck=0";
        iframe.className = "absolute top-0 left-0 w-full h-full rounded-3xl opacity-0 transition-opacity duration-1000";
        iframe.frameBorder = "0";
        iframe.allowFullscreen = true;
        
        iframe.onload = function() {
            loader.classList.add('hidden');
            iframe.classList.remove('opacity-0');
            viewport.classList.remove('border-dashed', 'bg-slate-50');
            viewport.classList.add('border-solid', 'border-slate-200', 'bg-black');
        };

        viewport.appendChild(iframe);
    }

    // Initialize Intersection Observer for PPT
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                placeholder.onclick = loadPowerPoint;
            }
        });
    }, { threshold: 0.1 });

    observer.observe(viewport);
});

// 2. Global Modal Functions
function openBrochure(pdfUrl) {
    const modal = document.getElementById('brochure-modal');
    const frame = document.getElementById('brochure-frame');
    frame.src = pdfUrl;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeBrochure() {
    const modal = document.getElementById('brochure-modal');
    const frame = document.getElementById('brochure-frame');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    frame.src = "";
    document.body.style.overflow = 'auto';
}
