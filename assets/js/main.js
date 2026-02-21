// ================ Dream Realm - الملف الرئيسي الكامل ================
// جميع الحقوق محفوظة - تصميم حاصل على جوائز عالمية

// ================ تهيئة كل شيء عند تحميل الصفحة ================
document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initBackToTop();
    initMobileMenu();
    initStats();
    initParticles();
    initSmoothScroll();
    initLazyLoading();
    initInfiniteScroll();
    initSearch();
    initFilters();
    initLikeButtons();
    initCommentSystem();
    initShareButtons();
    initFormValidation();
    initPasswordStrength();
    initImagePreview();
    initAutoSave();
    initNotifications();
    initKeyboardShortcuts();
    initThemeToggle();
    initReadingProgress();
});

// ================ 1. تأثير التمرير على الهيدر ================
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        // Add background when scrolled
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header based on scroll direction
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

// ================ 2. زر العودة للأعلى ================
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
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ================ 3. القائمة الجانبية للجوال ================
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('mobileSidebar');
    const closeBtn = document.getElementById('closeSidebar');
    const overlay = document.getElementById('overlay');
    
    if (!menuBtn || !sidebar || !closeBtn || !overlay) return;
    
    function openMenu() {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    menuBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            closeMenu();
        }
    });
}

// ================ 4. تحريك الأرقام الإحصائية ================
function initStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
        if (isNaN(target)) return;
        
        let current = 0;
        const increment = target / 50;
        const formattedTarget = target.toLocaleString('ar-EG');
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = formattedTarget;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current).toLocaleString('ar-EG');
            }
        }, 20);
    });
}

// ================ 5. جسيمات متحركة في الخلفية ================
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 50;
    const particles = [];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 1;
        const speedX = (Math.random() - 0.5) * 0.5;
        const speedY = (Math.random() - 0.5) * 0.5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            pointer-events: none;
            transition: transform 0.1s;
            box-shadow: 0 0 ${size * 2}px rgba(99, 102, 241, 0.3);
        `;
        
        container.appendChild(particle);
        particles.push({
            element: particle,
            x: parseFloat(particle.style.left),
            y: parseFloat(particle.style.top),
            speedX,
            speedY,
            size
        });
    }
    
    // Animate particles
    function animateParticles() {
        particles.forEach(p => {
            p.x += p.speedX * 0.1;
            p.y += p.speedY * 0.1;
            
            // Wrap around screen
            if (p.x < 0) p.x = 100;
            if (p.x > 100) p.x = 0;
            if (p.y < 0) p.y = 100;
            if (p.y > 100) p.y = 0;
            
            p.element.style.left = p.x + '%';
            p.element.style.top = p.y + '%';
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    // Mouse interaction
    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth) * 100;
        const mouseY = (e.clientY / window.innerHeight) * 100;
        
        particles.forEach(p => {
            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 20) {
                const angle = Math.atan2(dy, dx);
                const force = (20 - distance) * 0.1;
                p.x -= Math.cos(angle) * force;
                p.y -= Math.sin(angle) * force;
            }
        });
    });
}

// ================ 6. تمرير سلس ================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ================ 7. تحميل الصور عند الظهور ================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ================ 8. تحميل المزيد عند التمرير ================
function initInfiniteScroll() {
    let loading = false;
    let page = 1;
    const container = document.getElementById('infinite-scroll-container');
    
    if (!container) return;
    
    window.addEventListener('scroll', () => {
        if (loading) return;
        
        const scrollPosition = window.innerHeight + window.scrollY;
        const threshold = document.documentElement.scrollHeight - 1000;
        
        if (scrollPosition >= threshold) {
            loading = true;
            page++;
            
            // Show loading indicator
            const loader = document.createElement('div');
            loader.className = 'infinite-scroll-loader';
            loader.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';
            container.appendChild(loader);
            
            // Simulate loading
            setTimeout(() => {
                loader.remove();
                loading = false;
                
                // Load more content
                loadMoreContent(page);
            }, 1000);
        }
    });
}

function loadMoreContent(page) {
    // This would normally fetch from server
    console.log(`Loading page ${page}`);
}

// ================ 9. البحث المباشر ================
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(() => {
            const query = e.target.value.trim();
            if (query.length > 2) {
                performSearch(query);
            }
        }, 500);
    });
}

function performSearch(query) {
    console.log('Searching for:', query);
    showNotification(`جاري البحث عن: ${query}`, 'info');
}

// ================ 10. تصفية المحتوى ================
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Get filter value
            const filter = btn.dataset.filter;
            
            // Apply filter
            applyFilter(filter);
        });
    });
}

function applyFilter(filter) {
    console.log('Applying filter:', filter);
    showNotification(`تم تطبيق الفلتر: ${filter}`, 'success');
}

// ================ 11. أزرار الإعجاب ================
function initLikeButtons() {
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleLike(btn);
        });
    });
}

function toggleLike(btn) {
    const icon = btn.querySelector('i');
    const countSpan = btn.querySelector('.like-count');
    
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        
        if (countSpan) {
            let count = parseInt(countSpan.textContent) || 0;
            countSpan.textContent = count + 1;
        }
        
        showNotification('تم تسجيل إعجابك', 'success');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        
        if (countSpan) {
            let count = parseInt(countSpan.textContent) || 0;
            countSpan.textContent = Math.max(0, count - 1);
        }
    }
}

// ================ 12. نظام التعليقات ================
function initCommentSystem() {
    document.querySelectorAll('.comment-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const input = form.querySelector('input[type="text"]');
            const comment = input.value.trim();
            
            if (comment) {
                addComment(form, comment);
                input.value = '';
            }
        });
    });
}

function addComment(form, commentText) {
    const commentsContainer = form.closest('.comments-section')?.querySelector('.comments-list');
    
    if (commentsContainer) {
        const comment = document.createElement('div');
        comment.className = 'comment';
        comment.innerHTML = `
            <div class="comment-avatar">
                <i class="fas fa-user-circle"></i>
            </div>
            <div class="comment-content">
                <div class="comment-author">أنت</div>
                <div class="comment-text">${commentText}</div>
                <div class="comment-time">الآن</div>
            </div>
        `;
        
        commentsContainer.appendChild(comment);
        showNotification('تم إضافة التعليق', 'success');
    }
}

// ================ 13. أزرار المشاركة ================
function initShareButtons() {
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            shareContent(btn.dataset.url || window.location.href);
        });
    });
}

function shareContent(url) {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: url
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(url).then(() => {
            showNotification('تم نسخ الرابط', 'success');
        });
    }
}

// ================ 14. التحقق من صحة النماذج ================
function initFormValidation() {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!validateForm(form)) {
                e.preventDefault();
            }
        });
        
        form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('input', () => {
                validateField(field);
            });
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll('[required]');
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
    }
    
    return isValid;
}

function validateField(field) {
    const isValid = field.value.trim() !== '';
    
    if (!isValid) {
        field.style.borderColor = 'var(--danger)';
    } else {
        field.style.borderColor = '';
    }
    
    return isValid;
}

// ================ 15. قوة كلمة المرور ================
function initPasswordStrength() {
    const passwordInput = document.getElementById('password');
    if (!passwordInput) return;
    
    passwordInput.addEventListener('input', () => {
        const strength = checkPasswordStrength(passwordInput.value);
        updateStrengthIndicator(strength);
    });
}

function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[$@#&!]+/)) strength++;
    
    return strength;
}

function updateStrengthIndicator(strength) {
    const indicator = document.getElementById('passwordStrength');
    if (!indicator) return;
    
    indicator.className = 'password-strength';
    
    if (strength <= 2) {
        indicator.classList.add('weak');
        indicator.textContent = 'ضعيفة';
    } else if (strength <= 4) {
        indicator.classList.add('medium');
        indicator.textContent = 'متوسطة';
    } else {
        indicator.classList.add('strong');
        indicator.textContent = 'قوية';
    }
}

// ================ 16. معاينة الصور قبل الرفع ================
function initImagePreview() {
    const imageInput = document.getElementById('imageInput');
    if (!imageInput) return;
    
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const preview = document.getElementById('imagePreview');
                if (preview) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                }
            };
            
            reader.readAsDataURL(file);
        }
    });
}

// ================ 17. حفظ تلقائي ================
function initAutoSave() {
    const forms = document.querySelectorAll('[data-auto-save]');
    
    forms.forEach(form => {
        let saveTimeout;
        
        form.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            
            saveTimeout = setTimeout(() => {
                saveFormData(form);
            }, 2000);
        });
    });
}

function saveFormData(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    localStorage.setItem('formDraft', JSON.stringify(data));
    showNotification('تم الحفظ تلقائياً', 'info');
}

// ================ 18. نظام الإشعارات ================
function initNotifications() {
    // Check for notification permission
    if ('Notification' in window) {
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
}

function showNotification(message, type = 'success') {
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
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Dream Realm', {
            body: message,
            icon: '/favicon.ico'
        });
    }
}

// ================ 19. اختصارات لوحة المفاتيح ================
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl + K for search
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            document.getElementById('searchInput')?.focus();
        }
        
        // Esc to close modals
        if (e.key === 'Escape') {
            document.getElementById('mobileSidebar')?.classList.remove('open');
            document.getElementById('overlay')?.classList.remove('active');
        }
        
        // Ctrl + / for shortcuts help
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            showShortcutsHelp();
        }
    });
}

function showShortcutsHelp() {
    const help = document.createElement('div');
    help.className = 'shortcuts-help';
    help.innerHTML = `
        <div class="shortcuts-content">
            <h3>اختصارات لوحة المفاتيح</h3>
            <ul>
                <li><kbd>Ctrl</kbd> + <kbd>K</kbd> - بحث</li>
                <li><kbd>Esc</kbd> - إغلاق القوائم</li>
                <li><kbd>Ctrl</kbd> + <kbd>/</kbd> - هذه المساعدة</li>
                <li><kbd>Ctrl</kbd> + <kbd>Enter</kbd> - إرسال</li>
            </ul>
            <button onclick="this.parentElement.parentElement.remove()">حسناً</button>
        </div>
    `;
    document.body.appendChild(help);
}

// ================ 20. تبديل الثيم ================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        showNotification(`تم التبديل إلى الوضع ${isLight ? 'الفاتح' : 'الداكن'}`, 'info');
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
}

// ================ 21. مؤشر تقدم القراءة ================
function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// ================ 22. كشف الاتصال بالإنترنت ================
window.addEventListener('online', () => {
    showNotification('تم استعادة الاتصال بالإنترنت', 'success');
});

window.addEventListener('offline', () => {
    showNotification('انقطع الاتصال بالإنترنت', 'warning');
});

// ================ 23. حفظ حالة المستخدم ================
function saveUserState(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
}

function loadUserState() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
}

function clearUserState() {
    localStorage.removeItem('user');
}

// ================ 24. دوال مساعدة عامة ================
function formatDate(date) {
    return new Date(date).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatNumber(number) {
    return number.toLocaleString('ar-EG');
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ================ 25. تصدير الدوال إلى النطاق العام ================
window.toggleLike = toggleLike;
window.addComment = addComment;
window.shareContent = shareContent;
window.validateForm = validateForm;
window.showNotification = showNotification;
window.saveUserState = saveUserState;
window.loadUserState = loadUserState;
window.clearUserState = clearUserState;
window.formatDate = formatDate;
window.formatNumber = formatNumber;

// ================ 26. إضافة الأنماط اللازمة ================
const styles = document.createElement('style');
styles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        background: var(--bg-card);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
        padding: 1rem 2rem;
        border-radius: var(--radius-full);
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        transition: transform 0.3s ease;
        backdrop-filter: blur(12px);
    }
    
    .notification.show {
        transform: translateX(-50%) translateY(0);
    }
    
    .notification-success i { color: var(--success); }
    .notification-error i { color: var(--danger); }
    .notification-warning i { color: var(--warning); }
    .notification-info i { color: var(--info); }
    
    .reading-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--primary), var(--accent));
        z-index: 9999;
        width: 0%;
        transition: width 0.1s;
    }
    
    .shortcuts-help {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(8px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .shortcuts-content {
        background: var(--bg-card);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-xl);
        padding: 2rem;
        max-width: 400px;
        width: 90%;
    }
    
    .shortcuts-content h3 {
        margin-bottom: 1.5rem;
        color: var(--text-primary);
    }
    
    .shortcuts-content ul {
        list-style: none;
        margin-bottom: 2rem;
    }
    
    .shortcuts-content li {
        margin-bottom: 1rem;
        color: var(--text-secondary);
    }
    
    .shortcuts-content kbd {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        padding: 0.2rem 0.5rem;
        font-family: monospace;
        color: var(--primary-light);
    }
    
    .shortcuts-content button {
        width: 100%;
        padding: 0.75rem;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        border: none;
        border-radius: var(--radius-md);
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .shortcuts-content button:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-glow);
    }
    
    .password-strength {
        margin-top: 0.5rem;
        padding: 0.25rem 0.75rem;
        border-radius: var(--radius-full);
        font-size: 0.85rem;
        display: inline-block;
    }
    
    .password-strength.weak {
        background: rgba(239, 68, 68, 0.2);
        color: var(--danger);
    }
    
    .password-strength.medium {
        background: rgba(245, 158, 11, 0.2);
        color: var(--warning);
    }
    
    .password-strength.strong {
        background: rgba(16, 185, 129, 0.2);
        color: var(--success);
    }
    
    .infinite-scroll-loader {
        text-align: center;
        padding: 2rem;
        color: var(--text-secondary);
    }
    
    .infinite-scroll-loader i {
        margin-left: 0.5rem;
        color: var(--primary);
    }
`;

document.head.appendChild(styles);

// ================ 27. تهيئة الخدمات عند تحميل الصفحة بالكامل ================
window.addEventListener('load', () => {
    // Remove loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
    
    // Prefetch important pages
    const pages = ['pages/explore.html', 'pages/profile.html', 'pages/dream.html'];
    pages.forEach(page => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = page;
        document.head.appendChild(link);
    });
    
    console.log('✨ Dream Realm جاهز للعمل');
});

// ================ 28. معالجة الأخطاء العامة ================
window.addEventListener('error', (event) => {
    console.error('❌ خطأ:', event.error);
    showNotification('حدث خطأ غير متوقع', 'error');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ وعد غير معالج:', event.reason);
});

// ================ 29. حفظ الحالة قبل إغلاق الصفحة ================
window.addEventListener('beforeunload', () => {
    // Save any unsaved data
    const drafts = localStorage.getItem('formDraft');
    if (drafts) {
        // Keep drafts
    }
});

// ================ 30. تهيئة مؤشرات الأداء ================
const perf = performance.getEntriesByType('navigation')[0];
console.log(`📊 وقت التحميل: ${perf.loadEventEnd - perf.startTime}ms`);
console.log(`📊 وقت التفسير: ${perf.domContentLoadedEventEnd - perf.startTime}ms`);

// ================ تم بحمد الله ================
