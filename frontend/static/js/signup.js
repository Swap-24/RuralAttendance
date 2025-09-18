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
  document.getElementById('passwordToggle').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    this.classList.toggle('active');
  });

  document.getElementById('confirmPasswordToggle').addEventListener('click', function() {
    const confirmInput = document.getElementById('confirm_password');
    const type = confirmInput.type === 'password' ? 'text' : 'password';
    confirmInput.type = type;
    this.classList.toggle('active');
  });

  // Form submission
  document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values (match IDs in your HTML!)
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const rollno = document.getElementById('roll_number').value.trim();
    const grade = document.getElementById('grade').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    const userType = document.querySelector('input[name="user_role"]:checked');
    const imageFile = document.getElementById('image').files[0];

    // Clear previous errors
    document.getElementById('name-error').textContent = '';
    document.getElementById('email-error').textContent = '';
    document.getElementById('roll-error').textContent = '';
    document.getElementById('grade-error').textContent = '';
    document.getElementById('password-error').textContent = '';
    document.getElementById('confirm-password-error').textContent = '';
    document.getElementById('role-error').textContent = '';
    document.getElementById('image-error').textContent = '';

    // Validation
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

    if (hasError) return;

    // Build form data for Flask
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('roll_number', rollno);
    formData.append('grade', grade);
    formData.append('password', password);
    formData.append('confirm_password', confirmPassword);
    formData.append('user_role', userType.value);
    formData.append('image', imageFile);

    // Send POST request
fetch('/signup', {
  method: 'POST',
  body: formData
})
.then(response => response.json().then(data => ({ status: response.status, body: data })))
.then(({ status, body }) => {
  if (status === 200 && body.field === "success") {
    // Signup successful → redirect
    window.location.href = body.redirect;
  } else if (body.field && body.message) {
    // Display the message in the correct error span
    const errorSpan = document.getElementById(`${body.field}-error`);
    if (errorSpan) {
      errorSpan.textContent = body.message;
    }
  }
})
.catch(() => {
  console.error("Network error while signing up");
});
  });
});
