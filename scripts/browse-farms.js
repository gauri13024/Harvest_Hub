// Browse Farms JavaScript with Login Redirection

let displayedFarms = 3; // Number of farms initially displayed

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
    
    // Load all farms
    loadAllFarms();
    
    // Filter functionality
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
    
    // Load more farms functionality
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreFarms);
    }
});

// Update navigation based on login status
function updateNavigation() {
    const user = getCurrentUser();
    const navMenu = document.querySelector('.nav-menu');
    
    if (user) {
        // User is logged in - update navigation
        const loginLink = navMenu.querySelector('a[href="login.html"]');
        if (loginLink) {
            loginLink.textContent = 'Dashboard';
            loginLink.href = user.role === 'farmer' ? 'farmer-dashboard.html' : 'investor-dashboard.html';
            
            // Add logout link
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

// All Farms Data (would typically come from a backend)
const allFarmsData = [
    {
        id: 1,
        name: "Organic Vegetable Farm",
        location: "Punjab, India",
        image: "images/farm1.jpg",
        cropType: "Vegetables",
        investmentGoal: "₹1,50,000",
        raised: "₹85,000",
        investors: 5,
        rating: 4.8,
        description: "A certified organic farm specializing in seasonal vegetables using sustainable farming practices.",
        progress: 65,
        daysToHarvest: 65,
        tag: "Popular"
    },
    // ... rest of the farm data remains the same
];

function loadAllFarms() {
    const farmsGrid = document.getElementById('farms-grid');
    if (!farmsGrid) return;
    
    // Clear existing content
    farmsGrid.innerHTML = '';
    
    // Display initial farms
    displayFarms(0, displayedFarms);
}

function displayFarms(startIndex, endIndex) {
    const farmsGrid = document.getElementById('farms-grid');
    const farmsToShow = allFarmsData.slice(startIndex, endIndex);
    
    farmsToShow.forEach(farm => {
        const farmCard = document.createElement('div');
        farmCard.className = 'farm-card';
        farmCard.innerHTML = `
            <div class="farm-image" style="background-image: url('${farm.image}')">
                ${farm.tag ? `<div class="farm-tag">${farm.tag}</div>` : ''}
            </div>
            <div class="farm-info">
                <h3>${farm.name}</h3>
                <p class="farm-location"><i class="fas fa-map-marker-alt"></i> ${farm.location}</p>
                <div class="farm-rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                    <span>${farm.rating}</span>
                </div>
                <p class="farm-description">${farm.description}</p>
                <div class="farm-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${farm.progress}%"></div>
                    </div>
                    <div class="progress-text">
                        <span>${farm.progress}% funded</span>
                        <span>${farm.daysToHarvest} days to harvest</span>
                    </div>
                </div>
                <div class="farm-details">
                    <div class="farm-detail">
                        <span class="value">${farm.investmentGoal}</span>
                        <span class="label">Goal</span>
                    </div>
                    <div class="farm-detail">
                        <span class="value">${farm.raised}</span>
                        <span class="label">Raised</span>
                    </div>
                    <div class="farm-detail">
                        <span class="value">${farm.investors}</span>
                        <span class="label">Investors</span>
                    </div>
                </div>
                <button class="btn btn-primary btn-invest" data-farm-id="${farm.id}">Invest Now</button>
            </div>
        `;
        farmsGrid.appendChild(farmCard);
    });
    
    // Add event listeners to invest buttons
    document.querySelectorAll('.btn-invest').forEach(btn => {
        btn.addEventListener('click', function() {
            const farmId = this.getAttribute('data-farm-id');
            handleInvestment(farmId);
        });
    });
}

function applyFilters() {
    const locationFilter = document.getElementById('location').value;
    const cropTypeFilter = document.getElementById('crop-type').value;
    const investmentRangeFilter = document.getElementById('investment-range').value;
    
    // Filter logic would go here (simplified for demo)
    console.log('Applying filters:', { locationFilter, cropTypeFilter, investmentRangeFilter });
    
    // For now, just reload all farms
    loadAllFarms();
}

function loadMoreFarms() {
    if (displayedFarms >= allFarmsData.length) {
        document.getElementById('load-more').style.display = 'none';
        return;
    }
    
    displayedFarms += 3;
    if (displayedFarms > allFarmsData.length) {
        displayedFarms = allFarmsData.length;
    }
    
    displayFarms(0, displayedFarms);
    
    if (displayedFarms >= allFarmsData.length) {
        document.getElementById('load-more').style.display = 'none';
    }
}

function handleInvestment(farmId) {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
        // Store the current page as redirect URL
        sessionStorage.setItem('redirect_after_login', window.location.href);
        
        if (confirm('You need to login to invest. Would you like to login now?')) {
            window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
        }
        return;
    }
    
    // Check if user is an investor
    const user = getCurrentUser();
    if (user && user.role !== 'investor') {
        alert('Only investors can make investments. Please use an investor account.');
        return;
    }
    
    // Simulate investment process
    const farm = allFarmsData.find(f => f.id == farmId);
    if (farm) {
        const amount = prompt(`Enter investment amount for ${farm.name} (Minimum: ₹10,000):`);
        if (amount && !isNaN(amount) && amount >= 10000) {
            alert(`Thank you! Your investment of ₹${amount} in ${farm.name} has been processed.`);
            // Redirect to investor dashboard
            window.location.href = 'investor-dashboard.html';
        } else if (amount) {
            alert('Please enter a valid amount (minimum ₹10,000)');
        }
    }
}

// Import utility functions from auth.js
function isUserLoggedIn() {
    return localStorage.getItem('farmconnect_user') || sessionStorage.getItem('farmconnect_user');
}

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