document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

   const rollNumber = document.getElementById("roll_number").value;
   const password = document.getElementById("password").value;
    const userType = document.querySelector('input[name="userType"]:checked');
    const rememberMe = document.getElementById('rememberMe').checked;

    // Clear previous errors
    document.getElementById('email-error').textContent = '';
    document.getElementById('password-error').textContent = '';
    document.getElementById('userType-error').textContent = '';

    // Simple validation
    let hasError = false;
    if (!email) {
      document.getElementById('email-error').textContent = 'Email is required.';
      hasError = true;
    }
    if (!password) {
      document.getElementById('password-error').textContent = 'Password is required.';
      hasError = true;
    }
    if (!userType) {
      document.getElementById('userType-error').textContent = 'Please select a user type.';
      hasError = true;
    }
    if (hasError) return;

    fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password,
        userType: userType ? userType.value : '',
        rememberMe: rememberMe
      })
    })
    .then(response => {
      if (response.ok) {
        window.location.href = "./templates/StudentView.html"; // Change as needed
      } else {
        return response.json().then(data => {
          document.getElementById('password-error').textContent = data.message || 'Login failed.';
        });
      }
    })
    .catch(() => {
      document.getElementById('password-error').textContent = 'Network error. Please try again.';
    });
  });

  // Password visibility toggle
  document.getElementById('passwordToggle').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.classList.toggle('active');
  });
});
