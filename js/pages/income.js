/**
 * Gelir Yönetimi Sayfası - Global Scope
 */
window.Pages = window.Pages || {};

window.Pages.income = {
    render: () => {
        const incomes = window.Store.getTransactions().filter(t => t.type === 'income');
        const formatCurrency = window.Utils.formatCurrency;
        const formatDate = window.Utils.formatDate;
        const today = new Date().toISOString().split('T')[0];

        // --- ANALİZ VE TAVSİYE MANTIĞI ---
        const categoryTotals = {};
        incomes.forEach(t => {
            if (!categoryTotals[t.category]) categoryTotals[t.category] = 0;
            categoryTotals[t.category] += t.amount;
        });

        // En yüksek geliri bul
        let maxCategory = null;
        let maxAmount = 0;

        for (const [cat, total] of Object.entries(categoryTotals)) {
            if (total > maxAmount) {
                maxAmount = total;
                maxCategory = cat;
            }
        }

        // Tavsiye Mesajları Sözlüğü
        const adviceMap = {
            'Maaş': 'Ana gelir kaynağınız sabit maaşınız. Gelirinizi artırmak için terfi istemeyi, fazla mesai seçeneklerini veya yeteneklerinizi geliştirerek daha yüksek pozisyonları hedeflemeyi düşünebilirsiniz.',
            'Freelance': 'Freelance gelirleriniz gayet iyi! Bu alandaki başarınız, potansiyelinizin yüksek olduğunu gösteriyor. Portföyünüzü genişleterek veya saatlik ücretinizi artırarak bunu ana işe dönüştürme fırsatınız olabilir.',
            'Aileden Destek': 'Ailenizin desteği bütçeniz için önemli bir güvence. Ancak finansal özgürlüğünüzü kazanmak için bu kaynağı birikim veya yatırım aracı olarak kullanıp, kendi gelir akışlarınızı çeşitlendirmeyi hedeflemelisiniz.',
            'Yatırım': 'Yatırımlarınızdan getiri elde etmeye başlamanız harika! Bileşik getiri etkisinden faydalanmak için kârınızı tekrar yatırıma dönüştürmeyi düşünebilirsiniz.',
            'Diğer': 'Farklı kaynaklardan gelir elde etmek (pasif gelir, satış vb.) harika bir strateji. Bu "Diğer" kalemlerin hangisinin en kârlı olduğunu analiz edip, o alana daha fazla odaklanarak gelirinizi katlayabilirsiniz.'
        };

        const advice = maxCategory ? (adviceMap[maxCategory] || 'Gelir kaynaklarınızı çeşitlendirmek finansal güvenliğinizi artıracaktır.') : '';

        const content = `
            <!-- ANALİZ KARTI (Varsa göster) -->
            ${maxCategory ? `
                <div class="card mb-4" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05)); border: 1px solid rgba(16, 185, 129, 0.3);">
                    <div style="display: flex; gap: 1rem; align-items: flex-start;">
                        <div style="
                            min-width: 48px; height: 48px; 
                            background: rgba(16, 185, 129, 0.2); 
                            color: var(--success); 
                            border-radius: 12px; 
                            display: flex; align-items: center; justify-content: center;
                        ">
                            <i data-lucide="trending-up" width="24" height="24"></i>
                        </div>
                        <div>
                            <h4 style="color: var(--success); margin-bottom: 0.5rem; font-size: 1.1rem;">
                                Ana Gelir Kaynağı: ${maxCategory} (${formatCurrency(maxAmount)})
                            </h4>
                            <p style="color: var(--text-main); line-height: 1.5; font-size: 0.95rem;">
                                ${advice}
                            </p>
                        </div>
                    </div>
                </div>
            ` : ''}

            <div class="card mb-4">
                <h3 class="card-title mb-4">Yeni Gelir Ekle</h3>
                <form onsubmit="event.preventDefault(); window.Pages.income.handleAdd(this)" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    
                    <div style="grid-column: span 2;">
                        <label class="text-muted" style="font-size: 0.875rem">Açıklama</label>
                        <input type="text" name="desc" placeholder="Örn: Hisse Senedi Karı" required class="form-input">
                    </div>
                    
                    <div>
                        <label class="text-muted" style="font-size: 0.875rem">Tutar</label>
                        <input type="number" name="amount" placeholder="0.00" step="0.01" required class="form-input">
                    </div>
                    
                    <div>
                        <label class="text-muted" style="font-size: 0.875rem">Kategori</label>
                        <select name="category" class="form-input">
                            <option value="Maaş">Maaş</option>
                            <option value="Freelance">Freelance</option>
                            <option value="Yatırım">Yatırım</option>
                             <option value="Aileden Destek">Aileden Destek</option>
                            <option value="Diğer">Diğer</option>
                        </select>
                    </div>

                    <div>
                        <label class="text-muted" style="font-size: 0.875rem">Tarih</label>
                        <input type="date" name="date" value="${today}" required class="form-input">
                    </div>

                    <div style="grid-column: span 2;">
                         <button class="btn btn-primary" style="width: 100%">Kaydet</button>
                    </div>
                </form>
            </div>

            <div class="table-container">
                <h3 class="mb-4" style="padding: 1rem">Gelir Geçmişi</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Tarih</th>
                            <th>Kategori</th>
                            <th>Açıklama</th>
                            <th>Tutar</th>
                            <th style="width: 50px;"></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${incomes.map(t => `
                            <tr>
                                <td>${formatDate(t.date)}</td>
                                <td>
                                    <span style="
                                        padding: 4px 8px; 
                                        border-radius: 4px; 
                                        font-size: 0.75rem; 
                                        background-color: rgba(16, 185, 129, 0.2);
                                        color: var(--success);
                                    ">
                                        ${t.category}
                                    </span>
                                </td>
                                <td>${t.description}</td>
                                <td class="text-success" style="font-weight:700">+${formatCurrency(t.amount)}</td>
                                <td>
                                    <button class="btn-icon-danger" onclick="window.Pages.income.handleDelete(${t.id})">
                                        <i data-lucide="trash-2" width="18"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <style>
                .form-input {
                    width: 100%;
                    padding: 0.75rem;
                    background: var(--bg-main);
                    border: 1px solid var(--border);
                    color: var(--text-main);
                    border-radius: var(--radius);
                    outline: none;
                }
                .form-input:focus { border-color: var(--primary); }
                .btn-icon-danger {
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                }
                .btn-icon-danger:hover { background: rgba(239,68,68,0.1); color: var(--danger); }
            </style>
        `;

        return window.Utils.PageWrapper('Gelir Ekle', content);
    },

    handleAdd: (form) => {
        const desc = form.desc.value;
        const amount = parseFloat(form.amount.value);
        const category = form.category.value;
        const date = form.date.value;

        window.Store.addTransaction({
            type: 'income',
            category: category,
            description: desc,
            amount: amount,
            date: date
        });

        document.getElementById('content').innerHTML = window.Pages.income.render();
        if (window.lucide) window.lucide.createIcons();
    },

    handleDelete: (id) => {
        if (confirm('Bu geliri silmek istediğinize emin misiniz?')) {
            window.Store.deleteTransaction(id);
            document.getElementById('content').innerHTML = window.Pages.income.render();
            if (window.lucide) window.lucide.createIcons();
        }
    }
};
