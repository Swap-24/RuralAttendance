document.addEventListener('DOMContentLoaded', function() {
  // Password visibility toggles
  document.getElementById('passwordToggle').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.classList.toggle('active');
  });

  document.getElementById('confirmPasswordToggle').addEventListener('click', function() {
    const confirmInput = document.getElementById('confirmPassword');
    const type = confirmInput.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmInput.setAttribute('type', type);
    this.classList.toggle('active');
  });

  // Form submission
  document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const userType = document.querySelector('input[name="userType"]:checked');
    const imageInput = document.getElementById('image');
    const imageFile = imageInput.files[0];
    const grade = document.getElementById('grade');

    // Clear previous errors
    document.getElementById('username-error').textContent = '';
    document.getElementById('password-error').textContent = '';
    document.getElementById('confirmPassword-error').textContent = '';
    document.getElementById('userType-error').textContent = '';
    document.getElementById('image-error').textContent = '';

    // Basic validation
    let hasError = false;
    if (!username) {
      document.getElementById('username-error').textContent = 'Username is required.';
      hasError = true;
    }
    if (!password) {
      document.getElementById('password-error').textContent = 'Password is required.';
      hasError = true;
    }
    if (!confirmPassword) {
      document.getElementById('confirmPassword-error').textContent = 'Please confirm your password.';
      hasError = true;
    }
    if (password && confirmPassword && password !== confirmPassword) {
      document.getElementById('confirmPassword-error').textContent = 'Passwords do not match.';
      console.log('Passwords do not match');
      hasError = true;
    }
    if (!userType) {
      document.getElementById('userType-error').textContent = 'Please select a user type.';
      hasError = true;
    }
    if (!imageFile) {
      document.getElementById('image-error').textContent = 'Please select a profile image.';
      hasError = true;
    }
    if (hasError) return;

    // Prepare form data for submission
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('userType', userType.value);
    formData.append('image', imageFile);
    formData.append('grade', grade);

    // Send POST request to /signup
    fetch('/signup', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.ok) {
        window.location.href = '/'; // Change as needed
      } else {
        return response.json().then(data => {
          // Show error message (you can customize this)
          document.getElementById('username-error').textContent = data.message || 'Signup failed.';
        });
      }
    })
    .catch(() => {
      document.getElementById('username-error').textContent = 'Network error. Please try again.';
    });
  });
});