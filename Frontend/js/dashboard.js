$(document).ready(function() {
    // Check if user is logged in and is a care provider
    const currentUser = DataManager.getCurrentUser();
    if (!currentUser || currentUser.userType !== 'care-provider') {
        window.location.href = 'login.html';
        return;
    }

    // Initialize dashboard
    initDashboard();
    loadDashboardData();
    
    // Set up real-time updates
    setInterval(loadDashboardData, 30000); // Update every 30 seconds
});

let currentBookingId = null;
let currentConversation = null;

function initDashboard() {
    const currentUser = DataManager.getCurrentUser();
    $('#staffName').text(`${currentUser.firstName} ${currentUser.lastName}`);
    
    // Load initial data
    loadStats();
    loadRecentBookings();
    loadAllBookings();
    loadCustomers();
    loadAvailability();
    loadConversations();
}

function loadDashboardData() {
    loadStats();
    loadRecentBookings();
    updateMessageCount();
}

function showSection(sectionName) {
    // Hide all sections
    $('.content-section').removeClass('active');
    $('.menu-item').removeClass('active');
    
    // Show selected section
    $(`#${sectionName}-section`).addClass('active');
    $(`.menu-item[onclick="showSection('${sectionName}')"]`).addClass('active');
    
    // Load section-specific data
    switch(sectionName) {
        case 'bookings':
            loadAllBookings();
            break;
        case 'customers':
            loadCustomers();
            break;
        case 'availability':
            loadAvailability();
            break;
        case 'messages':
            loadConversations();
            break;
    }
}

function loadStats() {
    const currentUser = DataManager.getCurrentUser();
    const allBookings = DataManager.getBookings();
    const myBookings = allBookings.filter(b => b.providerId === currentUser.id);
    const users = DataManager.getUsers().filter(u => u.userType === 'pet-owner');
    
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = myBookings.filter(b => b.appointmentDate === today);
    const pendingBookings = myBookings.filter(b => b.status === 'pending');
    const completedBookings = myBookings.filter(b => b.status === 'completed');
    
    // Animate counters
    animateCounter('#todayBookings', todayBookings.length);
    animateCounter('#pendingBookings', pendingBookings.length);
    animateCounter('#completedBookings', completedBookings.length);
    animateCounter('#totalCustomers', users.length);
}

function animateCounter(selector, target) {
    const $element = $(selector);
    const current = parseInt($element.text()) || 0;
    
    $({ countNum: current }).animate({
        countNum: target
    }, {
        duration: 1000,
        easing: 'swing',
        step: function() {
            $element.text(Math.floor(this.countNum));
        },
        complete: function() {
            $element.text(target);
        }
    });
}

function loadRecentBookings() {
    const currentUser = DataManager.getCurrentUser();
    const allBookings = DataManager.getBookings();
    const myBookings = allBookings.filter(b => b.providerId === currentUser.id)
                                 .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                 .slice(0, 5);
    
    const tbody = $('#recentBookingsTable');
    tbody.empty();
    
    if (myBookings.length === 0) {
        tbody.append(`
            <tr>
                <td colspan="6" class="text-center text-muted py-4">
                    <i class="fas fa-calendar-times fa-2x mb-2"></i>
                    <p>No recent bookings</p>
                </td>
            </tr>
        `);
        return;
    }
    
    myBookings.forEach(booking => {
        const user = DataManager.getUsers().find(u => u.id === booking.userId);
        const statusClass = getStatusClass(booking.status);
        
        tbody.append(`
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <i class="fas fa-paw text-primary me-2"></i>
                        <div>
                            <strong>${booking.petName}</strong>
                            <small class="text-muted d-block">${booking.petType}</small>
                        </div>
                    </div>
                </td>
                <td>${booking.serviceType}</td>
                <td>
                    <div>
                        <strong>${formatDate(booking.appointmentDate)}</strong>
                        <small class="text-muted d-block">${formatTime(booking.appointmentTime)}</small>
                    </div>
                </td>
                <td>${user ? `${user.firstName} ${user.lastName}` : 'Unknown'}</td>
                <td><span class="status-badge ${statusClass}">${booking.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewBooking('${booking.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `);
    });
}

function loadAllBookings() {
    const currentUser = DataManager.getCurrentUser();
    const allBookings = DataManager.getBookings();
    const myBookings = allBookings.filter(b => b.providerId === currentUser.id)
                                 .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const tbody = $('#allBookingsTable');
    tbody.empty();
    
    if (myBookings.length === 0) {
        tbody.append(`
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    <i class="fas fa-calendar-times fa-2x mb-2"></i>
                    <p>No bookings found</p>
                </td>
            </tr>
        `);
        return;
    }
    
    myBookings.forEach(booking => {
        const user = DataManager.getUsers().find(u => u.id === booking.userId);
        const statusClass = getStatusClass(booking.status);
        
        tbody.append(`
            <tr>
                <td><strong>#${booking.id.slice(-6)}</strong></td>
                <td>
                    <div class="d-flex align-items-center">
                        <i class="fas fa-paw text-primary me-2"></i>
                        <div>
                            <strong>${booking.petName}</strong>
                            <small class="text-muted d-block">${booking.petType}</small>
                        </div>
                    </div>
                </td>
                <td>${booking.serviceType}</td>
                <td>
                    <div>
                        <strong>${formatDate(booking.appointmentDate)}</strong>
                        <small class="text-muted d-block">${formatTime(booking.appointmentTime)}</small>
                    </div>
                </td>
                <td>
                    <div>
                        <strong>${user ? `${user.firstName} ${user.lastName}` : 'Unknown'}</strong>
                        <small class="text-muted d-block">${user ? user.email : ''}</small>
                    </div>
                </td>
                <td><span class="status-badge ${statusClass}">${booking.status}</span></td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary" onclick="viewBooking('${booking.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-success" onclick="startChat('${user ? user.id : ''}')">
                            <i class="fas fa-comments"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `);
    });
}

function loadCustomers() {
    const users = DataManager.getUsers().filter(u => u.userType === 'pet-owner');
    const bookings = DataManager.getBookings();
    
    const tbody = $('#customersTable');
    tbody.empty();
    
    if (users.length === 0) {
        tbody.append(`
            <tr>
                <td colspan="6" class="text-center text-muted py-4">
                    <i class="fas fa-users fa-2x mb-2"></i>
                    <p>No customers found</p>
                </td>
            </tr>
        `);
        return;
    }
    
    users.forEach(user => {
        const userBookings = bookings.filter(b => b.userId === user.id);
        const lastBooking = userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        
        tbody.append(`
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <i class="fas fa-user-circle text-primary me-2 fa-2x"></i>
                        <div>
                            <strong>${user.firstName} ${user.lastName}</strong>
                            <small class="text-muted d-block">Member since ${formatDate(user.createdAt.split('T')[0])}</small>
                        </div>
                    </div>
                </td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>
                    <span class="badge bg-primary">${userBookings.length}</span>
                </td>
                <td>${lastBooking ? formatDate(lastBooking.appointmentDate) : 'Never'}</td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary" onclick="viewCustomerHistory('${user.id}')">
                            <i class="fas fa-history"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-success" onclick="startChat('${user.id}')">
                            <i class="fas fa-comments"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `);
    });
}

function loadAvailability() {
    const currentUser = DataManager.getCurrentUser();
    const providers = DataManager.getProviders();
    const provider = providers.find(p => p.id === currentUser.id);
    
    const morningSlots = ['09:00', '10:00', '11:00'];
    const afternoonSlots = ['13:00', '14:00', '15:00', '16:00', '17:00'];
    
    const availability = provider ? provider.availability : [];
    
    // Load morning slots
    const morningContainer = $('#morningSlots');
    morningContainer.empty();
    morningSlots.forEach(time => {
        const isAvailable = availability.includes(time);
        morningContainer.append(`
            <div class="time-slot ${isAvailable ? 'available' : 'unavailable'}" 
                 onclick="toggleTimeSlot('${time}', this)">
                ${formatTime(time)}
            </div>
        `);
    });
    
    // Load afternoon slots
    const afternoonContainer = $('#afternoonSlots');
    afternoonContainer.empty();
    afternoonSlots.forEach(time => {
        const isAvailable = availability.includes(time);
        afternoonContainer.append(`
            <div class="time-slot ${isAvailable ? 'available' : 'unavailable'}" 
                 onclick="toggleTimeSlot('${time}', this)">
                ${formatTime(time)}
            </div>
        `);
    });
}

function loadConversations() {
    const currentUser = DataManager.getCurrentUser();
    const messages = DataManager.getMessages();
    const users = DataManager.getUsers();
    
    // Get unique conversations
    const conversations = new Map();
    messages.forEach(msg => {
        if (msg.senderId === currentUser.id || msg.receiverId === currentUser.id) {
            const otherUserId = msg.senderId === currentUser.id ? msg.receiverId : msg.senderId;
            if (!conversations.has(otherUserId)) {
                const otherUser = users.find(u => u.id === otherUserId);
                if (otherUser) {
                    conversations.set(otherUserId, {
                        user: otherUser,
                        lastMessage: msg,
                        unreadCount: 0
                    });
                }
            } else {
                const conv = conversations.get(otherUserId);
                if (new Date(msg.timestamp) > new Date(conv.lastMessage.timestamp)) {
                    conv.lastMessage = msg;
                }
            }
        }
    });
    
    const conversationList = $('#conversationList');
    conversationList.empty();
    
    if (conversations.size === 0) {
        conversationList.append(`
            <div class="text-center text-muted p-4">
                <i class="fas fa-comments fa-2x mb-2"></i>
                <p>No conversations yet</p>
            </div>
        `);
        return;
    }
    
    conversations.forEach((conv, userId) => {
        conversationList.append(`
            <div class="conversation-item" onclick="openConversation('${userId}')">
                <div class="d-flex align-items-center">
                    <i class="fas fa-user-circle text-primary me-2 fa-2x"></i>
                    <div class="flex-grow-1">
                        <strong>${conv.user.firstName} ${conv.user.lastName}</strong>
                        <p class="text-muted mb-0 small">${conv.lastMessage.content.substring(0, 30)}...</p>
                    </div>
                    <small class="text-muted">${formatTime(new Date(conv.lastMessage.timestamp).toTimeString().slice(0, 5))}</small>
                </div>
            </div>
        `);
    });
    
    updateMessageCount();
}

function viewBooking(bookingId) {
    currentBookingId = bookingId;
    const booking = DataManager.getBookings().find(b => b.id === bookingId);
    const user = DataManager.getUsers().find(u => u.id === booking.userId);
    
    const modalBody = $('#bookingModalBody');
    modalBody.html(`
        <div class="row">
            <div class="col-md-6">
                <h6>Pet Information</h6>
                <p><strong>Name:</strong> ${booking.petName}</p>
                <p><strong>Type:</strong> ${booking.petType}</p>
                <p><strong>Service:</strong> ${booking.serviceType}</p>
            </div>
            <div class="col-md-6">
                <h6>Appointment Details</h6>
                <p><strong>Date:</strong> ${formatDate(booking.appointmentDate)}</p>
                <p><strong>Time:</strong> ${formatTime(booking.appointmentTime)}</p>
                <p><strong>Status:</strong> <span class="status-badge ${getStatusClass(booking.status)}">${booking.status}</span></p>
            </div>
            <div class="col-12">
                <h6>Owner Information</h6>
                <p><strong>Name:</strong> ${user ? `${user.firstName} ${user.lastName}` : 'Unknown'}</p>
                <p><strong>Email:</strong> ${user ? user.email : 'Unknown'}</p>
                <p><strong>Phone:</strong> ${user ? user.phone : 'Unknown'}</p>
            </div>
            ${booking.notes ? `
                <div class="col-12">
                    <h6>Notes</h6>
                    <p>${booking.notes}</p>
                </div>
            ` : ''}
        </div>
    `);
    
    // Show/hide action buttons based on status
    $('#confirmBtn').toggle(booking.status === 'pending');
    $('#completeBtn').toggle(booking.status === 'confirmed');
    $('#cancelBtn').toggle(booking.status !== 'cancelled' && booking.status !== 'completed');
    
    const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
    modal.show();
}

function updateBookingStatus(newStatus) {
    if (!currentBookingId) return;
    
    DataManager.updateBooking(currentBookingId, { status: newStatus });
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
    modal.hide();
    
    // Refresh data
    loadDashboardData();
    loadAllBookings();
    
    showAlert(`Booking ${newStatus} successfully!`, 'success');
}

function toggleTimeSlot(time, element) {
    $(element).toggleClass('available unavailable');
}

function updateAvailability() {
    const currentUser = DataManager.getCurrentUser();
    const availableSlots = [];
    
    $('.time-slot.available').each(function() {
        const time = $(this).text().replace(/\s*(AM|PM)/, '');
        const hour = time.includes('PM') && !time.startsWith('12') ? 
                    (parseInt(time.split(':')[0]) + 12) + ':00' : 
                    time.includes('AM') && time.startsWith('12') ? 
                    '00:00' : 
                    time.replace(/\s*(AM|PM)/, '');
        availableSlots.push(hour);
    });
    
    // Update provider availability (in a real app, this would be an API call)
    const providers = DataManager.getProviders();
    const providerIndex = providers.findIndex(p => p.id === currentUser.id);
    if (providerIndex !== -1) {
        providers[providerIndex].availability = availableSlots;
        localStorage.setItem('pawpal_providers', JSON.stringify(providers));
    }
    
    showAlert('Availability updated successfully!', 'success');
}

function startChat(userId) {
    showSection('messages');
    setTimeout(() => openConversation(userId), 100);
}

function openConversation(userId) {
    currentConversation = userId;
    const user = DataManager.getUsers().find(u => u.id === userId);
    const currentUser = DataManager.getCurrentUser();
    
    // Update chat header
    $('#chatHeader').text(`Chat with ${user.firstName} ${user.lastName}`);
    
    // Load messages
    const messages = DataManager.getConversation(currentUser.id, userId);
    const chatMessages = $('#chatMessages');
    chatMessages.empty();
    
    if (messages.length === 0) {
        chatMessages.append(`
            <div class="text-center text-muted">
                <i class="fas fa-comments fa-2x mb-2"></i>
                <p>No messages yet. Start the conversation!</p>
            </div>
        `);
    } else {
        messages.forEach(msg => {
            const isSent = msg.senderId === currentUser.id;
            chatMessages.append(`
                <div class="message ${isSent ? 'sent' : 'received'}">
                    <div class="message-content">
                        ${msg.content}
                        <div class="message-time">${formatTime(new Date(msg.timestamp).toTimeString().slice(0, 5))}</div>
                    </div>
                </div>
            `);
        });
    }
    
    // Scroll to bottom
    chatMessages.scrollTop(chatMessages[0].scrollHeight);
    
    // Enable message input
    $('#messageInput').prop('disabled', false);
    $('#sendButton').prop('disabled', false);
    
    // Mark conversation as active
    $('.conversation-item').removeClass('active');
    $(`.conversation-item[onclick="openConversation('${userId}')"]`).addClass('active');
}

function sendMessage() {
    const messageText = $('#messageInput').val().trim();
    if (!messageText || !currentConversation) return;
    
    const currentUser = DataManager.getCurrentUser();
    const message = {
        senderId: currentUser.id,
        receiverId: currentConversation,
        content: messageText,
        type: 'text'
    };
    
    DataManager.addMessage(message);
    
    // Clear input
    $('#messageInput').val('');
    
    // Refresh conversation
    openConversation(currentConversation);
    loadConversations();
}

function updateMessageCount() {
    // In a real app, this would count unread messages
    $('#messageCount').text('0');
}

function filterBookings() {
    const filter = $('#bookingFilter').val();
    const rows = $('#allBookingsTable tr');
    
    rows.each(function() {
        const status = $(this).find('.status-badge').text().toLowerCase();
        if (filter === 'all' || status === filter) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

function searchCustomers() {
    const searchTerm = $('#customerSearch').val().toLowerCase();
    const rows = $('#customersTable tr');
    
    rows.each(function() {
        const text = $(this).text().toLowerCase();
        if (text.includes(searchTerm)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

function refreshData() {
    loadDashboardData();
    showAlert('Data refreshed successfully!', 'success');
}

function logout() {
    DataManager.logout();
    window.location.href = 'login.html';
}

function showProfile() {
    showAlert('Profile management coming soon!', 'info');
}

function showSettings() {
    showAlert('Settings panel coming soon!', 'info');
}

function viewCustomerHistory(userId) {
    const user = DataManager.getUsers().find(u => u.id === userId);
    const bookings = DataManager.getBookings().filter(b => b.userId === userId);
    
    showAlert(`${user.firstName} ${user.lastName} has ${bookings.length} total bookings.`, 'info');
}

// Utility functions
function getStatusClass(status) {
    switch(status) {
        case 'pending': return 'status-pending';
        case 'confirmed': return 'status-confirmed';
        case 'completed': return 'status-completed';
        case 'cancelled': return 'status-cancelled';
        default: return 'status-pending';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

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

// Handle message input enter key
$(document).on('keypress', '#messageInput', function(e) {
    if (e.which === 13) {
        sendMessage();
    }
});