$(document).ready(function() {
    // Animate elements on scroll
    function animateOnScroll() {
        $('.fade-in-left, .fade-in-right, .fade-in-up').each(function() {
            const elementTop = $(this).offset().top;
            const elementBottom = elementTop + $(this).outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();

            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('animate');
            }
        });
    }

    // Counter animation
    function animateCounters() {
        $('.counter').each(function() {
            const $this = $(this);
            const target = parseInt($this.data('target'));
            
            $({ countNum: 0 }).animate({
                countNum: target
            }, {
                duration: 2000,
                easing: 'swing',
                step: function() {
                    $this.text(Math.floor(this.countNum));
                },
                complete: function() {
                    $this.text(target);
                }
            });
        });
    }

    // Team card hover effects
    $('.team-card').hover(
        function() {
            $(this).find('.team-image img').addClass('animate');
        },
        function() {
            $(this).find('.team-image img').removeClass('animate');
        }
    );

    // Mission card animations
    $('.mission-card').hover(
        function() {
            $(this).find('.mission-icon i').addClass('bounce');
        },
        function() {
            $(this).find('.mission-icon i').removeClass('bounce');
        }
    );

    // Initial animations
    animateOnScroll();
    
    // Trigger counter animation when stats section is visible
    let countersAnimated = false;
    $(window).scroll(function() {
        animateOnScroll();
        
        if (!countersAnimated) {
            const statsSection = $('.stats-row');
            if (statsSection.length) {
                const statsTop = statsSection.offset().top;
                const viewportBottom = $(window).scrollTop() + $(window).height();
                
                if (viewportBottom > statsTop) {
                    animateCounters();
                    countersAnimated = true;
                }
            }
        }
    });

    // Add bounce animation class
    $('<style>')
        .prop('type', 'text/css')
        .html(`
            .bounce {
                animation: bounce 0.6s ease-in-out;
            }
            
            @keyframes bounce {
                0%, 20%, 60%, 100% {
                    transform: translateY(0) scale(1);
                }
                40% {
                    transform: translateY(-10px) scale(1.1);
                }
                80% {
                    transform: translateY(-5px) scale(1.05);
                }
            }
        `)
        .appendTo('head');
});