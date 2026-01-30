/**
 * Mahindra Emirates Overview - Interaction Logic
 */

document.addEventListener("DOMContentLoaded", () => {
    // Intersection Observer for scroll-in animations
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                // Once it's visible, we can stop observing this specific element
                observer.unobserve(entry.target);
            }
        });
    };

    const options = { threshold: 0.15 };
    const observer = new IntersectionObserver(revealCallback, options);

    // Targets any element with the 'reveal' class
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    console.log("Overview Logic Initialized: Global Navbar and Style inherited.");
});
