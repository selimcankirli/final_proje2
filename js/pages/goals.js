/**
 * Hedefler Sayfası - Global Scope
 * Akıllı Tasarruf ve Tavsiye Sistemi
 */
window.Pages = window.Pages || {};

window.Pages.goals = {
    render: () => {
        const formatCurrency = window.Utils.formatCurrency;
        const currentBalance = window.Store.getBalance();

        // Kullanıcının daha önce kaydettiği hedef varsa al, yoksa varsayılan 0
        const user = window.Store.currentUser;
        const monthlyTarget = user.data.monthlyTarget || 0;

        // Tarih Hesaplamaları
        const today = new Date();
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const daysRemaining = Math.ceil((lastDayOfMonth - today) / (1000 * 60 * 60 * 24));

        // Matematiksel Hesaplama
        const neededAmount = monthlyTarget - currentBalance;
        let dailySavings = 0;
        let statusMessage = "";
        let statusColor = "";

        if (monthlyTarget > 0) {
            if (currentBalance >= monthlyTarget) {
                statusMessage = "Tebrikler! 🎉 Hedefinize ulaştınız. Artık keyfini çıkarabilirsiniz.";
                statusColor = "var(--success)";
            } else {
                dailySavings = neededAmount / daysRemaining;
                if (daysRemaining <= 0) dailySavings = neededAmount; // Son gün veya geçtiyse

                statusMessage = `Hedefe ulaşmak için ay sonuna kadar toplam <b>${formatCurrency(neededAmount)}</b> daha biriktirmelisiniz.`;
                statusColor = "var(--text-main)";
            }
        } else {
            statusMessage = "Henüz bir hedef belirlemediniz.";
            statusColor = "var(--text-muted)";
        }

        const content = `
            <!-- Hedef Belirleme Kartı -->
            <div class="card mb-4" style="background: linear-gradient(135deg, #1e1b4b, #312e81); border: 1px solid var(--primary);">
                <h3 class="card-title text-success" style="margin-bottom: 1.5rem">🎯 Ay Sonu Hedefi</h3>
                <p class="text-muted" style="color: #c7d2fe !important; margin-bottom: 1.5rem">
                    Bu ayın sonunda toplam varlığınızın ne kadar olmasını istiyorsunuz?
                </p>
                
                <form onsubmit="event.preventDefault(); window.Pages.goals.setTarget(this)" style="display: flex; gap: 1rem; align-items: flex-end;">
                     <div style="flex: 1">
                        <label style="display: block; margin-bottom: 0.5rem; color: #c7d2fe; font-size: 0.875rem">Hedef Tutar</label>
                        <input type="number" name="amount" value="${monthlyTarget}" step="100" style="
                            width: 100%; 
                            padding: 0.75rem; 
                            border-radius: var(--radius); 
                            border: 1px solid rgba(255,255,255,0.2); 
                            background: rgba(0,0,0,0.2); 
                            color: white;
                            font-size: 1.25rem;
                            font-weight: 700;
                            outline: none;
                        ">
                    </div>
                    <button class="btn btn-primary" style="height: 52px; background-color: var(--success); border: none;">Hedefi Güncelle</button>
                </form>
            </div>

            <!-- Analiz ve Tavsiye -->
            ${monthlyTarget > 0 && currentBalance < monthlyTarget ? `
                <div class="card mb-4">
                    <h3 class="card-title mb-4">📊 Durum Analizi</h3>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                         <div style="background: var(--bg-hover); padding: 1rem; border-radius: var(--radius); text-align: center;">
                            <div class="text-muted" style="font-size: 0.875rem">Mevcut Varlık</div>
                            <div style="font-weight: 700; font-size: 1.25rem; color: var(--text-main)">${formatCurrency(currentBalance)}</div>
                        </div>
                        <div style="background: var(--bg-hover); padding: 1rem; border-radius: var(--radius); text-align: center;">
                            <div class="text-muted" style="font-size: 0.875rem">Kalan Gün</div>
                            <div style="font-weight: 700; font-size: 1.25rem; color: var(--primary)">${daysRemaining} Gün</div>
                        </div>
                        <div style="background: var(--bg-hover); padding: 1rem; border-radius: var(--radius); text-align: center; border: 1px solid var(--primary);">
                            <div class="text-muted" style="font-size: 0.875rem; color: var(--primary)">Günlük Hedef</div>
                            <div style="font-weight: 700; font-size: 1.25rem; color: var(--primary)">${formatCurrency(dailySavings)}</div>
                        </div>
                    </div>

                    <div style="background: rgba(99, 102, 241, 0.1); padding: 1.5rem; border-radius: var(--radius); border-left: 4px solid var(--primary);">
                        <h4 style="color: var(--primary); margin-bottom: 0.5rem; font-size: 1.1rem">💡 Finansal Tavsiye</h4>
                        <p style="line-height: 1.6; color: var(--text-main)">
                            ${statusMessage}
                            <br><br>
                            Bu hedefe ulaşmak için bugünden itibaren her gün <b>${formatCurrency(dailySavings)}</b> kenara koymalısın. 
                            Bunu başarmak için dışarıdaki harcamaları (kahve, yemek) azaltmayı düşünebilirsin.
                        </p>
                    </div>
                </div>
            ` : ''}

            ${monthlyTarget > 0 && currentBalance >= monthlyTarget ? `
                 <div class="card" style="text-align: center; padding: 3rem;">
                    <div style="width: 80px; height: 80px; background: rgba(16, 185, 129, 0.2); color: var(--success); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;">
                        <i data-lucide="party-popper" width="40" height="40"></i>
                    </div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">Harika İş! 🎉</h3>
                    <p class="text-muted">Bu ayki hedefine şimdiden ulaştın.</p>
                </div>
            ` : ''}
        `;

        return window.Utils.PageWrapper('Hedefler & Tavsiyeler', content);
    },

    setTarget: (form) => {
        const amount = parseFloat(form.amount.value);

        // Store'a kaydet (Store'da bu alan yoktu, dinamik ekliyoruz veya store.js güncellenebilir ama JS object olduğu için sorun yok)
        const user = window.Store.currentUser;
        if (user) {
            user.data.monthlyTarget = amount;
            window.Store.updateUserData(); // DB'ye yazar

            // Sayfayı yenile
            document.getElementById('content').innerHTML = window.Pages.goals.render();
            if (window.lucide) window.lucide.createIcons();
        }
    }
};
