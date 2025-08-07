document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1500);

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav ul');
    
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        menuToggle.querySelector('i').classList.toggle('fa-times');
    });

    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav ul li a').forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            menuToggle.querySelector('i').classList.remove('fa-times');
        });
    });

    // Sticky Header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Back to Top Button
    const backToTopBtn = document.querySelector('.back-to-top');
    window.addEventListener('scroll', function() {
        backToTopBtn.classList.toggle('active', window.scrollY > 300);
    });

    // Smooth Scrolling for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animate sections on scroll
    const sections = document.querySelectorAll('.section');
    const animateOnScroll = function() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight - 100) {
                section.classList.add('show');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load

    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.skill-progress');
    const animateSkillBars = function() {
        skillBars.forEach(bar => {
            const barPosition = bar.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (barPosition < windowHeight - 100) {
                bar.classList.add('animate');
            }
        });
    };

    window.addEventListener('scroll', animateSkillBars);
    animateSkillBars(); // Run once on load

    // Current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Initialize 3D animation in hero section
    init3DAnimation();
    startShapeChanging(2000); // Start shape changing every 2 seconds
});

// 3D Animation with Three.js
let mesh, scene, renderer; // Make these variables global

function init3DAnimation() {
    const container = document.getElementById('canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    // Scene setup
    scene = new THREE.Scene();
    updateSceneBackground(); // Set initial background based on current mode

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    // Create initial geometry
    createNewGeometry();

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);
        
        if (mesh) {
            mesh.rotation.x += 0.005;
            mesh.rotation.y += 0.01;
        }
        
        renderer.render(scene, camera);
    };

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });

    animate();
}

function updateSceneBackground() {
    if (!scene) return;
    scene.background = new THREE.Color(
        document.body.classList.contains('dark-mode') ? 0x2d2d2d : 0xf8f9fa
    );
}

// Shape-changing logic
let geometryChangeInterval;
const geometries = [
    () => new THREE.IcosahedronGeometry(1, 0),
    () => new THREE.OctahedronGeometry(1, 0),
    () => new THREE.TetrahedronGeometry(1, 0),
    () => new THREE.SphereGeometry(1, 32, 32),
    () => new THREE.TorusGeometry(0.8, 0.2, 16, 32),
    () => new THREE.BoxGeometry(1.5, 1.5, 1.5),
    () => new THREE.CylinderGeometry(0.5, 0.5, 2, 32),
    () => new THREE.DodecahedronGeometry(1, 0),
    () => new THREE.ConeGeometry(1, 2, 32)

];

function createNewGeometry() {
    if (mesh) scene.remove(mesh);
    
    const randomIndex = Math.floor(Math.random() * geometries.length);
    const geometry = geometries[randomIndex]();
    const material = new THREE.MeshPhongMaterial({
        color: document.body.classList.contains('dark-mode') ? 0x6c63ff : 0x4d44db,
        shininess: 100,
        flatShading: true
    });
    
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}

function startShapeChanging(interval = 3000) {
    clearInterval(geometryChangeInterval);
    geometryChangeInterval = setInterval(createNewGeometry, interval);
}

function stopShapeChanging() {
    clearInterval(geometryChangeInterval);
}

// Dark Mode Toggle
const themeToggle = document.querySelector('.theme-toggle');
// Update your existing dark mode toggle in main.js
themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
    
    // Update Three.js scene
    updateSceneBackground();
    if (mesh) {
        mesh.material.color.setHex(
            document.body.classList.contains('dark-mode') ? 0x6c63ff : 0x4d44db
        );
    }
});