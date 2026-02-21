// ================ DREAM REALM LEGENDARY - الكود الأسطوري ================

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
    console.log('✨ Dream Realm Legendary - جاهز للعمل');
    
    initStars();
    initTypewriter();
    initHeader();
    initBackToTop();
    initAuth();
    loadStats();
    loadDreams();
    initForms();
    initSearch();
    initFilters();
    initPagination();
    updateTimeBasedColors();
});

// ================ 1. خلفية النجوم ================
function initStars() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;
    
    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const size = Math.random() * 3;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = 2 + Math.random() * 5;
        
        star.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}%;
            top: ${y}%;
            animation-duration: ${duration}s;
            animation-delay: ${Math.random() * 5}s;
        `;
        
        starsContainer.appendChild(star);
    }
}

// ================ 2. تأثير الكتابة التلقائية ================
function initTypewriter() {
    const element = document.getElementById('typewriter');
    if (!element) return;
    
    const words = [
        'أهلاً بك في عالم الأحلام',
        'شارك أحلامك مع العالم',
        'اكتشف عوالم جديدة',
        'Dream Realm'
    ];
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }
    
    type();
}

// ================ 3. تأثير الهيدر ================
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ================ 4. زر العودة للأعلى ================
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

// ================ 5. ألوان متغيرة مع الوقت ================
function updateTimeBasedColors() {
    const hours = new Date().getHours();
    let hue = 260; // افتراضي
    
    if (hours >= 5 && hours < 8) { // شروق الشمس
        hue = 30;
    } else if (hours >= 8 && hours < 17) { // نهار
        hue = 210;
    } else if (hours >= 17 && hours < 20) { // غروب
        hue = 10;
    } else { // ليل
        hue = 260;
    }
    
    document.documentElement.style.setProperty('--primary-hue', hue);
}

// ================ 6. نظام المصادقة ================
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
    if (!userMenu || !currentUser) return;
    
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

function updateUIForLoggedOutUser() {
    const userMenu = document.getElementById('userMenu');
    if (!userMenu) return;
    
    userMenu.innerHTML = `
        <a href="login.html" class="btn btn-outline">دخول</a>
        <a href="register.html" class="btn btn-primary">انضم</a>
    `;
}

function logout() {
    auth.signOut().then(() => {
        showNotification('تم الخروج من العالم', 'info');
        window.location.href = 'index.html';
    });
}

// ================ 7. تحميل الإحصائيات ================
function loadStats() {
    const statsRef = database.ref('stats');
    
    statsRef.on('value', (snapshot) => {
        const stats = snapshot.val() || { dreams: 1247, users: 829, today: 42, likes: 3456 };
        
        document.querySelectorAll('[data-stat]').forEach(el => {
            const stat = el.getAttribute('data-stat');
            if (stats[stat] !== undefined) {
                el.textContent = stats[stat].toLocaleString('ar-EG');
            }
        });
    });
}

// ================ 8. تحميل الأحلام ================
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
        } else {
            grid.innerHTML = '<p class="no-dreams">لا توجد أحلام بعد</p>';
        }
    });
}

function displayDreams(dreamsArray, append = false) {
    const grid = document.getElementById('dreamsGrid');
    if (!grid) return;
    
    if (!append) {
        grid.innerHTML = '';
    }
    
    dreamsArray.forEach(([id, dream], index) => {
        const card = createDreamCard(id, dream);
        card.style.setProperty('--index', index + 1);
        grid.appendChild(card);
    });
}

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
                <span class="dream-card-stat" onclick="viewDream('${id}')">
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

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'الآن';
    if (seconds < 3600) return `منذ ${Math.floor(seconds / 60)} دقيقة`;
    if (seconds < 86400) return `منذ ${Math.floor(seconds / 3600)} ساعة`;
    return `منذ ${Math.floor(seconds / 86400)} يوم`;
}

// ================ 9. نظام الإعجابات ================
function toggleLike(dreamId, element) {
    if (!currentUser) {
        showNotification('يجب الدخول أولاً', 'error');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }
    
    const dreamRef = database.ref('dreams/' + dreamId);
    const icon = element.querySelector('i');
    const countSpan = element.querySelector('.like-count');
    
    dreamRef.transaction((dream) => {
        if (dream) {
            const userLikes = dream.userLikes || {};
            
            if (userLikes[currentUser.uid]) {
                delete userLikes[currentUser.uid];
                dream.likes = (dream.likes || 1) - 1;
                icon.classList.remove('fas');
                icon.classList.add('far');
                element.classList.remove('liked');
            } else {
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
        dreamRef.once('value').then((snapshot) => {
            const dream = snapshot.val();
            countSpan.textContent = dream.likes || 0;
        });
        
        database.ref('stats/likes').transaction((likes) => (likes || 0) + 1);
    });
}

// ================ 10. نظام تسجيل الدخول ================
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            showNotification('تم الدخول بنجاح', 'success');
            setTimeout(() => window.location.href = 'index.html', 1500);
        })
        .catch((error) => showNotification(error.message, 'error'));
}

// ================ 11. نظام التسجيل ================
function handleRegister(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            return userCredential.user.updateProfile({ displayName: username }).then(() => {
                return database.ref('users/' + userCredential.user.uid).set({
                    username,
                    email,
                    joinDate: new Date().toISOString(),
                    dreams: 0,
                    followers: 0,
                    following: 0
                });
            }).then(() => {
                database.ref('stats/users').transaction((users) => (users || 0) + 1);
            });
        })
        .then(() => {
            showNotification('تم إنشاء العالم', 'success');
            setTimeout(() => window.location.href = 'login.html', 1500);
        })
        .catch((error) => showNotification(error.message, 'error'));
}

// ================ 12. نظام إضافة حلم ================
function handleAddDream(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showNotification('يجب الدخول أولاً', 'error');
        window.location.href = 'login.html';
        return;
    }
    
    const dreamText = document.getElementById('dreamText').value;
    const isPublic = document.getElementById('isPublic')?.checked || true;
    
    if (!dreamText.trim()) {
        showNotification('اكتب حلمك', 'error');
        return;
    }
    
    const dreamRef = database.ref('dreams').push();
    
    const dream = {
        userId: currentUser.uid,
        username: currentUser.displayName || currentUser.email?.split('@')[0] || 'مستخدم',
        text: dreamText,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        isPublic,
        likes: 0,
        comments: 0,
        userLikes: {}
    };
    
    dreamRef.set(dream).then(() => {
        showNotification('تم تسجيل الحلم', 'success');
        document.getElementById('dreamText').value = '';
        
        database.ref('stats/dreams').transaction((dreams) => (dreams || 0) + 1);
        database.ref('stats/today').transaction((today) => (today || 0) + 1);
        
        setTimeout(() => window.location.href = 'explore.html', 1500);
    });
}

// ================ 13. البحث ================
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    let timeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        
        timeout = setTimeout(() => {
            const query = e.target.value.toLowerCase();
            
            if (query.length < 2) {
                displayDreams(allDreams.slice(0, dreamsPerPage));
                return;
            }
            
            const filtered = allDreams.filter(([id, dream]) => 
                dream.text.toLowerCase().includes(query) ||
                (dream.username && dream.username.toLowerCase().includes(query))
            );
            
            displayDreams(filtered.slice(0, dreamsPerPage));
            
            if (filtered.length === 0) {
                showNotification('لا توجد نتائج', 'info');
            }
        }, 500);
    });
}

// ================ 14. الفلاتر ================
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
}

// ================ 15. التقسيم ================
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
            showNotification('انتهت الأحلام', 'info');
        }
    });
}

// ================ 16. عرض الحلم ================
function viewDream(dreamId) {
    window.location.href = `dream.html?id=${dreamId}`;
}

// ================ 17. نظام الإشعارات ================
function showNotification(message, type = 'success') {
    const old = document.querySelector('.notification');
    if (old) old.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    let icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'info') icon = 'fa-info-circle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ================ 18. تحميل بيانات المستخدم ================
function loadUserData(userId) {
    database.ref('users/' + userId).once('value').then((snapshot) => {
        const userData = snapshot.val();
        if (userData) {
            // تحديث واجهة المستخدم
        }
    });
}

// ================ 19. ربط النماذج ================
function initForms() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    
    const dreamForm = document.getElementById('dreamForm');
    if (dreamForm) dreamForm.addEventListener('submit', handleAddDream);
}

// ================ 20. تصدير الدوال ================
window.toggleLike = toggleLike;
window.viewDream = viewDream;
window.showNotification = showNotification;
window.logout = logout;

// ================ 21. إضافة الأنماط ================
const styles = document.createElement('style');
styles.textContent = `
    .notification {
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        background: oklch(0.15 0.1 var(--primary-hue) / 0.9);
        backdrop-filter: blur(10px);
        color: white;
        padding: 1rem 2rem;
        border-radius: var(--radius-full);
        border: 1px solid oklch(1 0.1 var(--primary-hue) / 0.1);
        box-shadow: var(--glow-primary);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: transform 0.3s;
    }
    
    .notification.show {
        transform: translateX(-50%) translateY(0);
    }
    
    .notification i {
        font-size: 1.2rem;
    }
    
    .notification-success i { color: #10b981; }
    .notification-error i { color: #ef4444; }
    .notification-info i { color: #3b82f6; }
    
    .profile-tab {
        padding: 0.5rem 1rem;
        background: transparent;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 1rem;
        position: relative;
    }
    
    .profile-tab.active {
        color: var(--text-primary);
    }
    
    .profile-tab.active::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, 
            oklch(0.7 0.3 var(--primary-hue)), 
            oklch(0.7 0.3 330));
    }
    
    .no-dreams {
        text-align: center;
        padding: 4rem;
        color: var(--text-secondary);
        font-size: 1.2rem;
    }
`;

document.head.appendChild(styles);

// ================ 22. تحديث الألوان كل دقيقة ================
setInterval(updateTimeBasedColors, 60000);

// ================ 23. معالجة الأخطاء ================
window.addEventListener('error', (event) => {
    console.error('خطأ:', event.error);
    showNotification('حدث خطأ', 'error');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('وعد غير معالج:', event.reason);
});

// ================ تم الانتهاء ================
console.log('✅ Dream Realm Legendary جاهز للعمل');
