// Password visibility toggle
document.querySelectorAll(".password-toggle").forEach((button) => {
  button.addEventListener("click", function () {
    const input = this.previousElementSibling;
    const icon = this.querySelector("i");

    if (input.type === "password") {
      input.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      input.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  });
});

// Form validation on submit
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", function (e) {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    let isValid = true;
    let errorMsg = "";

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.value.trim()) {
      errorMsg += "Email is required.\n";
      isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
      errorMsg += "Enter a valid email address.\n";
      isValid = false;
    }

    // Basic password validation
    if (!password.value.trim()) {
      errorMsg += "Password is required.\n";
      isValid = false;
    } else if (password.value.length < 6) {
      errorMsg += "Password must be at least 6 characters long.\n";
      isValid = false;
    }

    if (!isValid) {
      e.preventDefault(); 
      alert(errorMsg);   
    }
  });
});
