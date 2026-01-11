/**
 * Router Yapısı - Global Scope
 * Auth Guard Eklendi
 */

window.App = window.App || {};

window.App.Router = {
    // Sayfa tanımları
    routes: {
        '': 'dashboard',
        '#login': 'login',
        '#register': 'register',
        '#dashboard': 'dashboard',
        '#daily': 'daily',
        '#weekly': 'weekly',
        '#monthly': 'monthly',
        '#income': 'income',
        '#expense': 'expense',
        '#categories': 'categories',
        '#budget': 'budget',
        '#goals': 'goals',
        '#settings': 'settings'
    },

    init: () => {
        window.addEventListener('hashchange', window.App.Router.handleRoute);
        window.App.Router.handleRoute(); // İlk yükleme
    },

    handleRoute: () => {
        const hash = window.location.hash; // Boşsa '' gelir

        // 1. Auth Kontrolü
        const isLoggedIn = window.Store.isLoggedIn();

        // Eğer giriş yapılmamışsa ve login/register sayfasında değilse -> Login'e at
        if (!isLoggedIn && hash !== '#login' && hash !== '#register') {
            window.location.hash = '#login';
            return;
        }

        // Eğer giriş YAPILMIŞSA ve login/register'a gitmeye çalışıyorsa -> Dashboard'a at
        if (isLoggedIn && (hash === '#login' || hash === '#register' || hash === '')) {
            window.location.hash = '#dashboard';
            return;
        }

        // 2. Rota Belirleme
        const pageName = window.App.Router.routes[hash] || 'dashboard';
        const contentDiv = document.getElementById('content');

        // 3. Render
        const page = window.Pages[pageName];

        if (page && page.render) {
            contentDiv.innerHTML = page.render();

            if (page.afterRender) {
                page.afterRender();
            }

            if (window.lucide) {
                window.lucide.createIcons();
            }
        } else {
            console.error('Sayfa bulunamadı:', pageName);
            // Hata durumunda Dashboard iyidir
            if (isLoggedIn) window.location.hash = '#dashboard';
            else window.location.hash = '#login';
        }
    }
};
