document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#00f7ff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#00f7ff", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" }
            }
        }
    });

    // Custom cursor
    const cursor = document.getElementById('cursor');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    let currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    document.body.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
        setTimeout(() => { document.body.style.transition = ''; }, 500);
    });

    function updateThemeIcon(theme) {
        themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }

    // Mobile hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navbar.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                hamburger.classList.remove('active');
                navbar.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // Navigation between sections
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = btn.getAttribute('data-section');
            
            // Update active navigation button
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show the corresponding section
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
            
            // Smooth scroll to section
            window.scrollTo({
                top: document.getElementById(sectionId).offsetTop - 100,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (window.innerWidth <= 992) {
                hamburger.classList.remove('active');
                navbar.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // Make "Explore Products" button work
    const exploreProductsBtn = document.querySelector('.btn-primary[href="#products"]');
    if (exploreProductsBtn) {
        exploreProductsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const productsSection = document.getElementById('products');
            
            // Show products section
            sections.forEach(s => s.classList.remove('active'));
            productsSection.classList.add('active');
            
            // Update active nav button
            navBtns.forEach(b => b.classList.remove('active'));
            document.querySelector('.nav-btn[data-section="products"]').classList.add('active');
            
            // Scroll to products section
            window.scrollTo({
                top: productsSection.offsetTop - 100,
                behavior: 'smooth'
            });
        });
    }

    // Product category filtering
    const categoryButtons = document.querySelectorAll('.category-btn');
    const productContainer = document.getElementById('productContainer');
    const loadMoreBtn = document.getElementById('loadMoreProducts');
    let products = [];
    let visibleProducts = 6;

    // Load products from JSON
    function loadProducts() {
        fetch('data/products.json')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                products = data.products || data; // Handle both formats
                displayProducts(products.slice(0, visibleProducts));
                setupProductCardListeners();
            })
            .catch(error => {
                console.error('Error loading products:', error);
                productContainer.innerHTML = '<p class="error-message">Failed to load products. Please try again later.</p>';
            });
    }

    function displayProducts(productsToShow) {
        if (!productsToShow || productsToShow.length === 0) {
            productContainer.innerHTML = '<p class="no-products">No products found in this category</p>';
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
            return;
        }

        productContainer.innerHTML = productsToShow.map(product => `
            <div class="product-card" data-category="${product.category.toLowerCase()}" data-id="${product.id}">
                ${product.badge ? `<span class="product-card-badge">${product.badge}</span>` : ''}
                <img src="${product.image}" alt="${product.name}" class="product-card-img">
                <div class="product-card-content">
                    <h3>${product.name}</h3>
                    <p>${product.shortDescription || ''}</p>
                    <div class="product-meta">
                        <span class="product-price">Rs. ${product.price}</span>
                        <span class="product-category">${product.category}</span>
                    </div>
                </div>
            </div>
        `).join('');

        if (loadMoreBtn) {
            const activeCategory = document.querySelector('.category-btn.active')?.getAttribute('data-category') || 'all';
            const filteredProducts = activeCategory === 'all' ? products : 
                products.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
            loadMoreBtn.style.display = visibleProducts < filteredProducts.length ? 'block' : 'none';
        }
    }

    function setupProductCardListeners() {
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                fetchProductDetails(productId);
            });
        });
    }

    if (categoryButtons.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const category = button.getAttribute('data-category');
                filterProducts(category);
            });
        });
    }

    function filterProducts(category) {
        let filteredProducts = category !== 'all' ? 
            products.filter(product => product.category.toLowerCase() === category.toLowerCase()) : 
            products;
        visibleProducts = 6;
        displayProducts(filteredProducts.slice(0, visibleProducts));
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            const activeCategory = document.querySelector('.category-btn.active')?.getAttribute('data-category') || 'all';
            let filteredProducts = activeCategory !== 'all' ? 
                products.filter(product => product.category.toLowerCase() === activeCategory.toLowerCase()) : 
                products;
            visibleProducts += 6;
            displayProducts(filteredProducts.slice(0, visibleProducts));
            if (visibleProducts >= filteredProducts.length) loadMoreBtn.style.display = 'none';
        });
    }

    function fetchProductDetails(id) {
        fetch('data/products.json')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                const products = data.products || data; // Handle both formats
                const product = products.find(p => p.id == id);
                if (product) showProductModal(product);
                else console.error('Product not found');
            })
            .catch(error => console.error('Error fetching product details:', error));
    }

    function showProductModal(product) {
        const modal = document.getElementById('productModal');
        const content = document.getElementById('productModalContent');
        content.innerHTML = `
            <div class="modal-product">
                <div class="modal-product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="modal-product-details">
                    <h2>${product.name}</h2>
                    <div class="product-meta">
                        <span class="product-price">Rs. ${product.price}</span>
                        <span class="product-category">${product.category}</span>
                    </div>
                    <p>${product.description}</p>
                    <div class="product-specs">
                        <h3>Specifications</h3>
                        <ul>
                            ${product.specs.map(spec => `<li><strong>${spec.name}:</strong> ${spec.value}</li>`).join('')}
                        </ul>
                    </div>
                    <button class="btn-primary">Request Quote</button>
                </div>
            </div>
        `;
        modal.style.display = 'block';
    }

    // Project details functionality
    document.querySelectorAll('.project-view-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const projectId = this.getAttribute('data-project');
            fetchProjectDetails(projectId);
        });
    });

    function fetchProjectDetails(id) {
        fetch('data/projects.json')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                const projects = data.projects || data; // Handle both formats
                const project = projects.find(p => p.id == id);
                if (project) showProjectModal(project);
            })
            .catch(error => console.error('Error fetching project details:', error));
    }

    function showProjectModal(project) {
        const modal = document.getElementById('projectModal');
        const content = document.getElementById('projectModalContent');
        content.innerHTML = `
            <div class="modal-project">
                <h2>${project.name}</h2>
                <div class="project-meta">
                    <p><strong>Location:</strong> ${project.location}</p>
                    <p><strong>Completed:</strong> ${project.year}</p>
                    <p><strong>Area:</strong> ${project.area}</p>
                </div>
                <div class="project-gallery">
                    ${project.images.map(img => `<img src="${img}" alt="${project.name}">`).join('')}
                </div>
                <div class="project-description">
                    <h3>Project Details</h3>
                    <p>${project.description}</p>
                </div>
                <div class="project-testimonial">
                    <blockquote>"${project.testimonial.quote}"</blockquote>
                    <div class="testimonial-author">
                        <img src="${project.testimonial.authorImage}" alt="${project.testimonial.author}">
                        <div>
                            <h4>${project.testimonial.author}</h4>
                            <p>${project.testimonial.position}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        modal.style.display = 'block';
    }

    // Consultation Modal Functionality
    const consultationBtn = document.querySelector('.btn-outline[href="#contact"]');
    const consultationModal = document.getElementById('consultationModal');
    const consultationForm = document.getElementById('consultationForm');
    const consultationProducts = document.getElementById('consultationProducts');
    
    if (consultationBtn) {
        consultationBtn.addEventListener('click', function(e) {
            e.preventDefault();
            consultationModal.style.display = 'block';
            loadProductsForConsultation();
        });
    }
    
    function loadProductsForConsultation() {
        fetch('data/products.json')
            .then(response => response.json())
            .then(data => {
                const products = data.products || data; // Handle both formats
                consultationProducts.innerHTML = products.map(product => `
                    <div class="product-checkbox">
                        <input type="checkbox" id="product-${product.id}" name="products" value="${product.id}">
                        <label for="product-${product.id}">${product.name} (${product.category})</label>
                    </div>
                `).join('');
            })
            .catch(error => console.error('Error loading products:', error));
    }
    
    if (consultationForm) {
        consultationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(consultationForm);
            const selectedProducts = Array.from(document.querySelectorAll('#consultationProducts input:checked'))
                .map(input => input.value);
            
            // Add selected products to form data
            formData.append('selectedProducts', JSON.stringify(selectedProducts));
            
            // Here you would typically send the data to your server
            console.log('Consultation request:', Object.fromEntries(formData));
            
            // Show success message
            showStatusMessage('Consultation request submitted successfully! Our team will contact you soon.', 'success');
            
            // Close modal
            consultationModal.style.display = 'none';
            consultationForm.reset();
        });
    }
    
    // Close modals when clicking outside or on close button
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('productModal').style.display = 'none';
            document.getElementById('projectModal').style.display = 'none';
            if (consultationModal) consultationModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Google Maps integration
    const mapElement = document.getElementById('map');
    if (mapElement) {
        // Create an iframe with Google Maps embed
        const mapIframe = document.createElement('iframe');
        mapIframe.setAttribute('src', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.456030828568!2d85.36568331506203!3d27.71119628279315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1bcdb4d3e689%3A0xac5beaad4f023444!2sPashupati%20Aluminium%20and%20Glass%20Center!5e0!3m2!1sen!2snp!4v1620000000000!5m2!1sen!2snp');
        mapIframe.setAttribute('width', '100%');
        mapIframe.setAttribute('height', '100%');
        mapIframe.setAttribute('style', 'border:0;');
        mapIframe.setAttribute('allowfullscreen', '');
        mapIframe.setAttribute('loading', 'lazy');
        mapElement.appendChild(mapIframe);
    }

    // Authentication functionality
        const loginBtn = document.querySelector('.login-btn');
    const adminBtn = document.querySelector('.admin-btn');
    const userAuthSection = document.getElementById('userAuthSection');
    const adminAuthSection = document.getElementById('adminAuthSection');
    const closeBtns = document.querySelectorAll('.close-btn');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const showResetForm = document.getElementById('showResetForm');
    const resetForm = document.getElementById('resetForm');
    const cancelReset = document.getElementById('cancelReset');
    const showAdminResetForm = document.getElementById('showAdminResetForm');
    const adminResetForm = document.getElementById('adminResetForm');
    const cancelAdminReset = document.getElementById('cancelAdminReset');
    const signupRole = document.getElementById('signupRole');
    const employeeCodeContainer = document.getElementById('employeeCodeContainer');
    const loginRole = document.getElementById('loginRole');
    const resetCodeField = document.getElementById('resetCodeField');

    function toggleAuthModal(modal, show) {
        if (show) {
            modal.classList.add('active');
            document.body.classList.add('no-scroll');
        } else {
            modal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleAuthModal(userAuthSection, true);
            document.getElementById('loginForm').classList.add('active');
            document.getElementById('signupForm').classList.remove('active');
            authTabs[0].classList.add('active');
            authTabs[1].classList.remove('active');
            resetForm.classList.remove('active'); // Ensure reset form is hidden when opening login
        });
    }

    if (adminBtn) {
        adminBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleAuthModal(adminAuthSection, true);
            adminResetForm.classList.remove('active'); // Ensure admin reset form is hidden when opening
        });
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.auth-section');
            toggleAuthModal(modal, false);
            // Reset forms when closing modal
            if (modal === userAuthSection) {
                resetForm.classList.remove('active');
                document.getElementById('loginForm').classList.add('active');
            }
            if (modal === adminAuthSection) {
                adminResetForm.classList.remove('active');
                document.querySelector('#adminAuthSection .auth-form').classList.add('active');
            }
        });
    });

    [userAuthSection, adminAuthSection].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    toggleAuthModal(this, false);
                    // Reset forms when clicking outside
                    if (modal === userAuthSection) {
                        resetForm.classList.remove('active');
                        document.getElementById('loginForm').classList.add('active');
                    }
                    if (modal === adminAuthSection) {
                        adminResetForm.classList.remove('active');
                        document.querySelector('#adminAuthSection .auth-form').classList.add('active');
                    }
                }
            });
        }
    });

    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            authTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            authForms.forEach(form => form.classList.remove('active'));
            document.getElementById(`${tabName}Form`).classList.add('active');
            // Hide reset form when switching tabs
            resetForm.classList.remove('active');
        });
    });

    // Fixed forgot password functionality
    if (showResetForm) {
        showResetForm.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('loginForm').classList.remove('active');
            resetForm.classList.add('active');
            // Reset the form fields when showing
            document.getElementById('resetEmail').value = '';
            document.getElementById('resetCode').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmNewPassword').value = '';
        });
    }

    if (cancelReset) {
        cancelReset.addEventListener('click', function(e) {
            e.preventDefault();
            resetForm.classList.remove('active');
            document.getElementById('loginForm').classList.add('active');
        });
    }

    // Fixed admin reset password functionality
    if (showAdminResetForm) {
        showAdminResetForm.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('#adminAuthSection .auth-form').classList.remove('active');
            adminResetForm.classList.add('active');
            // Reset the form fields when showing
            document.getElementById('adminResetEmail').value = '';
            document.getElementById('adminResetCode').value = '';
            document.getElementById('adminNewPassword').value = '';
            document.getElementById('adminConfirmNewPassword').value = '';
        });
    }

    if (cancelAdminReset) {
        cancelAdminReset.addEventListener('click', function(e) {
            e.preventDefault();
            adminResetForm.classList.remove('active');
            document.querySelector('#adminAuthSection .auth-form').classList.add('active');
        });
    }

    // Handle role selection for signup
    if (signupRole) {
        signupRole.addEventListener('change', function() {
            employeeCodeContainer.style.display = this.value === 'employee' ? 'block' : 'none';
            if (this.value !== 'employee') {
                document.getElementById('employeeCode').value = '';
            }
        });
    }

    // Handle role selection for login and reset
    if (loginRole) {
        loginRole.addEventListener('change', function() {
            if (resetCodeField) {
                resetCodeField.style.display = this.value === 'employee' ? 'block' : 'none';
                if (this.value !== 'employee') {
                    document.getElementById('resetCode').value = '';
                }
            }
        });
    }

    // Toggle password visibility
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="far fa-eye"></i>' : '<i class="far fa-eye-slash"></i>';
        });
    });

    // Handle password reset form submission
    const passwordResetForm = document.getElementById('passwordResetForm');
    if (passwordResetForm) {
        passwordResetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('resetEmail').value;
            const code = document.getElementById('resetCode').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmNewPassword').value;
            
            if (newPassword !== confirmPassword) {
                showStatusMessage('Passwords do not match', 'error');
                return;
            }
            
            // Here you would typically send the data to your server
            console.log('Password reset request:', { email, code, newPassword });
            
            // Show success message
            showStatusMessage('Password reset successfully! You can now login with your new password.', 'success');
            
            // Reset form and go back to login
            passwordResetForm.reset();
            resetForm.classList.remove('active');
            document.getElementById('loginForm').classList.add('active');
        });
    }

    // Handle admin password reset form submission
    const adminPasswordResetForm = document.getElementById('adminPasswordResetForm');
    if (adminPasswordResetForm) {
        adminPasswordResetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('adminResetEmail').value;
            const code = document.getElementById('adminResetCode').value;
            const newPassword = document.getElementById('adminNewPassword').value;
            const confirmPassword = document.getElementById('adminConfirmNewPassword').value;
            
            if (newPassword !== confirmPassword) {
                showStatusMessage('Passwords do not match', 'error');
                return;
            }
            
            // Here you would typically send the data to your server
            console.log('Admin password reset request:', { email, code, newPassword });
            
            // Show success message
            showStatusMessage('Admin password reset successfully!', 'success');
            
            // Reset form and go back to login
            adminPasswordResetForm.reset();
            adminResetForm.classList.remove('active');
            document.querySelector('#adminAuthSection .auth-form').classList.add('active');
        });
    }
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="far fa-eye"></i>' : '<i class="far fa-eye-slash"></i>';
        });
    });

    // Back to top button
    const backToTopBtn = document.getElementById('backToTopBtn');
    window.addEventListener('scroll', () => {
        backToTopBtn.classList.toggle('active', window.scrollY > 300);
    });
    
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Quick contact functionality
    const quickContactBtn = document.querySelector('.quick-contact-btn');
    const quickContactOptions = document.querySelector('.quick-contact-options');
    if (quickContactBtn && quickContactOptions) {
        quickContactBtn.addEventListener('click', () => {
            quickContactOptions.classList.toggle('visible');
        });
        
<<<<<<< HEAD
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
=======
        document.addEventListener('click', (e) => {
            if (!quickContactBtn.contains(e.target) && !quickContactOptions.contains(e.target)) {
                quickContactOptions.classList.remove('visible');
            }
        });
    }

    // Animate statistics counters
    const statNumbers = document.querySelectorAll('.stat-number');
    function animateCounters() {
        statNumbers.forEach(stat => {
            if (!stat.dataset.animated) {
                stat.dataset.animated = 'true';
                const target = parseInt(stat.getAttribute('data-count'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const counter = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        clearInterval(counter);
                        stat.textContent = target + '+';
                    } else {
                        stat.textContent = Math.floor(current);
                    }
                }, 16);
            }
        });
    }

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('stat-number')) animateCounters();
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });

    // Status message functionality
    function showStatusMessage(message, type) {
        const statusElement = document.getElementById('statusMessage');
        if (!statusElement) return;
        
        statusElement.textContent = message;
        statusElement.className = `status-message ${type}`;
        
        if (statusElement.timeout) clearTimeout(statusElement.timeout);
        
        statusElement.timeout = setTimeout(() => {
            statusElement.classList.add('fade-out');
            setTimeout(() => statusElement.className = 'status-message', 500);
        }, 5000);
    }

    // Check authentication status
    function checkAuthStatus() {
        const authToken = localStorage.getItem('authToken');
        const adminToken = localStorage.getItem('adminToken');
        
        if (authToken && loginBtn) {
            loginBtn.textContent = 'My Account';
            loginBtn.href = '/account';
            loginBtn.classList.remove('login-btn');
        }
        
        if (adminToken && adminBtn) {
            adminBtn.textContent = 'Dashboard';
            adminBtn.href = '/admin/dashboard';
            adminBtn.classList.remove('admin-btn');
        }
    }

    // Initialize AOS animations
    AOS.init({ duration: 800, once: true, easing: 'ease-in-out' });
    
    // Load initial data
    loadProducts();
    checkAuthStatus();
});
>>>>>>> f7ed78f (    enhanced the ui)
