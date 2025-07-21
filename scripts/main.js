document.addEventListener('DOMContentLoaded', function() {
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

    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navbar.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                hamburger.classList.remove('active');
                navbar.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = btn.getAttribute('data-section');
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
            window.scrollTo({
                top: document.getElementById(sectionId).offsetTop - 100,
                behavior: 'smooth'
            });
            if (window.innerWidth <= 992) {
                hamburger.classList.remove('active');
                navbar.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    const exploreProductsBtn = document.querySelector('.btn-primary[href="#products"]');
    if (exploreProductsBtn) {
        exploreProductsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const productsSection = document.getElementById('products');
            sections.forEach(s => s.classList.remove('active'));
            productsSection.classList.add('active');
            navBtns.forEach(b => b.classList.remove('active'));
            document.querySelector('.nav-btn[data-section="products"]').classList.add('active');
            window.scrollTo({
                top: productsSection.offsetTop - 100,
                behavior: 'smooth'
            });
        });
    }

    const categoryButtons = document.querySelectorAll('.category-btn');
    const productContainer = document.getElementById('productContainer');
    const loadMoreBtn = document.getElementById('loadMoreProducts');
    let products = [];
    let visibleProducts = 6;

    function loadProducts() {
        fetch('data/products.json')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                products = data.products || data;
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
                const products = data.products || data;
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
                const projects = data.projects || data;
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
                const products = data.products || data;
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
            formData.append('selectedProducts', JSON.stringify(selectedProducts));
            console.log('Consultation request:', Object.fromEntries(formData));
            showStatusMessage('Consultation request submitted successfully! Our team will contact you soon.', 'success');
            consultationModal.style.display = 'none';
            consultationForm.reset();
        });
    }
    
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

    const mapElement = document.getElementById('map');
    if (mapElement) {
        const mapIframe = document.createElement('iframe');
        mapIframe.setAttribute('src', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.456030828568!2d85.36568331506203!3d27.71119628279315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1bcdb4d3e689%3A0xac5beaad4f023444!2sPashupati%20Aluminium%20and%20Glass%20Center!5e0!3m2!1sen!2snp!4v1620000000000!5m2!1sen!2snp');
        mapIframe.setAttribute('width', '100%');
        mapIframe.setAttribute('height', '100%');
        mapIframe.setAttribute('style', 'border:0;');
        mapIframe.setAttribute('allowfullscreen', '');
        mapIframe.setAttribute('loading', 'lazy');
        mapElement.appendChild(mapIframe);
    }

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
    const passwordResetForm = document.getElementById('passwordResetForm');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const showAdminResetForm = document.getElementById('showAdminResetForm');
    const adminResetForm = document.getElementById('adminResetForm');
    const cancelAdminReset = document.getElementById('cancelAdminReset');
    const adminLoginForm = document.querySelector('#adminAuthSection .auth-form');
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

    function resetAuthForms() {
        if (loginForm) loginForm.classList.add('active');
        if (signupForm) signupForm.classList.remove('active');
        if (resetForm) resetForm.classList.remove('active');
        if (passwordResetForm) passwordResetForm.reset();
        if (adminLoginForm) adminLoginForm.classList.add('active');
        if (adminResetForm) adminResetForm.classList.remove('active');
        if (authTabs.length > 0) {
            authTabs[0].classList.add('active');
            if (authTabs.length > 1) authTabs[1].classList.remove('active');
        }
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resetAuthForms();
            toggleAuthModal(userAuthSection, true);
        });
    }

    if (adminBtn) {
        adminBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resetAuthForms();
            toggleAuthModal(adminAuthSection, true);
        });
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.auth-section');
            toggleAuthModal(modal, false);
        });
    });

    [userAuthSection, adminAuthSection].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === this) toggleAuthModal(this, false);
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
            if (resetForm) resetForm.classList.remove('active');
            if (adminResetForm) adminResetForm.classList.remove('active');
        });
    });

    if (showResetForm && resetForm && cancelReset && loginForm) {
        showResetForm.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.classList.remove('active');
            resetForm.classList.add('active');
            if (loginRole && resetCodeField) {
                resetCodeField.style.display = loginRole.value === 'employee' ? 'block' : 'none';
            }
        });

        cancelReset.addEventListener('click', function(e) {
            e.preventDefault();
            resetForm.classList.remove('active');
            loginForm.classList.add('active');
        });

        if (passwordResetForm) {
            passwordResetForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('resetEmail').value;
                const newPassword = document.getElementById('newPassword').value;
                const confirmPassword = document.getElementById('confirmNewPassword').value;
                const resetCode = loginRole.value === 'employee' ? document.getElementById('resetCode').value : null;
                
                if (!email) {
                    showStatusMessage('Please enter your email address', 'error');
                    return;
                }
                
                if (newPassword !== confirmPassword) {
                    showStatusMessage('Passwords do not match', 'error');
                    return;
                }
                
                if (loginRole.value === 'employee' && !resetCode) {
                    showStatusMessage('Employee reset code is required', 'error');
                    return;
                }
                
                setTimeout(() => {
                    showStatusMessage('Password reset successfully! You can now login with your new password.', 'success');
                    passwordResetForm.reset();
                    resetForm.classList.remove('active');
                    loginForm.classList.add('active');
                }, 1000);
            });
        }
    }

    if (showAdminResetForm && adminResetForm && cancelAdminReset && adminLoginForm) {
        showAdminResetForm.addEventListener('click', function(e) {
            e.preventDefault();
            adminLoginForm.classList.remove('active');
            adminResetForm.classList.add('active');
            document.getElementById('adminPasswordResetForm').reset();
        });

        cancelAdminReset.addEventListener('click', function(e) {
            e.preventDefault();
            adminResetForm.classList.remove('active');
            adminLoginForm.classList.add('active');
        });

        const adminPasswordResetForm = document.getElementById('adminPasswordResetForm');
        if (adminPasswordResetForm) {
            adminPasswordResetForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('adminResetEmail').value;
                const code = document.getElementById('adminResetCode').value;
                const newPassword = document.getElementById('adminNewPassword').value;
                const confirmPassword = document.getElementById('adminConfirmNewPassword').value;
                
                if (!email || !code || !newPassword || !confirmPassword) {
                    showStatusMessage('All fields are required', 'error');
                    return;
                }
                
                if (newPassword !== confirmPassword) {
                    showStatusMessage('Passwords do not match', 'error');
                    return;
                }
                
                setTimeout(() => {
                    showStatusMessage('Admin password reset successfully!', 'success');
                    adminPasswordResetForm.reset();
                    adminResetForm.classList.remove('active');
                    adminLoginForm.classList.add('active');
                }, 1000);
            });
        }
    }

    if (signupRole && employeeCodeContainer) {
        signupRole.addEventListener('change', function() {
            employeeCodeContainer.style.display = this.value === 'employee' ? 'block' : 'none';
            if (this.value !== 'employee') {
                document.getElementById('employeeCode').value = '';
            }
        });
    }

    if (loginRole && resetCodeField) {
        loginRole.addEventListener('change', function() {
            if (resetForm.classList.contains('active')) {
                resetCodeField.style.display = this.value === 'employee' ? 'block' : 'none';
                if (this.value !== 'employee') {
                    document.getElementById('resetCode').value = '';
                }
            }
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

    const backToTopBtn = document.getElementById('backToTopBtn');
    window.addEventListener('scroll', () => {
        backToTopBtn.classList.toggle('active', window.scrollY > 300);
    });
    
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const quickContactBtn = document.querySelector('.quick-contact-btn');
    const quickContactOptions = document.querySelector('.quick-contact-options');
    if (quickContactBtn && quickContactOptions) {
        quickContactBtn.addEventListener('click', () => {
            quickContactOptions.classList.toggle('visible');
        });
        
        document.addEventListener('click', (e) => {
            if (!quickContactBtn.contains(e.target) && !quickContactOptions.contains(e.target)) {
                quickContactOptions.classList.remove('visible');
            }
        });
    }

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

    AOS.init({ duration: 800, once: true, easing: 'ease-in-out' });
    
    loadProducts();
    checkAuthStatus();
});