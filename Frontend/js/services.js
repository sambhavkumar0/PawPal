$(document).ready(function() {
    // Initialize services page
    initServicesPage();
    
    // Set minimum date for booking as tomorrow
    const bookingDateInput = $('#bookingDate');
    if (bookingDateInput.length) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        bookingDateInput.attr('min', tomorrow.toISOString().split('T')[0]);
    }

    // Add animation to service cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe service cards
    const serviceCards = $('.service-detail-card');
    serviceCards.each(function() {
        observer.observe(this);
    });
});

// Global variables
let currentService = '';
let selectedProviderId = '';

function initServicesPage() {
    // Add hover effects to service cards
    $('.service-detail-card').hover(
        function() {
            $(this).addClass('card-hover');
        },
        function() {
            $(this).removeClass('card-hover');
        }
    );

    // Add click animations to buttons
    $('.book-btn').on('click', function() {
        $(this).addClass('btn-clicked');
        setTimeout(() => {
            $(this).removeClass('btn-clicked');
        }, 200);
    });
}

// Open simple booking modal
function openBookingModal(serviceName) {
    // Check if user is logged in
    const currentUser = DataManager.getCurrentUser();
    if (!currentUser) {
        showAlert('Please log in to book an appointment.', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    currentService = serviceName;
    
    // Update modal title
    $('#modalServiceName').text(serviceName);
    
    // Reset form
    $('#simpleBookingForm')[0].reset();
    
    // Set minimum date
    const bookingDateInput = $('#bookingDate');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    bookingDateInput.attr('min', tomorrow.toISOString().split('T')[0]);
    
    // Show modal with animation
    const modal = new bootstrap.Modal(document.getElementById('simpleBookingModal'));
    modal.show();
    
    // Add entrance animation
    setTimeout(() => {
        $('.modal-content').addClass('modal-enter');
    }, 100);
}

// Open communication modal
function openCommunicationModal(serviceName) {
    // Check if user is logged in
    const currentUser = DataManager.getCurrentUser();
    if (!currentUser) {
        showAlert('Please log in to contact care providers.', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    currentService = serviceName;
    $('#commServiceName').text(serviceName);
    
    // Load providers for this service
    loadProvidersForService(serviceName);
    
    // Reset message form
    $('#messageForm')[0].reset();
    $('#messageSubject').val(`Inquiry about ${serviceName}`);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('communicationModal'));
    modal.show();
}

function loadProvidersForService(serviceName) {
    const providers = DataManager.getProviderByService(serviceName);
    const providersList = $('#providersList');
    
    providersList.empty();
    
    if (providers.length === 0) {
        providersList.append(`
            <div class="text-center text-muted p-3">
                <i class="fas fa-user-times fa-2x mb-2"></i>
                <p>No providers available for this service</p>
            </div>
        `);
        return;
    }
    
    providers.forEach(provider => {
        providersList.append(`
            <div class="provider-card p-3 mb-3 border rounded ${selectedProviderId === provider.id ? 'selected' : ''}" 
                 onclick="selectProvider('${provider.id}')">
                <div class="d-flex align-items-center">
                    <i class="fas fa-user-circle fa-2x text-primary me-3"></i>
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${provider.name}</h6>
                        <p class="text-muted mb-1 small">${provider.specialization}</p>
                        <div class="d-flex align-items-center">
                            <span class="badge bg-warning text-dark me-2">
                                <i class="fas fa-star"></i> ${provider.rating}
                            </span>
                            <small class="text-muted">${provider.experience}</small>
                        </div>
                    </div>
                </div>
            </div>
        `);
    });
}

function selectProvider(providerId) {
    selectedProviderId = providerId;
    $('#selectedProviderId').val(providerId);
    
    // Update UI
    $('.provider-card').removeClass('selected');
    $(`.provider-card[onclick="selectProvider('${providerId}')"]`).addClass('selected');
}

// Confirm booking
function confirmBooking() {
    const currentUser = DataManager.getCurrentUser();
    if (!currentUser) {
        showAlert('Please log in to book an appointment.', 'warning');
        return;
    }

    const petName = $('#petName').val();
    const petType = $('#petType').val();
    const bookingDate = $('#bookingDate').val();
    const bookingTime = $('#bookingTime').val();
    const notes = $('#notes').val();

    // Basic validation
    if (!petName || !petType || !bookingDate || !bookingTime) {
        showAlert('Please fill in all required fields.', 'warning');
        return;
    }

    // Get a provider for this service
    const providers = DataManager.getProviderByService(currentService);
    if (providers.length === 0) {
        showAlert('No providers available for this service.', 'error');
        return;
    }
    
    const provider = providers[0]; // Select first available provider

    const $confirmButton = $('button[onclick="confirmBooking()"]');
    const originalText = $confirmButton.html();
    
    // Show loading state
    $confirmButton.html('<span class="spinner-border spinner-border-sm me-2"></span>Booking...');
    $confirmButton.prop('disabled', true);

    // Simulate booking process
    setTimeout(() => {
        // Create booking
        const booking = {
            userId: currentUser.id,
            serviceType: currentService,
            petName: petName,
            petType: petType,
            appointmentDate: bookingDate,
            appointmentTime: bookingTime,
            status: 'pending',
            providerId: provider.id,
            providerName: provider.name,
            notes: notes
        };
        
        // Save booking
        const savedBooking = DataManager.addBooking(booking);
        
        // Reset button
        $confirmButton.html(originalText);
        $confirmButton.prop('disabled', false);

        // Format time for display
        const timeFormatted = formatTime(bookingTime);
        const dateFormatted = formatDate(bookingDate);

        // Show success message
        const successMessage = `✅ Booking Confirmed!\n\nService: ${currentService}\nPet: ${petName}\nDate: ${dateFormatted}\nTime: ${timeFormatted}\nProvider: ${provider.name}\n\nBooking ID: #${savedBooking.id.slice(-6)}\n\nYou'll receive a reminder 30 minutes before your appointment!`;
        
        showAlert(successMessage, 'success');
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('simpleBookingModal'));
        modal.hide();
        
        // Reset form
        $('#simpleBookingForm')[0].reset();
        
        // Add success animation to the service card
        const serviceCard = $(`.service-detail-card:contains("${currentService}")`);
        serviceCard.addClass('booking-success');
        setTimeout(() => {
            serviceCard.removeClass('booking-success');
        }, 2000);
        
    }, 1500);
}

// Send message to provider
function sendMessage() {
    const currentUser = DataManager.getCurrentUser();
    if (!currentUser) {
        showAlert('Please log in to send messages.', 'warning');
        return;
    }

    const subject = $('#messageSubject').val();
    const content = $('#messageContent').val();
    const providerId = $('#selectedProviderId').val();

    // Validation
    if (!subject || !content) {
        showAlert('Please fill in all fields.', 'warning');
        return;
    }

    if (!providerId) {
        showAlert('Please select a provider.', 'warning');
        return;
    }

    const $sendButton = $('button[onclick="sendMessage()"]');
    const originalText = $sendButton.html();
    
    // Show loading state
    $sendButton.html('<span class="spinner-border spinner-border-sm me-2"></span>Sending...');
    $sendButton.prop('disabled', true);

    // Simulate sending message
    setTimeout(() => {
        // Create message
        const message = {
            senderId: currentUser.id,
            receiverId: providerId,
            content: `Subject: ${subject}\n\n${content}`,
            type: 'text'
        };
        
        // Save message
        DataManager.addMessage(message);
        
        // Reset button
        $sendButton.html(originalText);
        $sendButton.prop('disabled', false);

        // Show success message
        showAlert('Message sent successfully! The provider will respond soon.', 'success');
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('communicationModal'));
        modal.hide();
        
        // Reset form
        $('#messageForm')[0].reset();
        selectedProviderId = '';
        
    }, 1500);
}

// Format time for display
function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    if (hour === 12) {
        return '12:00 PM';
    } else if (hour > 12) {
        return `${hour - 12}:00 PM`;
    } else if (hour === 0) {
        return '12:00 AM';
    } else {
        return `${hour}:00 AM`;
    }
}

// Format date for display
function formatDate(dateString) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Show alert function
function showAlert(message, type) {
    // Remove existing alerts
    $('.alert').remove();

    // Create new alert
    const alertDiv = $(`
        <div class="alert alert-${type} alert-dismissible fade show position-fixed" 
             style="top: 100px; right: 20px; z-index: 9999; max-width: 350px; white-space: pre-line;">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `);

    $('body').append(alertDiv);

    // Auto remove after 7 seconds for longer messages
    setTimeout(() => {
        alertDiv.fadeOut(500, function() {
            $(this).remove();
        });
    }, 7000);
}

// Add smooth scrolling for navigation links
$(document).on('click', 'a[href^="#"]', function(e) {
    e.preventDefault();
    const targetId = $(this).attr('href');
    const targetSection = $(targetId);
    if (targetSection.length) {
        const offsetTop = targetSection.offset().top - 80;
        $('html, body').animate({
            scrollTop: offsetTop
        }, 500);
    }
});

// Add custom CSS for animations
$('<style>')
    .prop('type', 'text/css')
    .html(`
        .card-hover {
            transform: translateY(-5px) scale(1.02);
            transition: all 0.3s ease;
        }
        
        .btn-clicked {
            transform: scale(0.95);
            transition: transform 0.1s ease;
        }
        
        .modal-enter {
            animation: modalEnter 0.3s ease-out;
        }
        
        @keyframes modalEnter {
            from {
                opacity: 0;
                transform: scale(0.9) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        .provider-card {
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .provider-card:hover {
            background-color: #f8fafc;
            transform: translateY(-2px);
        }
        
        .provider-card.selected {
            background-color: #eff6ff;
            border-color: var(--primary-color) !important;
            transform: translateY(-2px);
        }
        
        .booking-success {
            animation: bookingSuccess 2s ease-in-out;
        }
        
        @keyframes bookingSuccess {
            0% {
                transform: scale(1);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            }
            50% {
                transform: scale(1.05);
                box-shadow: 0 15px 40px rgba(16, 185, 129, 0.3);
            }
            100% {
                transform: scale(1);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            }
        }
        
        .animate-in {
            animation: slideInUp 0.6s ease-out;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `)
    .appendTo('head');