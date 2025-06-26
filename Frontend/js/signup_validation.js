document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");

    signupForm.addEventListener("submit", function (e) {
        e.preventDefault(); 

        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const userType = document.getElementById("userType").value;
        const agreeTerms = document.getElementById("agreeTerms").checked;

        // Basic regex patterns
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^[0-9]{10}$/;

        let isValid = true;
        let message = "";

        if (firstName === "" || lastName === "") {
            message = "First and Last Name are required.";
            isValid = false;
        } else if (!emailPattern.test(email)) {
            message = "Enter a valid email address.";
            isValid = false;
        } else if (!phonePattern.test(phone)) {
            message = "Enter a valid 10-digit phone number.";
            isValid = false;
        } else if (password.length < 8) {
            message = "Password must be at least 8 characters.";
            isValid = false;
        } else if (password !== confirmPassword) {
            message = "Passwords do not match.";
            isValid = false;
        } else if (userType === "") {
            message = "Please select your user type.";
            isValid = false;
        } else if (!agreeTerms) {
            message = "You must agree to the Terms and Privacy Policy.";
            isValid = false;
        }

        if (!isValid) {
            alert(message); 
            return;
        }

        alert("Form submitted successfully!");
        signupForm.submit(); 
    });
});
