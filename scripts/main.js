// Main JavaScript for the website with Login Status

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
    
    // Update navigation based on login status
    updateNavigation();
    
    // Load featured farms on the homepage
    loadFeaturedFarms();
});

// Update navigation based on login status
function updateNavigation() {
    const user = getCurrentUser();
    const navMenu = document.querySelector('.nav-menu');
    
    if (user && navMenu) {
        // User is logged in - update navigation
        const loginLink = navMenu.querySelector('a[href="login.html"]');
        if (loginLink) {
            loginLink.textContent = 'Dashboard';
            loginLink.href = user.role === 'farmer' ? 'farmer-dashboard.html' : 'investor-dashboard.html';
            
            // Add logout link if it doesn't exist
            if (!navMenu.querySelector('.logout')) {
                const logoutItem = document.createElement('li');
                logoutItem.className = 'nav-item';
                logoutItem.innerHTML = '<a href="#" class="nav-link logout">Logout</a>';
                navMenu.appendChild(logoutItem);
                
                // Add logout event listener
                const logoutLink = logoutItem.querySelector('.logout');
                logoutLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (confirm('Are you sure you want to logout?')) {
                        logoutUser();
                    }
                });
            }
        }
    }
}

// Import utility functions from auth.js
function getCurrentUser() {
    const userData = localStorage.getItem('farmconnect_user') || sessionStorage.getItem('farmconnect_user');
    return userData ? JSON.parse(userData) : null;
}

function logoutUser() {
    localStorage.removeItem('farmconnect_user');
    sessionStorage.removeItem('farmconnect_user');
    sessionStorage.removeItem('redirect_after_login');
    window.location.href = 'index.html';
}

// Rest of the main.js code remains the same...