document.addEventListener("DOMContentLoaded", function () {
    // ✅ Get data directly from Flask (injected into template)
    const studentData = window.studentData;
    const attendanceData = window.attendanceData;
    console.log(attendanceData);
    const achievements = window.achievements; 

    // ✅ Update Student Info (only if data exists)
    if (studentData) {
        document.getElementById("studentName").textContent = studentData.name;
        document.getElementById("studentNameDetail").textContent = studentData.name;
        document.getElementById("studentRoll").textContent = studentData.roll_number;
        document.getElementById("studentClass").textContent = studentData.grade + " Grade";
        if (studentData.photo) {
            document.getElementById("studentPhoto").src = studentData.photo;
        }
    }

    // ✅ Update Attendance Info
    if (attendanceData) {
        document.getElementById("totalDays").textContent = attendanceData.total_days;
        document.getElementById("presentDays").textContent = attendanceData.present;
        document.getElementById("absentDays").textContent = attendanceData.absent;
        document.getElementById("attendancePercentage").textContent = attendanceData.percentage + "%";

        // Progress bar
        document.getElementById("progressFill").style.width = attendanceData.percentage + "%";
    }

    // ✅ Update Achievements
    if (achievements && achievements.length > 0) {
        const achievementsList = document.getElementById("achievementsList");
        achievementsList.innerHTML = "";
        achievements.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            achievementsList.appendChild(li);
        });
    }


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
       if (!studentData) return;

    const studentNameElements = document.querySelectorAll('#studentName, #studentNameDetail');
    studentNameElements.forEach(element => {
        if (element) element.textContent = studentData.name;
    });

    const studentClassElement = document.getElementById('studentClass');
    const studentRollElement = document.getElementById('studentRoll');

    if (studentClassElement) studentClassElement.textContent = studentData.grade + " Grade";
    if (studentRollElement) studentRollElement.textContent = studentData.roll_number;
    }

    // Populate achievements section
    function populateAchievements() {
    const achievementsList = document.getElementById('achievementsList');
    if (!achievementsList) return;

    achievementsList.innerHTML = '';

    achievements.forEach(achievement => {
        const achievementItem = document.createElement('div');
        achievementItem.className = 'achievement-item earned'; // mark all as earned for now

        // Using a star icon for simplicity
        achievementItem.innerHTML = `
            <div class="achievement-icon">⭐</div>
            <div class="achievement-content">
                <h4>${achievement}</h4>
            </div>
        `;

        achievementsList.appendChild(achievementItem);
    });
}

    // Update dashboard data based on selected year
    function updateDashboard(selectedYear) {
       console.log('Updating dashboard for year:', selectedYear);
    const yearData = attendanceData[selectedYear]; // ✅ this comes from Flask
    if (!yearData) {
        console.error('No data found for year:', selectedYear);
        return;
    }

    updateSummaryCards(yearData);
    updatePerformanceIndicators(window.performanceData);
    updateMonthlyTable(window.monthlyAttendance);
    }

    // Update summary cards
    function updateSummaryCards(data) {
    const totalDaysElement = document.getElementById('totalDays');
    const presentDaysElement = document.getElementById('presentDays');
    const absentDaysElement = document.getElementById('absentDays');
    const attendancePercentageElement = document.getElementById('attendancePercentage');
    const progressFillElement = document.getElementById('progressFill');

    if (totalDaysElement) totalDaysElement.textContent = data.total_days;
    if (presentDaysElement) presentDaysElement.textContent = data.present;
    if (absentDaysElement) absentDaysElement.textContent = data.absent;
    if (attendancePercentageElement) attendancePercentageElement.textContent = data.percentage.toFixed(2) + '%';

    if (progressFillElement) {
        progressFillElement.style.width = data.percentage + '%';

        // optional: color classes based on percentage
        progressFillElement.classList.remove('warning', 'error');
        if (data.percentage < 75) {
            progressFillElement.classList.add('error');
        } else if (data.percentage < 90) {
            progressFillElement.classList.add('warning');
        }
    }
}
    // Update performance indicators
    function updatePerformanceIndicators(performanceData) {
    const currentStreakElement = document.getElementById('currentStreak');
    const pointsEarnedElement = document.getElementById('pointsEarned');

    if (currentStreakElement) currentStreakElement.textContent = performanceData.streak;
    if (pointsEarnedElement) pointsEarnedElement.textContent = performanceData.points.toLocaleString();
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
    <td>${monthData.name}</td>
    <td>${monthData.total_days}</td>
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