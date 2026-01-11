/**
 * Ortak Sayfa Şablonu (Wrapper)
 * Sayfaların içine Geri Dön butonu ekler.
 */

window.Utils.PageWrapper = (title, content) => {
    return `
        <div style="padding: 2rem; max-width: 1200px; margin: 0 auto;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
                <a href="#dashboard" class="btn" style="
                    width: 40px; 
                    height: 40px; 
                    border-radius: 50%; 
                    background-color: var(--bg-card); 
                    border: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-main);
                    text-decoration: none;
                ">
                    <i data-lucide="arrow-left"></i>
                </a>
                <h2 style="font-size: 1.5rem; margin: 0;">${title}</h2>
            </div>
            
            ${content}
        </div>
    `;
};
