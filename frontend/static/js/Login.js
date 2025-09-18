document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');
  if (!form) return;  // avoid errors if form missing

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const rollno = document.getElementById("rollno").value.trim();
    const password = document.getElementById("password").value;
    const user_role = document.querySelector('input[name="user_role"]:checked');

    // Clear previous errors
    document.getElementById('rollno-error').textContent = '';
    document.getElementById('password-error').textContent = '';
    document.getElementById('user_role-error').textContent = '';

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

    // Send fetch POST request to login route
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rollno: rollno,
        password: password,
        user_role: user_role.value,
      }),
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200) {
        // Redirect based on role returned from backend
        if (body.role === 'student') {
          window.location.href = "/student_view";
        } else if (body.role === 'teacher') {
          window.location.href = "/teacher_view"; // Adjust as needed
        } else {
          alert('Unknown user role.');
        }
      } else {
        // Show server error message near password or general error
        if (body.message) {
          document.getElementById('password-error').textContent = body.message;
        } else {
          alert('Login failed. Please check credentials and try again.');
        }
      }
    })
    .catch(() => {
      document.getElementById('password-error').textContent = 'Network error. Please try again.';
    });
  });

  // Password visibility toggle
  const passwordToggle = document.getElementById('passwordToggle');
  if (passwordToggle) {
    passwordToggle.addEventListener('click', function() {
      const passwordInput = document.getElementById('password');
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      this.classList.toggle('active');
    });
  }
});
