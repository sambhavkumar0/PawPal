document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registrationForm");
  form.noValidate = true;

  form.addEventListener("submit", function (e) {
    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const terms = document.getElementById("terms");

    let isValid = true;
    let message = "";

    if (fullName.value.trim() === "") {
      isValid = false;
      message += "Full Name is required.\n";
    }

    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(email.value.trim())) {
      isValid = false;
      message += "Please enter a valid email address.\n";
    }

    const phonePattern = /^\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/;
    if (!phonePattern.test(phone.value.trim())) {
      isValid = false;
      message += "Please enter a valid phone number.\n";
    }

    if (password.value.length < 6) {
      isValid = false;
      message += "Password must be at least 6 characters long.\n";
    }

    if (password.value !== confirmPassword.value) {
      isValid = false;
      message += "Passwords do not match.\n";
    }

    if (!terms.checked) {
      isValid = false;
      message += "You must agree to the Terms and Privacy Policy.\n";
    }

    if (!isValid) {
      e.preventDefault(); 
      alert(message);
    }
  });
});
