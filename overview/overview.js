/**
 * MEVA Overview Page Logic
 * Handles Flipbook initialization and PDF rendering
 */

// PDF.js worker setup
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

const brochures = {
    en: { file: '../downloads/brochure-en.pdf', label: 'Current Library: English Portfolio' },
    ar: { file: '../downloads/brochure-ar.pdf', label: 'المكتبة الحالية: المحفظة العربية' },
    es: { file: '../downloads/brochure-es.pdf', label: 'Biblioteca actual: Portafolio en español' },
    fr: { file: '../downloads/brochure-fr.pdf', label: 'Bibliothèque actuelle: Portfolio français' }
};

let pageFlip = null;

/**
 * Initializes or reloads the flipbook with a specific language PDF
 * @param {string} lang 
 */
async function loadBrochure(lang) {
    const overlay = document.getElementById('loading-overlay');
    overlay.style.display = 'flex';
    overlay.style.opacity = '1';

    const config = brochures[lang];
    const bookContainer = document.getElementById('book');
    
    // Reset existing instance
    if (pageFlip) { 
        pageFlip.destroy(); 
        bookContainer.innerHTML = ''; 
    }

    try {
        const loadingTask = pdfjsLib.getDocument(config.file);
        const pdf = await loadingTask.promise;
        document.getElementById('p-tot').innerText = pdf.numPages;

        // Render each page to a canvas for the flipbook engine
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2.0 }); // High quality scale
            
            const pageDiv = document.createElement('div');
            pageDiv.className = 'page';
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport: viewport }).promise;
            
            const content = document.createElement('div');
            content.className = 'page-content';
            content.appendChild(canvas);
            pageDiv.appendChild(content);
            bookContainer.appendChild(pageDiv);
        }

        // Initialize PageFlip Engine
        pageFlip = new St.PageFlip(bookContainer, {
            width: 550, 
            height: 750, 
            size: "stretch", 
            showCover: true,
            maxShadowOpacity: 0.3, 
            mobileScrollSupport: false,
            useMouseEvents: true,
            swipeDistance: 30
        });

        pageFlip.loadFromHTML(document.querySelectorAll('.page'));
        
        // Listen for flip events to update UI counter
        pageFlip.on('flip', (e) => { 
            document.getElementById('p-cur').innerText = e.data + 1; 
        });

        // Cleanup loading state
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 500);

    } catch (err) {
        overlay.innerHTML = `
            <div class="flex flex-col items-center p-8 text-center">
                <i class="ri-error-warning-fill text-4xl text-rose-600 mb-2"></i>
                <div class="text-rose-600 font-black text-xs uppercase tracking-widest">Database Sync Error</div>
                <div class="text-slate-400 font-medium text-[10px] mt-2 leading-relaxed">
                    Could not load resource: ${config.file.split('/').pop()}<br>
                    Please verify the file path in /downloads/
                </div>
            </div>
        `;
        console.error("PDF Load Error:", err);
    }
}

/**
 * Handles language switching and UI updates
 * @param {string} lang 
 */
function switchLanguage(lang) {
    const config = brochures[lang];
    
    // Update active button state
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-${lang}`).classList.add('active');
    
    // Update metadata
    document.getElementById('lang-indicator').innerText = config.label;
    document.getElementById('download-link').href = config.file;
    
    // Reload book
    loadBrochure(lang);
}

// Global Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (!pageFlip) return;
    if (e.key === 'ArrowRight') pageFlip.flipNext();
    if (e.key === 'ArrowLeft') pageFlip.flipPrev();
});

// Initial Load
window.addEventListener('load', () => {
    // Small delay to ensure navbar.js has injected the sidebar
    setTimeout(() => {
        const overviewLink = document.getElementById('nav-overview');
        if (overviewLink) {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            overviewLink.classList.add('active');
        }
    }, 150);

    // Load default English portfolio
    loadBrochure('en');
    document.getElementById('download-link').href = brochures.en.file;
});
