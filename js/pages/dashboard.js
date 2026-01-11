/**
 * Dashboard Sayfası - Global Scope (Grid Menü)
 */
window.Pages = window.Pages || {};

window.Pages.dashboard = {
    render: () => {
        const totalBalance = window.Store.getBalance();
        const userName = window.Store.getUserName();
        const formatCurrency = window.Utils.formatCurrency;

        // Menü Öğeleri
        const menuItems = [
            { title: 'Günlük', icon: 'calendar', link: '#daily', color: '#3b82f6' },
            { title: 'Haftalık', icon: 'calendar-days', link: '#weekly', color: '#8b5cf6' },
            { title: 'Aylık Rap.', icon: 'calendar-range', link: '#monthly', color: '#ec4899' },
            { title: 'Gelir Ekle', icon: 'trending-up', link: '#income', color: '#10b981' },
            { title: 'Gider Ekle', icon: 'trending-down', link: '#expense', color: '#ef4444' },
            { title: 'Kategoriler', icon: 'tags', link: '#categories', color: '#f59e0b' },
            { title: 'Bütçe', icon: 'pie-chart', link: '#budget', color: '#06b6d4' },
            { title: 'Hedefler', icon: 'target', link: '#goals', color: '#6366f1' },
            { title: 'Ayarlar', icon: 'settings', link: '#settings', color: '#64748b' },
        ];

        return `
            <div style="padding: 2rem; max-width: 1200px; margin: 0 auto;">
                
                <!-- Üst Başlık -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <div>
                        <div class="text-muted">Hoşgeldin,</div>
                        <h1 style="font-size: 1.5rem; color: var(--text-main);">${userName}</h1>
                    </div>
                    <button class="btn" style="border: 1px solid var(--border); color: var(--text-muted)" onclick="window.Store.logout()">
                        <i data-lucide="log-out"></i> Çıkış
                    </button>
                </div>

                <!-- Bakiye Kartı (Büyük) -->
                <div class="card mb-4" style="background: linear-gradient(135deg, var(--bg-card), #1e1b4b); border: 1px solid var(--primary);">
                    <div class="text-muted" style="margin-bottom: 0.5rem">Toplam Varlıklar</div>
                    <div style="font-size: 2.5rem; font-weight: 700; color: white;">${formatCurrency(totalBalance)}</div>
                    <div style="margin-top: 1rem; display: flex; gap: 2rem">
                         <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--success)">
                            <i data-lucide="arrow-up-circle"></i> ${formatCurrency(window.Store.getTotalIncome())}
                         </div>
                         <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--danger)">
                            <i data-lucide="arrow-down-circle"></i> ${formatCurrency(window.Store.getTotalExpense())}
                         </div>
                    </div>
                </div>

                <!-- GRİD MENÜ -->
                <div class="card-grid" style="grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem;">
                    ${menuItems.map(item => `
                        <a href="${item.link}" class="card" style="
                            display: flex; 
                            flex-direction: column; 
                            align-items: center; 
                            justify-content: center; 
                            text-decoration: none; 
                            padding: 2rem;
                            cursor: pointer;
                            transition: transform 0.2s, background-color 0.2s;
                            aspect-ratio: 1;
                        ">
                            <div style="
                                width: 50px; 
                                height: 50px; 
                                background-color: ${item.color}20; 
                                border-radius: 12px; 
                                display: flex; 
                                align-items: center; 
                                justify-content: center;
                                color: ${item.color};
                                margin-bottom: 1rem;
                            ">
                                <i data-lucide="${item.icon}" width="28" height="28"></i>
                            </div>
                            <div style="color: var(--text-main); font-weight: 600;">${item.title}</div>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }
};
