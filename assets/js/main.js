// ================ Dream Realm - المنطق الرئيسي ================

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    initHeader();
    initBackToTop();
    init3DScene();
    loadStats();
    loadRecentDreams();
});

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const mainContent = document.getElementById('mainContent');
    
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainContent.style.display = 'block';
        }, 500);
    }, 2000);
}

// Header Hide/Show on Scroll
function initHeader() {
    const header = document.querySelector('.glass-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
        
        lastScroll = currentScroll;
    });
}

// Back to Top Button
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
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

// 3D Scene with Three.js
function init3DScene() {
    const container = document.getElementById('canvas-container');
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 2000;
    const starsPositions = new Float32Array(starsCount * 3);
    
    for (let i = 0; i < starsCount * 3; i += 3) {
        starsPositions[i] = (Math.random() - 0.5) * 200;
        starsPositions[i + 1] = (Math.random() - 0.5) * 200;
        starsPositions[i + 2] = (Math.random() - 0.5) * 200;
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    
    const starsMaterial = new THREE.PointsMaterial({ 
        color: 0xffffff,
        size: 0.2,
        transparent: true
    });
    
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    // Create floating orbs
    const orbs = [];
    const orbColors = [0x6d28d9, 0xec4899, 0x3b82f6];
    
    for (let i = 0; i < 10; i++) {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshStandardMaterial({ 
            color: orbColors[Math.floor(Math.random() * orbColors.length)],
            emissive: 0x222222,
            roughness: 0.2,
            metalness: 0.1
        });
        const sphere = new THREE.Mesh(geometry, material);
        
        sphere.position.x = (Math.random() - 0.5) * 30;
        sphere.position.y = (Math.random() - 0.5) * 30;
        sphere.position.z = (Math.random() - 0.5) * 30;
        
        scene.add(sphere);
        orbs.push(sphere);
    }
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        stars.rotation.y += 0.0002;
        stars.rotation.x += 0.0001;
        
        orbs.forEach((orb, i) => {
            orb.rotation.x += 0.01;
            orb.rotation.y += 0.01;
            orb.position.y += Math.sin(Date.now() * 0.001 + i) * 0.005;
        });
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Load stats from Firebase
function loadStats() {
    // Temporary mock data
    document.getElementById('totalDreams').textContent = '12,847';
    document.getElementById('totalUsers').textContent = '8,291';
    document.getElementById('activeNow').textContent = '342';
}

// Load recent dreams
function loadRecentDreams() {
    const grid = document.getElementById('recentDreamsGrid');
    
    // Mock data
    const dreams = [
        { user: 'سارة', dream: 'حلمت أنني أطير فوق المدينة...', likes: 234, comments: 45 },
        { user: 'أحمد', dream: 'رأيت نفسي أتكلم مع القمر...', likes: 156, comments: 23 },
        { user: 'ندى', dream: 'كنت في غابة من الكريستال...', likes: 89, comments: 12 }
    ];
    
    dreams.forEach(d => {
        const card = document.createElement('div');
        card.className = 'dream-card';
        card.innerHTML = `
            <div class="dream-card-header">
                <div class="dream-user">
                    <i class="fas fa-user-circle"></i>
                    <span>${d.user}</span>
                </div>
                <div class="dream-time">منذ ساعة</div>
            </div>
            <div class="dream-content">
                "${d.dream}"
            </div>
            <div class="dream-footer">
                <div class="dream-likes">
                    <i class="fas fa-heart"></i>
                    <span>${d.likes}</span>
                </div>
                <div class="dream-comments">
                    <i class="fas fa-comment"></i>
                    <span>${d.comments}</span>
                </div>
                <a href="pages/dream.html" class="read-more">اقرأ المزيد</a>
            </div>
        `;
        grid.appendChild(card);
    });
}