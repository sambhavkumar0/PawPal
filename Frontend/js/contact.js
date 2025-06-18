$(document).ready(function() {
    // Animate elements on scroll
    function animateOnScroll() {
        $('.fade-in-up').each(function() {
            const elementTop = $(this).offset().top;
            const elementBottom = elementTop + $(this).outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();

            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('animate');
            }
        });
    }

    // Contact form submission
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        
        const $submitBtn = $(this).find('button[type="submit"]');
        const originalText = $submitBtn.html();
        
        // Show loading state
        $submitBtn.html('<span class="spinner-border spinner-border-sm me-2"></span>Sending...');
        $submitBtn.prop('disabled', true);
        
        // Simulate form submission
        setTimeout(function() {
            // Reset button
            $submitBtn.html(originalText);
            $submitBtn.prop('disabled', false);
            
            // Show success message
            showAlert('Thank you for your message! We\'ll get back to you within 2 hours.', 'success');
            
            // Reset form
            $('#contactForm')[0].reset();
            
            // Add success animation
            $('.contact-form-card').addClass('success-pulse');
            setTimeout(function() {
                $('.contact-form-card').removeClass('success-pulse');
            }, 1000);
            
        }, 2000);
    });

    // Contact card hover effects
    $('.contact-card').hover(
        function() {
            $(this).find('.contact-icon i').addClass('bounce-in');
        },
        function() {
            $(this).find('.contact-icon i').removeClass('bounce-in');
        }
    );

    // Form field animations
    $('.form-control, .form-select').on('focus', function() {
        $(this).parent().addClass('field-focus');
    }).on('blur', function() {
        $(this).parent().removeClass('field-focus');
    });

    // Accordion animations
    $('.accordion-button').on('click', function() {
        const $this = $(this);
        setTimeout(function() {
            if (!$this.hasClass('collapsed')) {
                $this.closest('.accordion-item').addClass('active-item');
            } else {
                $this.closest('.accordion-item').removeClass('active-item');
            }
        }, 100);
    });

    // Initial animations
    animateOnScroll();
    
    // Scroll animations
    $(window).scroll(function() {
        animateOnScroll();
    });

    // Add custom CSS animations
    $('<style>')
        .prop('type', 'text/css')
        .html(`
            .bounce-in {
                animation: bounceIn 0.6s ease-in-out;
            }
            
            @keyframes bounceIn {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.2) rotate(10deg);
                }
                100% {
                    transform: scale(1.1) rotate(5deg);
                }
            }
            
            .success-pulse {
                animation: successPulse 1s ease-in-out;
            }
            
            @keyframes successPulse {
                0% {
                    transform: scale(1);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                }
                50% {
                    transform: scale(1.02);
                    box-shadow: 0 15px 40px rgba(16, 185, 129, 0.3);
                }
                100% {
                    transform: scale(1);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                }
            }
            
            .field-focus {
                transform: translateY(-2px);
                transition: transform 0.3s ease;
            }
            
            .active-item {
                transform: scale(1.02);
                transition: transform 0.3s ease;
            }
        `)
        .appendTo('head');
});

// Open map function
function openMap() {
    const address = "123 Pet Care Street, Pet City, PC 12345";
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
}

// Show alert function
function showAlert(message, type) {
    // Remove existing alerts
    $('.alert').remove();

    // Create new alert
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show position-fixed" 
             style="top: 100px; right: 20px; z-index: 9999; max-width: 350px;">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    $('body').append(alertHtml);

    // Auto remove after 5 seconds
    setTimeout(function() {
        $('.alert').fadeOut(500, function() {
            $(this).remove();
        });
    }, 5000);
}