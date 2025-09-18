document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

   const rollno = document.getElementById("rollno").value;
   const password = document.getElementById("password").value;
   const userType = document.querySelector('input[name="user_role"]:checked');
    // Clear previous errors
    document.getElementById('rollno-error').textContent = '';
    document.getElementById('password-error').textContent = '';
    document.getElementById('userType-error').textContent = '';

    // Simple validation
    let hasError = false;
    if (!rollno) {
      document.getElementById('rollno-error').textContent = 'Roll Number is required.';
      hasError = true;
    }
    if (!password) {
      document.getElementById('password-error').textContent = 'Password is required.';
      hasError = true;
    }
    if (!user_role) {
      document.getElementById('user_role-error').textContent = 'Please select a user type.';
      hasError = true;
    }
    if (hasError) return;

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rollno: rollno,
        password: password,
        user_role: user_role ? user_role.value : '',
      })
    })
    .then(response => {
      if (response.ok) {
        window.location.href = "/student_view"; // Change as needed
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
