$(document).ready(function () {
    // Initialize auth page
    initAuthPage();

    // Login form submission
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();
        handleLogin();
    });

    // Signup form submission
    $('#signupForm').on('submit', function (e) {
        e.preventDefault();
        handleSignup();
    });

    // Password toggle functionality
    $('#togglePassword, #toggleSignupPassword').on('click', function () {
        togglePasswordVisibility($(this));
    });

    // Password strength checker
    $('#signupPassword').on('input', function () {
        checkPasswordStrength($(this).val());
    });

    // Confirm password validation
    $('#confirmPassword').on('input', function () {
        validatePasswordMatch();
    });

    // Form field animations
    $('.form-control, .form-select').on('focus', function () {
        $(this).closest('.input-group').addClass('focused');
    }).on('blur', function () {
        $(this).closest('.input-group').removeClass('focused');
    });
});

function initAuthPage() {
    // Animate auth card on load
    setTimeout(function () {
        $('.auth-card').addClass('fade-in-up');
    }, 300);

    // Add floating animation to auth icon
    $('.auth-icon').addClass('animate');
}

function handleLogin() {
    const email = $('#email').val();
    const password = $('#password').val();
    const rememberMe = $('#rememberMe').is(':checked');

    // Basic validation
    if (!email || !password) {
        showAuthError('Please fill in all fields.');
        return;
    }

    // Email validation
    if (!isValidEmail(email)) {
        showAuthError('Please enter a valid email address.');
        $('#email').addClass('error');
        return;
    }

    const $submitBtn = $('#loginForm button[type="submit"]');
    const originalText = $submitBtn.html();

    // Show loading state
    // $submitBtn.addClass('loading');
    $submitBtn.html('<span class="spinner-border spinner-border-sm me-2"></span>Signing In...');
    $submitBtn.prop('disabled', true);

    // Simulate login process
    setTimeout(function () {
        // Check credentials (in real app, this would be an API call)
        const users = DataManager.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Successful login
            DataManager.setCurrentUser(user);

            if (rememberMe) {
                localStorage.setItem('rememberUser', JSON.stringify(user));
            }

            showAuthSuccess('Login successful! Redirecting...');
            $('.auth-card').addClass('success');

            setTimeout(function () {
                if (user.userType === 'care-provider') {
                    window.location.href = 'staff-dashboard.html';
                } else {
                    window.location.href = 'index.html';
                }
            }, 2000);
        } else {
            // Failed login
            showAuthError('Invalid email or password.');
            // $submitBtn.removeClass('loading');
            $submitBtn.html(originalText);
            $submitBtn.prop('disabled', false);
        }
    }, 2000);
}

function handleSignup() {
    const firstName = $('#firstName').val();
    const lastName = $('#lastName').val();
    const email = $('#signupEmail').val();
    const phone = $('#phone').val();
    const password = $('#signupPassword').val();
    const confirmPassword = $('#confirmPassword').val();
    const userType = $('#userType').val();
    const agreeTerms = $('#agreeTerms').is(':checked');
    const newsletter = $('#newsletter').is(':checked');

    // Validation
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword || !userType) {
        showAuthError('Please fill in all required fields.');
        return;
    }

    if (!isValidEmail(email)) {
        showAuthError('Please enter a valid email address.');
        $('#signupEmail').addClass('error');
        return;
    }

    if (password !== confirmPassword) {
        showAuthError('Passwords do not match.');
        $('#confirmPassword').addClass('error');
        return;
    }

    if (password.length < 6) {
        showAuthError('Password must be at least 6 characters long.');
        $('#signupPassword').addClass('error');
        return;
    }

    if (!agreeTerms) {
        showAuthError('Please agree to the Terms of Service and Privacy Policy.');
        return;
    }

    // Check if email already exists
    const users = DataManager.getUsers();
    if (users.find(u => u.email === email)) {
        showAuthError('An account with this email already exists.');
        $('#signupEmail').addClass('error');
        return;
    }

    const $submitBtn = $('#signupForm button[type="submit"]');
    const originalText = $submitBtn.html();

    // Show loading state
    // $submitBtn.addClass('loading');
    $submitBtn.html('<span class="spinner-border spinner-border-sm me-2"></span>Creating Account...');
    $submitBtn.prop('disabled', true);

    // Simulate signup process
    setTimeout(function () {
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            firstName,
            lastName,
            email,
            phone,
            password,
            userType,
            newsletter,
            createdAt: new Date().toISOString(),
            isActive: true
        };

        // Save user
        DataManager.addUser(newUser);
        DataManager.setCurrentUser(newUser);

        showAuthSuccess('Account created successfully! Redirecting...');
        $('.auth-card').addClass('success');

        setTimeout(function () {
            if (userType === 'care-provider') {
                window.location.href = 'staff-dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 2000);
    }, 2000);
}

function togglePasswordVisibility($button) {
    const $input = $button.siblings('input');
    const $icon = $button.find('i');

    if ($input.attr('type') === 'password') {
        $input.attr('type', 'text');
        $icon.removeClass('fa-eye').addClass('fa-eye-slash');
    } else {
        $input.attr('type', 'password');
        $icon.removeClass('fa-eye-slash').addClass('fa-eye');
    }
}

function checkPasswordStrength(password) {
    const $progressBar = $('#passwordStrength');
    const $strengthText = $('#passwordStrengthText');

    let strength = 0;
    let strengthText = '';
    let strengthClass = '';

    if (password.length >= 6) strength += 25;
    if (password.match(/[a-z]/)) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;

    if (strength < 50) {
        strengthText = 'Weak';
        strengthClass = 'weak';
    } else if (strength < 75) {
        strengthText = 'Medium';
        strengthClass = 'medium';
    } else {
        strengthText = 'Strong';
        strengthClass = 'strong';
    }

    $progressBar.css('width', strength + '%');
    $progressBar.removeClass('weak medium strong').addClass(strengthClass);
    $strengthText.text(strengthText);
}

function validatePasswordMatch() {
    const password = $('#signupPassword').val();
    const confirmPassword = $('#confirmPassword').val();
    const $confirmInput = $('#confirmPassword');

    if (confirmPassword && password !== confirmPassword) {
        $confirmInput.addClass('error');
    } else {
        $confirmInput.removeClass('error');
    }
}

function socialLogin(provider) {
    showAuthError(`${provider} login is not implemented in this demo.`);
}

function showForgotPassword() {
    const modal = new bootstrap.Modal(document.getElementById('forgotPasswordModal'));
    modal.show();
}

function sendResetLink() {
    const email = $('#resetEmail').val();

    if (!email) {
        showAuthError('Please enter your email address.');
        return;
    }

    if (!isValidEmail(email)) {
        showAuthError('Please enter a valid email address.');
        return;
    }

    // Simulate sending reset link
    showAuthSuccess('Password reset link sent to your email!');

    const modal = bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal'));
    modal.hide();
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showAuthError(message) {
    showAuthAlert(message, 'danger');
}

function showAuthSuccess(message) {
    showAuthAlert(message, 'success');
}

function showAuthAlert(message, type) {
    // Remove existing alerts
    $('.alert').remove();

    // Create new alert
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show position-fixed" 
             style="top: 20px; right: 20px; z-index: 9999; max-width: 350px;">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    $('body').append(alertHtml);

    // Auto remove after 5 seconds
    setTimeout(function () {
        $('.alert').fadeOut(500, function () {
            $(this).remove();
        });
    }, 5000);
}