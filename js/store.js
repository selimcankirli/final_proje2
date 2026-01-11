/**
 * Veri Yönetimi - Supabase & Memory Store
 * LocalStorage yerine Supabase kullanılır.
 * Performans için veriler açılışta çekilir ve hafızada tutulur.
 */

window.Store = window.Store || {};

// Private State
let _supabase = null;
let _transactions = [];
let _user = null;
let _initialized = false;

// 1. Başlatma ve Veri Çekme
window.Store.init = async () => {
    if (_initialized) return;

    // Config Kontrolü
    if (!window.Config.SUPABASE_URL || window.Config.SUPABASE_URL.includes('URL_BURAYA')) {
        console.warn('Supabase Config Eksik!');
        return;
    }

    try {
        const { createClient } = supabase;
        _supabase = createClient(window.Config.SUPABASE_URL, window.Config.SUPABASE_KEY);
        console.log("Supabase Client Başlatıldı.");

        // Kullanıcı Kontrolü
        const { data: { user } } = await _supabase.auth.getUser();
        _user = user;

        if (_user) {
            // Verileri Çek
            await window.Store.fetchTransactions();
        }

        // Auth Listener
        _supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                _user = session.user;
                window.Store.fetchTransactions().then(() => {
                    window.location.hash = '#dashboard';
                    window.location.reload();
                });
            } else if (event === 'SIGNED_OUT') {
                _user = null;
                _transactions = [];
                window.location.hash = '#login';
            }
        });

        _initialized = true;
    } catch (error) {
        console.error("Store Init Hatası:", error);
    }
};

// 2. Veritabanı İşlemleri (Async - Arka Plan)
window.Store.fetchTransactions = async () => {
    if (!_user) return;

    const { data, error } = await _supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false }); // En yeni en üstte

    if (error) {
        console.error('Veri çekme hatası:', error);
        alert('Veriler yüklenirken hata oluştu.');
        return;
    }

    _transactions = data || [];
};

// 3. UI Tarafından Kullanılan Metodlar (Senkron - Hızlı)
window.Store.getTransactions = () => {
    return _transactions;
};

window.Store.isAuthenticated = () => {
    return !!_user;
};

window.Store.getUserName = () => {
    return _user ? (_user.user_metadata?.full_name || _user.email.split('@')[0]) : 'Misafir';
};

window.Store.getTotalIncome = () => {
    return _transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
};

window.Store.getTotalExpense = () => {
    return _transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
};

// 4. Yazma İşlemleri (Optimistic UI + Async DB)
window.Store.addTransaction = async (transaction) => {
    if (!_user) return;

    // Geçici ID ile UI'ı hemen güncelle (Optimistic)
    const tempId = Date.now();
    const optimisticTrans = { ...transaction, id: tempId, user_id: _user.id };

    _transactions.unshift(optimisticTrans);
    // Not: UI hemen render edilecek (render fonksiyonları array'den okuyor)

    // DB'ye Yaz
    const { data, error } = await _supabase
        .from('transactions')
        .insert([{
            user_id: _user.id,
            description: transaction.description,
            amount: transaction.amount,
            category: transaction.category,
            type: transaction.type,
            date: transaction.date
        }])
        .select();

    if (error) {
        console.error('Ekleme Hatası:', error);
        alert('İşlem kaydedilemedi!');
        // Hata varsa geri al
        _transactions = _transactions.filter(t => t.id !== tempId);
    } else {
        // Gerçek veriyle güncelle (Gerçek ID geldi)
        const index = _transactions.findIndex(t => t.id === tempId);
        if (index !== -1 && data && data[0]) {
            _transactions[index] = data[0];
        }
    }
};

window.Store.deleteTransaction = async (id) => {
    // UI Güncelle
    const backup = [..._transactions];
    _transactions = _transactions.filter(t => t.id !== id);

    // DB'den Sil
    const { error } = await _supabase
        .from('transactions')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Silme Hatası:', error);
        alert('Silinemedi!');
        _transactions = backup; // Geri al
    }
};

// 5. Auth İşlemleri
window.Store.login = async (email, password) => {
    if (!_supabase) return { error: { message: "Supabase yapılandırılmamış." } };
    return await _supabase.auth.signInWithPassword({ email, password });
};

window.Store.register = async (email, password, fullName) => {
    if (!_supabase) return { error: { message: "Supabase yapılandırılmamış." } };

    // Kayıt olurken meta data (İsim) ekleyelim
    return await _supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: fullName }
        }
    });
};

window.Store.logout = async () => {
    if (_supabase) await _supabase.auth.signOut();
    window.location.hash = '#login';
};

window.Store.clearData = async () => {
    if (confirm('Tüm verileriniz kalıcı olarak silinecek. Emin misiniz?')) {
        const { error } = await _supabase
            .from('transactions')
            .delete()
            .neq('id', 0); // Hepsini sil (where id != 0 gibi hacky bir yöntem veya delete all)

        if (!error) {
            _transactions = [];
            alert('Veriler temizlendi.');
            // Sayfaları yenilemek gerekebilir
            window.location.reload();
        }
    }
};
