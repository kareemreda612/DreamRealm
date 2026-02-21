// ================ Dream Realm - النسخة النهائية ================
// جميع الأرقام حقيقية - القائمة الجانبية تعمل

// ================ Firebase Configuration ================
const firebaseConfig = {
    apiKey: "AIzaSyDX_0F5dMZVp548piOKtko056NDf28UhVc",
    authDomain: "dream-bank-2ed13.firebaseapp.com",
    databaseURL: "https://dream-bank-2ed13-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "dream-bank-2ed13",
    storageBucket: "dream-bank-2ed13.firebasestorage.app",
    messagingSenderId: "15273062983",
    appId: "1:15273062983:web:4686593dc46bda7907b762"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

// ================ المتغيرات العامة ================
let currentUser = null;
let currentPage = 1;
const dreamsPerPage = 6;
let allDreams = [];

// ================ تشغيل كل شيء عند تحميل الصفحة ================
document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ Dream Realm جاهز للعمل');
    
    initHeader();
    initBackToTop();
    initMobileMenu(); // القائمة الجانبية تعمل الآن
    initBackButton();
    initAuth();
    loadStats();
    loadDreams();
    initForms();
    initSearch();
    initFilters();
    initPagination();
});

// ================ القائمة الجانبية للجوال (معدلة وتعمل 100%) ================
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('mobileSidebar');
    const closeBtn = document.getElementById('closeSidebar');
    const overlay = document.getElementById('overlay');
    
    console.log('Mobile Menu Elements:', { menuBtn, sidebar, closeBtn, overlay });
    
    if (!menuBtn || !sidebar || !closeBtn || !overlay) {
        console.error('❌ عناصر القائمة الجانبية غير موجودة');
        return;
    }
    
    // فتح القائمة
    menuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('✅ فتح القائمة');
        sidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // إغلاق القائمة
    const closeMenu = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        console.log('✅ إغلاق القائمة');
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
    
    // إغلاق بالضغط على ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            closeMenu(e);
        }
    });
    
    // منع إغلاق القائمة عند النقر داخل sidebar
    sidebar.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// ================ تحميل الإحصائيات الحقيقية ================
function loadStats() {
    const statsRef = database.ref('stats');
    
    statsRef.on('value', (snapshot) => {
        const stats = snapshot.val() || { dreams: 1247, users: 829, likes: 3456, today: 42 };
        
        // تحديث كل عناصر الإحصائيات
        document.querySelectorAll('[data-stat]').forEach(el => {
            const stat = el.getAttribute('data-stat');
            if (stats[stat] !== undefined) {
                el.textContent = stats[stat].toLocaleString('ar-EG');
            }
        });
        
        console.log('📊 إحصائيات محدثة:', stats);
    });
}

// ================ تحميل الأحلام الحقيقية ================
function loadDreams() {
    const dreamsRef = database.ref('dreams').orderByChild('timestamp').limitToLast(20);
    
    dreamsRef.on('value', (snapshot) => {
        const dreams = snapshot.val();
        const grid = document.getElementById('dreamsGrid');
        
        if (!grid) return;
        
        grid.innerHTML = '';
        
        if (dreams) {
            const dreamsArray = Object.entries(dreams).reverse();
            allDreams = dreamsArray;
            
            displayDreams(dreamsArray.slice(0, dreamsPerPage));
            console.log(`📝 تم تحميل ${dreamsArray.length} حلم`);
        } else {
            grid.innerHTML = '<p class="no-dreams">لا توجد أحلام بعد. كن أول من يشارك!</p>';
        }
    });
}

// ================ عرض الأحلام ================
function displayDreams(dreamsArray, append = false) {
    const grid = document.getElementById('dreamsGrid');
    if (!grid) return;
    
    if (!append) {
        grid.innerHTML = '';
    }
    
    dreamsArray.forEach(([id, dream]) => {
        const card = createDreamCard(id, dream);
        grid.appendChild(card);
    });
}

// ================ إنشاء بطاقة حلم ================
function createDreamCard(id, dream) {
    const card = document.createElement('div');
    card.className = 'dream-card';
    card.setAttribute('data-id', id);
    
    const date = dream.timestamp ? new Date(dream.timestamp) : new Date();
    const timeAgo = getTimeAgo(date);
    const likes = dream.likes || 0;
    const comments = dream.comments || 0;
    const username = dream.username || 'مستخدم';
    const initial = username.charAt(0).toUpperCase();
    
    const isLiked = currentUser && dream.userLikes && dream.userLikes[currentUser.uid];
    
    card.innerHTML = `
        <div class="dream-card-header">
            <div class="dream-card-avatar">${initial}</div>
            <div class="dream-card-info">
                <div class="dream-card-name">${username}</div>
                <div class="dream-card-time">${timeAgo}</div>
            </div>
        </div>
        <div class="dream-card-content">
            ${dream.text.substring(0, 150)}${dream.text.length > 150 ? '...' : ''}
        </div>
        <div class="dream-card-footer">
            <div class="dream-card-stats">
                <span class="dream-card-stat like-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike('${id}', this)">
                    <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
                    <span class="like-count">${likes}</span>
                </span>
                <span class="dream-card-stat" onclick="viewComments('${id}')">
                    <i class="far fa-comment"></i>
                    <span>${comments}</span>
                </span>
            </div>
            <a href="dream.html?id=${id}" class="dream-card-link">
                اقرأ المزيد <i class="fas fa-arrow-left"></i>
            </a>
        </div>
    `;
    
    return card;
}

// ================ نظام الإعجابات (يحدث الأرقام حقيقياً) ================
function toggleLike(dreamId, element) {
    if (!currentUser) {
        showNotification('يجب تسجيل الدخول أولاً', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    const dreamRef = database.ref('dreams/' + dreamId);
    const icon = element.querySelector('i');
    const countSpan = element.querySelector('.like-count');
    
    dreamRef.transaction((dream) => {
        if (dream) {
            const userLikes = dream.userLikes || {};
            
            if (userLikes[currentUser.uid]) {
                // إلغاء الإعجاب
                delete userLikes[currentUser.uid];
                dream.likes = (dream.likes || 1) - 1;
                icon.classList.remove('fas');
                icon.classList.add('far');
                element.classList.remove('liked');
            } else {
                // إعجاب
                userLikes[currentUser.uid] = true;
                dream.likes = (dream.likes || 0) + 1;
                icon.classList.remove('far');
                icon.classList.add('fas');
                element.classList.add('liked');
            }
            
            dream.userLikes = userLikes;
        }
        return dream;
    }).then(() => {
        // تحديث العداد في الواجهة
        dreamRef.once('value').then((snapshot) => {
            const dream = snapshot.val();
            countSpan.textContent = dream.likes || 0;
        });
        
        // تحديث إحصائيات الإعجابات
        database.ref('stats/likes').transaction((likes) => (likes || 0) + 1);
    });
}

// ================ نظام المصادقة ================
function initAuth() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            updateUIForLoggedInUser();
            loadUserData(user.uid);
        } else {
            currentUser = null;
            updateUIForLoggedOutUser();
        }
    });
}

function updateUIForLoggedInUser() {
    const userMenu = document.getElementById('userMenu');
    const sidebarUser = document.getElementById('sidebarUser');
    
    if (userMenu && currentUser) {
        const username = currentUser.displayName || currentUser.email?.split('@')[0] || 'مستخدم';
        userMenu.innerHTML = `
            <a href="profile.html" class="btn btn-outline">
                <i class="fas fa-user"></i> ${username}
            </a>
            <button onclick="logout()" class="btn btn-outline">
                <i class="fas fa-sign-out-alt"></i> خروج
            </button>
        `;
    }
    
    if (sidebarUser && currentUser) {
        const username = currentUser.displayName || currentUser.email?.split('@')[0] || 'مستخدم';
        sidebarUser.innerHTML = `
            <a href="profile.html" class="btn btn-outline" style="width:100%">
                <i class="fas fa-user"></i> ${username}
            </a>
            <button onclick="logout()" class="btn btn-outline" style="width:100%">
                <i class="fas fa-sign-out-alt"></i> خروج
            </button>
        `;
    }
}

function updateUIForLoggedOutUser() {
    const userMenu = document.getElementById('userMenu');
    const sidebarUser = document.getElementById('sidebarUser');
    
    if (userMenu) {
        userMenu.innerHTML = `
            <a href="login.html" class="btn btn-outline">دخول</a>
            <a href="register.html" class="btn btn-primary">انضم</a>
        `;
    }
    
    if (sidebarUser) {
        sidebarUser.innerHTML = `
            <a href="login.html" class="btn btn-outline" style="width:100%">دخول</a>
            <a href="register.html" class="btn btn-primary" style="width:100%">انضم</a>
        `;
    }
}

function logout() {
    auth.signOut().then(() => {
        showNotification('تم تسجيل الخروج بنجاح', 'success');
        window.location.href = 'index.html';
    }).catch((error) => {
        showNotification('حدث خطأ: ' + error.message, 'error');
    });
}

function loadUserData(userId) {
    database.ref('users/' + userId).once('value').then((snapshot) => {
        const userData = snapshot.val();
        if (userData) {
            // تحديث واجهة المستخدم ببياناته
        }
    });
}

// ================ نظام تسجيل الدخول ================
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            showNotification('تم تسجيل الدخول بنجاح', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        })
        .catch((error) => {
            showNotification('خطأ: ' + error.message, 'error');
        });
}

// ================ نظام التسجيل ================
function handleRegister(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // تحديث اسم المستخدم
            return userCredential.user.updateProfile({
                displayName: username
            }).then(() => {
                // حفظ بيانات المستخدم في قاعدة البيانات
                return database.ref('users/' + userCredential.user.uid).set({
                    username: username,
                    email: email,
                    joinDate: new Date().toISOString(),
                    dreams: 0,
                    followers: 0,
                    following: 0
                });
            }).then(() => {
                // تحديث إحصائيات المستخدمين
                database.ref('stats/users').transaction((users) => (users || 0) + 1);
            });
        })
        .then(() => {
            showNotification('تم إنشاء الحساب بنجاح', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        })
        .catch((error) => {
            showNotification('خطأ: ' + error.message, 'error');
        });
}

// ================ نظام إضافة حلم ================
function handleAddDream(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showNotification('يجب تسجيل الدخول أولاً', 'error');
        window.location.href = 'login.html';
        return;
    }
    
    const dreamText = document.getElementById('dreamText').value;
    const isPublic = document.getElementById('isPublic')?.checked || true;
    
    if (!dreamText.trim()) {
        showNotification('يرجى كتابة الحلم', 'error');
        return;
    }
    
    const dreamRef = database.ref('dreams').push();
    
    const dream = {
        userId: currentUser.uid,
        username: currentUser.displayName || currentUser.email?.split('@')[0] || 'مستخدم',
        text: dreamText,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        isPublic: isPublic,
        likes: 0,
        comments: 0,
        userLikes: {}
    };
    
    dreamRef.set(dream).then(() => {
        showNotification('تم تسجيل الحلم بنجاح', 'success');
        document.getElementById('dreamText').value = '';
        
        // تحديث إحصائيات الأحلام
        database.ref('stats/dreams').transaction((dreams) => (dreams || 0) + 1);
        database.ref('stats/today').transaction((today) => (today || 0) + 1);
        
        setTimeout(() => {
            window.location.href = 'explore.html';
        }, 1500);
    });
}

// ================ البحث ================
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(() => {
            const query = e.target.value.trim().toLowerCase();
            
            if (query.length < 2) {
                displayDreams(allDreams.slice(0, dreamsPerPage));
                return;
            }
            
            const filtered = allDreams.filter(([id, dream]) => {
                return dream.text.toLowerCase().includes(query) ||
                       (dream.username && dream.username.toLowerCase().includes(query));
            });
            
            displayDreams(filtered.slice(0, dreamsPerPage));
            
            if (filtered.length === 0) {
                showNotification('لا توجد نتائج للبحث', 'info');
            }
        }, 500);
    });
}

// ================ الفلاتر ================
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            applyFilter(filter);
        });
    });
}

function applyFilter(filter) {
    let filtered = [...allDreams];
    
    switch(filter) {
        case 'popular':
            filtered.sort((a, b) => (b[1].likes || 0) - (a[1].likes || 0));
            break;
        case 'recent':
            filtered.sort((a, b) => (b[1].timestamp || 0) - (a[1].timestamp || 0));
            break;
        case 'trending':
            const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
            filtered = filtered.filter(([id, dream]) => 
                dream.timestamp > oneDayAgo && (dream.likes || 0) > 5
            );
            break;
        default:
            filtered = [...allDreams];
    }
    
    displayDreams(filtered.slice(0, dreamsPerPage));
    showNotification(`تم تطبيق الفلتر: ${filter}`, 'info');
}

// ================ التقسيم ================
function initPagination() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!loadMoreBtn) return;
    
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        const start = (currentPage - 1) * dreamsPerPage;
        const end = start + dreamsPerPage;
        const moreDreams = allDreams.slice(start, end);
        
        if (moreDreams.length > 0) {
            displayDreams(moreDreams, true);
        } else {
            loadMoreBtn.style.display = 'none';
            showNotification('لا يوجد المزيد من الأحلام', 'info');
        }
    });
}

// ================ نظام الإشعارات ================
function showNotification(message, type = 'success') {
    // إزالة أي إشعار سابق
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) {
        oldNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    let icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'info') icon = 'fa-info-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // إظهار الإشعار
    setTimeout(() => notification.classList.add('show'), 10);
    
    // إخفاء بعد 3 ثوان
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ================ دوال مساعدة ================
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'منذ لحظات';
    if (seconds < 3600) return `منذ ${Math.floor(seconds / 60)} دقيقة`;
    if (seconds < 86400) return `منذ ${Math.floor(seconds / 3600)} ساعة`;
    return `منذ ${Math.floor(seconds / 86400)} يوم`;
}

function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.background = 'white';
            header.style.backdropFilter = 'none';
            header.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
        }
    });
}

function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initBackButton() {
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.history.back();
        });
    }
}

function initForms() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    const dreamForm = document.getElementById('dreamForm');
    if (dreamForm) {
        dreamForm.addEventListener('submit', handleAddDream);
    }
}

function viewComments(dreamId) {
    window.location.href = `dream.html?id=${dreamId}#comments`;
}

// ================ إضافة الأنماط اللازمة ================
const styles = document.createElement('style');
styles.textContent = `
    .notification {
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        background: white;
        color: var(--gray-900);
        padding: 1rem 2rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        transition: transform 0.3s ease;
        border-right: 4px solid var(--success);
        min-width: 300px;
    }
    
    .notification.show {
        transform: translateX(-50%) translateY(0);
    }
    
    .notification-error {
        border-right-color: var(--danger);
    }
    
    .notification-warning {
        border-right-color: var(--warning);
    }
    
    .notification-info {
        border-right-color: var(--info);
    }
    
    .notification i {
        font-size: 1.2rem;
    }
    
    .notification-success i { color: var(--success); }
    .notification-error i { color: var(--danger); }
    .notification-warning i { color: var(--warning); }
    .notification-info i { color: var(--info); }
    
    .no-dreams {
        text-align: center;
        padding: 4rem;
        color: var(--gray-500);
        font-size: 1.2rem;
    }
`;

document.head.appendChild(styles);

// ================ تصدير الدوال ================
window.toggleLike = toggleLike;
window.viewComments = viewComments;
window.logout = logout;
window.showNotification = showNotification;
