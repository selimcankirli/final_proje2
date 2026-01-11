/**
 * Gider Yönetimi Sayfası - Global Scope
 */
window.Pages = window.Pages || {};

window.Pages.expense = {
    render: () => {
        const expenses = window.Store.getTransactions().filter(t => t.type === 'expense');
        const formatCurrency = window.Utils.formatCurrency;
        const formatDate = window.Utils.formatDate;
        const today = new Date().toISOString().split('T')[0];

        // --- ANALİZ VE TAVSİYE MANTIĞI ---
        const categoryTotals = {};
        expenses.forEach(t => {
            if (!categoryTotals[t.category]) categoryTotals[t.category] = 0;
            categoryTotals[t.category] += t.amount;
        });

        // En yüksek harcamayı bul
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
            'Market': 'Market harcamalarınız bütçenizin büyük kısmını oluşturuyor. İndirimleri takip etmek, liste ile alışveriş yapmak ve toplu alımlar ciddi tasarruf sağlayabilir.',
            'Fatura': 'Faturalar en büyük gider kaleminiz. Gereksiz abonelikleri iptal etmeyi, enerji tasarrufu yapmayı veya daha uygun tarifeleri araştırmayı düşünün.',
            'Kira': 'Kira gideriniz yüksek görünüyor. Bu sabit bir gider olsa da, ev arkadaşı seçenekleri veya daha uygun bölgeler uzun vadede değerlendirilebilir.',
            'Eğlence': 'Eğlence ve keyfi harcamalarınız zirvede. Dışarıda yemek yerine ev etkinlikleri düzenleyerek veya ücretsiz aktivitelere yönelerek her ay ciddi miktarda para biriktirebilirsiniz.',
            'Ulaşım': 'Ulaşım masraflarınız dikkat çekici. Mümkünse toplu taşıma kullanmak, yürümek veya araç paylaşımı yapmak bütçenizi rahatlatacaktır.',
            'Yatırım': 'En çok harcamayı "Yatırım" olarak yapmışsınız. Bu harika! Geleceğiniz için bütçe ayırıyorsunuz. Bu disiplini korumaya devam edin.',
            'Diğer': 'Diğer kategorisindeki harcamalarınız çok fazla. Bu harcamaları daha detaylı kategorize ederek nereye para gittiğini tam olarak görebilir ve gereksizleri eleyebilirsiniz.'
        };

        const advice = maxCategory ? (adviceMap[maxCategory] || 'Harcamalarınızı gözden geçirerek tasarruf potansiyeli yaratabilirsiniz.') : '';

        // --- SAYFA İÇERİĞİ ---
        const content = `
            <!-- ANALİZ KARTI (Varsa göster) -->
            ${maxCategory ? `
                <div class="card mb-4" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05)); border: 1px solid rgba(239, 68, 68, 0.3);">
                    <div style="display: flex; gap: 1rem; align-items: flex-start;">
                        <div style="
                            min-width: 48px; height: 48px; 
                            background: rgba(239, 68, 68, 0.2); 
                            color: var(--danger); 
                            border-radius: 12px; 
                            display: flex; align-items: center; justify-content: center;
                        ">
                            <i data-lucide="alert-circle" width="24" height="24"></i>
                        </div>
                        <div>
                            <h4 style="color: var(--danger); margin-bottom: 0.5rem; font-size: 1.1rem;">
                                En Yüksek Gider: ${maxCategory} (${formatCurrency(maxAmount)})
                            </h4>
                            <p style="color: var(--text-main); line-height: 1.5; font-size: 0.95rem;">
                                ${advice}
                            </p>
                        </div>
                    </div>
                </div>
            ` : ''}

            <div class="card mb-4" style="border-top: 4px solid var(--danger)">
                <h3 class="card-title mb-4">Yeni Gider Ekle</h3>
                <form onsubmit="event.preventDefault(); window.Pages.expense.handleAdd(this)" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    
                     <div style="grid-column: span 2;">
                        <label class="text-muted" style="font-size: 0.875rem">Açıklama</label>
                        <input type="text" name="desc" placeholder="Örn: Altın Alımı" required class="form-input">
                    </div>

                    <div>
                        <label class="text-muted" style="font-size: 0.875rem">Tutar</label>
                        <input type="number" name="amount" placeholder="0.00" step="0.01" required class="form-input">
                    </div>
                    
                    <div>
                        <label class="text-muted" style="font-size: 0.875rem">Kategori</label>
                        <select name="category" class="form-input">
                            <option value="Market">Market</option>
                            <option value="Fatura">Fatura</option>
                            <option value="Kira">Kira</option>
                            <option value="Ulaşım">Ulaşım</option>
                            <option value="Eğlence">Eğlence</option>
                            <option value="Yatırım">Yatırım</option>
                            <option value="Diğer">Diğer</option>
                        </select>
                    </div>
                    
                     <div style="grid-column: span 2;">
                        <label class="text-muted" style="font-size: 0.875rem">Tarih</label>
                        <input type="date" name="date" value="${today}" required class="form-input">
                    </div>

                    <div style="grid-column: span 2;">
                        <button class="btn btn-primary" style="background-color: var(--danger); width: 100%">Harcama Kaydet</button>
                    </div>
                </form>
            </div>

            <div class="table-container">
                 <h3 class="mb-4" style="padding: 1rem">Gider Geçmişi</h3>
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
                        ${expenses.map(t => `
                            <tr>
                                <td>${formatDate(t.date)}</td>
                                <td>
                                    <span style="
                                        padding: 4px 8px; 
                                        border-radius: 4px; 
                                        background-color: rgba(239, 68, 68, 0.1);
                                        color: var(--danger);
                                        font-size: 0.85rem;
                                    ">
                                        ${t.category}
                                    </span>
                                </td>
                                <td>${t.description}</td>
                                <td class="text-danger" style="font-weight:700">-${formatCurrency(t.amount)}</td>
                                <td>
                                    <button class="btn-icon-danger" onclick="window.Pages.expense.handleDelete(${t.id})">
                                        <i data-lucide="trash-2" width="18"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                         ${expenses.length === 0 ? '<tr><td colspan="5" style="text-align:center; padding:1rem; color:var(--text-muted)">Kayıt yok.</td></tr>' : ''}
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
                .form-input:focus { border-color: var(--danger); }
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

        return window.Utils.PageWrapper('Gider Ekle', content);
    },

    handleAdd: (form) => {
        const desc = form.desc.value;
        const amount = parseFloat(form.amount.value);
        const category = form.category.value;
        const date = form.date.value;

        window.Store.addTransaction({
            type: 'expense',
            category: category,
            description: desc,
            amount: amount,
            date: date
        });

        document.getElementById('content').innerHTML = window.Pages.expense.render();
        if (window.lucide) window.lucide.createIcons();
    },

    handleDelete: (id) => {
        if (confirm('Bu gideri silmek istediğinize emin misiniz?')) {
            window.Store.deleteTransaction(id);
            document.getElementById('content').innerHTML = window.Pages.expense.render();
            if (window.lucide) window.lucide.createIcons();
        }
    }
};
