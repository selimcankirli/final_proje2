/**
 * Layout Bileşeni - Global Scope
 * Sidebar ve Navbar kaldırıldı, sadece içerik container'ı.
 * HEADER GÜNCELLEMESİ: Canlı Saat ve Döviz Eklendi.
 */

window.Components = window.Components || {};

window.Components.Layout = {
    render: () => {
        return `
            <div class="layout" style="display: block; min-height: 100vh;">
                <!-- Fixed Header Info (Sağ Üst Köşe) -->
                <div id="liveHeader" class="live-header">
                    <div class="currency-ticker">
                        <div class="currency-item">
                            <span class="curr-icon">$</span> US: <span id="usdRate">...</span>
                        </div>
                        <div class="currency-item">
                            <span class="curr-icon">€</span> EU: <span id="eurRate">...</span>
                        </div>
                        <div class="currency-item">
                            <span class="curr-icon">£</span> GBP: <span id="gbpRate">...</span>
                        </div>
                    </div>
                    <div class="clock-display">
                        <div id="liveDate" class="live-date">...</div>
                        <div id="liveTime" class="live-time">...</div>
                    </div>
                </div>

                <!-- İçerik -->
                <main class="main-content" style="height: auto; min-height: 100vh;">
                    <div id="content" class="content-area" style="padding: 0;">
                        <!-- Sayfalar buraya tam ekran render edilecek -->
                    </div>
                </main>
            </div>
            
            <style>
                .live-header {
                    position: fixed;
                    bottom: 1.5rem;
                    right: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    z-index: 1000;
                    background: rgba(15, 23, 42, 0.9);
                    padding: 0.75rem 1.25rem;
                    border-radius: 12px;
                    border: 1px solid var(--border);
                    backdrop-filter: blur(12px);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
                }
                @media (max-width: 768px) {
                    .live-header {
                        position: fixed;
                        bottom: 0; right: 0; left: 0;
                        margin: 0;
                        border-radius: 0;
                        justify-content: space-between;
                        width: 100%;
                        border-top: 1px solid var(--border);
                        border-bottom: none;
                        border-left: none;
                        border-right: none;
                    }
                    .currency-ticker { font-size: 0.75rem; }
                }

                .currency-ticker {
                    display: flex;
                    gap: 1rem;
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    border-right: 1px solid var(--border);
                    padding-right: 1.5rem;
                }
                .currency-item { display: flex; align-items: center; gap: 4px; }
                .curr-icon { color: var(--warning); font-weight: bold; }
                
                .clock-display {
                    text-align: right;
                }
                .live-date {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .live-time {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--primary);
                    font-variant-numeric: tabular-nums;
                    line-height: 1.2;
                }
            </style>
        `;
    },

    startClock: () => {
        const update = () => {
            const now = new Date();
            const timeEl = document.getElementById('liveTime');
            const dateEl = document.getElementById('liveDate');

            if (timeEl) {
                timeEl.innerText = now.toLocaleTimeString('tr-TR');
            }
            if (dateEl) {
                dateEl.innerText = now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'short' });
            }
        };
        setInterval(update, 1000);
        update();

        // Simüle edilmiş Döviz Kuru
        // Not: Gerçek API key olmadan public erişim her zaman stabil değildir. Mock data kullanıyoruz.
        const usdEl = document.getElementById('usdRate');
        const eurEl = document.getElementById('eurRate');
        const gbpEl = document.getElementById('gbpRate');

        if (usdEl) usdEl.innerText = "34.20"; // Mock
        if (eurEl) eurEl.innerText = "37.50"; // Mock
        if (gbpEl) gbpEl.innerText = "43.10"; // Mock
    },

    updateActiveNav: () => { }
};
