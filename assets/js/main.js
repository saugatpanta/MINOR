document.addEventListener('DOMContentLoaded', function() {
    initPageLoader();
    initTheme();
    initMobileMenu();
    initCart();
    initPasswordToggle();
    initUserDropdown();
    initSidebarToggle();
    
    if (document.getElementById('contactForm')) {
        initContactForm();
    }
    
    if (document.getElementById('registerForm')) {
        initRegistrationForm();
    }
    
    if (document.querySelector('.chart-container')) {
        initCharts();
    }
    
    if (document.querySelector('.calendar-container')) {
        initCalendar();
    }
    
    if (document.getElementById('heroCanvas')) {
        initThreeJS();
    }
    
    initAnimations();
    
    if (document.getElementById('productsContainer')) {
        loadProducts();
    }
    if (document.getElementById('projectsContainer')) {
        loadProjects();
    }
    if (document.getElementById('testimonialsContainer')) {
        loadTestimonials();
    }
    if (document.getElementById('cartItems')) {
        loadCartItems();
    }
});

function initPageLoader() {
    const pageLoader = document.querySelector('.page-loader');
    if (pageLoader) {
        window.addEventListener('load', function() {
        setTimeout(() => {
            pageLoader.classList.add('fade-out');
            setTimeout(() => {
            pageLoader.style.display = 'none';
            }, 500);
        }, 300);
        });
    }
}

function initAnimations() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
        duration: 800,
        easing: 'ease-out-quad',
        once: true,
        offset: 100,
        startEvent: 'DOMContentLoaded'
        });
    }
    
    if (typeof gsap !== 'undefined') {
        gsap.utils.toArray('.gsap-fade-in').forEach(el => {
        gsap.from(el, {
        opacity: 0,
        duration: 1,
        delay: el.dataset.delay || 0,
            ease: 'power2.out'
        });
        });
        
        gsap.utils.toArray('.gsap-slide-up').forEach(el => {
        gsap.from(el, {
            y: 50,
            opacity: 0,
            duration: 1,
            delay: el.dataset.delay || 0,
            ease: 'power2.out'
        });
        });
        
        gsap.utils.toArray('.gsap-slide-down').forEach(el => {
        gsap.from(el, {
            y: -50,
            opacity: 0,
            duration: 1,
            delay: el.dataset.delay || 0,
            ease: 'power2.out'
        });
        });
        
        gsap.utils.toArray('.gsap-slide-left').forEach(el => {
        gsap.from(el, {
            x: 50,
            opacity: 0,
            duration: 1,
            delay: el.dataset.delay || 0,
            ease: 'power2.out'
        });
        });
        
        gsap.utils.toArray('.gsap-slide-right').forEach(el => {
        gsap.from(el, {
            x: -50,
            opacity: 0,
            duration: 1,
            delay: el.dataset.delay || 0,
            ease: 'power2.out'
        });
        });
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        document.documentElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
    }
    
    if (!document.querySelector('.theme-toggle')) {
        const themeToggle = document.createElement('div');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = `
        <button class="btn btn-outline">
            <i class="fas fa-moon"></i>
            <i class="fas fa-sun"></i>
        </button>
        `;
        document.querySelector('header').appendChild(themeToggle);
        
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        updateThemeToggle();
        }
    });
    
    updateThemeToggle();
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggle();
}

function updateThemeToggle() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const toggle = document.querySelector('.theme-toggle');
    
    if (toggle) {
        if (currentTheme === 'dark') {
        toggle.querySelector('.fa-moon').style.display = 'none';
        toggle.querySelector('.fa-sun').style.display = 'inline-block';
        } else {
        toggle.querySelector('.fa-moon').style.display = 'inline-block';
        toggle.querySelector('.fa-sun').style.display = 'none';
        }
    }
}

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('.main-nav');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');
        });
    }
}

function initCart() {
    updateCartCount();
    
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart')) {
        const button = e.target.closest('.add-to-cart');
        const productId = button.getAttribute('data-id');
        addToCart(productId);
        }
    });
}

function addToCart(productId) {
    fetch('data/products.json')
        .then(response => response.json())
        .then(data => {
        const products = data.products;
        const product = products.find(p => p.id == productId);
        
        if (!product) return;
        
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id == productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.classList.add('update');
            setTimeout(() => {
            cartCount.classList.remove('update');
            }, 300);
        }
        
        if (document.getElementById('cartItems')) {
            loadCartItems();
        }
        })
        .catch(error => {
        console.error('Error adding to cart:', error);
        });
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = totalItems;
    });
}

function initPasswordToggle() {
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
        const input = this.parentElement.querySelector('input');
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
        });
    });
}

function initUserDropdown() {
    const userDropdowns = document.querySelectorAll('.user-dropdown');
    
    userDropdowns.forEach(dropdown => {
    const avatar = dropdown.querySelector('.user-avatar');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    avatar.addEventListener('click', function(e) {
        e.stopPropagation();
        menu.classList.toggle('active');
        });
    });
    
    document.addEventListener('click', function() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('active');
        });
    });
}

function initSidebarToggle() {
    const sidebarToggles = document.querySelectorAll('.sidebar-toggle');
    
    sidebarToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
        document.querySelector('.dashboard-sidebar').classList.toggle('active');
        document.querySelector('.dashboard-main').classList.toggle('active');
        });
    });
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: this.name.value,
            email: this.email.value,
            phone: this.phone.value,
            subject: this.subject.value,
            message: this.message.value
        };
        
        console.log('Form submitted:', formData);
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
        });
    }
}

function initRegistrationForm() {
    const registerForm = document.getElementById('registerForm');
  
    if (registerForm) {
    const passwordInput = registerForm.querySelector('#registerPassword');
    const strengthBars = registerForm.querySelectorAll('.strength-bar');
    const strengthText = registerForm.querySelector('.strength-text');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        
        if (password.length >= 8) strength++;
    
        if (password.match(/[a-z]/)) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;
        strengthBars.forEach((bar, index) => {
            bar.style.backgroundColor = index < strength ? '#4CAF50' : '#ddd';
        });
            
            const strengthMessages = ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'];
            strengthText.textContent = strengthMessages[strength - 1] || 'Password strength';
        });
        }
        
        registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = this.registerPassword.value;
        const confirmPassword = this.confirmPassword.value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        const formData = {
            firstName: this.firstName.value,
            lastName: this.lastName.value,
            email: this.email.value,
            password: password,
            phone: this.phone.value
        };
        
        console.log('Registration submitted:', formData);
        alert('Registration successful! Welcome to Pashupati Aluminium.');
        window.location.href = 'index.html';
        });
    }
}

function loadProducts() {
    fetch('data/products.json')
    .then(response => response.json())
    .then(data => {
        displayProducts(data.products);
        initProductFilters();
    })
    .catch(error => {
        console.error('Error loading products:', error);
    });
}

function displayProducts(products) {
    const productsContainer = document.getElementById('productsContainer');
    if (!productsContainer) return;
    
    let html = '';
    
    products.forEach(product => {
        html += `
        <div class="product-card" data-category="${product.category.toLowerCase()}" data-price="${product.price}">
            <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-overlay">
                <button class="btn btn-outline add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
            </div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">₹${product.price.toLocaleString()}</div>
        </div>
        `;
    });
    
    productsContainer.innerHTML = html;
}

function initProductFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    if (sortBy) {
        sortBy.addEventListener('change', sortProducts);
    }
}

function filterProducts() {
    const category = this.value;
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
        card.style.display = 'block';
        } else {
        card.style.display = 'none';
        }
    });
}

function sortProducts() {
    const sortBy = this.value;
    const productsContainer = document.getElementById('productsContainer');
    const productCards = Array.from(document.querySelectorAll('.product-card'));
    
    productCards.sort((a, b) => {
    const aPrice = parseFloat(a.getAttribute('data-price'));
    const bPrice = parseFloat(b.getAttribute('data-price'));
    const aName = a.querySelector('h3').textContent;
    const bName = b.querySelector('h3').textContent;
    
    switch (sortBy) {
        case 'price-low': return aPrice - bPrice;
        case 'price-high': return bPrice - aPrice;
        case 'name-asc': return aName.localeCompare(bName);
        case 'name-desc': return bName.localeCompare(aName);
        default: return 0;
        }
    });
    
    productCards.forEach(card => {
        productsContainer.appendChild(card);
    });
}

function loadProjects() {
    fetch('data/projects.json')
        .then(response => response.json())
        .then(data => {
        displayProjects(data.projects);
        initProjectFilters();
        })
        .catch(error => {
        console.error('Error loading projects:', error);
        });
}

function displayProjects(projects) {
    const projectsContainer = document.getElementById('projectsContainer');
    if (!projectsContainer) return;
    
    let html = '';
    
    projects.forEach(project => {
        const type = project.scope.includes('Residential') ? 'residential' : 
                    project.scope.includes('Commercial') ? 'commercial' : 
                    project.scope.includes('Hotel') ? 'hospitality' : 'institutional';
        
        html += `
        <div class="project-card" data-type="${type}" data-location="${project.location.toLowerCase().split(',')[0]}">
            <div class="project-image">
            <img src="${project.images[0]}" alt="${project.title}">
            <div class="project-overlay">
                <h3>${project.title}</h3>
                <a href="projects.html#${project.id}" class="btn btn-outline">View Project</a>
            </div>
            </div>
        </div>
        `;
    });
    
    projectsContainer.innerHTML = html;
}

function initProjectFilters() {
    const projectType = document.getElementById('project-type');
    const projectLocation = document.getElementById('project-location');
    
    if (projectType) {
        projectType.addEventListener('change', filterProjects);
    }
    
    if (projectLocation) {
        projectLocation.addEventListener('change', filterProjects);
    }
}

function filterProjects() {
    const type = document.getElementById('project-type').value;
    const location = document.getElementById('project-location').value;
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const cardType = card.getAttribute('data-type');
        const cardLocation = card.getAttribute('data-location');
        
        const typeMatch = type === 'all' || cardType === type;
        const locationMatch = location === 'all' || cardLocation === location;
        
        if (typeMatch && locationMatch) {
        card.style.display = 'block';
        } else {
        card.style.display = 'none';
        }
    });
}

function loadTestimonials() {
    fetch('data/testimonials.json')
        .then(response => response.json())
        .then(data => {
        displayTestimonials(data.testimonials);
        })
        .catch(error => {
        console.error('Error loading testimonials:', error);
        });
}

function displayTestimonials(testimonials) {
    const testimonialsContainer = document.getElementById('testimonialsContainer');
    if (!testimonialsContainer) return;
    
    let html = '';
    
    testimonials.forEach(testimonial => {
        html += `
        <div class="testimonial-card">
            <div class="testimonial-content">
            <p>"${testimonial.content}"</p>
            <div class="testimonial-rating">
                ${'<i class="fas fa-star"></i>'.repeat(testimonial.rating)}
                ${'<i class="far fa-star"></i>'.repeat(5 - testimonial.rating)}
            </div>
            </div>
            <div class="testimonial-author">
            <img src="${testimonial.avatar}" alt="${testimonial.name}">
            <div>
                <h4>${testimonial.name}</h4>
                <p>${testimonial.position}, ${testimonial.company}</p>
            </div>
            </div>
        </div>
        `;
    });
    
    testimonialsContainer.innerHTML = html;
}

function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (checkoutBtn) checkoutBtn.disabled = false;
    
    let html = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        html += `
        <div class="cart-item">
            <div class="item-image">
            <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
            <h3>${item.name}</h3>
            <p>₹${item.price.toLocaleString()}</p>
            </div>
            <div class="item-quantity">
            <button class="quantity-btn minus" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn plus" data-id="${item.id}">+</button>
            </div>
            <div class="item-total">
            <p>₹${itemTotal.toLocaleString()}</p>
            </div>
            <div class="item-remove">
            <button class="btn btn-outline remove-btn" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
            </div>
        </div>
        `;
    });
    
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = html;
    }
    
    initCartFunctionality();
    updateCartSummary(subtotal);
}

function initCartFunctionality() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.quantity-btn')) {
        const button = e.target.closest('.quantity-btn');
        const productId = button.getAttribute('data-id');
        const isPlus = button.classList.contains('plus');
        updateCartItemQuantity(productId, isPlus);
        }
        
        if (e.target.closest('.remove-btn')) {
        const button = e.target.closest('.remove-btn');
        const productId = button.getAttribute('data-id');
        removeCartItem(productId);
        }
        
        if (e.target.closest('#checkoutBtn')) {
        e.preventDefault();
        alert('Proceeding to checkout. In a real app, this would redirect to the checkout page.');
        }
    });
}

function updateCartItemQuantity(productId, isPlus) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id == productId);
    
    if (itemIndex !== -1) {
        if (isPlus) {
        cart[itemIndex].quantity += 1;
        } else {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
        }
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
        updateCartCount();
    }
}

function removeCartItem(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id != productId);
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
    updateCartCount();
}

function updateCartSummary(subtotal) {
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) {
        subtotalElement.textContent = `₹${subtotal.toLocaleString()}`;
    }
    
    if (totalElement) {
        totalElement.textContent = `₹${subtotal.toLocaleString()}`;
    }
}

function initCharts() {
    if (typeof Chart === 'undefined') return;
    
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
            label: 'Revenue',
            data: [5000, 7000, 4500, 8000, 6000, 9000, 7500, 8500, 9500, 11000, 10500, 12000],
            borderColor: 'var(--primary)',
            backgroundColor: 'rgba(108, 92, 231, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'var(--text-dark-secondary)' },
                ticks: { callback: value => '₹' + value.toLocaleString() }
            },
            x: { grid: { color: 'var(--text-dark-secondary)' } }
            }
        }
        });
    }
    
    const orderCtx = document.getElementById('orderChart');
    if (orderCtx) {
        new Chart(orderCtx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Processing', 'Pending', 'Shipped'],
            datasets: [{
            data: [45, 25, 15, 15],
            backgroundColor: ['var(--success)', 'var(--warning)', 'var(--error)', 'var(--accent)'],
            borderColor: ['var(--success)', 'var(--warning)', 'var(--error)', 'var(--accent)'],
            borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'right' } },
            cutout: '70%'
        }
        });
    }
    
    const projectStatusCtx = document.getElementById('projectStatusChart');
    if (projectStatusCtx) {
        new Chart(projectStatusCtx, {
        type: 'bar',
        data: {
            labels: ['Planning', 'Design', 'Development', 'Testing', 'Deployment'],
            datasets: [{
            label: 'Progress',
            data: [100, 80, 65, 40, 20],
            backgroundColor: 'var(--primary)',
            borderColor: 'var(--primary-dark)',
            borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: { color: 'var(--text-dark-secondary)' },
                ticks: { callback: value => value + '%' }
            },
            x: { grid: { color: 'var(--text-dark-secondary)' } }
            }
        }
        });
    }
}

function initCalendar() {
    const calendarBody = document.querySelector('.calendar-body');
    if (!calendarBody) return;
    
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    
    let days = '';
    
    for (let i = firstDay - 1; i >= 0; i--) {
        days += `<div class="calendar-day empty"></div>`;
    }
    
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        days += `<div class="calendar-day ${isToday ? 'today' : ''}">
        <div class="calendar-day-number">${i}</div>
        ${i % 5 === 0 ? '<div class="calendar-event">Meeting</div>' : ''}
        ${i % 7 === 0 ? '<div class="calendar-event">Deadline</div>' : ''}
        </div>`;
    }
    
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const nextMonthDays = totalCells - (firstDay + daysInMonth);
    
    for (let i = 1; i <= nextMonthDays; i++) {
        days += `<div class="calendar-day empty"></div>`;
    }
    
    calendarBody.innerHTML = days;
}

function initThreeJS() {
    if (typeof THREE === 'undefined') return;
    
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    const geometry = new THREE.IcosahedronGeometry(2, 0);
    const material = new THREE.MeshPhongMaterial({
        color: 0x6c5ce7,
        emissive: 0x000000,
        specular: 0xffffff,
        shininess: 30,
        transparent: true,
        opacity: 0.8,
        wireframe: false
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    camera.position.z = 5;
    
    function animate() {
        requestAnimationFrame(animate);
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    
    animate();
    
    window.addEventListener('resize', function() {
        camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    });
}