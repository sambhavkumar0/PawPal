document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        let isValid = true;
        let message = "";

        if (!emailPattern.test(email)) {
            isValid = false;
            message = "Please enter a valid email address.";
        } else if (password.length < 6) {
            isValid = false;
            message = "Password must be at least 6 characters.";
        }

        if (!isValid) {
            alert(message); 
            return;
        }

        alert("Login successful!");
        loginForm.submit();
    });
});
