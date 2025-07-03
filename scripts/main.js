 HEAD
/**
 * Pashupati Aluminium & Glass Center - Main JavaScript File
 * 
 * This file contains all the interactive functionality for the website including:
 * - Authentication system (login/signup)
 * - Product loading from JSON
 * - Interactive maps
 * - MongoDB connectivity
 * - Animations and UI enhancements
 */

// Initialize MongoDB Stitch (Atlas) connection
const initMongoDB = () => {
    // MongoDB Stitch App ID (replace with your actual App ID)
    const APP_ID = 'pashupati-aluminium-abcde';
    
    // Initialize the MongoDB Stitch client
    const client = stitch.Stitch.initializeDefaultAppClient(APP_ID);
    
    // Get a MongoDB service client
    const mongodb = client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas');
    
    // Get database and collections
    const db = mongodb.db('pashupati');
    const usersCollection = db.collection('users');
    const productsCollection = db.collection('products');
    const inquiriesCollection = db.collection('inquiries');
    
    return {
        client,
        db,
        usersCollection,
        productsCollection,
        inquiriesCollection
    };
};

// MongoDB Connection Object
const mongoDB = initMongoDB();

// DOM Elements
const userAuthSection = document.getElementById('userAuthSection');
const adminAuthSection = document.getElementById('adminAuthSection');
const loginBtn = document.querySelector('.login-btn');
const adminBtn = document.querySelector('.admin-btn');
const closeBtns = document.querySelectorAll('.close-btn');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');
const authSwitchLinks = document.querySelectorAll('.auth-switch a');
const statusMessage = document.getElementById('statusMessage');
const signupRole = document.getElementById('signupRole');
const employeeCodeContainer = document.getElementById('employeeCodeContainer');
const userLoginForm = document.getElementById('userLoginForm');
const userSignupForm = document.getElementById('userSignupForm');
const adminLoginForm = document.getElementById('adminLoginForm');
const themeToggle = document.getElementById('themeToggle');
const hamburger = document.querySelector('.hamburger');
const navbar = document.querySelector('.navbar');
const backToTopBtn = document.getElementById('backToTopBtn');
const resetForm = document.getElementById('resetForm');
const showResetForm = document.getElementById('showResetForm');
const passwordResetForm = document.getElementById('passwordResetForm');
const cancelReset = document.getElementById('cancelReset');
const adminResetForm = document.getElementById('adminResetForm');
const showAdminResetForm = document.getElementById('showAdminResetForm');
const adminPasswordResetForm = document.getElementById('adminPasswordResetForm');
const cancelAdminReset = document.getElementById('cancelAdminReset');
const resetCodeField = document.getElementById('resetCodeField');
const passwordToggles = document.querySelectorAll('.password-toggle');
const loginRole = document.getElementById('loginRole');
const productContainer = document.getElementById('productContainer');
const categoryButtons = document.querySelectorAll('.category-btn');
const loadMoreBtn = document.getElementById('loadMoreProducts');
const inquiryForm = document.getElementById('inquiryForm');
const newsletterForm = document.getElementById('newsletterForm');
const quickContactBtn = document.querySelector('.quick-contact-btn');
const quickContact = document.querySelector('.quick-contact');

// Global Variables
let currentUser = null;
let isAdmin = false;
let products = [];
let displayedProducts = 0;
const productsPerLoad = 6;

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function () {
    // Check authentication status
    checkAuthStatus();
    
    // Initialize animations
    initAnimations();
    
    // Initialize event listeners
    initEventListeners();
    
    // Load products from MongoDB
    loadProducts();
    
    // Initialize map
    initMap();
    
    // Initialize counter animations
    initCounters();
});

/**
 * Check user authentication status
 */
const checkAuthStatus = () => {
    // Check if user is logged in (from sessionStorage)
    const userData = sessionStorage.getItem('currentUser');
    const adminStatus = sessionStorage.getItem('isAdmin');
    
    if (userData) {
        currentUser = JSON.parse(userData);
        updateAuthUI();
    }
    
    if (adminStatus === 'true') {
        isAdmin = true;
        updateAuthUI();
    }
};

/**
 * Initialize all animations
 */
const initAnimations = () => {
    // Animate elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('[data-aos]');
        
        elements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                el.classList.add('aos-animate');
            }
        });
    };
    
    // Run on load and scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
};

/**
 * Initialize all event listeners
 */
const initEventListeners = () => {
    // Mobile menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking a link
    navbar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toggleMobileMenu();
            }
        });
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleDarkMode);
    
    // Back to top button
    backToTopBtn.addEventListener('click', scrollToTop);
    window.addEventListener('scroll', toggleBackToTop);
    
    // Login/Signup buttons
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleAuthModal('user');
    });
    
    adminBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleAuthModal('admin');
    });
    
    // Close auth modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeAuthModals);
    });
    
    // Auth modal background click
    userAuthSection.addEventListener('click', (e) => {
        if (e.target === userAuthSection) closeAuthModals();
    });
    
    adminAuthSection.addEventListener('click', (e) => {
        if (e.target === adminAuthSection) closeAuthModals();
    });
    
    // Auth tab switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            switchTab(this.getAttribute('data-tab'));
        });
    });
    
    // Auth switch links
    authSwitchLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            switchTab(this.getAttribute('data-tab'));
        });
    });
    
    // Show/hide employee code input
    signupRole.addEventListener('change', function () {
        const isEmployee = this.value === 'employee';
        employeeCodeContainer.style.display = isEmployee ? 'block' : 'none';
        document.getElementById('employeeCode').required = isEmployee;
    });
    
    // Password toggles
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            togglePasswordVisibility(input, this);
        });
    });
    
    // Reset password forms
    showResetForm.addEventListener('click', function(e) {
        e.preventDefault();
        resetForm.classList.add('active');
        userLoginForm.style.display = 'none';
    });
    
    cancelReset.addEventListener('click', function() {
        resetForm.classList.remove('active');
        userLoginForm.style.display = 'block';
    });
    
    showAdminResetForm.addEventListener('click', function(e) {
        e.preventDefault();
        adminLoginForm.style.display = 'none';
        adminResetForm.classList.add('active');
    });
    
    cancelAdminReset.addEventListener('click', function() {
        adminResetForm.classList.remove('active');
        adminLoginForm.style.display = 'block';
    });
    
    // Product category filtering
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterProducts(this.getAttribute('data-category'));
        });
    });
    
    // Load more products
    loadMoreBtn.addEventListener('click', loadMoreProducts);
    
    // Form submissions
    if (userLoginForm) {
        userLoginForm.addEventListener('submit', handleUserLogin);
    }
    
    if (userSignupForm) {
        userSignupForm.addEventListener('submit', handleUserSignup);
    }
    
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
    
    if (passwordResetForm) {
        passwordResetForm.addEventListener('submit', handlePasswordReset);
    }
    
    if (adminPasswordResetForm) {
        adminPasswordResetForm.addEventListener('submit', handleAdminPasswordReset);
    }
    
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', handleInquirySubmit);
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    // Quick contact button
    if (quickContactBtn) {
        quickContactBtn.addEventListener('click', toggleQuickContact);
    }
};

/**
 * Toggle mobile menu
 */
const toggleMobileMenu = () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true' || false;
    hamburger.classList.toggle('active');
    navbar.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', !isExpanded);
    document.body.style.overflow = isExpanded ? '' : 'hidden';
};

/**
 * Toggle dark mode
 */
const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
};

/**
 * Check and apply dark mode preference from localStorage
 */
const applyDarkModePreference = () => {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }
};

/**
 * Scroll to top of page
 */
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

/**
 * Show/hide back to top button based on scroll position
 */
const toggleBackToTop = () => {
    if (window.scrollY > 300) {
        backToTopBtn.style.display = 'flex';
    } else {
        backToTopBtn.style.display = 'none';
    }
    
    // Header shadow on scroll
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
};

/**
 * Toggle authentication modals
 * @param {string} type - 'user' or 'admin'
 */
const toggleAuthModal = (type) => {
    if (type === 'user') {
        userAuthSection.classList.add('show');
    } else if (type === 'admin') {
        adminAuthSection.classList.add('show');
    }
    document.body.style.overflow = 'hidden';
};

/**
 * Close all auth modals
 */
const closeAuthModals = () => {
    userAuthSection.classList.remove('show');
    adminAuthSection.classList.remove('show');
    document.body.style.overflow = '';
};

/**
 * Switch between auth tabs
 * @param {string} tabName - 'login' or 'signup'
 */
const switchTab = (tabName) => {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.auth-tab[data-tab="${tabName}"]`).classList.add('active');
    
    document.querySelectorAll('.auth-form').forEach(f => {
        f.classList.remove('active');
        if (f.id === `${tabName}Form`) f.classList.add('active');
    });
};

/**
 * Toggle password visibility
 * @param {HTMLElement} input - Password input element
 * @param {HTMLElement} toggle - Toggle button element
 */
const togglePasswordVisibility = (input, toggle) => {
    if (input.type === 'password') {
        input.type = 'text';
        toggle.innerHTML = '<i class="far fa-eye-slash"></i>';
    } else {
        input.type = 'password';
        toggle.innerHTML = '<i class="far fa-eye"></i>';
    }
};

/**
 * Update authentication UI based on login state
 */
const updateAuthUI = () => {
    if (currentUser) {
        loginBtn.textContent = `Hi, ${currentUser.name.split(' ')[0]}`;
        loginBtn.classList.add('logged-in');
        loginBtn.onclick = function () {
            sessionStorage.removeItem('currentUser');
            currentUser = null;
            loginBtn.textContent = 'Login';
            loginBtn.classList.remove('logged-in');
            showStatusMessage('Logged out successfully', 'success');
        };
    } else {
        loginBtn.textContent = 'Login';
        loginBtn.classList.remove('logged-in');
        loginBtn.onclick = (e) => {
            e.preventDefault();
            toggleAuthModal('user');
        };
    }
    
    if (isAdmin) {
        adminBtn.textContent = 'Admin Dashboard';
        adminBtn.classList.add('logged-in');
        adminBtn.onclick = () => {
            sessionStorage.removeItem('isAdmin');
            isAdmin = false;
            adminBtn.textContent = 'Admin';
            adminBtn.classList.remove('logged-in');
            showStatusMessage('Admin logged out', 'success');
        };
    } else {
        adminBtn.textContent = 'Admin';
        adminBtn.classList.remove('logged-in');
        adminBtn.onclick = (e) => {
            e.preventDefault();
            toggleAuthModal('admin');
        };
    }
};

/**
 * Show status message
 * @param {string} message - Message to display
 * @param {string} type - 'success' or 'error'
 */
const showStatusMessage = (message, type = 'success') => {
    statusMessage.textContent = message;
    statusMessage.className = `status-message show ${type === 'error' ? 'error' : 'success'}`;
    
    if (type === 'success') {
        statusMessage.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    } else {
        statusMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    }
    
    setTimeout(() => statusMessage.classList.remove('show'), 3000);
};

/**
 * Load products from MongoDB
 */
const loadProducts = async () => {
    try {
        // Show loading state
        productContainer.innerHTML = '<div class="loading-spinner"><div></div><div></div><div></div><div></div></div>';
        
        // Fetch products from MongoDB
        const products = await mongoDB.productsCollection.find({}).toArray();
        
        // Store products globally
        window.products = products;
        
        // Display initial products
        displayProducts(products.slice(0, productsPerLoad));
        displayedProducts = productsPerLoad;
        
        // Show/hide load more button
        if (products.length <= productsPerLoad) {
            loadMoreBtn.style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showStatusMessage('Failed to load products. Please try again.', 'error');
        
        // Fallback to local JSON if MongoDB fails
        fetchProductsFromJSON();
    }
};

/**
 * Fallback to load products from local JSON file
 */
const fetchProductsFromJSON = async () => {
    try {
        const response = await fetch('data/products.json');
        const products = await response.json();
        
        // Store products globally
        window.products = products;
        
        // Display initial products
        displayProducts(products.slice(0, productsPerLoad));
        displayedProducts = productsPerLoad;
        
        // Show/hide load more button
        if (products.length <= productsPerLoad) {
            loadMoreBtn.style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading products from JSON:', error);
        productContainer.innerHTML = '<p class="error-message">Failed to load products. Please refresh the page or try again later.</p>';
    }
};

/**
 * Display products in the product grid
 * @param {Array} products - Array of product objects
 */
const displayProducts = (products) => {
    if (products.length === 0) {
        productContainer.innerHTML = '<p class="no-products">No products found in this category.</p>';
        return;
    }
    
    let html = '';
    
    products.forEach(product => {
        html += `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy" />
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                </div>
                <div class="product-content">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    
                    <div class="product-specs">
                        ${product.specs.map(spec => `<span class="product-spec">${spec}</span>`).join('')}
                    </div>
                    
                    <div class="product-footer">
                        <span class="product-price">${product.price}</span>
                        <a href="product-details.html?id=${product.id}" class="btn-outline">Details</a>
                    </div>
                </div>
            </div>
        `;
    });
    
    productContainer.innerHTML = html;
};

/**
 * Load more products when "View More" button is clicked
 */
const loadMoreProducts = () => {
    const remainingProducts = window.products.length - displayedProducts;
    const nextProducts = window.products.slice(displayedProducts, displayedProducts + Math.min(productsPerLoad, remainingProducts));
    
    displayProducts([...document.querySelectorAll('.product-card'), ...nextProducts]);
    displayedProducts += nextProducts.length;
    
    if (displayedProducts >= window.products.length) {
        loadMoreBtn.style.display = 'none';
    }
};

/**
 * Filter products by category
 * @param {string} category - Category to filter by
 */
const filterProducts = (category) => {
    // Update active category button
    categoryButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-category') === category);
    });
    
    // Filter products
    let filteredProducts = window.products;
    if (category !== 'all') {
        filteredProducts = window.products.filter(product => product.category === category);
    }
    
    // Reset displayed products
    displayedProducts = Math.min(productsPerLoad, filteredProducts.length);
    
    // Display filtered products
    displayProducts(filteredProducts.slice(0, displayedProducts));
    
    // Show/hide load more button
    if (filteredProducts.length <= displayedProducts) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
};

/**
 * Initialize Leaflet map
 */
const initMap = () => {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    // Coordinates for Pashupati Aluminium (example coordinates)
    const pashupatiCoords = [27.7172, 85.3240];
    
    // Create map
    const map = L.map('map').setView(pashupatiCoords, 15);
    
    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add marker
    L.marker(pashupatiCoords).addTo(map)
        .bindPopup('<b>Pashupati Aluminium</b><br>Head Office Location')
        .openPopup();
};

/**
 * Initialize counter animations
 */
const initCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(initCounters, 1);
        } else {
            counter.innerText = target + '+';
        }
    });
};

/**
 * Handle user login form submission
 * @param {Event} e - Form submission event
 */
const handleUserLogin = async (e) => {
    e.preventDefault();
    
    const role = document.getElementById('loginRole').value;
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    
    if (!role) {
        showStatusMessage('Please select a role', 'error');
        return;
    }
    
    try {
        // Authenticate with MongoDB Stitch
        await mongoDB.client.auth.loginWithCredential(
            new stitch.UserPasswordCredential(email, password)
        );
        
        // Get user data
        const user = await mongoDB.usersCollection.findOne({ email, role });
        
        if (user) {
            showStatusMessage('Login successful!', 'success');
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            setTimeout(() => {
                window.location.href = `${role}-dashboard.html`;
            }, 1500);
        } else {
            showStatusMessage('Invalid credentials or role!', 'error');
            await mongoDB.client.auth.logout();
        }
    } catch (error) {
        console.error('Login error:', error);
        showStatusMessage('Invalid credentials or role!', 'error');
    }
};

/**
 * Handle user signup form submission
 * @param {Event} e - Form submission event
 */
const handleUserSignup = async (e) => {
    e.preventDefault();
    
    const role = signupRole.value;
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const phone = document.getElementById('signupPhone').value;
    const address = document.getElementById('signupAddress').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const employeeCode = document.getElementById('employeeCode')?.value;
    
    if (!role) {
        showStatusMessage('Please select a role', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showStatusMessage('Passwords do not match!', 'error');
        return;
    }
    
    if (role === 'employee' && employeeCode !== 'PASHUPATI123') {
        showStatusMessage('Invalid employee code!', 'error');
        return;
    }
    
    try {
        // Check if user already exists
        const existingUser = await mongoDB.usersCollection.findOne({ email });
        
        if (existingUser) {
            showStatusMessage('Email already registered!', 'error');
            return;
        }
        
        // Register new user
        await mongoDB.client.auth.registerWithEmail(email, password);
        
        // Create user document
        const newUser = { 
            role, 
            name, 
            email, 
            phone, 
            address, 
            password, // Note: In production, hash the password before storing
            createdAt: new Date().toISOString() 
        };
        
        await mongoDB.usersCollection.insertOne(newUser);
        
        showStatusMessage('Registration successful! Please login.', 'success');
        switchTab('login');
        userSignupForm.reset();
        employeeCodeContainer.style.display = 'none';
    } catch (error) {
        console.error('Signup error:', error);
        showStatusMessage('Registration failed. Please try again.', 'error');
    }
};

/**
 * Handle admin login form submission
 * @param {Event} e - Form submission event
 */
const handleAdminLogin = async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value.trim().toLowerCase();
    const password = document.getElementById('adminPassword').value;
    
    try {
        // Authenticate with MongoDB Stitch
        await mongoDB.client.auth.loginWithCredential(
            new stitch.UserPasswordCredential(email, password)
        );
        
        // Check if user is admin
        const adminUser = await mongoDB.usersCollection.findOne({ 
            email, 
            role: 'admin' 
        });
        
        if (adminUser) {
            showStatusMessage('Admin login successful!', 'success');
            sessionStorage.setItem('isAdmin', 'true');
            sessionStorage.setItem('adminEmail', email);
            adminLoginForm.reset();
            
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 1500);
        } else {
            showStatusMessage('Invalid admin credentials', 'error');
            await mongoDB.client.auth.logout();
        }
    } catch (error) {
        console.error('Admin login error:', error);
        showStatusMessage('Invalid admin credentials', 'error');
    }
};

/**
 * Handle password reset form submission
 * @param {Event} e - Form submission event
 */
const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('resetEmail').value.trim().toLowerCase();
    const code = document.getElementById('resetCode').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    
    if (newPassword !== confirmPassword) {
        showStatusMessage('Passwords do not match!', 'error');
        return;
    }
    
    try {
        // Check if user exists
        const user = await mongoDB.usersCollection.findOne({ email });
        
        if (user) {
            if (user.role === 'admin' || user.role === 'employee') {
                if (code !== 'PASHUPATI123') {
                    showStatusMessage('Invalid reset code!', 'error');
                    return;
                }
            }
            
            // Update password in MongoDB (in production, use proper password hashing)
            await mongoDB.usersCollection.updateOne(
                { email },
                { $set: { password: newPassword } }
            );
            
            showStatusMessage('Password reset successfully!', 'success');
            
            // Reset form and show login
            resetForm.classList.remove('active');
            userLoginForm.style.display = 'block';
            passwordResetForm.reset();
        } else {
            showStatusMessage('Email not found!', 'error');
        }
    } catch (error) {
        console.error('Password reset error:', error);
        showStatusMessage('Failed to reset password. Please try again.', 'error');
    }
};

/**
 * Handle admin password reset form submission
 * @param {Event} e - Form submission event
 */
const handleAdminPasswordReset = async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('adminResetEmail').value.trim().toLowerCase();
    const code = document.getElementById('adminResetCode').value;
    const newPassword = document.getElementById('adminNewPassword').value;
    const confirmPassword = document.getElementById('adminConfirmNewPassword').value;
    
    if (newPassword !== confirmPassword) {
        showStatusMessage('Passwords do not match!', 'error');
        return;
    }
    
    if (code !== 'ADMIN123') {
        showStatusMessage('Invalid security code!', 'error');
        return;
    }
    
    try {
        // Check if admin exists
        const admin = await mongoDB.usersCollection.findOne({ 
            email, 
            role: 'admin' 
        });
        
        if (admin) {
            // Update admin password in MongoDB (in production, use proper password hashing)
            await mongoDB.usersCollection.updateOne(
                { email, role: 'admin' },
                { $set: { password: newPassword } }
            );
            
            showStatusMessage('Admin password reset successfully!', 'success');
            
            // Reset form and show login
            adminResetForm.classList.remove('active');
            adminLoginForm.style.display = 'block';
            adminPasswordResetForm.reset();
        } else {
            showStatusMessage('Admin email not found!', 'error');
        }
    } catch (error) {
        console.error('Admin password reset error:', error);
        showStatusMessage('Failed to reset admin password. Please try again.', 'error');
    }
};

/**
 * Handle contact inquiry form submission
 * @param {Event} e - Form submission event
 */
const handleInquirySubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(inquiryForm);
    const data = Object.fromEntries(formData.entries());
    
    try {
        // Save inquiry to MongoDB
        await mongoDB.inquiriesCollection.insertOne({
            ...data,
            createdAt: new Date().toISOString(),
            status: 'new'
        });
        
        showStatusMessage('Inquiry submitted successfully! We will contact you soon.', 'success');
        inquiryForm.reset();
    } catch (error) {
        console.error('Inquiry submission error:', error);
        showStatusMessage('Failed to submit inquiry. Please try again.', 'error');
    }
};

/**
 * Handle newsletter subscription form submission
 * @param {Event} e - Form submission event
 */
const handleNewsletterSubscribe = async (e) => {
    e.preventDefault();
    
    const email = newsletterForm.querySelector('input[type="email"]').value.trim().toLowerCase();
    
    try {
        // Save subscriber to MongoDB
        await mongoDB.db.collection('newsletter').insertOne({
            email,
            subscribedAt: new Date().toISOString(),
            active: true
        });
        
        showStatusMessage('Thank you for subscribing to our newsletter!', 'success');
        newsletterForm.reset();
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        showStatusMessage('Failed to subscribe. Please try again.', 'error');
    }
};

/**
 * Toggle quick contact options
 */
const toggleQuickContact = () => {
    quickContact.classList.toggle('active');
};

// Apply dark mode preference on page load
applyDarkModePreference();

 AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-in-out'
        });

        document.addEventListener('DOMContentLoaded', function () {
            // DOM Elements
            const userAuthSection = document.getElementById('userAuthSection');
            const adminAuthSection = document.getElementById('adminAuthSection');
            const loginBtn = document.querySelector('.navbar .btn-outline');
            const adminBtn = document.querySelector('.navbar .btn-primary');
            const closeBtns = document.querySelectorAll('.close-btn');
            const authTabs = document.querySelectorAll('.auth-tab');
            const authForms = document.querySelectorAll('.auth-form');
            const authSwitchLinks = document.querySelectorAll('.auth-switch a');
            const statusMessage = document.getElementById('statusMessage');
            const signupRole = document.getElementById('signupRole');
            const employeeCodeContainer = document.getElementById('employeeCodeContainer');
            const userLoginForm = document.getElementById('userLoginForm');
            const userSignupForm = document.getElementById('userSignupForm');
            const adminLoginForm = document.getElementById('adminLoginForm');
            const themeToggle = document.getElementById('themeToggle');
            const hamburger = document.querySelector('.hamburger');
            const navbar = document.querySelector('.navbar');
            const backToTopBtn = document.getElementById('backToTopBtn');
            const resetForm = document.getElementById('resetForm');
            const showResetForm = document.getElementById('showResetForm');
            const passwordResetForm = document.getElementById('passwordResetForm');
            const cancelReset = document.getElementById('cancelReset');
            const adminResetForm = document.getElementById('adminResetForm');
            const showAdminResetForm = document.getElementById('showAdminResetForm');
            const adminPasswordResetForm = document.getElementById('adminPasswordResetForm');
            const cancelAdminReset = document.getElementById('cancelAdminReset');
            const resetCodeField = document.getElementById('resetCodeField');
            const passwordToggles = document.querySelectorAll('.password-toggle');
            const loginRole = document.getElementById('loginRole');

            // Initialize local storage if empty
            if (!localStorage.getItem('users')) {
                localStorage.setItem('users', JSON.stringify([]));
            }
            if (!localStorage.getItem('admin')) {
                localStorage.setItem('admin', JSON.stringify({
                    email: "admin@gmail.com",
                    password: "admin123"
                }));
            }

            // ------------------ Password Toggle ------------------
            passwordToggles.forEach(toggle => {
                toggle.addEventListener('click', function() {
                    const input = this.previousElementSibling;
                    if (input.type === 'password') {
                        input.type = 'text';
                        this.innerHTML = '<i class="far fa-eye-slash"></i>';
                    } else {
                        input.type = 'password';
                        this.innerHTML = '<i class="far fa-eye"></i>';
                    }
                });
            });

            // ------------------ Reset Password Logic ------------------
            showResetForm.addEventListener('click', function(e) {
                e.preventDefault();
                resetForm.classList.add('active');
                userLoginForm.style.display = 'none';
            });

            cancelReset.addEventListener('click', function() {
                resetForm.classList.remove('active');
                userLoginForm.style.display = 'block';
            });

            showAdminResetForm.addEventListener('click', function(e) {
                e.preventDefault();
                adminLoginForm.style.display = 'none';
                adminResetForm.classList.add('active');
            });

            cancelAdminReset.addEventListener('click', function() {
                adminResetForm.classList.remove('active');
                adminLoginForm.style.display = 'block';
            });

            loginRole.addEventListener('change', function() {
                if (this.value === 'admin' || this.value === 'employee') {
                    resetCodeField.style.display = 'block';
                } else {
                    resetCodeField.style.display = 'none';
                }
            });

            passwordResetForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('resetEmail').value;
                const code = document.getElementById('resetCode').value;
                const newPassword = document.getElementById('newPassword').value;
                const confirmPassword = document.getElementById('confirmNewPassword').value;
                
                if (newPassword !== confirmPassword) {
                    showStatusMessage('Passwords do not match!', 'error');
                    return;
                }
                
                // Check if user exists
                const users = JSON.parse(localStorage.getItem('users'));
                const user = users.find(u => u.email === email);
                
                if (user) {
                    if (user.role === 'admin' || user.role === 'employee') {
                        if (code !== 'PASHUPATI123') {
                            showStatusMessage('Invalid reset code!', 'error');
                            return;
                        }
                    }
                    
                    // Update password
                    user.password = newPassword;
                    localStorage.setItem('users', JSON.stringify(users));
                    showStatusMessage('Password reset successfully!', 'success');
                    
                    // Reset form and show login
                    resetForm.classList.remove('active');
                    userLoginForm.style.display = 'block';
                    this.reset();
                } else {
                    showStatusMessage('Email not found!', 'error');
                }
            });

            adminPasswordResetForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('adminResetEmail').value;
                const code = document.getElementById('adminResetCode').value;
                const newPassword = document.getElementById('adminNewPassword').value;
                const confirmPassword = document.getElementById('adminConfirmNewPassword').value;
                
                if (newPassword !== confirmPassword) {
                    showStatusMessage('Passwords do not match!', 'error');
                    return;
                }
                
                if (code !== 'ADMIN123') {
                    showStatusMessage('Invalid security code!', 'error');
                    return;
                }
                
                // Update admin password
                const adminData = JSON.parse(localStorage.getItem('admin'));
                if (adminData.email === email) {
                    adminData.password = newPassword;
                    localStorage.setItem('admin', JSON.stringify(adminData));
                    showStatusMessage('Admin password reset successfully!', 'success');
                    
                    // Reset form and show login
                    adminResetForm.classList.remove('active');
                    adminLoginForm.style.display = 'block';
                    this.reset();
                } else {
                    showStatusMessage('Admin email not found!', 'error');
                }
            });

            // ------------------ Hamburger Menu Toggle ------------------
            hamburger.addEventListener('click', () => {
                const isExpanded = hamburger.getAttribute('aria-expanded') === 'true' || false;
                hamburger.classList.toggle('active');
                navbar.classList.toggle('open');
                hamburger.setAttribute('aria-expanded', !isExpanded);
            });

            // Close navbar on clicking any nav link or button inside navbar (for mobile)
            navbar.querySelectorAll('a, button').forEach(item => {
                item.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        hamburger.classList.remove('active');
                        navbar.classList.remove('open');
                        hamburger.setAttribute('aria-expanded', false);
                    }
                });
            });

            // ------------------ Back to Top Button ------------------
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTopBtn.style.display = 'flex';
                } else {
                    backToTopBtn.style.display = 'none';
                }
                
                // Header shadow on scroll
                const header = document.querySelector('.header');
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });

            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // ------------------ Auth Section Logic ------------------

            // Toggle auth section
            loginBtn.addEventListener('click', e => {
                e.preventDefault();
                userAuthSection.classList.add('show');
                toggleModal(true);
            });

            adminBtn.addEventListener('click', e => {
                e.preventDefault();
                adminAuthSection.classList.add('show');
                toggleModal(true);
            });

            closeBtns.forEach(btn => {
                btn.addEventListener('click', () => closeAuthSections());
            });

            userAuthSection.addEventListener('click', e => {
                if (e.target === userAuthSection) closeAuthSections();
            });

            adminAuthSection.addEventListener('click', e => {
                if (e.target === adminAuthSection) closeAuthSections();
            });

            // Auth tab switching
            authTabs.forEach(tab => {
                tab.addEventListener('click', function () {
                    switchTab(this.getAttribute('data-tab'));
                });
            });

            authSwitchLinks.forEach(link => {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    switchTab(this.getAttribute('data-tab'));
                });
            });

            // Show/hide employee code input
            signupRole.addEventListener('change', function () {
                const isEmployee = this.value === 'employee';
                employeeCodeContainer.style.display = isEmployee ? 'block' : 'none';
                document.getElementById('employeeCode').required = isEmployee;
            });

            // User Login
            userLoginForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const role = document.getElementById('loginRole').value;
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;

                if (!role) return showStatusMessage('Please select a role', 'error');

                const users = JSON.parse(localStorage.getItem('users'));
                const user = users.find(u => u.email === email && u.password === password && u.role === role);

                if (user) {
                    showStatusMessage('Login successful!', 'success');
                    sessionStorage.setItem('currentUser', JSON.stringify(user));

                    setTimeout(() => {
                        window.location.href = `../html/${role}-dashboard.html`;
                    }, 1500);
                } else {
                    showStatusMessage('Invalid credentials or role!', 'error');
                }
            });

            // User Signup
            userSignupForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const role = signupRole.value;
                const name = document.getElementById('signupName').value;
                const email = document.getElementById('signupEmail').value;
                const phone = document.getElementById('signupPhone').value;
                const address = document.getElementById('signupAddress').value;
                const password = document.getElementById('signupPassword').value;
                const confirmPassword = document.getElementById('signupConfirmPassword').value;
                const employeeCode = document.getElementById('employeeCode').value;

                if (!role) return showStatusMessage('Please select a role', 'error');
                if (password !== confirmPassword) return showStatusMessage('Passwords do not match!', 'error');

                if (role === 'employee') {
                    if (employeeCode !== 'PASHUPATI123') return showStatusMessage('Invalid employee code!', 'error');
                }

                const users = JSON.parse(localStorage.getItem('users'));
                if (users.some(u => u.email === email)) return showStatusMessage('Email already registered!', 'error');

                const newUser = { role, name, email, phone, address, password, createdAt: new Date().toISOString() };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                showStatusMessage('Registration successful! Please login.', 'success');
                switchTab('login');
                userSignupForm.reset();
                employeeCodeContainer.style.display = 'none';
            });

            // Admin Login
            adminLoginForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const email = document.getElementById('adminEmail').value.trim().toLowerCase();
                const password = document.getElementById('adminPassword').value;

                const adminData = JSON.parse(localStorage.getItem('admin') || '{}');

                if (email === adminData.email.toLowerCase() && password === adminData.password) {
                    showStatusMessage('Admin login successful!', 'success');
                    sessionStorage.setItem('isAdmin', 'true');
                    sessionStorage.setItem('adminEmail', adminData.email);
                    adminLoginForm.reset();
                    setTimeout(() => {
                        window.location.href = 'https://saugatpanta.github.io/MINOR/html/admin-dashboard.html';
                    }, 1500);
                } else {
                    showStatusMessage('Invalid admin credentials', 'error');
                }
            });

            // Dark Mode Toggle
            if (themeToggle) {
                themeToggle.addEventListener('click', function () {
                    document.body.classList.toggle('dark-mode');
                    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
                    this.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
                });

                if (localStorage.getItem('darkMode') === 'true') {
                    document.body.classList.add('dark-mode');
                    themeToggle.textContent = '☀️';
                }
            }

            // UI Auth Update
            updateAuthUI();
        });

        // Check auth and redirect
        (function checkAuthStatus() {
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
            const isAdmin = sessionStorage.getItem('isAdmin');

            if (currentUser || isAdmin) {
                const role = isAdmin ? 'admin' : currentUser.role;
                window.location.href = `https://saugatpanta.github.io/MINOR/html/${role}-dashboard.html`;
            }
        })();

        // Utility Functions
        function toggleModal(show) {
            document.body.style.overflow = show ? 'hidden' : '';
        }

        function closeAuthSections() {
            document.getElementById('userAuthSection').classList.remove('show');
            document.getElementById('adminAuthSection').classList.remove('show');
            toggleModal(false);
        }

        function switchTab(tabName) {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            document.querySelector(`.auth-tab[data-tab="${tabName}"]`).classList.add('active');

            document.querySelectorAll('.auth-form').forEach(f => {
                f.classList.remove('active');
                if (f.id === `${tabName}Form`) f.classList.add('active');
            });
        }

        function showStatusMessage(message, type = 'success') {
            const statusMessage = document.getElementById('statusMessage');
            statusMessage.textContent = message;
            statusMessage.className = `status-message show ${type === 'error' ? 'error' : 'success'}`;
            
            if (type === 'success') {
                statusMessage.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
            } else {
                statusMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
            }
            
            setTimeout(() => statusMessage.classList.remove('show'), 3000);
        }

        function updateAuthUI() {
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
            const isAdmin = sessionStorage.getItem('isAdmin');
            const loginBtn = document.querySelector('.navbar .btn-outline');
            const adminBtn = document.querySelector('.navbar .btn-primary');

            if (currentUser) {
                loginBtn.textContent = `Hi, ${currentUser.name.split(' ')[0]}`;
                loginBtn.classList.add('logged-in');
                loginBtn.onclick = function () {
                    sessionStorage.removeItem('currentUser');
                    loginBtn.textContent = 'Login';
                    loginBtn.classList.remove('logged-in');
                    updateAuthUI(); // Refresh UI
                    showStatusMessage('Logged out successfully', 'success');
                };
            } else {
                loginBtn.textContent = 'Login';
                loginBtn.classList.remove('logged-in');
                loginBtn.onclick = e => {
                    e.preventDefault();
                    document.getElementById('userAuthSection').classList.add('show');
                    toggleModal(true);
                };
            }

            if (isAdmin) {
                adminBtn.textContent = 'Admin Dashboard';
                adminBtn.classList.add('logged-in');
                adminBtn.onclick = () => {
                    sessionStorage.removeItem('isAdmin');
                    adminBtn.textContent = 'Admin';
                    adminBtn.classList.remove('logged-in');
                    updateAuthUI(); // Refresh UI
                    showStatusMessage('Admin logged out', 'success');
                };
            } else {
                adminBtn.textContent = 'Admin';
                adminBtn.classList.remove('logged-in');
                adminBtn.onclick = e => {
                    e.preventDefault();
                    document.getElementById('adminAuthSection').classList.add('show');
                    toggleModal(true);
                };
            }
2bef0c83dd50b808fc83f0ea958859fec2b980ab
