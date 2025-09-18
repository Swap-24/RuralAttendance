document.addEventListener('DOMContentLoaded', function() {
  function getErrorSpanId(field) {
    const mapping = {
      "roll_number": "roll-error",
      "user_role": "role-error",
      "confirm_password": "confirm-password-error",
      "image": "image-error",
      "name": "name-error",
      "email": "email-error",
      "grade": "grade-error",
      "password": "password-error",
    };
    return mapping[field] || `${field}-error`;
  }

  // Password visibility toggles
  const passwordToggle = document.getElementById('passwordToggle');
  if(passwordToggle) {
    passwordToggle.addEventListener('click', function() {
      const passwordInput = document.getElementById('password');
      passwordInput.type = (passwordInput.type === 'password') ? 'text' : 'password';
      this.classList.toggle('active');
    });
  }

  const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
  if(confirmPasswordToggle) {
    confirmPasswordToggle.addEventListener('click', function() {
      const confirmInput = document.getElementById('confirm_password');
      confirmInput.type = (confirmInput.type === 'password') ? 'text' : 'password';
      this.classList.toggle('active');
    });
  }

  document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault(); // prevent normal form submit

    // Clear previous error messages
    ['name', 'email', 'roll', 'grade', 'password', 'confirm-password', 'role', 'image'].forEach(id => {
      const el = document.getElementById(`${id}-error`);
      if(el) el.textContent = '';
    });

    // Gather values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const rollno = document.getElementById('roll_number').value.trim();
    const grade = document.getElementById('grade').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    const userType = document.querySelector('input[name="user_role"]:checked');
    const imageFile = document.getElementById('image').files[0];

    // Client side validation
    let hasError = false;
    if (!name) { document.getElementById('name-error').textContent = 'Name is required.'; hasError = true; }
    if (!email) { document.getElementById('email-error').textContent = 'Email is required.'; hasError = true; }
    if (!rollno) { document.getElementById('roll-error').textContent = 'Roll number is required.'; hasError = true; }
    if (!grade) { document.getElementById('grade-error').textContent = 'Grade is required.'; hasError = true; }
    if (!password) { document.getElementById('password-error').textContent = 'Password is required.'; hasError = true; }
    if (!confirmPassword) { document.getElementById('confirm-password-error').textContent = 'Please confirm your password.'; hasError = true; }
    if (password && confirmPassword && password !== confirmPassword) {
      document.getElementById('confirm-password-error').textContent = 'Passwords do not match.';
      hasError = true;
    }
    if (!userType) { document.getElementById('role-error').textContent = 'Please select a user type.'; hasError = true; }
    if (!imageFile) { document.getElementById('image-error').textContent = 'Please select a profile image.'; hasError = true; }
    if (hasError) return; // stop submission on client errors

    // Prepare form data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('roll_number', rollno);
    formData.append('grade', grade);
    formData.append('password', password);
    formData.append('confirm_password', confirmPassword);
    formData.append('user_role', userType.value);
    formData.append('image', imageFile);

    // Send fetch POST request
    fetch('/signup', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json().then(body => ({status: response.status, body})))
    .then(({status, body}) => {
      // Clear all error messages before showing new ones
      ['name', 'email', 'roll', 'grade', 'password', 'confirm-password', 'role', 'image'].forEach(id => {
        const el = document.getElementById(`${id}-error`);
        if(el) el.textContent = '';
      });

      if (status === 200 && body.field === "success") {
        // On success, redirect as per returned URL
        window.location.href = body.redirect;
      } else if (body.field && body.message) {
        // Show inline error message under relevant field
        const errorSpanId = getErrorSpanId(body.field);
        const errorSpan = document.getElementById(errorSpanId);
        if (errorSpan) errorSpan.textContent = body.message;
      } else {
        // Handle unexpected errors nicely
        alert("Unexpected error occurred. Please try again.");
      }
    })
    .catch(err => {
      console.error("Network error while signing up:", err);
      alert("Network error occurred. Please check your connection and try again.");
    });
  });
});
