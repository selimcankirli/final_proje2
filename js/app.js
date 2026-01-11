/**
 * Uygulama Başlatıcı - Global Scope
 */

// App Init
window.addEventListener('DOMContentLoaded', async () => {
    const app = document.getElementById('app');

    // 0. Supabase & Store Init (Bekle)
    // Veritabanından veriler çekilmeden arayüzü çizme
    if (window.Store && window.Store.init) {
        await window.Store.init();
    }

    // 1. Layout Render
    app.innerHTML = window.Components.Layout.render();

    // 2. Start Live Clock
    if (window.Components.Layout.startClock) {
        window.Components.Layout.startClock();
    }

    // 3. İkonları Oluştur
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 4. Router'ı Başlat
    window.App.Router.init();
});
