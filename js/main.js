// Ayurvedic Diet Dashboard - Main JavaScript

// Global state management
const DashboardState = {
    currentSection: 'dashboard',
    currentPatient: null,
    currentDietPlan: null,
    progressData: [],
    notifications: []
};

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

// Dashboard initialization
async function initializeDashboard() {
    try {
        showLoader();
        
        // Load patient data
        await loadPatientData();
        
        // Load current diet plan
        await loadCurrentDietPlan();
        
        // Load progress data
        await loadProgressData();
        
        // Initialize charts
        initializeCharts();
        
        // Load notifications
        loadNotifications();
        
        hideLoader();
        
        // Show welcome notification
        showNotification('Welcome back, Priya! Your dashboard has been updated.', 'success');
        
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showNotification('Error loading dashboard data', 'error');
        hideLoader();
    }
}

// Navigation functions
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section-content');
    sections.forEach(section => section.classList.add('hidden'));
    
    // Show selected section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.remove('hidden');
        DashboardState.currentSection = sectionName;
        
        // Update navigation active states
        updateNavigationState();
        
        // Load section-specific content
        loadSectionContent(sectionName);
    }
}

function updateNavigationState() {
    // Update desktop navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.textContent.toLowerCase().includes(DashboardState.currentSection)) {
            link.classList.add('active');
        }
    });
    
    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.add('hidden');
    }
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

// Data loading functions
async function loadPatientData() {
    try {
        const response = await fetch('tables/patients/pat_001');
        if (response.ok) {
            DashboardState.currentPatient = await response.json();
            updatePatientProfile();
        }
    } catch (error) {
        console.error('Error loading patient data:', error);
    }
}

async function loadCurrentDietPlan() {
    try {
        const response = await fetch('tables/diet_plans?patient_id=pat_001&status=Active');
        if (response.ok) {
            const result = await response.json();
            if (result.data && result.data.length > 0) {
                DashboardState.currentDietPlan = result.data[0];
                updateDietSummary();
            }
        }
    } catch (error) {
        console.error('Error loading diet plan:', error);
    }
}

async function loadProgressData() {
    try {
        const response = await fetch('tables/progress_tracking?patient_id=pat_001&limit=30&sort=date');
        if (response.ok) {
            const result = await response.json();
            DashboardState.progressData = result.data || [];
            updateProgressCharts();
        }
    } catch (error) {
        console.error('Error loading progress data:', error);
    }
}

// Section content loaders
function loadSectionContent(sectionName) {
    switch(sectionName) {
        case 'dashboard':
            // Dashboard is already loaded in initialization
            break;
        case 'diet-plan':
            loadDietPlanSection();
            break;
        case 'progress':
            loadProgressSection();
            break;
        case 'recipes':
            loadRecipesSection();
            break;
        case 'communication':
            loadCommunicationSection();
            break;
    }
}

// Diet Plan Section
function loadDietPlanSection() {
    const section = document.getElementById('diet-plan-section');
    if (!section) return;
    
    section.innerHTML = `
        <div class="space-y-6">
            <!-- Current Diet Plan Header -->
            <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                <div class="flex justify-between items-start">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800 mb-2">Current Diet Plan</h2>
                        <p class="text-lg text-green-600 font-medium">${DashboardState.currentDietPlan?.plan_name || 'Loading...'}</p>
                        <p class="text-sm text-gray-600 mt-1">
                            <i class="fas fa-calendar-alt mr-1"></i>
                            Active since ${DashboardState.currentDietPlan ? formatDate(DashboardState.currentDietPlan.start_date) : '...'}
                        </p>
                    </div>
                    <div class="text-right">
                        <span class="status-active">Active</span>
                        <p class="text-sm text-gray-600 mt-2">
                            Compliance: <span class="font-bold text-green-600">89%</span>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Diet Plan Details -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Nutritional Targets -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-bullseye mr-2 text-blue-600"></i>
                        Daily Nutritional Targets
                    </h3>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">Calories</span>
                            <span class="font-bold text-lg">${DashboardState.currentDietPlan?.target_calories || 0} kcal</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">Protein</span>
                            <span class="font-bold">${DashboardState.currentDietPlan?.target_protein || 0}g</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">Carbohydrates</span>
                            <span class="font-bold">${DashboardState.currentDietPlan?.target_carbs || 0}g</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">Fat</span>
                            <span class="font-bold">${DashboardState.currentDietPlan?.target_fat || 0}g</span>
                        </div>
                    </div>
                </div>

                <!-- Ayurvedic Guidelines -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-leaf mr-2 text-green-600"></i>
                        Ayurvedic Guidelines
                    </h3>
                    <div class="space-y-3">
                        <div>
                            <span class="text-sm font-medium text-gray-600">Focus:</span>
                            <span class="ml-2 px-3 py-1 bg-pitta-100 text-pitta-600 rounded-full text-sm">
                                ${DashboardState.currentDietPlan?.dosha_focus || 'Loading...'}
                            </span>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-gray-600">Thermal Preference:</span>
                            <span class="ml-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm thermal-cold">
                                <i class="fas fa-snowflake mr-1"></i>
                                ${DashboardState.currentDietPlan?.thermal_preference || 'Cooling'}
                            </span>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-gray-600 block mb-2">Emphasize Tastes:</span>
                            <div class="flex flex-wrap gap-2">
                                ${generateRasaTags(DashboardState.currentDietPlan?.primary_rasa || [])}
                            </div>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-gray-600 block mb-2">Avoid Tastes:</span>
                            <div class="flex flex-wrap gap-2">
                                ${generateRasaTags(DashboardState.currentDietPlan?.avoid_rasa || [], true)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Today's Meal Plan -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                        <i class="fas fa-utensils mr-2 text-orange-600"></i>
                        Today's Meal Plan
                    </h3>
                    <div class="flex space-x-2">
                        <button onclick="generateTodaysPlan()" class="interactive-button text-sm">
                            <i class="fas fa-magic mr-1"></i>
                            Generate Plan
                        </button>
                        <button onclick="printMealPlan()" class="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm">
                            <i class="fas fa-print mr-1"></i>
                            Print
                        </button>
                    </div>
                </div>
                <div id="todays-meal-plan">
                    ${generateTodaysMealPlan()}
                </div>
            </div>

            <!-- Meal Timing Guidelines -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <i class="fas fa-clock mr-2 text-purple-600"></i>
                    Meal Timing & Portions
                </h3>
                <div class="prose max-w-none">
                    ${DashboardState.currentDietPlan?.meal_timing || '<p>Loading meal timing guidelines...</p>'}
                </div>
            </div>

            <!-- Special Instructions -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <i class="fas fa-exclamation-circle mr-2 text-yellow-600"></i>
                    Special Instructions
                </h3>
                <div class="prose max-w-none">
                    ${DashboardState.currentDietPlan?.special_instructions || '<p>Loading special instructions...</p>'}
                </div>
            </div>
        </div>
    `;
}

// Progress Section
function loadProgressSection() {
    const section = document.getElementById('progress-section');
    if (!section) return;
    
    section.innerHTML = `
        <div class="space-y-6">
            <!-- Progress Header -->
            <div class="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border border-blue-200">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Progress Analytics</h2>
                <p class="text-gray-600">Track your health journey and diet compliance</p>
            </div>

            <!-- Progress Charts -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Weight Progress -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-chart-line mr-2 text-blue-600"></i>
                        Weight Progress
                    </h3>
                    <div class="chart-container">
                        <canvas id="weightChart"></canvas>
                    </div>
                </div>

                <!-- Energy & Mood Tracking -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-battery-three-quarters mr-2 text-green-600"></i>
                        Energy & Mood
                    </h3>
                    <div class="chart-container">
                        <canvas id="moodChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- Compliance Tracking -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <i class="fas fa-chart-pie mr-2 text-purple-600"></i>
                    Diet Compliance Trends
                </h3>
                <div class="chart-container">
                    <canvas id="complianceChart"></canvas>
                </div>
            </div>

            <!-- Health Metrics Summary -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white rounded-lg shadow-md p-6 text-center">
                    <i class="fas fa-trendline-up text-3xl text-green-500 mb-3"></i>
                    <h4 class="text-lg font-semibold text-gray-800">Weight Change</h4>
                    <p class="text-2xl font-bold text-green-600">-0.6 kg</p>
                    <p class="text-sm text-gray-600">Last 30 days</p>
                </div>
                <div class="bg-white rounded-lg shadow-md p-6 text-center">
                    <i class="fas fa-chart-line text-3xl text-blue-500 mb-3"></i>
                    <h4 class="text-lg font-semibold text-gray-800">Avg. Compliance</h4>
                    <p class="text-2xl font-bold text-blue-600">87%</p>
                    <p class="text-sm text-gray-600">Last 30 days</p>
                </div>
                <div class="bg-white rounded-lg shadow-md p-6 text-center">
                    <i class="fas fa-battery-full text-3xl text-yellow-500 mb-3"></i>
                    <h4 class="text-lg font-semibold text-gray-800">Energy Level</h4>
                    <p class="text-2xl font-bold text-yellow-600">High</p>
                    <p class="text-sm text-gray-600">Current status</p>
                </div>
            </div>
        </div>
    `;
    
    // Initialize progress charts
    setTimeout(() => {
        initializeProgressCharts();
    }, 100);
}

// Recipes Section
function loadRecipesSection() {
    const section = document.getElementById('recipes-section');
    if (!section) return;
    
    section.innerHTML = `
        <div class="space-y-6">
            <!-- Recipes Header -->
            <div class="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
                <div class="flex justify-between items-start">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800 mb-2">Ayurvedic Recipes</h2>
                        <p class="text-gray-600">Personalized recipes for your dosha type and dietary goals</p>
                    </div>
                    <button onclick="addNewRecipe()" class="interactive-button">
                        <i class="fas fa-plus mr-1"></i>
                        Add Recipe
                    </button>
                </div>
            </div>

            <!-- Recipe Filters -->
            <div class="bg-white rounded-lg shadow-md p-4">
                <div class="flex flex-wrap gap-4 items-center">
                    <div>
                        <label class="text-sm text-gray-600 block mb-1">Category</label>
                        <select class="border border-gray-300 rounded px-3 py-1 text-sm">
                            <option>All Categories</option>
                            <option>Breakfast</option>
                            <option>Lunch</option>
                            <option>Dinner</option>
                            <option>Snack</option>
                            <option>Beverage</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-sm text-gray-600 block mb-1">Dosha Type</label>
                        <select class="border border-gray-300 rounded px-3 py-1 text-sm">
                            <option>All Doshas</option>
                            <option>Vata Balancing</option>
                            <option>Pitta Balancing</option>
                            <option>Kapha Balancing</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-sm text-gray-600 block mb-1">Thermal Effect</label>
                        <select class="border border-gray-300 rounded px-3 py-1 text-sm">
                            <option>All Types</option>
                            <option>Cooling</option>
                            <option>Warming</option>
                            <option>Neutral</option>
                        </select>
                    </div>
                    <div class="ml-auto">
                        <button onclick="filterRecipes()" class="interactive-button text-sm">
                            <i class="fas fa-search mr-1"></i>
                            Filter
                        </button>
                    </div>
                </div>
            </div>

            <!-- Recipe Grid -->
            <div id="recipe-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${generateSampleRecipes()}
            </div>
        </div>
    `;
}

// Communication Section
function loadCommunicationSection() {
    const section = document.getElementById('communication-section');
    if (!section) return;
    
    section.innerHTML = `
        <div class="space-y-6">
            <!-- Communication Header -->
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Communication Center</h2>
                <p class="text-gray-600">Connect with your dietitian and schedule appointments</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Chat Section -->
                <div class="lg:col-span-2 bg-white rounded-lg shadow-md">
                    <div class="p-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                            <i class="fas fa-comments mr-2 text-blue-600"></i>
                            Chat with Dr. Sunita Rao
                        </h3>
                        <p class="text-sm text-green-600 mt-1">
                            <i class="fas fa-circle text-xs mr-1"></i>
                            Online now
                        </p>
                    </div>
                    <div class="h-96 p-4 overflow-y-auto custom-scrollbar" id="chat-messages">
                        ${generateSampleChat()}
                    </div>
                    <div class="p-4 border-t border-gray-200">
                        <div class="flex space-x-2">
                            <input type="text" placeholder="Type your message..." class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" id="chat-input">
                            <button onclick="sendMessage()" class="interactive-button">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="space-y-6">
                    <!-- Quick Actions -->
                    <div class="bg-white rounded-lg shadow-md p-4">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                        <div class="space-y-3">
                            <button onclick="scheduleAppointment()" class="w-full text-left flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                <i class="fas fa-calendar-plus text-blue-600 mr-3"></i>
                                <span class="text-sm">Schedule Appointment</span>
                            </button>
                            <button onclick="requestDietChange()" class="w-full text-left flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                <i class="fas fa-edit text-green-600 mr-3"></i>
                                <span class="text-sm">Request Diet Change</span>
                            </button>
                            <button onclick="reportSymptoms()" class="w-full text-left flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                <i class="fas fa-exclamation-triangle text-yellow-600 mr-3"></i>
                                <span class="text-sm">Report Symptoms</span>
                            </button>
                        </div>
                    </div>

                    <!-- Upcoming Appointments -->
                    <div class="bg-white rounded-lg shadow-md p-4">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">Upcoming</h3>
                        <div class="space-y-3">
                            <div class="p-3 bg-blue-50 rounded-lg">
                                <p class="text-sm font-medium text-blue-800">Follow-up Consultation</p>
                                <p class="text-xs text-blue-600 mt-1">
                                    <i class="fas fa-calendar mr-1"></i>
                                    Jan 25, 2024 at 10:00 AM
                                </p>
                            </div>
                            <div class="p-3 bg-green-50 rounded-lg">
                                <p class="text-sm font-medium text-green-800">Diet Plan Review</p>
                                <p class="text-xs text-green-600 mt-1">
                                    <i class="fas fa-calendar mr-1"></i>
                                    Feb 5, 2024 at 2:00 PM
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Notifications -->
                    <div class="bg-white rounded-lg shadow-md p-4">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
                        <div class="space-y-3">
                            <div class="p-3 bg-yellow-50 rounded-lg">
                                <p class="text-sm text-yellow-800">Diet plan updated</p>
                                <p class="text-xs text-yellow-600 mt-1">2 hours ago</p>
                            </div>
                            <div class="p-3 bg-blue-50 rounded-lg">
                                <p class="text-sm text-blue-800">New message received</p>
                                <p class="text-xs text-blue-600 mt-1">1 day ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Helper functions for generating content
function generateRasaTags(rasaArray, isAvoid = false) {
    if (!Array.isArray(rasaArray)) return '';
    
    return rasaArray.map(rasa => {
        const colorClass = isAvoid ? 'bg-red-100 text-red-600' : getRasaColorClass(rasa);
        return `<span class="px-2 py-1 rounded-full text-xs ${colorClass}">${rasa}</span>`;
    }).join('');
}

function getRasaColorClass(rasa) {
    const colorMap = {
        'Sweet': 'bg-yellow-100 text-yellow-600',
        'Sour': 'bg-orange-100 text-orange-600', 
        'Salty': 'bg-blue-100 text-blue-600',
        'Pungent': 'bg-red-100 text-red-600',
        'Bitter': 'bg-green-100 text-green-600',
        'Astringent': 'bg-purple-100 text-purple-600'
    };
    return colorMap[rasa] || 'bg-gray-100 text-gray-600';
}

function generateTodaysMealPlan() {
    return `
        <div class="space-y-4">
            ${generateMealCard('Breakfast', '7:30 AM', [
                { name: 'Oats Porridge with Almonds', calories: 320, rasa: 'Sweet', thermal: 'Neutral' },
                { name: 'Fresh Cucumber Juice', calories: 45, rasa: 'Sweet', thermal: 'Cold' }
            ])}
            ${generateMealCard('Mid-Morning', '10:00 AM', [
                { name: 'Coconut Water', calories: 60, rasa: 'Sweet', thermal: 'Cold' }
            ])}
            ${generateMealCard('Lunch', '12:30 PM', [
                { name: 'Basmati Rice', calories: 180, rasa: 'Sweet', thermal: 'Cold' },
                { name: 'Moong Dal Curry', calories: 150, rasa: 'Sweet', thermal: 'Warm' },
                { name: 'Steamed Vegetables', calories: 80, rasa: 'Sweet, Bitter', thermal: 'Cold' }
            ])}
            ${generateMealCard('Evening Snack', '4:00 PM', [
                { name: 'Herbal Tea with Mint', calories: 25, rasa: 'Bitter', thermal: 'Cold' }
            ])}
            ${generateMealCard('Dinner', '7:30 PM', [
                { name: 'Quinoa Salad', calories: 220, rasa: 'Sweet, Bitter', thermal: 'Cold' },
                { name: 'Bitter Gourd Sabji', calories: 95, rasa: 'Bitter', thermal: 'Cold' }
            ])}
        </div>
    `;
}

function generateMealCard(mealType, time, foods) {
    const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);
    
    return `
        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-center mb-3">
                <div>
                    <h4 class="font-medium text-gray-800">${mealType}</h4>
                    <p class="text-sm text-gray-600">${time}</p>
                </div>
                <div class="text-right">
                    <p class="text-sm font-medium">${totalCalories} cal</p>
                    <button onclick="swapMeal('${mealType}')" class="text-xs text-blue-600 hover:text-blue-800">
                        <i class="fas fa-exchange-alt mr-1"></i>Swap
                    </button>
                </div>
            </div>
            <div class="space-y-2">
                ${foods.map(food => `
                    <div class="flex justify-between items-center text-sm">
                        <span>${food.name}</span>
                        <div class="flex items-center space-x-2">
                            <span class="thermal-${food.thermal.toLowerCase()} px-2 py-1 rounded text-xs">
                                ${food.thermal}
                            </span>
                            <span class="text-gray-500">${food.calories} cal</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function generateSampleRecipes() {
    const recipes = [
        {
            name: 'Cooling Cucumber Raita',
            category: 'Side Dish',
            thermal: 'Cooling',
            time: '10 min',
            difficulty: 'Easy',
            dosha: 'Pitta Balancing'
        },
        {
            name: 'Warming Ginger Tea',
            category: 'Beverage', 
            thermal: 'Warming',
            time: '5 min',
            difficulty: 'Easy',
            dosha: 'Vata Balancing'
        },
        {
            name: 'Light Moong Dal Soup',
            category: 'Main Course',
            thermal: 'Neutral',
            time: '25 min', 
            difficulty: 'Medium',
            dosha: 'Kapha Balancing'
        }
    ];
    
    return recipes.map(recipe => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onclick="openRecipe('${recipe.name}')">
            <div class="h-48 bg-gradient-to-br from-green-100 to-yellow-100 flex items-center justify-center">
                <i class="fas fa-utensils text-4xl text-gray-400"></i>
            </div>
            <div class="p-4">
                <h4 class="font-semibold text-gray-800 mb-2">${recipe.name}</h4>
                <div class="flex justify-between items-center text-sm text-gray-600 mb-2">
                    <span>${recipe.category}</span>
                    <span>${recipe.time}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">${recipe.dosha}</span>
                    <span class="thermal-${recipe.thermal.toLowerCase()} px-2 py-1 rounded text-xs">${recipe.thermal}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function generateSampleChat() {
    return `
        <div class="space-y-4">
            <div class="flex justify-start">
                <div class="bg-gray-100 rounded-lg p-3 max-w-xs">
                    <p class="text-sm">Good morning Priya! How are you feeling today? Any changes in your energy levels?</p>
                    <p class="text-xs text-gray-500 mt-1">Dr. Sunita - 9:00 AM</p>
                </div>
            </div>
            <div class="flex justify-end">
                <div class="bg-green-100 rounded-lg p-3 max-w-xs">
                    <p class="text-sm">Good morning Doctor! I'm feeling much better. My energy levels have improved significantly since starting the new diet plan.</p>
                    <p class="text-xs text-gray-500 mt-1">You - 9:05 AM</p>
                </div>
            </div>
            <div class="flex justify-start">
                <div class="bg-gray-100 rounded-lg p-3 max-w-xs">
                    <p class="text-sm">That's wonderful to hear! Are you following the meal timings we discussed? And how's your sleep quality?</p>
                    <p class="text-xs text-gray-500 mt-1">Dr. Sunita - 9:07 AM</p>
                </div>
            </div>
            <div class="flex justify-end">
                <div class="bg-green-100 rounded-lg p-3 max-w-xs">
                    <p class="text-sm">Yes, I'm following the timings mostly. Sleep has improved too. I have one question about the bitter gourd recipe...</p>
                    <p class="text-xs text-gray-500 mt-1">You - 9:10 AM</p>
                </div>
            </div>
        </div>
    `;
}

// Interactive functions
function swapMeal(mealType) {
    showNotification(`Meal swap feature for ${mealType} will be implemented`, 'info');
}

function generateTodaysPlan() {
    showLoader();
    setTimeout(() => {
        hideLoader();
        showNotification('Meal plan regenerated based on your preferences!', 'success');
    }, 2000);
}

function printMealPlan() {
    window.print();
}

function addNewRecipe() {
    showNotification('Recipe creation form will open', 'info');
}

function filterRecipes() {
    showNotification('Applying recipe filters...', 'info');
}

function openRecipe(recipeName) {
    showNotification(`Opening recipe: ${recipeName}`, 'info');
}

function scheduleAppointment() {
    showNotification('Appointment scheduling will open', 'info');
}

function requestDietChange() {
    showNotification('Diet change request form will open', 'info');
}

function reportSymptoms() {
    showNotification('Symptom reporting form will open', 'info');
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    if (input && input.value.trim()) {
        const message = input.value;
        input.value = '';
        
        // Add message to chat (simplified)
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'flex justify-end';
            messageDiv.innerHTML = `
                <div class="bg-green-100 rounded-lg p-3 max-w-xs">
                    <p class="text-sm">${message}</p>
                    <p class="text-xs text-gray-500 mt-1">You - just now</p>
                </div>
            `;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        showNotification('Message sent!', 'success');
    }
}

// Utility functions
function showLoader() {
    // Simple loader implementation
    const loader = document.createElement('div');
    loader.id = 'dashboard-loader';
    loader.className = 'fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50';
    loader.innerHTML = `
        <div class="text-center">
            <div class="loading-spinner mb-4"></div>
            <p class="text-gray-600">Loading dashboard...</p>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoader() {
    const loader = document.getElementById('dashboard-loader');
    if (loader) {
        loader.remove();
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="flex justify-between items-start">
            <div>
                <p class="text-sm font-medium text-gray-800">${message}</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="text-gray-400 hover:text-gray-600">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function updatePatientProfile() {
    // Update patient profile information in the dashboard
    if (DashboardState.currentPatient) {
        // This would update the UI with current patient data
        console.log('Patient profile updated:', DashboardState.currentPatient.name);
    }
}

function updateDietSummary() {
    // Update diet summary information
    if (DashboardState.currentDietPlan) {
        console.log('Diet summary updated:', DashboardState.currentDietPlan.plan_name);
    }
}

function updateProgressCharts() {
    // Update progress charts with latest data
    if (DashboardState.progressData.length > 0) {
        console.log('Progress charts updated with', DashboardState.progressData.length, 'records');
    }
}

function loadNotifications() {
    // Load and display notifications
    DashboardState.notifications = [
        { message: 'Diet plan compliance is excellent!', type: 'success', time: new Date() },
        { message: 'Remember to drink more water', type: 'warning', time: new Date() }
    ];
}

// Initialize charts placeholder
function initializeCharts() {
    // This will be implemented in charts.js
    console.log('Initializing dashboard charts...');
}

function initializeProgressCharts() {
    // This will be implemented in charts.js for progress section
    console.log('Initializing progress charts...');
}