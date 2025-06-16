document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault(); 

    const petName = document.querySelector('input[placeholder="Pet Name"]');
    const dob = document.querySelector('input[type="date"]');
    const gender = document.getElementById('gender');
    const breed = document.querySelector('input[placeholder="Breed"]');
    const ownerName = document.querySelector('input[placeholder="Owner Name"]');
    const email = document.querySelector('input[type="email"]');
    const phone = document.querySelector('input[type="tel"]');
    const service = document.getElementById('service');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    let valid = true;
    let errorMessage = "";

    if (!petName.value.trim()) {
      valid = false;
      errorMessage += "Pet Name is required.\n";
    }

    if (!dob.value) {
      valid = false;
      errorMessage += "Date of Birth is required.\n";
    }

    if (!gender.value) {
      valid = false;
      errorMessage += "Please select gender.\n";
    }

    if (!breed.value.trim()) {
      valid = false;
      errorMessage += "Breed is required.\n";
    }

    if (!ownerName.value.trim()) {
      valid = false;
      errorMessage += "Owner Name is required.\n";
    }

    if (!emailRegex.test(email.value)) {
      valid = false;
      errorMessage += "Please enter a valid email.\n";
    }

    if (!phoneRegex.test(phone.value)) {
      valid = false;
      errorMessage += "Enter a valid 10-digit phone number.\n";
    }

    if (!service.value) {
      valid = false;
      errorMessage += "Please select a service.\n";
    }

    if (!valid) {
      alert(errorMessage);
    } else {
      alert("Form submitted successfully!");
      // e.target.submit(); 
    }
  });
});
