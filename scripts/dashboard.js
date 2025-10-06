// Dashboard JavaScript with User Data

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
    
    // Check if user is logged in, otherwise redirect to login
    checkAuthentication();
    
    // Load user data
    loadUserData();
    
    // Add Farm Button (Farmer Dashboard)
    const addFarmBtn = document.getElementById('add-farm-btn');
    if (addFarmBtn) {
        addFarmBtn.addEventListener('click', function() {
            alert('Add New Farm functionality would open a form here');
            // This would typically open a modal or redirect to a farm creation page
        });
    }
    
    // Browse Farms Button (Investor Dashboard)
    const browseFarmsBtn = document.getElementById('browse-farms-btn');
    if (browseFarmsBtn) {
        browseFarmsBtn.addEventListener('click', function() {
            window.location.href = 'browse-farms.html';
        });
    }
    
    // Logout functionality
    const logoutLinks = document.querySelectorAll('.logout');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                logoutUser();
            }
        });
    });
    
    // Initialize any dashboard-specific functionality
    initializeDashboard();
});

function checkAuthentication() {
    const user = getCurrentUser();
    if (!user) {
        // Redirect to login with redirect back to this page
        sessionStorage.setItem('redirect_after_login', window.location.href);
        window.location.href = 'login.html';
        return;
    }
    
    // Check if user has access to this dashboard
    const currentPage = window.location.pathname;
    if (currentPage.includes('farmer-dashboard') && user.role !== 'farmer') {
        alert('Access denied. This dashboard is for farmers only.');
        window.location.href = user.role === 'investor' ? 'investor-dashboard.html' : 'index.html';
        return;
    }
    
    if (currentPage.includes('investor-dashboard') && user.role !== 'investor') {
        alert('Access denied. This dashboard is for investors only.');
        window.location.href = user.role === 'farmer' ? 'farmer-dashboard.html' : 'index.html';
        return;
    }
}

function loadUserData() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Update welcome message
    const welcomeElement = document.querySelector('.dashboard-welcome h1');
    if (welcomeElement) {
        welcomeElement.textContent = `Welcome back, ${user.name}!`;
    }
    
    // Update user-specific content based on role
    if (user.role === 'farmer') {
        updateFarmerDashboard(user);
    } else {
        updateInvestorDashboard(user);
    }
}

function updateFarmerDashboard(user) {
    // Update farmer-specific content
    console.log('Updating farmer dashboard for:', user.name);
    
    // You can add farmer-specific updates here
    if (user.farmLocation) {
        // Update farm location in the dashboard if needed
    }
}

function updateInvestorDashboard(user) {
    // Update investor-specific content
    console.log('Updating investor dashboard for:', user.name);
    
    // You can add investor-specific updates here
    if (user.investmentRange) {
        // Update investment range display if needed
    }
}

function initializeDashboard() {
    // Add any dashboard initialization code here
    console.log('Dashboard initialized');
    
    // Example: Update progress bars with animation
    animateProgressBars();
}

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
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