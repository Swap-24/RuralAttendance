// Student Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Student and attendance data
    const studentData = {
        "name": "Priya Sharma",
        "rollNo": "RS2024001",
        "class": "10th Grade",
        "photo": "placeholder"
    };

    const attendanceData = {
        "2025-26": {
            "totalDays": 45,
            "present": 42,
            "absent": 3,
            "percentage": 93.33,
            "streak": 15,
            "points": 420,
            "monthlyData": [
                {"month": "April", "totalDays": 22, "present": 21, "absent": 1, "percentage": 95.45},
                {"month": "May", "totalDays": 23, "present": 21, "absent": 2, "percentage": 91.30}
            ]
        },
        "2024-25": {
            "totalDays": 200,
            "present": 185,
            "absent": 15,
            "percentage": 92.50,
            "streak": 28,
            "points": 1850,
            "monthlyData": [
                {"month": "April", "totalDays": 20, "present": 19, "absent": 1, "percentage": 95.00},
                {"month": "May", "totalDays": 22, "present": 20, "absent": 2, "percentage": 90.91},
                {"month": "June", "totalDays": 18, "present": 17, "absent": 1, "percentage": 94.44},
                {"month": "July", "totalDays": 23, "present": 22, "absent": 1, "percentage": 95.65},
                {"month": "August", "totalDays": 21, "present": 19, "absent": 2, "percentage": 90.48},
                {"month": "September", "totalDays": 22, "present": 21, "absent": 1, "percentage": 95.45},
                {"month": "October", "totalDays": 23, "present": 22, "absent": 1, "percentage": 95.65},
                {"month": "November", "totalDays": 20, "present": 18, "absent": 2, "percentage": 90.00},
                {"month": "December", "totalDays": 15, "present": 14, "absent": 1, "percentage": 93.33},
                {"month": "January", "totalDays": 21, "present": 19, "absent": 2, "percentage": 90.48},
                {"month": "February", "totalDays": 19, "present": 18, "absent": 1, "percentage": 94.74},
                {"month": "March", "totalDays": 16, "present": 15, "absent": 1, "percentage": 93.75}
            ]
        },
        "2023-24": {
            "totalDays": 195,
            "present": 170,
            "absent": 25,
            "percentage": 87.18,
            "streak": 12,
            "points": 1700,
            "monthlyData": [
                {"month": "April", "totalDays": 18, "present": 16, "absent": 2, "percentage": 88.89},
                {"month": "May", "totalDays": 20, "present": 17, "absent": 3, "percentage": 85.00},
                {"month": "June", "totalDays": 19, "present": 16, "absent": 3, "percentage": 84.21},
                {"month": "July", "totalDays": 22, "present": 19, "absent": 3, "percentage": 86.36},
                {"month": "August", "totalDays": 20, "present": 17, "absent": 3, "percentage": 85.00},
                {"month": "September", "totalDays": 21, "present": 18, "absent": 3, "percentage": 85.71},
                {"month": "October", "totalDays": 22, "present": 20, "absent": 2, "percentage": 90.91},
                {"month": "November", "totalDays": 19, "present": 16, "absent": 3, "percentage": 84.21},
                {"month": "December", "totalDays": 14, "present": 12, "absent": 2, "percentage": 85.71},
                {"month": "January", "totalDays": 20, "present": 17, "absent": 3, "percentage": 85.00},
                {"month": "February", "totalDays": 18, "present": 16, "absent": 2, "percentage": 88.89},
                {"month": "March", "totalDays": 15, "present": 13, "absent": 2, "percentage": 86.67}
            ]
        }
    };

    const achievements = [
        {"name": "Perfect Week", "description": "7 days perfect attendance", "icon": "⭐", "earned": true},
        {"name": "Monthly Star", "description": "90%+ attendance in a month", "icon": "🌟", "earned": true},
        {"name": "Streak Master", "description": "20+ days continuous attendance", "icon": "🔥", "earned": true},
        {"name": "Year Champion", "description": "90%+ attendance for full year", "icon": "🏆", "earned": false}
    ];

    // DOM elements
    const academicYearSelect = document.getElementById('academicYear');
    const logoutBtn = document.querySelector('.logout-btn');
    const printBtn = document.querySelector('.print-btn');

    // Initialize dashboard
    function initializeDashboard() {
        console.log('Initializing dashboard...');
        populateStudentInfo();
        populateAchievements();
        updateDashboard('2025-26'); // Default year
        attachEventListeners();
        console.log('Dashboard initialized successfully');
    }

    // Populate student basic information
    function populateStudentInfo() {
        const studentNameElements = document.querySelectorAll('#studentName, #studentNameDetail');
        const studentClassElement = document.getElementById('studentClass');
        const studentRollElement = document.getElementById('studentRoll');

        studentNameElements.forEach(element => {
            if (element) element.textContent = studentData.name;
        });

        if (studentClassElement) studentClassElement.textContent = studentData.class;
        if (studentRollElement) studentRollElement.textContent = studentData.rollNo;
    }

    // Populate achievements section
    function populateAchievements() {
        const achievementsList = document.getElementById('achievementsList');
        if (!achievementsList) return;

        achievementsList.innerHTML = '';

        achievements.forEach(achievement => {
            const achievementItem = document.createElement('div');
            achievementItem.className = `achievement-item ${achievement.earned ? 'earned' : ''}`;
            
            achievementItem.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-content">
                    <h4>${achievement.name}</h4>
                    <p>${achievement.description}</p>
                </div>
            `;
            
            achievementsList.appendChild(achievementItem);
        });
    }

    // Update dashboard data based on selected year
    function updateDashboard(selectedYear) {
        console.log('Updating dashboard for year:', selectedYear);
        const yearData = attendanceData[selectedYear];
        if (!yearData) {
            console.error('No data found for year:', selectedYear);
            return;
        }

        // Update summary cards
        updateSummaryCards(yearData);
        
        // Update performance indicators
        updatePerformanceIndicators(yearData);
        
        // Update monthly table
        updateMonthlyTable(yearData.monthlyData);
        
        console.log('Dashboard updated successfully');
    }

    // Update summary cards
    function updateSummaryCards(data) {
        const totalDaysElement = document.getElementById('totalDays');
        const presentDaysElement = document.getElementById('presentDays');
        const absentDaysElement = document.getElementById('absentDays');
        const attendancePercentageElement = document.getElementById('attendancePercentage');
        const progressFillElement = document.getElementById('progressFill');

        if (totalDaysElement) totalDaysElement.textContent = data.totalDays;
        if (presentDaysElement) presentDaysElement.textContent = data.present;
        if (absentDaysElement) absentDaysElement.textContent = data.absent;
        if (attendancePercentageElement) attendancePercentageElement.textContent = data.percentage.toFixed(2) + '%';

        // Update progress bar
        if (progressFillElement) {
            progressFillElement.style.width = data.percentage + '%';
            
            // Remove existing classes
            progressFillElement.classList.remove('warning', 'error');
            
            // Add appropriate class based on percentage
            if (data.percentage < 75) {
                progressFillElement.classList.add('error');
            } else if (data.percentage < 90) {
                progressFillElement.classList.add('warning');
            }
        }
    }

    // Update performance indicators
    function updatePerformanceIndicators(data) {
        const currentStreakElement = document.getElementById('currentStreak');
        const pointsEarnedElement = document.getElementById('pointsEarned');

        if (currentStreakElement) currentStreakElement.textContent = data.streak;
        if (pointsEarnedElement) pointsEarnedElement.textContent = data.points.toLocaleString();
    }

    // Update monthly table
    function updateMonthlyTable(monthlyData) {
        const tableBody = document.getElementById('monthlyTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        monthlyData.forEach(monthData => {
            const row = document.createElement('tr');
            
            // Determine status and class for percentage
            let percentageClass = 'excellent';
            let statusText = 'Excellent';
            let statusClass = 'status--success';

            if (monthData.percentage < 75) {
                percentageClass = 'poor';
                statusText = 'Needs Improvement';
                statusClass = 'status--error';
            } else if (monthData.percentage < 90) {
                percentageClass = 'good';
                statusText = 'Good';
                statusClass = 'status--warning';
            }

            row.innerHTML = `
                <td>${monthData.month}</td>
                <td>${monthData.totalDays}</td>
                <td class="present">${monthData.present}</td>
                <td class="absent">${monthData.absent}</td>
                <td class="attendance-percentage ${percentageClass}">${monthData.percentage.toFixed(2)}%</td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
            `;
            
            tableBody.appendChild(row);
        });
    }

    // Attach all event listeners
    function attachEventListeners() {
        console.log('Attaching event listeners...');
        
        // Year dropdown change handler
        if (academicYearSelect) {
            console.log('Academic year select found, attaching change listener');
            academicYearSelect.addEventListener('change', function(e) {
                console.log('Year changed to:', this.value);
                const selectedYear = this.value;
                
                // Add visual feedback
                const summaryCards = document.querySelectorAll('.summary-card');
                summaryCards.forEach(card => {
                    card.style.opacity = '0.7';
                });
                
                // Update dashboard with slight delay for visual effect
                setTimeout(() => {
                    updateDashboard(selectedYear);
                    summaryCards.forEach(card => {
                        card.style.opacity = '1';
                    });
                }, 200);
            });
        } else {
            console.error('Academic year select element not found');
        }

        // Logout button functionality
        if (logoutBtn) {
            console.log('Logout button found, attaching click listener');
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Logout button clicked');
                
                const confirmLogout = confirm('Are you sure you want to logout?');
                if (confirmLogout) {
                    alert('Logging out...\n\nIn a real application, you would be redirected to the login page.');
                    // In a real application:
                    // window.location.href = '/login';
                }
            });
        } else {
            console.error('Logout button not found');
        }

        // Print functionality
        if (printBtn) {
            console.log('Print button found, attaching click listener');
            printBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Print button clicked');
                
                // Add print-specific class to body for additional styling if needed
                document.body.classList.add('printing');
                
                // Trigger print
                try {
                    window.print();
                } catch (error) {
                    console.error('Print failed:', error);
                    alert('Print functionality is not available in this environment.');
                }
                
                // Remove print class after printing
                setTimeout(() => {
                    document.body.classList.remove('printing');
                }, 1000);
            });
        } else {
            console.error('Print button not found');
        }

        // Add keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.altKey) {
                switch(e.key) {
                    case '1':
                        if (academicYearSelect) {
                            academicYearSelect.value = '2025-26';
                            academicYearSelect.dispatchEvent(new Event('change'));
                        }
                        e.preventDefault();
                        break;
                    case '2':
                        if (academicYearSelect) {
                            academicYearSelect.value = '2024-25';
                            academicYearSelect.dispatchEvent(new Event('change'));
                        }
                        e.preventDefault();
                        break;
                    case '3':
                        if (academicYearSelect) {
                            academicYearSelect.value = '2023-24';
                            academicYearSelect.dispatchEvent(new Event('change'));
                        }
                        e.preventDefault();
                        break;
                    case 'p':
                        if (printBtn) {
                            printBtn.click();
                        }
                        e.preventDefault();
                        break;
                }
            }
        });

        console.log('Event listeners attached successfully');
    }

    // Add smooth transitions for interactive elements
    function addSmoothTransitions() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.transition = 'transform 0.2s ease-out, box-shadow 0.2s ease-out';
            
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = 'var(--shadow-lg)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'var(--shadow-sm)';
            });
        });
    }

    // Enhanced form control styling
    function enhanceFormControls() {
        if (academicYearSelect) {
            academicYearSelect.style.cursor = 'pointer';
            academicYearSelect.addEventListener('focus', function() {
                this.style.borderColor = 'var(--color-primary)';
                this.style.boxShadow = 'var(--focus-ring)';
            });
            
            academicYearSelect.addEventListener('blur', function() {
                this.style.borderColor = 'var(--color-border)';
                this.style.boxShadow = 'none';
            });
        }
    }

    // Performance optimization: Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Recalculate any responsive elements if needed
            const progressBars = document.querySelectorAll('.progress-fill');
            progressBars.forEach(bar => {
                const width = bar.style.width;
                if (width) {
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 50);
                }
            });
        }, 250);
    });

    // Wait for DOM to be fully loaded
    setTimeout(() => {
        initializeDashboard();
        addSmoothTransitions();
        enhanceFormControls();
    }, 100);
});