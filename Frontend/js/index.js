// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background and color change on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Set minimum date for appointment booking
    const appointmentDateInput = document.getElementById('appointmentDate');
    if (appointmentDateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        appointmentDateInput.min = tomorrow.toISOString().split('T')[0];
    }

    // Add fade-in animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe feature cards and service cards
    const animatedElements = document.querySelectorAll('.feature-card, .service-card, .step-card');
    animatedElements.forEach(el => observer.observe(el));
});

// Show booking modal
function showBookingForm() {
    const bookingModal = new bootstrap.Modal(document.getElementById('bookingModal'));
    bookingModal.show();
}

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Submit booking form
function submitBooking() {
    const form = document.getElementById('bookingForm');
    const formData = new FormData(form);
    
    // Get form values
    const petName = document.getElementById('petName').value;
    const petType = document.getElementById('petType').value;
    const serviceType = document.getElementById('serviceType').value;
    const appointmentDate = document.getElementById('appointmentDate').value;
    const ownerName = document.getElementById('ownerName').value;
    const ownerPhone = document.getElementById('ownerPhone').value;
    const specialRequests = document.getElementById('specialRequests').value;

    // Basic validation
    if (!petName || !petType || !serviceType || !appointmentDate || !ownerName || !ownerPhone) {
        showAlert('Please fill in all required fields.', 'danger');
        return;
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(ownerPhone.replace(/[\s\-\(\)]/g, ''))) {
        showAlert('Please enter a valid phone number.', 'danger');
        return;
    }

    // Show loading state
    const submitButton = event.target;
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="loading"></span> Booking...';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;

        // Show success message
        showAlert(`Great! Your ${serviceType} appointment for ${petName} has been scheduled for ${formatDate(appointmentDate)}. We'll send you a confirmation shortly.`, 'success');
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
        modal.hide();
        
        // Reset form
        form.reset();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
}

// Show alert function
function showAlert(message, type) {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());

    // Create new alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 100px; right: 20px; z-index: 9999; max-width: 400px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(alertDiv);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Format date function
function formatDate(dateString) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Service type change handler
document.addEventListener('DOMContentLoaded', function() {
    const serviceSelect = document.getElementById('serviceType');
    if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
            const selectedService = this.value;
            updateServiceInfo(selectedService);
        });
    }
});

// Update service information based on selection
function updateServiceInfo(serviceType) {
    const serviceInfo = {
        grooming: {
            duration: '2-3 hours',
            price: '$50-$100',
            description: 'Full grooming service including bath, cut, nail trim, and ear cleaning.'
        },
        veterinary: {
            duration: '30-60 minutes',
            price: '$75-$200',
            description: 'Comprehensive health checkup and consultation with licensed veterinarian.'
        },
        sitting: {
            duration: 'Custom',
            price: '$25-$50/day',
            description: 'Professional pet sitting in your home or our facility.'
        },
        training: {
            duration: '1 hour',
            price: '$60-$120',
            description: 'Professional training sessions tailored to your pet\'s needs.'
        }
    };

    // You can add a service info display area in the modal if needed
    console.log('Selected service:', serviceType, serviceInfo[serviceType]);
}

// Add loading animation to buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn') && !e.target.disabled) {
        const btn = e.target;
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);
    }
});

// Counter animation for statistics (if you want to add them later)
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Parallax effect for hero section (optional)
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        const rate = scrolled * -0.5;
        heroSection.style.transform = `translateY(${rate}px)`;
    }
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length && 
        konamiCode.every((code, index) => code === konamiSequence[index])) {
        showEasterEgg();
    }
});

function showEasterEgg() {
    showAlert('🎉 Woof! You found the secret code! Your pet gets a free treat! 🐕🦴', 'success');
    
    // Add some fun animations
    const paws = ['🐾', '🐕', '🐱', '🦴', '❤️'];
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createFloatingEmoji(paws[Math.floor(Math.random() * paws.length)]);
        }, i * 200);
    }
}

function createFloatingEmoji(emoji) {
    const emojiEl = document.createElement('div');
    emojiEl.textContent = emoji;
    emojiEl.style.cssText = `
        position: fixed;
        font-size: 2rem;
        pointer-events: none;
        z-index: 10000;
        left: ${Math.random() * window.innerWidth}px;
        top: ${window.innerHeight + 50}px;
        animation: floatUp 3s ease-out forwards;
    `;
    
    document.body.appendChild(emojiEl);
    
    setTimeout(() => {
        emojiEl.remove();
    }, 3000);
}

// Add CSS for floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        to {
            transform: translateY(-${window.innerHeight + 100}px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);