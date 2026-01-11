/**
 * Haftalık Rapor Sayfası - Global Scope
 */
window.Pages = window.Pages || {};

window.Pages.weekly = {
    render: () => {
        const transactions = window.Store.getTransactions();
        const formatCurrency = window.Utils.formatCurrency;

        // --- HAFTALIK KAPANIŞ ANALİZİ ---
        // Son 7 güne ait toplamlar
        const incomeTrans = transactions.filter(t => t.type === 'income');
        const expenseTrans = transactions.filter(t => t.type === 'expense');

        const weeklyIncomeData = window.Utils.prepareTimelineData(incomeTrans, 'weekly').data;
        const weeklyExpenseData = window.Utils.prepareTimelineData(expenseTrans, 'weekly').data;

        const totalWeeklyIncome = weeklyIncomeData.reduce((a, b) => a + b, 0);
        const totalWeeklyExpense = weeklyExpenseData.reduce((a, b) => a + b, 0);
        const weeklyNet = totalWeeklyIncome - totalWeeklyExpense;

        let closingMessage = "";
        let closingColor = "";

        if (weeklyNet > 0) {
            closingMessage = `Bu haftayı <strong>${formatCurrency(weeklyNet)}</strong> artıda kapatıyorsunuz. Tasarruf için güzel bir hafta!`;
            closingColor = "var(--success)";
        } else if (weeklyNet < 0) {
            closingMessage = `Bu haftayı <strong>${formatCurrency(Math.abs(weeklyNet))}</strong> ekside kapatıyorsunuz. Harcamaları gözden geçirin.`;
            closingColor = "var(--danger)";
        } else {
            closingMessage = `Bu hafta gelir ve giderleriniz dengede.`;
            closingColor = "var(--text-muted)";
        }

        const content = `
            <!-- KAPANIŞ ANALİZ KARTI -->
            <div class="card mb-4" style="border: 1px solid var(--border); border-left: 4px solid ${closingColor};">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                    <div>
                        <h4 style="color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.5rem">Haftalık Net Durum</h4>
                        <div style="font-size: 1.1rem; color: var(--text-main);">${closingMessage}</div>
                    </div>
                </div>
            </div>

            <div class="card mb-4">
                <h3 class="card-title">Haftalık Genel Bakış</h3>
                <p class="text-muted">Son 7 günün harcama ve gelir trendleri.</p>
            </div>

            <div style="display: flex; flex-direction: column; gap: 2rem;">
                <!-- GELİR -->
                <div class="chart-row-wrapper">
                    <h3 class="section-title text-success">Haftalık Gelir Trendi</h3>
                    <div class="chart-row">
                        <div class="chart-card">
                             <div class="chart-header">Günlük Dağılım</div>
                             <div style="height: 250px;"><canvas id="weeklyIncomeBar"></canvas></div>
                        </div>
                        <div class="chart-card">
                             <div class="chart-header">Kaynak Dağılımı</div>
                             <div style="height: 250px;"><canvas id="weeklyIncomePie"></canvas></div>
                        </div>
                    </div>
                </div>

                <!-- GİDER -->
                <div class="chart-row-wrapper">
                    <h3 class="section-title text-danger">Haftalık Harcama Trendi</h3>
                    <div class="chart-row">
                        <div class="chart-card">
                             <div class="chart-header">Günlük Harcama</div>
                             <div style="height: 250px;"><canvas id="weeklyExpenseBar"></canvas></div>
                        </div>
                        <div class="chart-card">
                             <div class="chart-header">Kategori Dağılımı</div>
                             <div style="height: 250px;"><canvas id="weeklyExpensePie"></canvas></div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                .chart-row-wrapper { margin-bottom: 2rem; }
                .section-title { font-size: 1.25rem; margin-bottom: 1rem; padding-left: 0.5rem; border-left: 4px solid currentColor; }
                .chart-row {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 1.5rem;
                }
                @media (max-width: 900px) {
                    .chart-row { grid-template-columns: 1fr; }
                }
                .chart-card {
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    padding: 1.5rem;
                }
                .chart-header {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    margin-bottom: 1rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
            </style>
        `;

        return window.Utils.PageWrapper('Haftalık Özet', content);
    },

    afterRender: () => {
        const transactions = window.Store.getTransactions();

        const incomeTrans = transactions.filter(t => t.type === 'income');
        const expenseTrans = transactions.filter(t => t.type === 'expense');

        // BAR CHART: Timeline (Günler)
        const incomeTimeline = window.Utils.prepareTimelineData(incomeTrans, 'weekly');
        const expenseTimeline = window.Utils.prepareTimelineData(expenseTrans, 'weekly');

        // PIE CHART: Kategoriler
        const incomeCategories = window.Utils.groupDataByCategory(incomeTrans);
        const expenseCategories = window.Utils.groupDataByCategory(expenseTrans);

        if (incomeCategories.labels.length === 0) { incomeCategories.labels = ['Veri Yok']; incomeCategories.data = [0]; }
        if (expenseCategories.labels.length === 0) { expenseCategories.labels = ['Veri Yok']; expenseCategories.data = [0]; }

        window.Utils.renderChart('weeklyIncomeBar', 'Gelir', incomeTimeline.labels, incomeTimeline.data, '#10b981', { barThickness: 10 });
        window.Utils.renderPieChart('weeklyIncomePie', 'Gelir', incomeCategories.labels, incomeCategories.data, window.Utils.greenPalette);

        window.Utils.renderChart('weeklyExpenseBar', 'Gider', expenseTimeline.labels, expenseTimeline.data, '#ef4444', { barThickness: 10 });
        window.Utils.renderPieChart('weeklyExpensePie', 'Gider', expenseCategories.labels, expenseCategories.data, window.Utils.redPalette);
    }
};
