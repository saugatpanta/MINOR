document.addEventListener('DOMContentLoaded', function() {
    initAuthForms();
    initPasswordStrength();
});

function initAuthForms() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
        });
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleRegister();
        });
    }
    
    document.querySelectorAll('.btn-social').forEach(button => {
        button.addEventListener('click', function(e) {
        e.preventDefault();
        alert('In a real app, this would initiate social login with ' + 
                (this.textContent.includes('Google') ? 'Google' : 'Facebook'));
        });
    });
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    if (!email || !password) {
        showAuthError('Please fill in all fields');
        return;
    }
    
    console.log('Login attempt with:', { email, password, rememberMe });
    simulateAuthSuccess('login');
}

function handleRegister() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const phone = document.getElementById('phone').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showAuthError('Please fill in all required fields');
        return;
    }
    
    if (password !== confirmPassword) {
        showAuthError('Passwords do not match');
        return;
    }
    
    if (!agreeTerms) {
        showAuthError('You must agree to the terms and conditions');
        return;
    }
    
    console.log('Registration attempt with:', { 
        firstName, 
        lastName, 
        email, 
        password, 
        phone,
        agreeTerms 
    });
    
    simulateAuthSuccess('register');
}

function showAuthError(message) {
    alert('Error: ' + message);
}

function simulateAuthSuccess(type) {
    const redirectUrl = type === 'login' ? 'client-dashboard.html' : 'login.html';
    
    const submitBtn = document.querySelector(`#${type}Form .btn-primary`);
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    }
    
    setTimeout(() => {
        window.location.href = redirectUrl;
    }, 1500);
}

function initPasswordStrength() {
    const passwordInput = document.getElementById('registerPassword');
    if (!passwordInput) return;
    
    passwordInput.addEventListener('input', function() {
    const password = this.value;
    const strengthBars = document.querySelectorAll('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    strengthBars.forEach(bar => {
        bar.style.backgroundColor = '';
    });
    
    if (!password) {
        strengthText.textContent = 'Password strength';
        return;
    }
    
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    let strengthLabel = '';
    let strengthColor = '';
    
    if (strength <= 2) {
        strengthLabel = 'Weak';
        strengthColor = 'var(--error)';
        } else if (strength <= 4) {
        strengthLabel = 'Medium';
        strengthColor = 'var(--warning)';
        } else {
        strengthLabel = 'Strong';
        strengthColor = 'var(--success)';
        }
        
        for (let i = 0; i < strengthBars.length; i++) {
        if (i < strength) {
            strengthBars[i].style.backgroundColor = strengthColor;
        }
        }
        
        strengthText.textContent = strengthLabel;
    });
}