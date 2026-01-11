/**
 * Günlük/Tüm İşlemler Sayfası - Global Scope
 */
window.Pages = window.Pages || {};

window.Pages.daily = {
    render: () => {
        // En yeni en üstte
        const allTransactions = window.Store.getTransactions().sort((a, b) => new Date(b.date) - new Date(a.date));
        const formatCurrency = window.Utils.formatCurrency;
        const formatDate = window.Utils.formatDate;

        // --- GÜNLÜK KAPANIŞ ANALİZİ ---
        // Not: Burada "Bugün" yapılan işlemleri analiz etmek daha doğru olur ancak kullanıcı genel "Günü nasıl kapatıyorum" dediği için
        // Tüm zamanların değil, o güne ait işlemlerin farkına bakmak gerekir.
        // Basitlik adına: Son girilen tarihteki (veya bugün) durumu özetleyelim.

        const todayStr = new Date().toISOString().split('T')[0];
        const todaysTransactions = allTransactions.filter(t => t.date === todayStr);

        const dailyIncome = todaysTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const dailyExpense = todaysTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        const dailyNet = dailyIncome - dailyExpense;

        let closingMessage = "";
        let closingColor = "";
        let closingIcon = "";

        if (dailyNet > 0) {
            closingMessage = `Bugünü <strong>${formatCurrency(dailyNet)}</strong> artıda kapatıyorsunuz. Harika bir gün! 🎉`;
            closingColor = "var(--success)";
            closingIcon = "trending-up";
        } else if (dailyNet < 0) {
            closingMessage = `Bugünü <strong>${formatCurrency(Math.abs(dailyNet))}</strong> ekside kapatıyorsunuz. Harcamalara dikkat! ⚠️`;
            closingColor = "var(--danger)";
            closingIcon = "trending-down";
        } else {
            closingMessage = `Bugün henüz bir hareket yok veya gelir gider dengede.`;
            closingColor = "var(--text-muted)";
            closingIcon = "minus";
        }

        const content = `
            <!-- KAPANIŞ ANALİZ KARTI -->
            <div class="card mb-4" style="background: linear-gradient(to right, rgba(15, 23, 42, 1), rgba(30, 41, 59, 0.5)); border-left: 4px solid ${closingColor};">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="
                        background: rgba(255,255,255,0.05); 
                        width: 50px; height: 50px; 
                        border-radius: 50%; 
                        display: flex; align-items: center; justify-content: center;
                        color: ${closingColor};
                    ">
                        <i data-lucide="${closingIcon}" width="24"></i>
                    </div>
                    <div>
                        <h4 style="color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase;">Günlük Kapanış Tahmini</h4>
                        <div style="font-size: 1.1rem; color: var(--text-main); margin-top: 0.25rem;">${closingMessage}</div>
                    </div>
                </div>
            </div>

            <!-- GELİR BÖLÜMÜ -->
            <div class="card mb-4">
                <h3 class="card-title text-success" style="margin-bottom: 1rem;">Gelir Analizi</h3>
                <div class="chart-row">
                    <div class="chart-container">
                        <canvas id="dailyIncomeBar"></canvas>
                    </div>
                    <div class="chart-container">
                        <canvas id="dailyIncomePie"></canvas>
                    </div>
                </div>
            </div>

            <!-- GİDER BÖLÜMÜ -->
            <div class="card mb-4">
                <h3 class="card-title text-danger" style="margin-bottom: 1rem;">Gider Analizi</h3>
                 <div class="chart-row">
                    <div class="chart-container">
                        <canvas id="dailyExpenseBar"></canvas>
                    </div>
                    <div class="chart-container">
                        <canvas id="dailyExpensePie"></canvas>
                    </div>
                </div>
            </div>

            <div class="table-container">
                <h3 class="mb-4" style="padding: 1rem">Tüm İşlemler Listesi</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Tarih</th>
                            <th>Tür</th>
                            <th>Açıklama</th>
                            <th>Tutar</th>
                            <th style="width: 50px;"></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${allTransactions.map(t => `
                            <tr>
                                <td>${formatDate(t.date)}</td>
                                <td><span class="badge ${t.type}">${t.category}</span></td>
                                <td>${t.description}</td>
                                <td class="${t.type === 'income' ? 'text-success' : 'text-danger'}" style="font-weight: 600">
                                    ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
                                </td>
                                <td>
                                    <button class="btn-icon-danger" onclick="window.Pages.daily.handleDelete(${t.id})">
                                        <i data-lucide="trash-2" width="18"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
             <style>
                .chart-row {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 1.5rem;
                }
                @media (max-width: 768px) {
                    .chart-row { grid-template-columns: 1fr; }
                }
                .chart-container {
                    height: 250px;
                    width: 100%;
                }
                .badge { padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; }
                .badge.income { background-color: rgba(16, 185, 129, 0.2); color: var(--success); }
                .badge.expense { background-color: rgba(239, 68, 68, 0.2); color: var(--danger); }
                .btn-icon-danger { background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; border-radius: 4px; }
                .btn-icon-danger:hover { background: rgba(239,68,68,0.1); color: var(--danger); }
            </style>
        `;

        return window.Utils.PageWrapper('Günlük Rapor', content);
    },

    afterRender: () => {
        const transactions = window.Store.getTransactions();
        // Grafikler genel toplamı gösterdiği için tüm transactions gönderiliyor, 
        // ancak kullanıcı "Günlük" sayfasında sadece bugünün detayını görmek istiyorsa filtreli de gönderilebilir.
        // Şimdilik mevcut yapıyı bozmuyorum (Genel Analiz).

        const incomeData = window.Utils.groupDataByCategory(transactions.filter(t => t.type === 'income'));
        const expenseData = window.Utils.groupDataByCategory(transactions.filter(t => t.type === 'expense'));

        if (incomeData.labels.length === 0) { incomeData.labels = ['Veri Yok']; incomeData.data = [0]; }
        if (expenseData.labels.length === 0) { expenseData.labels = ['Veri Yok']; expenseData.data = [0]; }

        window.Utils.renderChart('dailyIncomeBar', 'Gelir', incomeData.labels, incomeData.data, '#10b981');
        window.Utils.renderPieChart('dailyIncomePie', 'Gelir', incomeData.labels, incomeData.data, window.Utils.greenPalette);

        window.Utils.renderChart('dailyExpenseBar', 'Gider', expenseData.labels, expenseData.data, '#ef4444');
        window.Utils.renderPieChart('dailyExpensePie', 'Gider', expenseData.labels, expenseData.data, window.Utils.redPalette);
    },

    handleDelete: (id) => {
        if (confirm('İşlemi silmek istediğinize emin misiniz?')) {
            window.Store.deleteTransaction(id);
            document.getElementById('content').innerHTML = window.Pages.daily.render();
            window.Pages.daily.afterRender();
            if (window.lucide) window.lucide.createIcons();
        }
    }
};
