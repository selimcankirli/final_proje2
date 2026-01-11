/**
 * Ayarlar Sayfası - Global Scope
 */
window.Pages = window.Pages || {};

window.Pages.settings = {
    render: () => {
        const user = window.Store.currentUser;

        const content = `
            <div class="card mb-4">
                <h3 class="card-title" style="margin-bottom: 1.5rem; font-size: 1.1rem">Profil Ayarları</h3>
                
                <form onsubmit="event.preventDefault(); window.Pages.settings.handleUpdate(this)">
                    <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem">
                        <div style="display: flex; flex-direction: column; gap: 0.5rem">
                            <label style="font-size: 0.875rem; color: var(--text-muted)">Ad Soyad</label>
                            <div style="display: flex; gap: 1rem;">
                                <input type="text" name="name" value="${user ? user.name : ''}" style="flex:1; padding: 0.75rem; border-radius: var(--radius); border: 1px solid var(--border); background: var(--bg-main); color: var(--text-main); outline: none;">
                                <button class="btn btn-primary">Güncelle</button>
                            </div>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem">
                            <label style="font-size: 0.875rem; color: var(--text-muted)">E-Posta</label>
                            <input type="text" value="${user ? user.email : ''}" readonly style="padding: 0.75rem; border-radius: var(--radius); border: 1px solid var(--border); background: var(--bg-hover); color: var(--text-muted);">
                        </div>
                    </div>
                </form>
            </div>

            <div class="card">
                <h3 class="card-title text-danger" style="margin-bottom: 1.5rem; font-size: 1.1rem">Veri Yönetimi</h3>
                <p class="text-muted" style="margin-bottom: 1rem">Hesabınızı silmeden sadece eklediğiniz işlemleri, bütçeyi ve hedefleri sıfırlar.</p>
                
                <button class="btn" style="border: 1px solid var(--danger); color: var(--danger)" onclick="window.Pages.settings.handleClear()">
                    <i data-lucide="refresh-ccw"></i> Listeleri ve Verileri Temizle
                </button>
            </div>
            
            <div style="margin-top: 2rem; text-align: center; color: var(--text-muted); font-size: 0.8rem">
                FinansTakip v3.0 Ultimate <br>
                Oturum: ${user ? user.email : '-'}
            </div>
        `;

        return window.Utils.PageWrapper('Ayarlar', content);
    },

    handleUpdate: (form) => {
        const name = form.name.value;
        window.Store.updateProfile(name);
        alert('Profil güncellendi!');
    },

    handleClear: () => {
        if (confirm('Tüm gelir, gider ve bütçe verileriniz silinecek. Onaylıyor musunuz?')) {
            window.Store.clearData();
            alert('Tüm veriler temizlendi.');
            location.reload();
        }
    }
};
