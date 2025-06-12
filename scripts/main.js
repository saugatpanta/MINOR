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
                        window.location.href = '../html/admin-dashboard.html';
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
                window.location.href = `../html/${role}-dashboard.html`;
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
        }
