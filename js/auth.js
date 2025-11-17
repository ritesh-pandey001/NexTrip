// Authentication Management

class AuthManager {
    constructor() {
        this.user = null;
        this.authCallbacks = [];
        this.init();
    }

    init() {
        this.loadUserFromStorage();
        this.setupAuthListeners();
    }

    loadUserFromStorage() {
        const userData = localStorage.getItem('nextrip_user');
        if (userData) {
            try {
                this.user = JSON.parse(userData);
                this.notifyAuthChange(true);
            } catch (error) {
                console.error('Error loading user data:', error);
                this.clearUserData();
            }
        }
    }

    saveUserToStorage() {
        if (this.user) {
            localStorage.setItem('nextrip_user', JSON.stringify(this.user));
        } else {
            localStorage.removeItem('nextrip_user');
        }
    }

    setupAuthListeners() {
        // Listen for storage changes (for multi-tab sync)
        window.addEventListener('storage', (e) => {
            if (e.key === 'nextrip_user') {
                this.loadUserFromStorage();
            }
        });
    }

    async signIn(email, password) {
        try {
            // Simulate API call delay
            await this.delay(800);
            
            // Validate credentials
            if (!this.validateEmail(email)) {
                throw new Error('Please enter a valid email address');
            }
            
            if (!password || password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }
            
            // Simulate user lookup
            const userData = this.simulateUserLookup(email, password);
            
            if (!userData) {
                throw new Error('Invalid email or password');
            }
            
            this.user = userData;
            this.saveUserToStorage();
            this.notifyAuthChange(true);
            
            return { success: true, user: this.user };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async signUp(name, email, password, confirmPassword) {
        try {
            // Simulate API call delay
            await this.delay(1000);
            
            // Validate input
            if (!name || name.trim().length < 2) {
                throw new Error('Name must be at least 2 characters long');
            }
            
            if (!this.validateEmail(email)) {
                throw new Error('Please enter a valid email address');
            }
            
            if (!password || password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }
            
            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }
            
            // Check if user already exists
            if (this.userExists(email)) {
                throw new Error('An account with this email already exists');
            }
            
            // Create new user
            this.user = {
                id: Date.now(),
                name: name.trim(),
                email: email.toLowerCase().trim(),
                tier: 'Free',
                points: 50, // Welcome bonus
                joinDate: new Date().toISOString(),
                avatar: name.charAt(0).toUpperCase(),
                preferences: {
                    notifications: true,
                    newsletter: true,
                    theme: 'dark'
                },
                stats: {
                    tripsCompleted: 0,
                    countriesVisited: 0,
                    totalDistance: 0,
                    badgesEarned: 0
                }
            };
            
            this.saveUserToStorage();
            this.notifyAuthChange(true);
            
            return { success: true, user: this.user };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    signOut() {
        this.user = null;
        this.clearUserData();
        this.notifyAuthChange(false);
        
        // Clear all app data
        this.clearAllAppData();
        
        return { success: true };
    }

    clearUserData() {
        localStorage.removeItem('nextrip_user');
    }

    clearAllAppData() {
        // Clear all app-related data
        const keysToRemove = [
            'nextrip_trips',
            'nextrip_memories',
            'nextrip_preferences',
            'nextrip_cache'
        ];
        
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
        });
    }

    updateUser(updates) {
        if (!this.user) {
            return { success: false, error: 'No user logged in' };
        }
        
        try {
            this.user = { ...this.user, ...updates };
            this.saveUserToStorage();
            this.notifyAuthChange(true);
            
            return { success: true, user: this.user };
            
        } catch (error) {
            return { success: false, error: 'Failed to update user data' };
        }
    }

    updatePreferences(preferences) {
        if (!this.user) {
            return { success: false, error: 'No user logged in' };
        }
        
        this.user.preferences = { ...this.user.preferences, ...preferences };
        this.saveUserToStorage();
        this.notifyAuthChange(true);
        
        return { success: true, preferences: this.user.preferences };
    }

    addPoints(points) {
        if (!this.user) return false;
        
        this.user.points += points;
        this.saveUserToStorage();
        this.notifyAuthChange(true);
        
        return true;
    }

    deductPoints(points) {
        if (!this.user || this.user.points < points) {
            return false;
        }
        
        this.user.points -= points;
        this.saveUserToStorage();
        this.notifyAuthChange(true);
        
        return true;
    }

    upgradeUserTier(newTier) {
        if (!this.user) {
            return { success: false, error: 'No user logged in' };
        }
        
        const validTiers = ['Free', 'Pro', 'Premium'];
        if (!validTiers.includes(newTier)) {
            return { success: false, error: 'Invalid tier' };
        }
        
        this.user.tier = newTier;
        this.saveUserToStorage();
        this.notifyAuthChange(true);
        
        return { success: true, tier: newTier };
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    userExists(email) {
        // Simulate checking if user exists
        const existingUsers = [
            'demo@nextrip.com',
            'test@example.com'
        ];
        
        return existingUsers.includes(email.toLowerCase());
    }

    simulateUserLookup(email, password) {
        // Simulate user database lookup
        const demoUsers = {
            'demo@nextrip.com': {
                id: 1,
                name: 'Demo User',
                email: 'demo@nextrip.com',
                tier: 'Pro',
                points: 150,
                joinDate: '2024-01-01T00:00:00.000Z',
                avatar: 'D',
                preferences: {
                    notifications: true,
                    newsletter: true,
                    theme: 'dark'
                },
                stats: {
                    tripsCompleted: 5,
                    countriesVisited: 8,
                    totalDistance: 15000,
                    badgesEarned: 3
                }
            }
        };
        
        const user = demoUsers[email.toLowerCase()];
        
        // Simple password check (in real app, use proper authentication)
        if (user && password.length >= 6) {
            return user;
        }
        
        return null;
    }

    isAuthenticated() {
        return this.user !== null;
    }

    getUser() {
        return this.user;
    }

    getUserId() {
        return this.user ? this.user.id : null;
    }

    getUserName() {
        return this.user ? this.user.name : null;
    }

    getUserEmail() {
        return this.user ? this.user.email : null;
    }

    getUserTier() {
        return this.user ? this.user.tier : 'Free';
    }

    getUserPoints() {
        return this.user ? this.user.points : 0;
    }

    getUserPreferences() {
        return this.user ? this.user.preferences : {};
    }

    getUserStats() {
        return this.user ? this.user.stats : {};
    }

    hasPermission(permission) {
        if (!this.user) return false;
        
        const tierPermissions = {
            'Free': ['basic_features', 'map_access', 'trip_planning'],
            'Pro': ['basic_features', 'map_access', 'trip_planning', 'ai_suggestions', 'advanced_analytics'],
            'Premium': ['basic_features', 'map_access', 'trip_planning', 'ai_suggestions', 'advanced_analytics', 'team_features', 'api_access']
        };
        
        const userPermissions = tierPermissions[this.user.tier] || tierPermissions['Free'];
        return userPermissions.includes(permission);
    }

    onAuthChange(callback) {
        this.authCallbacks.push(callback);
        
        // Return unsubscribe function
        return () => {
            this.authCallbacks = this.authCallbacks.filter(cb => cb !== callback);
        };
    }

    notifyAuthChange(isAuthenticated) {
        this.authCallbacks.forEach(callback => {
            try {
                callback(isAuthenticated, this.user);
            } catch (error) {
                console.error('Error in auth callback:', error);
            }
        });
    }

    async resetPassword(email) {
        try {
            await this.delay(1000);
            
            if (!this.validateEmail(email)) {
                throw new Error('Please enter a valid email address');
            }
            
            if (!this.userExists(email)) {
                throw new Error('No account found with this email address');
            }
            
            // Simulate sending reset email
            return { 
                success: true, 
                message: 'Password reset instructions have been sent to your email' 
            };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async changePassword(currentPassword, newPassword, confirmPassword) {
        try {
            if (!this.user) {
                throw new Error('No user logged in');
            }
            
            if (!currentPassword || !newPassword || !confirmPassword) {
                throw new Error('All password fields are required');
            }
            
            if (newPassword !== confirmPassword) {
                throw new Error('New passwords do not match');
            }
            
            if (newPassword.length < 6) {
                throw new Error('New password must be at least 6 characters long');
            }
            
            // Simulate password validation and update
            await this.delay(800);
            
            return { success: true, message: 'Password updated successfully' };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async deleteAccount() {
        try {
            if (!this.user) {
                throw new Error('No user logged in');
            }
            
            // Simulate account deletion
            await this.delay(1000);
            
            this.signOut();
            
            return { success: true, message: 'Account deleted successfully' };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    exportUserData() {
        if (!this.user) {
            return { success: false, error: 'No user logged in' };
        }
        
        const userData = {
            user: this.user,
            trips: JSON.parse(localStorage.getItem('nextrip_trips')) || [],
            memories: JSON.parse(localStorage.getItem('nextrip_memories')) || [],
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `nextrip-data-${this.user.id}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return { success: true, message: 'User data exported successfully' };
    }

    getSessionInfo() {
        return {
            isAuthenticated: this.isAuthenticated(),
            user: this.user,
            sessionStart: localStorage.getItem('nextrip_session_start'),
            lastActivity: localStorage.getItem('nextrip_last_activity')
        };
    }
}

// Initialize auth manager
window.authManager = new AuthManager();

// Export for other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}