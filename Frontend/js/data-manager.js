// Data Manager - Handles all data operations using localStorage as JSON storage

class DataManager {
    // Initialize default data structure
    static init() {
        if (!localStorage.getItem('pawpal_users')) {
            this.initializeDefaultData();
        }
    }

    static initializeDefaultData() {
        // Default users
        const defaultUsers = [
            {
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                phone: '+1234567890',
                password: 'password123',
                userType: 'pet-owner',
                newsletter: true,
                createdAt: '2024-01-01T00:00:00.000Z',
                isActive: true
            },
            {
                id: '2',
                firstName: 'Dr. Sarah',
                lastName: 'Johnson',
                email: 'sarah@pawpal.com',
                phone: '+1234567891',
                password: 'staff123',
                userType: 'care-provider',
                newsletter: false,
                createdAt: '2024-01-01T00:00:00.000Z',
                isActive: true,
                specialization: 'Veterinarian'
            },
            {
                id: '3',
                firstName: 'Mike',
                lastName: 'Chen',
                email: 'mike@pawpal.com',
                phone: '+1234567892',
                password: 'staff123',
                userType: 'care-provider',
                newsletter: false,
                createdAt: '2024-01-01T00:00:00.000Z',
                isActive: true,
                specialization: 'Groomer'
            }
        ];

        // Default bookings
        const defaultBookings = [
            {
                id: '1',
                userId: '1',
                serviceType: 'Professional Grooming',
                petName: 'Buddy',
                petType: 'dog',
                appointmentDate: '2024-12-25',
                appointmentTime: '10:00',
                status: 'confirmed',
                providerId: '3',
                providerName: 'Mike Chen',
                createdAt: '2024-12-20T10:00:00.000Z',
                notes: 'First time grooming, very friendly dog'
            },
            {
                id: '2',
                userId: '1',
                serviceType: 'Veterinary Care',
                petName: 'Whiskers',
                petType: 'cat',
                appointmentDate: '2024-12-26',
                appointmentTime: '14:00',
                status: 'pending',
                providerId: '2',
                providerName: 'Dr. Sarah Johnson',
                createdAt: '2024-12-20T11:00:00.000Z',
                notes: 'Annual checkup'
            },
            {
                id: '3',
                userId: '1',
                serviceType: 'Pet Training',
                petName: 'Max',
                petType: 'dog',
                appointmentDate: '2024-12-24',
                appointmentTime: '09:00',
                status: 'completed',
                providerId: '2',
                providerName: 'Dr. Sarah Johnson',
                createdAt: '2024-12-19T09:00:00.000Z',
                notes: 'Basic obedience training completed successfully'
            }
        ];

        // Default care providers
        const defaultProviders = [
            {
                id: '2',
                name: 'Dr. Sarah Johnson',
                specialization: 'Veterinarian',
                services: ['Veterinary Care', 'Emergency Care'],
                rating: 4.9,
                experience: '15+ years',
                availability: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
                phone: '+1234567891',
                email: 'sarah@pawpal.com'
            },
            {
                id: '3',
                name: 'Mike Chen',
                specialization: 'Professional Groomer',
                services: ['Professional Grooming'],
                rating: 4.8,
                experience: '8+ years',
                availability: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'],
                phone: '+1234567892',
                email: 'mike@pawpal.com'
            },
            {
                id: '4',
                name: 'Emma Wilson',
                specialization: 'Pet Trainer',
                services: ['Pet Training'],
                rating: 4.7,
                experience: '6+ years',
                availability: ['10:00', '11:00', '14:00', '15:00', '16:00'],
                phone: '+1234567893',
                email: 'emma@pawpal.com'
            }
        ];

        // Default reminders
        const defaultReminders = [
            {
                id: '1',
                bookingId: '1',
                userId: '1',
                reminderTime: new Date(new Date('2024-12-25T10:00:00.000Z').getTime() - 30 * 60000).toISOString(),
                message: 'Reminder: Your grooming appointment for Buddy is in 30 minutes',
                sent: false,
                createdAt: '2024-12-20T10:00:00.000Z'
            },
            {
                id: '2',
                bookingId: '2',
                userId: '1',
                reminderTime: new Date(new Date('2024-12-26T14:00:00.000Z').getTime() - 30 * 60000).toISOString(),
                message: 'Reminder: Your veterinary appointment for Whiskers is in 30 minutes',
                sent: false,
                createdAt: '2024-12-20T11:00:00.000Z'
            }
        ];

        // Save to localStorage
        localStorage.setItem('pawpal_users', JSON.stringify(defaultUsers));
        localStorage.setItem('pawpal_bookings', JSON.stringify(defaultBookings));
        localStorage.setItem('pawpal_providers', JSON.stringify(defaultProviders));
        localStorage.setItem('pawpal_reminders', JSON.stringify(defaultReminders));
    }

    // User Management
    static getUsers() {
        return JSON.parse(localStorage.getItem('pawpal_users') || '[]');
    }

    static addUser(user) {
        const users = this.getUsers();
        users.push(user);
        localStorage.setItem('pawpal_users', JSON.stringify(users));
    }

    static updateUser(userId, updates) {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            localStorage.setItem('pawpal_users', JSON.stringify(users));
        }
    }

    static getCurrentUser() {
        return JSON.parse(localStorage.getItem('pawpal_current_user') || 'null');
    }

    static setCurrentUser(user) {
        localStorage.setItem('pawpal_current_user', JSON.stringify(user));
    }

    static logout() {
        localStorage.removeItem('pawpal_current_user');
        localStorage.removeItem('rememberUser');
    }

    // Booking Management
    static getBookings() {
        return JSON.parse(localStorage.getItem('pawpal_bookings') || '[]');
    }

    static addBooking(booking) {
        const bookings = this.getBookings();
        booking.id = Date.now().toString();
        booking.createdAt = new Date().toISOString();
        bookings.push(booking);
        localStorage.setItem('pawpal_bookings', JSON.stringify(bookings));
        
        // Create reminder
        this.createReminder(booking);
        
        return booking;
    }

    static updateBooking(bookingId, updates) {
        const bookings = this.getBookings();
        const bookingIndex = bookings.findIndex(b => b.id === bookingId);
        if (bookingIndex !== -1) {
            bookings[bookingIndex] = { ...bookings[bookingIndex], ...updates };
            localStorage.setItem('pawpal_bookings', JSON.stringify(bookings));
        }
    }

    static getUserBookings(userId) {
        return this.getBookings().filter(b => b.userId === userId);
    }

    static getProviderBookings(providerId) {
        return this.getBookings().filter(b => b.providerId === providerId);
    }

    // Provider Management
    static getProviders() {
        return JSON.parse(localStorage.getItem('pawpal_providers') || '[]');
    }

    static getProviderByService(serviceType) {
        const providers = this.getProviders();
        return providers.filter(p => p.services.includes(serviceType));
    }

    // Reminder Management
    static getReminders() {
        return JSON.parse(localStorage.getItem('pawpal_reminders') || '[]');
    }

    static createReminder(booking) {
        const reminders = this.getReminders();
        const appointmentDateTime = new Date(`${booking.appointmentDate}T${booking.appointmentTime}:00.000Z`);
        const reminderTime = new Date(appointmentDateTime.getTime() - 30 * 60000); // 30 minutes before
        
        const reminder = {
            id: Date.now().toString(),
            bookingId: booking.id,
            userId: booking.userId,
            reminderTime: reminderTime.toISOString(),
            message: `Reminder: Your ${booking.serviceType.toLowerCase()} appointment for ${booking.petName} is in 30 minutes`,
            sent: false,
            createdAt: new Date().toISOString()
        };
        
        reminders.push(reminder);
        localStorage.setItem('pawpal_reminders', JSON.stringify(reminders));
    }

    static checkAndSendReminders() {
        const reminders = this.getReminders();
        const now = new Date();
        
        reminders.forEach(reminder => {
            if (!reminder.sent && new Date(reminder.reminderTime) <= now) {
                this.sendReminder(reminder);
                reminder.sent = true;
            }
        });
        
        localStorage.setItem('pawpal_reminders', JSON.stringify(reminders));
    }

    static sendReminder(reminder) {
        // In a real app, this would send an actual notification
        // For demo purposes, we'll show a browser notification if supported
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('PawPal Reminder', {
                body: reminder.message,
                icon: '/favicon.ico'
            });
        } else {
            // Fallback to console log for demo
            console.log('Reminder:', reminder.message);
        }
    }

    // Communication Management
    static getMessages() {
        return JSON.parse(localStorage.getItem('pawpal_messages') || '[]');
    }

    static addMessage(message) {
        const messages = this.getMessages();
        message.id = Date.now().toString();
        message.timestamp = new Date().toISOString();
        messages.push(message);
        localStorage.setItem('pawpal_messages', JSON.stringify(messages));
        return message;
    }

    static getConversation(userId, providerId) {
        const messages = this.getMessages();
        return messages.filter(m => 
            (m.senderId === userId && m.receiverId === providerId) ||
            (m.senderId === providerId && m.receiverId === userId)
        ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }

    // Statistics for dashboard
    static getStats() {
        const bookings = this.getBookings();
        const users = this.getUsers();
        const providers = this.getProviders();
        
        return {
            totalBookings: bookings.length,
            totalUsers: users.filter(u => u.userType === 'pet-owner').length,
            totalProviders: providers.length,
            pendingBookings: bookings.filter(b => b.status === 'pending').length,
            completedBookings: bookings.filter(b => b.status === 'completed').length,
            todayBookings: bookings.filter(b => b.appointmentDate === new Date().toISOString().split('T')[0]).length
        };
    }
}

// Initialize data when script loads
DataManager.init();

// Check for reminders every minute
setInterval(() => {
    DataManager.checkAndSendReminders();
}, 60000);

// Request notification permission on page load
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}