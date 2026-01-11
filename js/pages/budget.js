/**
 * Bütçe Sayfası - Global Scope
 */
window.Pages = window.Pages || {};

window.Pages.budget = {
    render: () => {
        const initialBalance = window.Store.getInitialBalance();
        const formatCurrency = window.Utils.formatCurrency;

        const content = `
            <div class="card mb-4">
                <h3 class="card-title mb-4">Cüzdan / Başlangıç Bütçesi</h3>
                <p class="text-muted" style="margin-bottom: 1.5rem">
                    Toplam varlıklarınızı hesaplarken kullanılacak başlangıç parasını (kasa, banka, vb.) buradan belirleyin.
                </p>
                
                <form onsubmit="event.preventDefault(); window.Pages.budget.handleUpdate(this)" style="display: flex; gap: 1rem; align-items: flex-end;">
                    <div style="flex: 1">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-muted)">Başlangıç Bakiyesi</label>
                        <input type="number" name="balance" value="${initialBalance}" step="0.01" style="
                            width: 100%; 
                            padding: 0.75rem; 
                            border-radius: var(--radius); 
                            border: 1px solid var(--border); 
                            background: var(--bg-main); 
                            color: var(--text-main);
                            font-size: 1.1rem;
                            font-weight: 600;
                        ">
                    </div>
                    <button class="btn btn-primary" style="height: 48px;">Güncelle</button>
                </form>
            </div>

            <div class="card" style="border-style: dashed; opacity: 0.7; padding: 2rem; text-align: center;">
                 <i data-lucide="info" style="margin-bottom: 0.5rem"></i>
                 <p>Kategori bazlı limit özellikleri bir sonraki güncellemede eklenecektir.</p>
            </div>
        `;

        return window.Utils.PageWrapper('Bütçe Yönetimi', content);
    },

    handleUpdate: (form) => {
        const amount = form.balance.value;
        window.Store.setInitialBalance(amount);
        alert('Başlangıç bütçesi güncellendi!');
        // Sayfayı yenilemeye gerek yok ama input değerini koruduk.
        // Dashboard'a dönünce etki görülecek.
    }
};
