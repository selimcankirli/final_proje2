/**
 * Aylık Rapor Sayfası - Global Scope
 */
window.Pages = window.Pages || {};

window.Pages.monthly = {
    render: () => {
        const formatCurrency = window.Utils.formatCurrency;
        const totalIncome = window.Store.getTotalIncome();
        const totalExpense = window.Store.getTotalExpense();
        const now = new Date();
        const monthName = new Intl.DateTimeFormat('tr-TR', { month: 'long' }).format(now);

        const monthlyNet = totalIncome - totalExpense;
        let closingMessage = "";
        let closingColor = "";

        if (monthlyNet > 0) {
            closingMessage = `Bu ayı şu an itibariyle <strong>${formatCurrency(monthlyNet)}</strong> artıda kapatıyorsunuz. Planlarınıza sadıksınız!`;
            closingColor = "var(--success)";
        } else if (monthlyNet < 0) {
            closingMessage = `Bu ayı şu an itibariyle <strong>${formatCurrency(Math.abs(monthlyNet))}</strong> ekside kapatıyorsunuz. Harcamaları kısma zamanı!`;
            closingColor = "var(--danger)";
        } else {
            closingMessage = `Bu ay şu ana kadar gelir ve gider dengede.`;
            closingColor = "var(--text-muted)";
        }

        const content = `
             <!-- KAPANIŞ ANALİZ KARTI -->
            <div class="card mb-4" style="background: rgba(30, 41, 59, 0.5); border: 2px solid ${closingColor}; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <div style="text-align: center; padding: 1rem;">
                    <h4 style="color: ${closingColor}; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem">Aylık Projeksiyon</h4>
                    <div style="font-size: 1.25rem; font-weight: 500; color: var(--text-main);">${closingMessage}</div>
                    <div style="margin-top: 1rem; font-size: 2.5rem; font-weight: 700; color: ${closingColor}">
                        ${monthlyNet >= 0 ? '+' : ''}${formatCurrency(monthlyNet)}
                    </div>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 2rem;">
                <!-- GELİR -->
                <div class="chart-row-wrapper">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem">
                        <h3 class="section-title text-success">Aylık Gelir Akışı</h3>
                        <span class="text-success" style="font-weight:700; font-size:1.2rem">+${formatCurrency(totalIncome)}</span>
                    </div>
                    <div class="chart-row">
                        <div class="chart-card">
                             <div class="chart-header">Günlük Gelir Grafiği (1-${new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()})</div>
                             <div style="height: 250px;"><canvas id="monthlyIncomeBar"></canvas></div>
                        </div>
                        <div class="chart-card">
                             <div class="chart-header">Kaynak Dağılımı</div>
                             <div style="height: 250px;"><canvas id="monthlyIncomePie"></canvas></div>
                        </div>
                    </div>
                </div>

                <!-- GİDER -->
                <div class="chart-row-wrapper">
                     <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem">
                        <h3 class="section-title text-danger">Aylık Harcama Akışı</h3>
                        <span class="text-danger" style="font-weight:700; font-size:1.2rem">-${formatCurrency(totalExpense)}</span>
                    </div>
                    <div class="chart-row">
                        <div class="chart-card">
                             <div class="chart-header">Günlük Harcama Grafiği (1-${new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()})</div>
                             <div style="height: 250px;"><canvas id="monthlyExpenseBar"></canvas></div>
                        </div>
                        <div class="chart-card">
                             <div class="chart-header">Kategori Dağılımı</div>
                             <div style="height: 250px;"><canvas id="monthlyExpensePie"></canvas></div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                .chart-row-wrapper { margin-bottom: 2rem; }
                .section-title { font-size: 1.25rem; padding-left: 0.5rem; border-left: 4px solid currentColor; margin: 0; }
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

        return window.Utils.PageWrapper('Aylık Rapor', content);
    },

    afterRender: () => {
        const transactions = window.Store.getTransactions();
        const incomeTrans = transactions.filter(t => t.type === 'income');
        const expenseTrans = transactions.filter(t => t.type === 'expense');

        const incomeTimeline = window.Utils.prepareTimelineData(incomeTrans, 'monthly');
        const expenseTimeline = window.Utils.prepareTimelineData(expenseTrans, 'monthly');

        const incomeCategories = window.Utils.groupDataByCategory(incomeTrans);
        const expenseCategories = window.Utils.groupDataByCategory(expenseTrans);

        if (incomeCategories.labels.length === 0) { incomeCategories.labels = ['Veri Yok']; incomeCategories.data = [0]; }
        if (expenseCategories.labels.length === 0) { expenseCategories.labels = ['Veri Yok']; expenseCategories.data = [0]; }

        // Render Bar (Timeline) - İnce sütunlar
        window.Utils.renderChart('monthlyIncomeBar', 'Gelir', incomeTimeline.labels, incomeTimeline.data, '#10b981', { barThickness: 10 });
        window.Utils.renderPieChart('monthlyIncomePie', 'Gelir', incomeCategories.labels, incomeCategories.data, window.Utils.greenPalette);

        window.Utils.renderChart('monthlyExpenseBar', 'Gider', expenseTimeline.labels, expenseTimeline.data, '#ef4444', { barThickness: 10 });
        window.Utils.renderPieChart('monthlyExpensePie', 'Gider', expenseCategories.labels, expenseCategories.data, window.Utils.redPalette);
    }
};
