/**
 * Kayıt Sayfası
 */
window.Pages = window.Pages || {};

window.Pages.register = {
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
                        <p class="text-muted">Hemen ücretsiz hesap oluştur</p>
                    </div>

                    <form onsubmit="event.preventDefault(); window.Pages.register.handleRegister(this)">
                        <div class="mb-4">
                            <label class="text-muted" style="font-size: 0.875rem; display: block; margin-bottom: 0.5rem">Ad Soyad</label>
                            <input type="text" name="fullname" required class="form-input" placeholder="Adınız Soyadınız">
                        </div>

                        <div class="mb-4">
                            <label class="text-muted" style="font-size: 0.875rem; display: block; margin-bottom: 0.5rem">E-posta</label>
                            <input type="email" name="email" required class="form-input" placeholder="ornek@mail.com">
                        </div>

                        <div class="mb-4">
                            <label class="text-muted" style="font-size: 0.875rem; display: block; margin-bottom: 0.5rem">Şifre (Min 6 karakter)</label>
                            <input type="password" name="password" required minlength="6" class="form-input" placeholder="******">
                        </div>

                        <button id="regBtn" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Kayıt Ol</button>
                    </form>

                    <div style="text-align: center; margin-top: 1.5rem;">
                        <span class="text-muted">Zaten hesabın var mı?</span>
                        <a href="#login" style="color: var(--primary); text-decoration: none; font-weight: 600; margin-left: 0.5rem;">Giriş Yap</a>
                    </div>
                     <div id="regError" style="color: var(--danger); text-align: center; margin-top: 1rem; font-size: 0.9rem;"></div>
                </div>
            </div>
        `;
    },

    handleRegister: async (form) => {
        const fullname = form.fullname.value;
        const email = form.email.value;
        const password = form.password.value;
        const btn = document.getElementById('regBtn');
        const errorDiv = document.getElementById('regError');

        btn.disabled = true;
        btn.innerText = "Kaydediliyor...";
        errorDiv.innerText = "";

        // Config Kontrol
        if (window.Config.SUPABASE_URL.includes('URL_BURAYA')) {
            errorDiv.innerHTML = "Lütfen <code>js/config.js</code> dosyasını Supabase bilgilerinizle düzenleyin.";
            btn.disabled = false;
            btn.innerText = "Kayıt Ol";
            return;
        }

        const { data, error } = await window.Store.register(email, password, fullname);

        if (error) {
            errorDiv.innerText = "Hata: " + error.message;
            btn.disabled = false;
            btn.innerText = "Kayıt Ol";
        } else {
            alert('Kayıt başarılı! Lütfen giriş yapın.');
            window.location.hash = '#login';
        }
    }
};
