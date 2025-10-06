// Authentication JavaScript with Redirection

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Check if user is already logged in (for demo purposes)
    checkLoginStatus();
    
    // Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Update active tab
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding form
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${targetTab}-form`) {
                    form.classList.add('active');
                }
            });
        });
    });
    
    // Role Selection for Signup
    const signupRoleRadios = document.querySelectorAll('input[name="signup-role"]');
    const farmerSpecific = document.querySelector('.farmer-specific');
    const investorSpecific = document.querySelector('.investor-specific');
    
    signupRoleRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'farmer') {
                farmerSpecific.style.display = 'block';
                investorSpecific.style.display = 'none';
            } else {
                farmerSpecific.style.display = 'none';
                investorSpecific.style.display = 'block';
            }
        });
    });
    
    // Role Selection for Login
    const loginRoleRadios = document.querySelectorAll('input[name="login-role"]');
    
    // Switch between login and signup forms
    const switchToSignup = document.querySelector('.switch-to-signup');
    const switchToLogin = document.querySelector('.switch-to-login');
    
    if (switchToSignup) {
        switchToSignup.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('.tab-btn[data-tab="signup"]').click();
        });
    }
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('.tab-btn[data-tab="login"]').click();
        });
    }
    
    // Form Validation and Submission
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup();
        });
    }
    
    // Password confirmation validation
    const signupPassword = document.getElementById('signup-password');
    const signupConfirmPassword = document.getElementById('signup-confirm-password');
    
    if (signupConfirmPassword) {
        signupConfirmPassword.addEventListener('input', function() {
            if (signupPassword.value !== signupConfirmPassword.value) {
                signupConfirmPassword.setCustomValidity('Passwords do not match');
            } else {
                signupConfirmPassword.setCustomValidity('');
            }
        });
    }
    
    // Check for redirect parameter in URL
    checkRedirectParameter();
});

// Check if user is already logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('farmconnect_user');
    if (isLoggedIn) {
        const user = JSON.parse(isLoggedIn);
        redirectToDashboard(user.role);
    }
}

// Check for redirect parameter in URL
function checkRedirectParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    
    if (redirect) {
        // Store the redirect URL for after login
        sessionStorage.setItem('redirect_after_login', redirect);
    }
}

// Login Handler
function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const role = document.querySelector('input[name="login-role"]:checked').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Simple validation
    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate API call
    showMessage('Logging in...', 'info');
    
    setTimeout(() => {
        // Create user object
        const user = {
            email: email,
            name: email.split('@')[0], // Simple name extraction
            role: role,
            loginTime: new Date().toISOString()
        };
        
        // Store user data
        if (rememberMe) {
            localStorage.setItem('farmconnect_user', JSON.stringify(user));
        } else {
            sessionStorage.setItem('farmconnect_user', JSON.stringify(user));
        }
        
        showMessage('Login successful! Redirecting...', 'success');
        
        // Redirect after short delay
        setTimeout(() => {
            redirectAfterLogin(role);
        }, 1000);
    }, 1500);
}

// Signup Handler
function handleSignup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const role = document.querySelector('input[name="signup-role"]:checked').value;
    const farmLocation = document.getElementById('farm-location') ? document.getElementById('farm-location').value : '';
    const investmentRange = document.getElementById('investment-range') ? document.getElementById('investment-range').value : '';
    const termsAgreed = document.getElementById('terms-agreement').checked;
    
    // Validation
    if (!name || !email || !phone || !password || !confirmPassword) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    
    if (!termsAgreed) {
        showMessage('Please agree to the terms and conditions', 'error');
        return;
    }
    
    // Simulate API call
    showMessage('Creating your account...', 'info');
    
    setTimeout(() => {
        // Create user object with additional signup data
        const user = {
            email: email,
            name: name,
            phone: phone,
            role: role,
            farmLocation: farmLocation,
            investmentRange: investmentRange,
            signupTime: new Date().toISOString()
        };
        
        // Store user data
        localStorage.setItem('farmconnect_user', JSON.stringify(user));
        
        showMessage('Account created successfully! Redirecting...', 'success');
        
        // Redirect after short delay
        setTimeout(() => {
            redirectAfterLogin(role);
        }, 1000);
    }, 2000);
}

// Redirect after login/signup
function redirectAfterLogin(role) {
    // Check if there's a redirect URL stored
    const redirectUrl = sessionStorage.getItem('redirect_after_login');
    
    if (redirectUrl) {
        // Clear the stored redirect URL
        sessionStorage.removeItem('redirect_after_login');
        window.location.href = redirectUrl;
    } else {
        // Redirect to appropriate dashboard based on role
        redirectToDashboard(role);
    }
}

// Redirect to appropriate dashboard
function redirectToDashboard(role) {
    if (role === 'farmer') {
        window.location.href = 'farmer-dashboard.html';
    } else {
        window.location.href = 'investor-dashboard.html';
    }
}

// Show message function
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `auth-message auth-message-${type}`;
    messageEl.textContent = message;
    
    // Style the message
    messageEl.style.padding = '12px';
    messageEl.style.marginBottom = '1rem';
    messageEl.style.borderRadius = '4px';
    messageEl.style.textAlign = 'center';
    messageEl.style.fontWeight = '500';
    
    if (type === 'error') {
        messageEl.style.backgroundColor = '#ffebee';
        messageEl.style.color = '#c62828';
        messageEl.style.border = '1px solid #ffcdd2';
    } else if (type === 'success') {
        messageEl.style.backgroundColor = '#e8f5e8';
        messageEl.style.color = '#2e7d32';
        messageEl.style.border = '1px solid #c8e6c9';
    } else {
        messageEl.style.backgroundColor = '#e3f2fd';
        messageEl.style.color = '#1565c0';
        messageEl.style.border = '1px solid #bbdefb';
    }
    
    // Insert message at the top of the active form
    const activeForm = document.querySelector('.auth-form.active');
    const firstChild = activeForm.firstElementChild;
    activeForm.insertBefore(messageEl, firstChild);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 5000);
}

// Utility function to check if user is logged in (for other pages)
function isUserLoggedIn() {
    return localStorage.getItem('farmconnect_user') || sessionStorage.getItem('farmconnect_user');
}

// Utility function to get current user data
function getCurrentUser() {
    const userData = localStorage.getItem('farmconnect_user') || sessionStorage.getItem('farmconnect_user');
    return userData ? JSON.parse(userData) : null;
}

// Utility function to logout user
function logoutUser() {
    localStorage.removeItem('farmconnect_user');
    sessionStorage.removeItem('farmconnect_user');
    sessionStorage.removeItem('redirect_after_login');
    window.location.href = 'index.html';
}