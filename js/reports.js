// Ayurvedic Diet Dashboard - PDF Reports Generation

// PDF Report Generator using jsPDF
class AyurvedaReportGenerator {
    constructor() {
        this.doc = null;
        this.pageHeight = 297; // A4 height in mm
        this.pageWidth = 210; // A4 width in mm
        this.margin = 20;
        this.currentY = this.margin;
        this.lineHeight = 6;
        
        // Colors matching our Ayurvedic theme
        this.colors = {
            primary: '#84cc16',
            secondary: '#22c55e', 
            accent: '#f59e0b',
            text: '#374151',
            lightGray: '#f3f4f6',
            vata: '#0ea5e9',
            pitta: '#ef4444', 
            kapha: '#22c55e'
        };
    }

    // Initialize new PDF document
    initDocument() {
        this.doc = new jsPDF();
        this.currentY = this.margin;
    }

    // Check if we need a new page
    checkPageBreak(neededHeight = 20) {
        if (this.currentY + neededHeight > this.pageHeight - this.margin) {
            this.doc.addPage();
            this.currentY = this.margin;
            return true;
        }
        return false;
    }

    // Add header with logo and title
    addHeader(title, subtitle) {
        // Logo area (placeholder)
        this.doc.setFontSize(16);
        this.doc.setTextColor(this.colors.primary);
        this.doc.text('🍃 AyurDiet Pro', this.margin, this.currentY);
        
        // Title
        this.doc.setFontSize(20);
        this.doc.setTextColor(this.colors.text);
        this.doc.text(title, this.margin, this.currentY + 15);
        
        // Subtitle
        if (subtitle) {
            this.doc.setFontSize(12);
            this.doc.setTextColor('#6b7280');
            this.doc.text(subtitle, this.margin, this.currentY + 25);
        }
        
        // Date
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long', 
            day: 'numeric'
        });
        this.doc.setFontSize(10);
        this.doc.text(`Generated on: ${currentDate}`, this.pageWidth - 60, this.currentY + 10);
        
        // Line separator
        this.doc.setDrawColor('#e5e7eb');
        this.doc.line(this.margin, this.currentY + 35, this.pageWidth - this.margin, this.currentY + 35);
        
        this.currentY += 45;
    }

    // Add section header
    addSectionHeader(title, icon = '') {
        this.checkPageBreak(15);
        
        this.doc.setFontSize(14);
        this.doc.setTextColor(this.colors.primary);
        this.doc.text(`${icon} ${title}`, this.margin, this.currentY);
        
        // Underline
        this.doc.setDrawColor(this.colors.primary);
        this.doc.line(this.margin, this.currentY + 2, this.margin + 50, this.currentY + 2);
        
        this.currentY += 12;
    }

    // Add patient information section
    addPatientInfo(patient) {
        this.addSectionHeader('Patient Information', '👤');
        
        const info = [
            [`Name:`, patient.name || 'N/A'],
            [`Age:`, `${patient.age || 'N/A'} years`],
            [`Gender:`, patient.gender || 'N/A'],
            [`Height:`, `${patient.height || 'N/A'} cm`],
            [`Weight:`, `${patient.weight || 'N/A'} kg`],
            [`BMI:`, patient.bmi || 'N/A'],
            [`Dominant Dosha:`, patient.dominant_dosha || 'N/A'],
            [`Dietary Preference:`, patient.dietary_preference || 'N/A']
        ];
        
        this.doc.setFontSize(10);
        info.forEach(([label, value]) => {
            this.doc.setTextColor(this.colors.text);
            this.doc.text(label, this.margin, this.currentY);
            this.doc.setTextColor('#000000');
            this.doc.text(value, this.margin + 40, this.currentY);
            this.currentY += this.lineHeight;
        });
        
        this.currentY += 10;
    }

    // Add diet plan summary
    addDietPlanSummary(dietPlan) {
        this.addSectionHeader('Current Diet Plan', '🍽️');
        
        this.doc.setFontSize(12);
        this.doc.setTextColor('#000000');
        this.doc.text(dietPlan.plan_name || 'N/A', this.margin, this.currentY);
        
        this.currentY += 10;
        
        const planInfo = [
            [`Start Date:`, new Date(dietPlan.start_date).toLocaleDateString()],
            [`Status:`, dietPlan.status || 'N/A'],
            [`Dosha Focus:`, dietPlan.dosha_focus || 'N/A'],
            [`Thermal Preference:`, dietPlan.thermal_preference || 'N/A'],
            [`Target Calories:`, `${dietPlan.target_calories || 0} kcal/day`],
            [`Target Protein:`, `${dietPlan.target_protein || 0}g/day`],
            [`Target Carbs:`, `${dietPlan.target_carbs || 0}g/day`],
            [`Target Fat:`, `${dietPlan.target_fat || 0}g/day`]
        ];
        
        this.doc.setFontSize(10);
        planInfo.forEach(([label, value]) => {
            this.doc.setTextColor(this.colors.text);
            this.doc.text(label, this.margin, this.currentY);
            this.doc.setTextColor('#000000');
            this.doc.text(value, this.margin + 50, this.currentY);
            this.currentY += this.lineHeight;
        });
        
        this.currentY += 10;
    }

    // Add progress summary
    addProgressSummary(progressData) {
        this.addSectionHeader('Progress Summary', '📊');
        
        if (progressData && progressData.length > 0) {
            const latest = progressData[0];
            const oldest = progressData[progressData.length - 1];
            
            // Weight change calculation
            const weightChange = latest.weight - oldest.weight;
            const weightChangeText = weightChange > 0 ? `+${weightChange.toFixed(1)} kg` : `${weightChange.toFixed(1)} kg`;
            
            // Average compliance
            const avgCompliance = progressData.reduce((sum, record) => sum + record.compliance_percentage, 0) / progressData.length;
            
            const summary = [
                [`Period:`, `${new Date(oldest.date).toLocaleDateString()} to ${new Date(latest.date).toLocaleDateString()}`],
                [`Weight Change:`, weightChangeText],
                [`Current Weight:`, `${latest.weight} kg`],
                [`Current BMI:`, latest.bmi.toString()],
                [`Average Compliance:`, `${avgCompliance.toFixed(1)}%`],
                [`Current Energy Level:`, latest.energy_level || 'N/A'],
                [`Sleep Quality:`, latest.sleep_quality || 'N/A'],
                [`Stress Level:`, latest.stress_level || 'N/A']
            ];
            
            this.doc.setFontSize(10);
            summary.forEach(([label, value]) => {
                this.doc.setTextColor(this.colors.text);
                this.doc.text(label, this.margin, this.currentY);
                this.doc.setTextColor('#000000');
                this.doc.text(value, this.margin + 60, this.currentY);
                this.currentY += this.lineHeight;
            });
        } else {
            this.doc.setFontSize(10);
            this.doc.setTextColor(this.colors.text);
            this.doc.text('No progress data available', this.margin, this.currentY);
        }
        
        this.currentY += 10;
    }

    // Add meal plan for specific date
    addDailyMealPlan(date) {
        this.checkPageBreak(80);
        this.addSectionHeader(`Meal Plan - ${date}`, '🍴');
        
        const meals = [
            {
                type: 'Breakfast',
                time: '7:30 AM',
                items: ['Oats Porridge with Almonds (320 cal)', 'Fresh Cucumber Juice (45 cal)'],
                totalCal: 365
            },
            {
                type: 'Mid-Morning',
                time: '10:00 AM', 
                items: ['Coconut Water (60 cal)'],
                totalCal: 60
            },
            {
                type: 'Lunch',
                time: '12:30 PM',
                items: ['Basmati Rice (180 cal)', 'Moong Dal Curry (150 cal)', 'Steamed Vegetables (80 cal)'],
                totalCal: 410
            },
            {
                type: 'Evening Snack',
                time: '4:00 PM',
                items: ['Herbal Tea with Mint (25 cal)'],
                totalCal: 25
            },
            {
                type: 'Dinner',
                time: '7:30 PM',
                items: ['Quinoa Salad (220 cal)', 'Bitter Gourd Sabji (95 cal)'],
                totalCal: 315
            }
        ];
        
        meals.forEach(meal => {
            this.checkPageBreak(20);
            
            // Meal header
            this.doc.setFontSize(11);
            this.doc.setTextColor(this.colors.primary);
            this.doc.text(`${meal.type} (${meal.time})`, this.margin, this.currentY);
            this.doc.setTextColor(this.colors.text);
            this.doc.text(`Total: ${meal.totalCal} cal`, this.pageWidth - 50, this.currentY);
            
            this.currentY += 8;
            
            // Meal items
            this.doc.setFontSize(9);
            this.doc.setTextColor('#000000');
            meal.items.forEach(item => {
                this.doc.text(`• ${item}`, this.margin + 5, this.currentY);
                this.currentY += 5;
            });
            
            this.currentY += 5;
        });
    }

    // Add Ayurvedic recommendations
    addAyurvedicRecommendations(dietPlan) {
        this.checkPageBreak(60);
        this.addSectionHeader('Ayurvedic Recommendations', '🌿');
        
        // Primary tastes to emphasize
        if (dietPlan.primary_rasa && dietPlan.primary_rasa.length > 0) {
            this.doc.setFontSize(10);
            this.doc.setTextColor(this.colors.text);
            this.doc.text('Emphasize Tastes:', this.margin, this.currentY);
            this.doc.setTextColor('#000000');
            this.doc.text(dietPlan.primary_rasa.join(', '), this.margin + 45, this.currentY);
            this.currentY += this.lineHeight;
        }
        
        // Tastes to avoid
        if (dietPlan.avoid_rasa && dietPlan.avoid_rasa.length > 0) {
            this.doc.setTextColor(this.colors.text);
            this.doc.text('Avoid Tastes:', this.margin, this.currentY);
            this.doc.setTextColor('#000000');
            this.doc.text(dietPlan.avoid_rasa.join(', '), this.margin + 45, this.currentY);
            this.currentY += this.lineHeight;
        }
        
        this.currentY += 5;
        
        // General guidelines
        const guidelines = [
            'Eat meals at regular times for better digestion',
            'Drink warm water throughout the day',
            'Include all six tastes in your daily diet',
            'Eat your largest meal at midday when digestion is strongest',
            'Allow 3-4 hours between meals',
            'Practice mindful eating in a peaceful environment'
        ];
        
        this.doc.setTextColor(this.colors.text);
        this.doc.text('General Guidelines:', this.margin, this.currentY);
        this.currentY += 8;
        
        this.doc.setFontSize(9);
        guidelines.forEach(guideline => {
            this.checkPageBreak(8);
            this.doc.text(`• ${guideline}`, this.margin + 5, this.currentY);
            this.currentY += 6;
        });
    }

    // Add footer
    addFooter() {
        const pageCount = this.doc.internal.getNumberOfPages();
        
        for (let i = 1; i <= pageCount; i++) {
            this.doc.setPage(i);
            
            // Footer line
            this.doc.setDrawColor('#e5e7eb');
            this.doc.line(this.margin, this.pageHeight - 15, this.pageWidth - this.margin, this.pageHeight - 15);
            
            // Footer text
            this.doc.setFontSize(8);
            this.doc.setTextColor('#9ca3af');
            this.doc.text('AyurDiet Pro - Personalized Ayurvedic Nutrition Dashboard', this.margin, this.pageHeight - 8);
            this.doc.text(`Page ${i} of ${pageCount}`, this.pageWidth - 30, this.pageHeight - 8);
        }
    }

    // Generate comprehensive patient report
    async generatePatientReport(patientId = 'pat_001') {
        try {
            this.initDocument();
            
            // Load data
            const patient = DashboardState.currentPatient || await this.loadPatientData(patientId);
            const dietPlan = DashboardState.currentDietPlan || await this.loadDietPlan(patientId);
            const progressData = DashboardState.progressData || await this.loadProgressData(patientId);
            
            // Add content
            this.addHeader('Patient Health Report', `Ayurvedic Diet Management - ${patient?.name || 'Patient'}`);
            this.addPatientInfo(patient);
            this.addDietPlanSummary(dietPlan);
            this.addProgressSummary(progressData);
            
            // Add new page for meal plan
            this.doc.addPage();
            this.currentY = this.margin;
            this.addDailyMealPlan(new Date().toLocaleDateString());
            
            this.addAyurvedicRecommendations(dietPlan);
            this.addFooter();
            
            // Download the PDF
            const fileName = `ayurveda-report-${patient?.name?.replace(/\s+/g, '-').toLowerCase() || 'patient'}-${new Date().toISOString().split('T')[0]}.pdf`;
            this.doc.save(fileName);
            
            showNotification('Patient report generated successfully!', 'success');
            
        } catch (error) {
            console.error('Error generating patient report:', error);
            showNotification('Error generating report. Please try again.', 'error');
        }
    }

    // Generate meal plan report
    async generateMealPlanReport(startDate, endDate) {
        try {
            this.initDocument();
            
            const dietPlan = DashboardState.currentDietPlan;
            const patient = DashboardState.currentPatient;
            
            this.addHeader('Weekly Meal Plan', `${startDate} to ${endDate}`);
            
            if (patient) {
                this.doc.setFontSize(12);
                this.doc.setTextColor(this.colors.text);
                this.doc.text(`Patient: ${patient.name}`, this.margin, this.currentY);
                this.doc.text(`Dosha: ${patient.dominant_dosha}`, this.margin, this.currentY + 8);
                this.currentY += 20;
            }
            
            // Generate meal plans for each day
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            days.forEach(day => {
                if (this.currentY > this.pageHeight - 100) {
                    this.doc.addPage();
                    this.currentY = this.margin;
                }
                this.addDailyMealPlan(day);
            });
            
            if (dietPlan) {
                this.addAyurvedicRecommendations(dietPlan);
            }
            
            this.addFooter();
            
            const fileName = `meal-plan-${startDate}-to-${endDate}.pdf`;
            this.doc.save(fileName);
            
            showNotification('Meal plan report generated successfully!', 'success');
            
        } catch (error) {
            console.error('Error generating meal plan report:', error);
            showNotification('Error generating meal plan report. Please try again.', 'error');
        }
    }

    // Generate progress report
    async generateProgressReport(patientId = 'pat_001') {
        try {
            this.initDocument();
            
            const patient = DashboardState.currentPatient;
            const progressData = DashboardState.progressData;
            
            this.addHeader('Progress Analysis Report', `Health Journey - ${patient?.name || 'Patient'}`);
            
            if (patient) {
                this.addPatientInfo(patient);
            }
            
            this.addProgressSummary(progressData);
            
            // Detailed progress analysis
            this.addSectionHeader('Detailed Progress Analysis', '📈');
            
            if (progressData && progressData.length > 0) {
                // Create a simple text-based chart representation
                this.doc.setFontSize(10);
                this.doc.setTextColor(this.colors.text);
                this.doc.text('Weight Trend (Last 10 Records):', this.margin, this.currentY);
                this.currentY += 10;
                
                progressData.slice(0, 10).forEach((record, index) => {
                    const date = new Date(record.date).toLocaleDateString();
                    this.doc.text(`${date}: ${record.weight} kg (BMI: ${record.bmi})`, this.margin + 5, this.currentY);
                    this.currentY += 6;
                });
                
                this.currentY += 10;
                
                // Compliance analysis
                this.doc.setTextColor(this.colors.text);
                this.doc.text('Compliance Trend:', this.margin, this.currentY);
                this.currentY += 10;
                
                progressData.slice(0, 10).forEach((record, index) => {
                    const date = new Date(record.date).toLocaleDateString();
                    const compliance = record.compliance_percentage;
                    let status = 'Poor';
                    if (compliance >= 90) status = 'Excellent';
                    else if (compliance >= 75) status = 'Good';
                    else if (compliance >= 60) status = 'Fair';
                    
                    this.doc.text(`${date}: ${compliance}% (${status})`, this.margin + 5, this.currentY);
                    this.currentY += 6;
                });
            }
            
            this.addFooter();
            
            const fileName = `progress-report-${patient?.name?.replace(/\s+/g, '-').toLowerCase() || 'patient'}-${new Date().toISOString().split('T')[0]}.pdf`;
            this.doc.save(fileName);
            
            showNotification('Progress report generated successfully!', 'success');
            
        } catch (error) {
            console.error('Error generating progress report:', error);
            showNotification('Error generating progress report. Please try again.', 'error');
        }
    }

    // Helper methods to load data if not in state
    async loadPatientData(patientId) {
        try {
            const response = await fetch(`tables/patients/${patientId}`);
            return response.ok ? await response.json() : null;
        } catch (error) {
            console.error('Error loading patient data:', error);
            return null;
        }
    }

    async loadDietPlan(patientId) {
        try {
            const response = await fetch(`tables/diet_plans?patient_id=${patientId}&status=Active`);
            if (response.ok) {
                const result = await response.json();
                return result.data && result.data.length > 0 ? result.data[0] : null;
            }
        } catch (error) {
            console.error('Error loading diet plan:', error);
            return null;
        }
    }

    async loadProgressData(patientId) {
        try {
            const response = await fetch(`tables/progress_tracking?patient_id=${patientId}&limit=30&sort=date`);
            if (response.ok) {
                const result = await response.json();
                return result.data || [];
            }
        } catch (error) {
            console.error('Error loading progress data:', error);
            return [];
        }
    }
}

// Create global instance
const reportGenerator = new AyurvedaReportGenerator();

// Export functions for use in other scripts
window.generatePatientReport = () => reportGenerator.generatePatientReport();
window.generateMealPlanReport = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    reportGenerator.generateMealPlanReport(
        today.toLocaleDateString(), 
        nextWeek.toLocaleDateString()
    );
};
window.generateProgressReport = () => reportGenerator.generateProgressReport();

// Add report generation buttons to various sections
document.addEventListener('DOMContentLoaded', function() {
    // Add report buttons to dashboard if not already present
    setTimeout(addReportButtons, 1000);
});

function addReportButtons() {
    // Add floating action button for reports
    const reportFAB = document.createElement('div');
    reportFAB.className = 'fixed bottom-6 right-6 z-50';
    reportFAB.innerHTML = `
        <div class="relative group">
            <button onclick="toggleReportMenu()" class="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <i class="fas fa-file-pdf text-xl"></i>
            </button>
            <div id="report-menu" class="hidden absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-2 min-w-48">
                <button onclick="generatePatientReport()" class="w-full text-left px-4 py-2 hover:bg-gray-100 rounded flex items-center">
                    <i class="fas fa-user-md mr-2 text-blue-600"></i>
                    Patient Report
                </button>
                <button onclick="generateMealPlanReport()" class="w-full text-left px-4 py-2 hover:bg-gray-100 rounded flex items-center">
                    <i class="fas fa-utensils mr-2 text-green-600"></i>
                    Meal Plan Report
                </button>
                <button onclick="generateProgressReport()" class="w-full text-left px-4 py-2 hover:bg-gray-100 rounded flex items-center">
                    <i class="fas fa-chart-line mr-2 text-purple-600"></i>
                    Progress Report
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(reportFAB);
}

function toggleReportMenu() {
    const menu = document.getElementById('report-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const menu = document.getElementById('report-menu');
    const button = event.target.closest('[onclick="toggleReportMenu()"]');
    
    if (menu && !menu.contains(event.target) && !button) {
        menu.classList.add('hidden');
    }
});