/**
 * Yardımcı Fonksiyonlar - Global Scope
 */
window.Utils = window.Utils || {};

window.Utils.formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
    }).format(amount);
};

window.Utils.formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(date);
};

// --- RENK PALETLERİ ---
// Gelir İçin Yeşil Tonları
window.Utils.greenPalette = [
    '#10b981', // Emerald 500
    '#34d399', // Emerald 400
    '#059669', // Emerald 600
    '#6ee7b7', // Emerald 300
    '#047857', // Emerald 700
    '#a7f3d0', // Emerald 200
    '#065f46', // Emerald 800
    '#d1fae5'  // Emerald 100
];

// Gider İçin Kırmızı Tonları
window.Utils.redPalette = [
    '#ef4444', // Red 500
    '#f87171', // Red 400
    '#dc2626', // Red 600
    '#fca5a5', // Red 300
    '#b91c1c', // Red 700
    '#fecaca', // Red 200
    '#991b1b', // Red 800
    '#fee2e2'  // Red 100
];

// Eski karışık palet (Yedek)
window.Utils.colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1'
];

window.Utils.renderChart = (canvasId, label, labels, data, color, options = {}) => {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    const existingChart = Chart.getChart(canvasId);
    if (existingChart) existingChart.destroy();

    const datasetConfig = {
        label: label,
        data: data,
        backgroundColor: color,
        borderRadius: 4,
        borderWidth: 0
    };

    if (options.barThickness) {
        datasetConfig.barThickness = options.barThickness;
    }

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [datasetConfig]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94a3b8', font: { size: 10 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8', font: { size: 10 } }
                }
            },
            plugins: { legend: { display: false } }
        }
    });
};

// GÜNCELLENDİ: colorPalette parametresi eklendi
window.Utils.renderPieChart = (canvasId, label, labels, data, colorPalette) => {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    const existingChart = Chart.getChart(canvasId);
    if (existingChart) existingChart.destroy();

    // Eğer özel bir palet verilmezse varsayılan karışık renkleri kullan
    const colors = colorPalette || window.Utils.colors;

    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: colors,
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: '#e2e8f0', font: { size: 10 }, boxWidth: 12 }
                }
            }
        }
    });
};

window.Utils.groupDataByCategory = (transactions) => {
    const map = {};
    transactions.forEach(t => {
        if (!map[t.category]) map[t.category] = 0;
        map[t.category] += t.amount;
    });
    return {
        labels: Object.keys(map),
        data: Object.values(map)
    };
};

window.Utils.prepareTimelineData = (transactions, rangeType) => {
    const labels = [];
    const data = [];
    const now = new Date();

    if (rangeType === 'weekly') {
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(now.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayName = new Intl.DateTimeFormat('tr-TR', { weekday: 'short' }).format(d);
            labels.push(dayName);
            const dayTotal = transactions
                .filter(t => t.date.startsWith(dateStr))
                .reduce((acc, curr) => acc + curr.amount, 0);
            data.push(dayTotal);
        }
    }
    else if (rangeType === 'monthly') {
        const year = now.getFullYear();
        const month = now.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 1; i <= daysInMonth; i++) {
            labels.push(i.toString());
            const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const dayTotal = transactions
                .filter(t => t.date === dayStr)
                .reduce((acc, curr) => acc + curr.amount, 0);
            data.push(dayTotal);
        }
    }

    return { labels, data };
};
