// Trip Management

class TripManager {
    constructor() {
        this.trips = [];
        this.currentTrip = null;
        this.tripCallbacks = [];
        this.init();
    }

    init() {
        this.loadTripsFromStorage();
        this.setupEventListeners();
    }

    loadTripsFromStorage() {
        const tripsData = localStorage.getItem('nextrip_trips');
        if (tripsData) {
            try {
                this.trips = JSON.parse(tripsData);
                this.notifyTripsChange();
            } catch (error) {
                console.error('Error loading trips data:', error);
                this.trips = [];
            }
        }
    }

    saveTripsToStorage() {
        localStorage.setItem('nextrip_trips', JSON.stringify(this.trips));
        this.notifyTripsChange();
    }

    setupEventListeners() {
        // Listen for storage changes (for multi-tab sync)
        window.addEventListener('storage', (e) => {
            if (e.key === 'nextrip_trips') {
                this.loadTripsFromStorage();
            }
        });
    }

    createTrip(tripData) {
        try {
            // Validate required fields
            if (!tripData.name || !tripData.destination) {
                throw new Error('Trip name and destination are required');
            }

            // Validate dates
            if (tripData.startDate && tripData.endDate) {
                const start = new Date(tripData.startDate);
                const end = new Date(tripData.endDate);
                
                if (start >= end) {
                    throw new Error('End date must be after start date');
                }
                
                if (start < new Date().setHours(0, 0, 0, 0)) {
                    throw new Error('Start date cannot be in the past');
                }
            }

            // Create new trip object
            const newTrip = {
                id: Date.now() + Math.random(),
                name: tripData.name.trim(),
                destination: tripData.destination.trim(),
                startDate: tripData.startDate || null,
                endDate: tripData.endDate || null,
                budget: parseFloat(tripData.budget) || 0,
                travelClass: tripData.travelClass || 'economy',
                description: tripData.description?.trim() || '',
                status: 'planned',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                userId: window.authManager?.getUserId(),
                itinerary: [],
                expenses: [],
                photos: [],
                notes: '',
                tags: [],
                coordinates: null,
                weather: null,
                bookings: {
                    flights: [],
                    hotels: [],
                    activities: []
                },
                checklist: [],
                documents: []
            };

            // Add trip to array
            this.trips.push(newTrip);
            this.saveTripsToStorage();

            // Award points for creating trip
            if (window.authManager) {
                window.authManager.addPoints(10);
            }

            return { success: true, trip: newTrip };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    updateTrip(tripId, updates) {
        try {
            const tripIndex = this.trips.findIndex(trip => trip.id === tripId);
            
            if (tripIndex === -1) {
                throw new Error('Trip not found');
            }

            // Validate updates
            if (updates.name !== undefined && !updates.name.trim()) {
                throw new Error('Trip name cannot be empty');
            }

            if (updates.destination !== undefined && !updates.destination.trim()) {
                throw new Error('Destination cannot be empty');
            }

            // Validate dates if provided
            if (updates.startDate || updates.endDate) {
                const currentTrip = this.trips[tripIndex];
                const start = new Date(updates.startDate || currentTrip.startDate);
                const end = new Date(updates.endDate || currentTrip.endDate);
                
                if (start >= end) {
                    throw new Error('End date must be after start date');
                }
            }

            // Apply updates
            this.trips[tripIndex] = {
                ...this.trips[tripIndex],
                ...updates,
                updatedAt: new Date().toISOString()
            };

            this.saveTripsToStorage();

            return { success: true, trip: this.trips[tripIndex] };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    deleteTrip(tripId) {
        try {
            const tripIndex = this.trips.findIndex(trip => trip.id === tripId);
            
            if (tripIndex === -1) {
                throw new Error('Trip not found');
            }

            const deletedTrip = this.trips.splice(tripIndex, 1)[0];
            this.saveTripsToStorage();

            // Clear current trip if it was deleted
            if (this.currentTrip && this.currentTrip.id === tripId) {
                this.currentTrip = null;
            }

            return { success: true, trip: deletedTrip };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    getTrip(tripId) {
        return this.trips.find(trip => trip.id === tripId) || null;
    }

    getAllTrips() {
        return [...this.trips];
    }

    getUserTrips(userId) {
        if (!userId) {
            userId = window.authManager?.getUserId();
        }
        
        return this.trips.filter(trip => trip.userId === userId);
    }

    searchTrips(query) {
        const lowercaseQuery = query.toLowerCase();
        
        return this.trips.filter(trip => 
            trip.name.toLowerCase().includes(lowercaseQuery) ||
            trip.destination.toLowerCase().includes(lowercaseQuery) ||
            trip.description.toLowerCase().includes(lowercaseQuery) ||
            trip.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
        );
    }

    getTripsStats() {
        const userTrips = this.getUserTrips();
        
        return {
            total: userTrips.length,
            planned: userTrips.filter(trip => trip.status === 'planned').length,
            active: userTrips.filter(trip => trip.status === 'active').length,
            completed: userTrips.filter(trip => trip.status === 'completed').length,
            totalBudget: userTrips.reduce((sum, trip) => sum + (trip.budget || 0), 0),
            averageBudget: userTrips.length > 0 
                ? userTrips.reduce((sum, trip) => sum + (trip.budget || 0), 0) / userTrips.length 
                : 0,
            destinations: [...new Set(userTrips.map(trip => trip.destination))],
            countries: [...new Set(userTrips.map(trip => {
                const parts = trip.destination.split(',');
                return parts.length > 1 ? parts[1].trim() : trip.destination;
            }))],
            upcomingTrips: userTrips.filter(trip => {
                if (!trip.startDate) return false;
                return new Date(trip.startDate) > new Date() && trip.status !== 'completed';
            }),
            recentTrips: userTrips
                .filter(trip => trip.status === 'completed')
                .sort((a, b) => new Date(b.endDate || b.updatedAt) - new Date(a.endDate || a.updatedAt))
                .slice(0, 5)
        };
    }

    setCurrentTrip(tripId) {
        const trip = this.getTrip(tripId);
        if (trip) {
            this.currentTrip = trip;
            localStorage.setItem('nextrip_current_trip', tripId.toString());
            return { success: true, trip: trip };
        }
        
        return { success: false, error: 'Trip not found' };
    }

    getCurrentTrip() {
        if (!this.currentTrip) {
            const currentTripId = localStorage.getItem('nextrip_current_trip');
            if (currentTripId) {
                this.currentTrip = this.getTrip(parseInt(currentTripId));
            }
        }
        
        return this.currentTrip;
    }

    addItineraryItem(tripId, item) {
        try {
            const trip = this.getTrip(tripId);
            if (!trip) {
                throw new Error('Trip not found');
            }

            const itineraryItem = {
                id: Date.now() + Math.random(),
                title: item.title || '',
                description: item.description || '',
                startTime: item.startTime || null,
                endTime: item.endTime || null,
                location: item.location || '',
                type: item.type || 'activity', // activity, transport, accommodation, meal
                status: 'planned',
                cost: parseFloat(item.cost) || 0,
                notes: item.notes || '',
                createdAt: new Date().toISOString()
            };

            trip.itinerary.push(itineraryItem);
            trip.updatedAt = new Date().toISOString();
            
            this.saveTripsToStorage();

            return { success: true, item: itineraryItem };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    updateItineraryItem(tripId, itemId, updates) {
        try {
            const trip = this.getTrip(tripId);
            if (!trip) {
                throw new Error('Trip not found');
            }

            const itemIndex = trip.itinerary.findIndex(item => item.id === itemId);
            if (itemIndex === -1) {
                throw new Error('Itinerary item not found');
            }

            trip.itinerary[itemIndex] = {
                ...trip.itinerary[itemIndex],
                ...updates,
                updatedAt: new Date().toISOString()
            };

            trip.updatedAt = new Date().toISOString();
            this.saveTripsToStorage();

            return { success: true, item: trip.itinerary[itemIndex] };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    deleteItineraryItem(tripId, itemId) {
        try {
            const trip = this.getTrip(tripId);
            if (!trip) {
                throw new Error('Trip not found');
            }

            const itemIndex = trip.itinerary.findIndex(item => item.id === itemId);
            if (itemIndex === -1) {
                throw new Error('Itinerary item not found');
            }

            const deletedItem = trip.itinerary.splice(itemIndex, 1)[0];
            trip.updatedAt = new Date().toISOString();
            
            this.saveTripsToStorage();

            return { success: true, item: deletedItem };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    addExpense(tripId, expense) {
        try {
            const trip = this.getTrip(tripId);
            if (!trip) {
                throw new Error('Trip not found');
            }

            const expenseItem = {
                id: Date.now() + Math.random(),
                title: expense.title || '',
                amount: parseFloat(expense.amount) || 0,
                currency: expense.currency || 'USD',
                category: expense.category || 'other',
                date: expense.date || new Date().toISOString().split('T')[0],
                description: expense.description || '',
                receipt: expense.receipt || null,
                createdAt: new Date().toISOString()
            };

            trip.expenses.push(expenseItem);
            trip.updatedAt = new Date().toISOString();
            
            this.saveTripsToStorage();

            return { success: true, expense: expenseItem };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    getTripExpenses(tripId) {
        const trip = this.getTrip(tripId);
        return trip ? trip.expenses : [];
    }

    getTripExpensesSummary(tripId) {
        const expenses = this.getTripExpenses(tripId);
        
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const byCategory = {};
        
        expenses.forEach(expense => {
            if (!byCategory[expense.category]) {
                byCategory[expense.category] = 0;
            }
            byCategory[expense.category] += expense.amount;
        });

        return {
            total,
            count: expenses.length,
            byCategory,
            average: expenses.length > 0 ? total / expenses.length : 0
        };
    }

    addChecklistItem(tripId, item) {
        try {
            const trip = this.getTrip(tripId);
            if (!trip) {
                throw new Error('Trip not found');
            }

            const checklistItem = {
                id: Date.now() + Math.random(),
                title: item.title || '',
                completed: false,
                category: item.category || 'general',
                priority: item.priority || 'medium',
                createdAt: new Date().toISOString()
            };

            trip.checklist.push(checklistItem);
            trip.updatedAt = new Date().toISOString();
            
            this.saveTripsToStorage();

            return { success: true, item: checklistItem };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    toggleChecklistItem(tripId, itemId) {
        try {
            const trip = this.getTrip(tripId);
            if (!trip) {
                throw new Error('Trip not found');
            }

            const item = trip.checklist.find(item => item.id === itemId);
            if (!item) {
                throw new Error('Checklist item not found');
            }

            item.completed = !item.completed;
            item.completedAt = item.completed ? new Date().toISOString() : null;
            trip.updatedAt = new Date().toISOString();
            
            this.saveTripsToStorage();

            // Award points for completing checklist items
            if (item.completed && window.authManager) {
                window.authManager.addPoints(2);
            }

            return { success: true, item: item };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    duplicateTrip(tripId) {
        try {
            const originalTrip = this.getTrip(tripId);
            if (!originalTrip) {
                throw new Error('Trip not found');
            }

            const duplicatedTrip = {
                ...originalTrip,
                id: Date.now() + Math.random(),
                name: `${originalTrip.name} (Copy)`,
                status: 'planned',
                startDate: null,
                endDate: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                expenses: [],
                photos: [],
                // Reset dynamic data but keep itinerary and checklist as templates
                itinerary: originalTrip.itinerary.map(item => ({
                    ...item,
                    id: Date.now() + Math.random() + Math.random(),
                    status: 'planned',
                    startTime: null,
                    endTime: null
                })),
                checklist: originalTrip.checklist.map(item => ({
                    ...item,
                    id: Date.now() + Math.random() + Math.random(),
                    completed: false,
                    completedAt: null
                }))
            };

            this.trips.push(duplicatedTrip);
            this.saveTripsToStorage();

            return { success: true, trip: duplicatedTrip };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    exportTrip(tripId, format = 'json') {
        try {
            const trip = this.getTrip(tripId);
            if (!trip) {
                throw new Error('Trip not found');
            }

            let content, mimeType, filename;

            switch (format) {
                case 'json':
                    content = JSON.stringify(trip, null, 2);
                    mimeType = 'application/json';
                    filename = `trip-${trip.name.replace(/[^a-zA-Z0-9]/g, '-')}.json`;
                    break;
                
                case 'csv':
                    content = this.convertTripToCSV(trip);
                    mimeType = 'text/csv';
                    filename = `trip-${trip.name.replace(/[^a-zA-Z0-9]/g, '-')}.csv`;
                    break;
                
                default:
                    throw new Error('Unsupported export format');
            }

            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            return { success: true, filename: filename };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    convertTripToCSV(trip) {
        const rows = [
            ['Trip Information'],
            ['Name', trip.name],
            ['Destination', trip.destination],
            ['Start Date', trip.startDate || ''],
            ['End Date', trip.endDate || ''],
            ['Budget', trip.budget || ''],
            ['Status', trip.status],
            [''],
            ['Itinerary'],
            ['Title', 'Description', 'Start Time', 'End Time', 'Location', 'Type', 'Cost']
        ];

        trip.itinerary.forEach(item => {
            rows.push([
                item.title,
                item.description,
                item.startTime || '',
                item.endTime || '',
                item.location,
                item.type,
                item.cost || ''
            ]);
        });

        if (trip.expenses.length > 0) {
            rows.push([''], ['Expenses'], ['Title', 'Amount', 'Currency', 'Category', 'Date']);
            trip.expenses.forEach(expense => {
                rows.push([
                    expense.title,
                    expense.amount,
                    expense.currency,
                    expense.category,
                    expense.date
                ]);
            });
        }

        return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    }

    onTripsChange(callback) {
        this.tripCallbacks.push(callback);
        
        return () => {
            this.tripCallbacks = this.tripCallbacks.filter(cb => cb !== callback);
        };
    }

    notifyTripsChange() {
        this.tripCallbacks.forEach(callback => {
            try {
                callback(this.trips);
            } catch (error) {
                console.error('Error in trip callback:', error);
            }
        });
    }

    getUpcomingTrips(limit = 5) {
        return this.getUserTrips()
            .filter(trip => {
                if (!trip.startDate) return false;
                return new Date(trip.startDate) > new Date() && trip.status !== 'completed';
            })
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
            .slice(0, limit);
    }

    getRecentTrips(limit = 5) {
        return this.getUserTrips()
            .filter(trip => trip.status === 'completed')
            .sort((a, b) => new Date(b.endDate || b.updatedAt) - new Date(a.endDate || a.updatedAt))
            .slice(0, limit);
    }

    startTrip(tripId) {
        return this.updateTrip(tripId, { 
            status: 'active',
            actualStartDate: new Date().toISOString()
        });
    }

    completeTrip(tripId) {
        return this.updateTrip(tripId, { 
            status: 'completed',
            actualEndDate: new Date().toISOString()
        });
    }

    cancelTrip(tripId) {
        return this.updateTrip(tripId, { 
            status: 'cancelled',
            cancelledAt: new Date().toISOString()
        });
    }
}

// Initialize trip manager
window.tripManager = new TripManager();

// Export for other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TripManager;
}