// ================ DREAM REALM - Firebase Configuration ================
// تم التحديث بمعلومات Firebase الجديدة

const firebaseConfig = {
    apiKey: "AIzaSyBuQEtPF6q_GxwtqT7cl1crdA8SGUPGE7c",
    authDomain: "dream-realm-7b654.firebaseapp.com",
    databaseURL: "https://dream-realm-7b654-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "dream-realm-7b654",
    storageBucket: "dream-realm-7b654.firebasestorage.app",
    messagingSenderId: "708773386154",
    appId: "1:708773386154:web:ed09cac847ed0348b03dd3"
};

// Initialize Firebase (باستخدام طريقة CDN القديمة)
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

// ================ تهيئة الإحصائيات عند أول استخدام ================
function initializeStats() {
    database.ref('stats').once('value').then((snapshot) => {
        if (!snapshot.exists()) {
            database.ref('stats').set({
                dreams: 0,
                users: 0,
                today: 0
            });
        }
    });
}

initializeStats();

// ================ Global Variables ================
let currentUser = null;
let allDreams = [];

// ================ Authentication ================
auth.onAuthStateChanged((user) => {
    currentUser = user;
    updateUI();
    
    if (window.location.pathname.includes('profile.html') && !user) {
        window.location.href = 'login.html';
    }
});

function updateUI() {
    const userMenu = document.getElementById('userMenu');
    if (!userMenu) return;
    
    if (currentUser) {
        const username = currentUser.displayName || currentUser.email?.split('@')[0] || 'مستخدم';
        userMenu.innerHTML = `
            <a href="profile.html" class="btn btn-outline">${username}</a>
            <button onclick="logout()" class="btn btn-outline">خروج</button>
        `;
    } else {
        userMenu.innerHTML = `
            <a href="login.html" class="btn btn-outline">دخول</a>
            <a href="register.html" class="btn btn-primary">انضم</a>
        `;
    }
}

window.logout = function() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    });
};

// ================ Stats Functions ================
function getTotalDreams() {
    return database.ref('stats/dreams').once('value').then(s => s.val() || 0);
}

function getTotalUsers() {
    return database.ref('stats/users').once('value').then(s => s.val() || 0);
}

function getTodayDreams() {
    return database.ref('stats/today').once('value').then(s => s.val() || 0);
}

function updateStats(type, increment = 1) {
    database.ref(`stats/${type}`).transaction((current) => (current || 0) + increment);
}

// ================ Dream Functions ================
function loadDreams(containerId, limit = 10, filter = 'all', userId = null) {
    let query = database.ref('dreams').orderByChild('timestamp');
    
    if (userId) {
        query = database.ref('dreams').orderByChild('userId').equalTo(userId);
    }
    
    query.limitToLast(limit).once('value').then((snapshot) => {
        const dreams = snapshot.val();
        const container = document.getElementById(containerId);
        
        if (!container) return;
        container.innerHTML = '';
        
        if (dreams) {
            let dreamsArray = Object.entries(dreams).reverse();
            
            if (filter === 'popular') {
                dreamsArray.sort((a, b) => {
                    const likesA = a[1].likes ? Object.keys(a[1].likes).length : 0;
                    const likesB = b[1].likes ? Object.keys(b[1].likes).length : 0;
                    return likesB - likesA;
                });
            }
            
            dreamsArray.forEach(([id, dream]) => {
                container.appendChild(createDreamCard(id, dream));
            });
        } else {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">لا توجد أحلام بعد</p>';
        }
    });
}

function createDreamCard(id, dream) {
    const card = document.createElement('div');
    card.className = 'dream-card';
    
    const date = dream.timestamp ? new Date(dream.timestamp).toLocaleDateString('ar-EG') : 'تاريخ غير معروف';
    const username = dream.username || 'مستخدم';
    const initial = username.charAt(0).toUpperCase();
    const likesCount = dream.likes ? Object.keys(dream.likes).length : 0;
    const isLiked = currentUser && dream.likes && dream.likes[currentUser.uid];
    
    card.innerHTML = `
        <div class="dream-card-header">
            <div class="dream-card-avatar">${initial}</div>
            <div>
                <div class="dream-card-name">${username}</div>
                <div class="dream-card-time">${date}</div>
            </div>
        </div>
        <div class="dream-card-content">${dream.text.substring(0, 150)}${dream.text.length > 150 ? '...' : ''}</div>
        <div class="dream-card-footer">
            <span class="dream-card-likes" onclick="toggleLike('${id}')">
                <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
                <span class="likes-count-${id}">${likesCount}</span>
            </span>
            <a href="dream.html?id=${id}" class="dream-card-link">اقرأ المزيد</a>
        </div>
    `;
    
    return card;
}

window.toggleLike = function(dreamId) {
    if (!currentUser) {
        alert('يجب تسجيل الدخول أولاً');
        window.location.href = 'login.html';
        return;
    }
    
    const dreamRef = database.ref('dreams/' + dreamId);
    
    dreamRef.transaction((dream) => {
        if (dream) {
            if (!dream.likes) dream.likes = {};
            
            if (dream.likes[currentUser.uid]) {
                delete dream.likes[currentUser.uid];
            } else {
                dream.likes[currentUser.uid] = true;
            }
        }
        return dream;
    }).then(() => {
        dreamRef.once('value').then((snapshot) => {
            const dream = snapshot.val();
            const likesCount = dream.likes ? Object.keys(dream.likes).length : 0;
            const likeSpan = document.querySelector(`.likes-count-${dreamId}`);
            if (likeSpan) likeSpan.textContent = likesCount;
        });
    });
};

// ================ User Functions ================
function registerUser(email, password, username) {
    return auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            return userCredential.user.updateProfile({
                displayName: username
            }).then(() => {
                return database.ref('users/' + userCredential.user.uid).set({
                    username: username,
                    email: email,
                    joinDate: new Date().toISOString()
                });
            }).then(() => {
                updateStats('users');
                return userCredential;
            });
        });
}

function loginUser(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
}

// ================ Dream Submission ================
function submitDream(text, isPublic = true) {
    if (!currentUser) {
        alert('يجب تسجيل الدخول أولاً');
        window.location.href = 'login.html';
        return Promise.reject();
    }
    
    const dreamData = {
        userId: currentUser.uid,
        username: currentUser.displayName || currentUser.email?.split('@')[0] || 'مستخدم',
        text: text,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        isPublic: isPublic,
        likes: {}
    };
    
    return database.ref('dreams').push(dreamData).then(() => {
        updateStats('dreams');
        updateStats('today');
    });
}

// ================ Export functions to window ================
window.submitDream = submitDream;
window.registerUser = registerUser;
window.loginUser = loginUser;
window.loadDreams = loadDreams;
window.getTotalDreams = getTotalDreams;
window.getTotalUsers = getTotalUsers;
window.getTodayDreams = getTodayDreams;
