/**
 * Giriş Sayfası
 */
window.Pages = window.Pages || {};

window.Pages.login = {
    render: () => {
        return `
            <div style="
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: var(--bg-main);
            ">
                <div class="card" style="width: 100%; max-width: 400px; padding: 2.5rem;">
                    <div style="text-align: center; margin-bottom: 2rem;">
                        <h1 style="color: var(--primary); font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">FinansApp</h1>
                        <p class="text-muted">Bulut tabanlı finans yönetimi</p>
                    </div>

                    <form onsubmit="event.preventDefault(); window.Pages.login.handleLogin(this)">
                        <div class="mb-4">
                            <label class="text-muted" style="font-size: 0.875rem; display: block; margin-bottom: 0.5rem">E-posta</label>
                            <input type="email" name="email" required class="form-input" placeholder="ornek@mail.com">
                        </div>

                        <div class="mb-4">
                            <label class="text-muted" style="font-size: 0.875rem; display: block; margin-bottom: 0.5rem">Şifre</label>
                            <input type="password" name="password" required class="form-input" placeholder="******">
                        </div>

                        <button id="loginBtn" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Giriş Yap</button>
                    </form>

                    <div style="text-align: center; margin-top: 1.5rem;">
                        <span class="text-muted">Hesabın yok mu?</span>
                        <a href="#register" style="color: var(--primary); text-decoration: none; font-weight: 600; margin-left: 0.5rem;">Kayıt Ol</a>
                    </div>
                    
                    <div id="loginError" style="color: var(--danger); text-align: center; margin-top: 1rem; font-size: 0.9rem;"></div>
                </div>
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
            </style>
        `;
    },

    handleLogin: async (form) => {
        const email = form.email.value;
        const password = form.password.value;
        const btn = document.getElementById('loginBtn');
        const errorDiv = document.getElementById('loginError');

        btn.disabled = true;
        btn.innerText = "Giriş yapılıyor...";
        errorDiv.innerText = "";

        // Config Kontrol
        if (window.Config.SUPABASE_URL.includes('URL_BURAYA')) {
            errorDiv.innerHTML = "Lütfen <code>js/config.js</code> dosyasını Supabase bilgilerinizle düzenleyin.";
            btn.disabled = false;
            btn.innerText = "Giriş Yap";
            return;
        }

        const { data, error } = await window.Store.login(email, password);

        if (error) {
            errorDiv.innerText = "Hata: " + (error.message === "Invalid API Key" ? "API Key hatalı." : "E-posta veya şifre yanlış.");
            btn.disabled = false;
            btn.innerText = "Giriş Yap";
        } else {
            // Başarılı giriş, Store.js içindeki onAuthStateChange yönlendirmeyi yapacak
            // Biz sadece bekleyelim
            btn.innerText = "Yönlendiriliyor...";
        }
    }
};
