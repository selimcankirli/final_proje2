/**
 * Kategoriler Sayfası - Global Scope
 */
window.Pages = window.Pages || {};

window.Pages.categories = {
    render: () => {
        const categories = window.Store.getState().categories;

        const content = `
            <div class="card-grid">
                ${categories.map(c => `
                    <div class="card" style="display:flex; align-items:center; gap: 1rem; position:relative; overflow:hidden">
                        <div style="width: 4px; height: 100%; position: absolute; left: 0; top: 0; background-color: ${c.color}"></div>
                        <div style="
                            width: 48px; 
                            height: 48px; 
                            border-radius: 12px; 
                            background-color: ${c.color}20; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center;
                            color: ${c.color};
                        ">
                            <i data-lucide="${c.type === 'income' ? 'trending-up' : 'shopping-bag'}"></i>
                        </div>
                        <div>
                            <div style="font-weight: 600; font-size: 1.1rem">${c.name}</div>
                            <div class="text-muted" style="font-size: 0.875rem">
                                ${c.type === 'income' ? 'Gelir' : 'Gider'}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        return window.Utils.PageWrapper('Kategoriler', content);
    }
};
