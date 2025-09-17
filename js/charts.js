// Ayurvedic Diet Dashboard - Charts and Data Visualization

// Chart instances storage
const ChartInstances = {
    calorieChart: null,
    weightChart: null,
    moodChart: null,
    complianceChart: null
};

// Chart colors and themes
const ChartThemes = {
    ayurveda: {
        vata: '#0ea5e9',
        pitta: '#ef4444',
        kapha: '#22c55e',
        primary: '#84cc16',
        secondary: '#f59e0b',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
    },
    gradients: {
        success: ['rgba(16, 185, 129, 0.8)', 'rgba(16, 185, 129, 0.2)'],
        primary: ['rgba(132, 204, 22, 0.8)', 'rgba(132, 204, 22, 0.2)'],
        warning: ['rgba(245, 158, 11, 0.8)', 'rgba(245, 158, 11, 0.2)'],
        error: ['rgba(239, 68, 68, 0.8)', 'rgba(239, 68, 68, 0.2)']
    }
};

// Initialize all charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeCharts, 500); // Small delay to ensure elements are rendered
});

// Main chart initialization function
function initializeCharts() {
    try {
        initializeCalorieChart();
        console.log('Dashboard charts initialized successfully');
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

// Initialize progress charts (called from progress section)
function initializeProgressCharts() {
    try {
        initializeWeightChart();
        initializeMoodChart();
        initializeComplianceChart();
        console.log('Progress charts initialized successfully');
    } catch (error) {
        console.error('Error initializing progress charts:', error);
    }
}

// Calorie Progress Doughnut Chart (Dashboard)
function initializeCalorieChart() {
    const canvas = document.getElementById('calorieChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (ChartInstances.calorieChart) {
        ChartInstances.calorieChart.destroy();
    }

    const consumed = 1850;
    const target = 2000;
    const remaining = target - consumed;
    
    ChartInstances.calorieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Consumed', 'Remaining'],
            datasets: [{
                data: [consumed, remaining],
                backgroundColor: [
                    ChartThemes.ayurveda.success,
                    '#e5e7eb'
                ],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + ' kcal';
                        }
                    }
                }
            }
        }
    });
}

// Weight Progress Line Chart
function initializeWeightChart() {
    const canvas = document.getElementById('weightChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (ChartInstances.weightChart) {
        ChartInstances.weightChart.destroy();
    }

    // Sample weight data for the last 30 days
    const weightData = generateWeightData();
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, ChartThemes.gradients.primary[0]);
    gradient.addColorStop(1, ChartThemes.gradients.primary[1]);

    ChartInstances.weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: weightData.labels,
            datasets: [{
                label: 'Weight (kg)',
                data: weightData.weights,
                borderColor: ChartThemes.ayurveda.primary,
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: ChartThemes.ayurveda.primary,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: ChartThemes.ayurveda.primary,
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 7
                    }
                },
                y: {
                    display: true,
                    grid: {
                        color: '#f3f4f6'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + ' kg';
                        }
                    },
                    min: Math.min(...weightData.weights) - 1,
                    max: Math.max(...weightData.weights) + 1
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Energy & Mood Multi-line Chart
function initializeMoodChart() {
    const canvas = document.getElementById('moodChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (ChartInstances.moodChart) {
        ChartInstances.moodChart.destroy();
    }

    const moodData = generateMoodData();

    ChartInstances.moodChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: moodData.labels,
            datasets: [
                {
                    label: 'Energy Level',
                    data: moodData.energy,
                    borderColor: ChartThemes.ayurveda.warning,
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: ChartThemes.ayurveda.warning,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                },
                {
                    label: 'Mood',
                    data: moodData.mood,
                    borderColor: ChartThemes.ayurveda.success,
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: ChartThemes.ayurveda.success,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                },
                {
                    label: 'Sleep Quality',
                    data: moodData.sleep,
                    borderColor: ChartThemes.ayurveda.vata,
                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: ChartThemes.ayurveda.vata,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff'
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 7
                    }
                },
                y: {
                    display: true,
                    grid: {
                        color: '#f3f4f6'
                    },
                    min: 1,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
                            return labels[value];
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Compliance Tracking Bar Chart
function initializeComplianceChart() {
    const canvas = document.getElementById('complianceChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (ChartInstances.complianceChart) {
        ChartInstances.complianceChart.destroy();
    }

    const complianceData = generateComplianceData();

    ChartInstances.complianceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: complianceData.labels,
            datasets: [
                {
                    label: 'Diet Compliance (%)',
                    data: complianceData.compliance,
                    backgroundColor: complianceData.compliance.map(value => {
                        if (value >= 90) return ChartThemes.ayurveda.success;
                        if (value >= 75) return ChartThemes.ayurveda.primary;
                        if (value >= 60) return ChartThemes.ayurveda.warning;
                        return ChartThemes.ayurveda.error;
                    }),
                    borderRadius: 4,
                    borderSkipped: false,
                },
                {
                    label: 'Exercise Compliance (%)',
                    data: complianceData.exercise,
                    backgroundColor: complianceData.exercise.map(value => {
                        if (value >= 90) return 'rgba(16, 185, 129, 0.6)';
                        if (value >= 75) return 'rgba(132, 204, 22, 0.6)';
                        if (value >= 60) return 'rgba(245, 158, 11, 0.6)';
                        return 'rgba(239, 68, 68, 0.6)';
                    }),
                    borderRadius: 4,
                    borderSkipped: false,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: false
                    }
                },
                y: {
                    display: true,
                    grid: {
                        color: '#f3f4f6'
                    },
                    min: 0,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Data generation functions
function generateWeightData() {
    const labels = [];
    const weights = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 29); // Last 30 days
    
    let currentWeight = 62.1; // Starting weight
    
    for (let i = 0; i < 30; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Simulate gradual weight loss with some fluctuation
        currentWeight += (Math.random() - 0.7) * 0.3; // Slight downward trend with variation
        currentWeight = Math.max(60.5, Math.min(62.5, currentWeight)); // Keep within reasonable bounds
        weights.push(parseFloat(currentWeight.toFixed(1)));
    }
    
    return { labels, weights };
}

function generateMoodData() {
    const labels = [];
    const energy = [];
    const mood = [];
    const sleep = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 13); // Last 14 days
    
    for (let i = 0; i < 14; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Simulate improving trends with some variation
        const baseImprovement = i * 0.1; // Gradual improvement over time
        
        energy.push(Math.min(5, Math.max(1, 2.5 + baseImprovement + (Math.random() - 0.5) * 0.8)));
        mood.push(Math.min(5, Math.max(1, 3 + baseImprovement + (Math.random() - 0.5) * 0.6)));
        sleep.push(Math.min(5, Math.max(1, 3.2 + baseImprovement + (Math.random() - 0.5) * 0.7)));
    }
    
    return { labels, energy, mood, sleep };
}

function generateComplianceData() {
    const labels = [];
    const compliance = [];
    const exercise = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 20); // Last 3 weeks
    
    for (let i = 0; i < 21; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Simulate improving compliance over time
        const baseCompliance = Math.min(95, 65 + (i * 1.5)); // Gradual improvement
        const dailyVariation = (Math.random() - 0.5) * 20; // Daily variation
        
        compliance.push(Math.max(50, Math.min(100, baseCompliance + dailyVariation)));
        
        // Exercise compliance generally lower but improving
        const exerciseBase = Math.min(90, 55 + (i * 1.2));
        const exerciseVariation = (Math.random() - 0.5) * 25;
        
        exercise.push(Math.max(40, Math.min(100, exerciseBase + exerciseVariation)));
    }
    
    return { labels, compliance, exercise };
}

// Dosha Balance Radar Chart (for detailed view)
function initializeDoshaChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Vata', 'Pitta', 'Kapha'],
            datasets: [{
                label: 'Current Balance',
                data: [25, 55, 20],
                backgroundColor: 'rgba(132, 204, 22, 0.2)',
                borderColor: ChartThemes.ayurveda.primary,
                borderWidth: 2,
                pointBackgroundColor: ChartThemes.ayurveda.primary,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6
            }, {
                label: 'Ideal Balance',
                data: [30, 40, 30],
                backgroundColor: 'rgba(156, 163, 175, 0.1)',
                borderColor: '#9ca3af',
                borderWidth: 2,
                borderDash: [5, 5],
                pointBackgroundColor: '#9ca3af',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: '#e5e7eb'
                    },
                    angleLines: {
                        color: '#e5e7eb'
                    },
                    pointLabels: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    });
}

// Nutrient Breakdown Pie Chart
function initializeNutrientChart(canvasId, data = null) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const defaultData = {
        protein: 65,
        carbs: 225,
        fat: 58,
        fiber: 28
    };
    
    const chartData = data || defaultData;
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Protein', 'Carbohydrates', 'Fat', 'Fiber'],
            datasets: [{
                data: [chartData.protein, chartData.carbs, chartData.fat, chartData.fiber],
                backgroundColor: [
                    ChartThemes.ayurveda.pitta,
                    ChartThemes.ayurveda.kapha,
                    ChartThemes.ayurveda.warning,
                    ChartThemes.ayurveda.vata
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + 'g';
                        }
                    }
                }
            }
        }
    });
}

// Rasa (Taste) Distribution Chart
function initializeRasaChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: ['Sweet', 'Sour', 'Salty', 'Pungent', 'Bitter', 'Astringent'],
            datasets: [{
                data: [35, 12, 10, 20, 15, 8],
                backgroundColor: [
                    'rgba(245, 158, 11, 0.7)',  // Sweet - Yellow
                    'rgba(249, 115, 22, 0.7)',  // Sour - Orange
                    'rgba(59, 130, 246, 0.7)',  // Salty - Blue
                    'rgba(239, 68, 68, 0.7)',   // Pungent - Red
                    'rgba(34, 197, 94, 0.7)',   // Bitter - Green
                    'rgba(147, 51, 234, 0.7)'   // Astringent - Purple
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        padding: 12
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 40,
                    ticks: {
                        display: false
                    },
                    grid: {
                        color: '#e5e7eb'
                    }
                }
            }
        }
    });
}

// Chart update functions
function updateCalorieProgress(consumed, target) {
    if (ChartInstances.calorieChart) {
        const remaining = Math.max(0, target - consumed);
        ChartInstances.calorieChart.data.datasets[0].data = [consumed, remaining];
        ChartInstances.calorieChart.update('none'); // No animation for real-time updates
    }
}

function updateWeightChart(newWeightData) {
    if (ChartInstances.weightChart) {
        ChartInstances.weightChart.data.labels = newWeightData.labels;
        ChartInstances.weightChart.data.datasets[0].data = newWeightData.weights;
        ChartInstances.weightChart.update();
    }
}

function addComplianceDataPoint(date, dietCompliance, exerciseCompliance) {
    if (ChartInstances.complianceChart) {
        const chart = ChartInstances.complianceChart;
        
        // Add new data point
        chart.data.labels.push(date);
        chart.data.datasets[0].data.push(dietCompliance);
        chart.data.datasets[1].data.push(exerciseCompliance);
        
        // Remove old data if we have too many points
        if (chart.data.labels.length > 21) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
            chart.data.datasets[1].data.shift();
        }
        
        chart.update();
    }
}

// Cleanup function for chart instances
function destroyAllCharts() {
    Object.keys(ChartInstances).forEach(key => {
        if (ChartInstances[key]) {
            ChartInstances[key].destroy();
            ChartInstances[key] = null;
        }
    });
}

// Responsive chart handling
window.addEventListener('resize', function() {
    setTimeout(() => {
        Object.keys(ChartInstances).forEach(key => {
            if (ChartInstances[key]) {
                ChartInstances[key].resize();
            }
        });
    }, 100);
});

// Export chart data as image (for reports)
function exportChartAsImage(chartInstance, filename) {
    if (chartInstance) {
        const canvas = chartInstance.canvas;
        const link = document.createElement('a');
        link.download = filename || 'chart.png';
        link.href = canvas.toDataURL();
        link.click();
    }
}