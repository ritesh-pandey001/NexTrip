// Theme Management

class ThemeManager {
    constructor() {
        this.currentTheme = 'dark';
        this.themes = {
            dark: {
                name: 'Dark',
                icon: 'fas fa-moon',
                colors: {
                    primary: '#2563eb',
                    secondary: '#64748b',
                    accent: '#f59e0b',
                    success: '#10b981',
                    danger: '#ef4444',
                    warning: '#f59e0b',
                    
                    bgPrimary: '#0f172a',
                    bgSecondary: '#1e293b',
                    bgTertiary: '#334155',
                    bgCard: 'rgba(30, 41, 59, 0.8)',
                    bgOverlay: 'rgba(15, 23, 42, 0.95)',
                    
                    textPrimary: '#f8fafc',
                    textSecondary: '#cbd5e1',
                    textMuted: '#94a3b8',
                    textInverse: '#1e293b',
                    
                    borderPrimary: 'rgba(203, 213, 225, 0.1)',
                    borderSecondary: 'rgba(203, 213, 225, 0.05)'
                }
            },
            light: {
                name: 'Light',
                icon: 'fas fa-sun',
                colors: {
                    primary: '#2563eb',
                    secondary: '#64748b',
                    accent: '#f59e0b',
                    success: '#10b981',
                    danger: '#ef4444',
                    warning: '#f59e0b',
                    
                    bgPrimary: '#ffffff',
                    bgSecondary: '#f8fafc',
                    bgTertiary: '#e2e8f0',
                    bgCard: 'rgba(248, 250, 252, 0.9)',
                    bgOverlay: 'rgba(255, 255, 255, 0.95)',
                    
                    textPrimary: '#1e293b',
                    textSecondary: '#475569',
                    textMuted: '#64748b',
                    textInverse: '#f8fafc',
                    
                    borderPrimary: 'rgba(30, 41, 59, 0.1)',
                    borderSecondary: 'rgba(30, 41, 59, 0.05)'
                }
            },
            auto: {
                name: 'Auto',
                icon: 'fas fa-adjust',
                colors: null // Will be determined by system preference
            }
        };
        
        this.init();
    }

    init() {
        this.loadThemeFromStorage();
        this.applyTheme();
        this.setupEventListeners();
        this.setupSystemThemeListener();
    }

    loadThemeFromStorage() {
        const savedTheme = localStorage.getItem('nextrip_theme');
        if (savedTheme && this.themes[savedTheme]) {
            this.currentTheme = savedTheme;
        } else {
            // Default to auto if no preference saved
            this.currentTheme = 'auto';
        }
    }

    saveThemeToStorage() {
        localStorage.setItem('nextrip_theme', this.currentTheme);
    }

    setupEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for storage changes (for multi-tab sync)
        window.addEventListener('storage', (e) => {
            if (e.key === 'nextrip_theme') {
                this.currentTheme = e.newValue || 'auto';
                this.applyTheme();
            }
        });
    }

    setupSystemThemeListener() {
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addListener(() => {
            if (this.currentTheme === 'auto') {
                this.applyTheme();
            }
        });
    }

    toggleTheme() {
        const themeOrder = ['dark', 'light', 'auto'];
        const currentIndex = themeOrder.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themeOrder.length;
        
        this.setTheme(themeOrder[nextIndex]);
    }

    setTheme(themeName) {
        if (!this.themes[themeName]) {
            console.warn(`Theme "${themeName}" not found`);
            return;
        }

        this.currentTheme = themeName;
        this.saveThemeToStorage();
        this.applyTheme();
        this.updateThemeToggleButton();
        this.notifyThemeChange();

        // Show notification
        if (window.app) {
            window.app.showNotification('success', `Theme changed to ${this.themes[themeName].name}`);
        }
    }

    applyTheme() {
        const theme = this.getEffectiveTheme();
        const root = document.documentElement;

        // Set data-theme attribute
        root.setAttribute('data-theme', theme.name.toLowerCase());

        // Apply CSS custom properties
        if (theme.colors) {
            Object.entries(theme.colors).forEach(([key, value]) => {
                const cssVar = this.camelToKebab(key);
                root.style.setProperty(`--${cssVar}`, value);
            });
        }

        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);

        // Apply special styles for specific themes
        this.applyThemeSpecificStyles(theme);
    }

    getEffectiveTheme() {
        if (this.currentTheme === 'auto') {
            // Determine theme based on system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            return prefersDark ? this.themes.dark : this.themes.light;
        }

        return this.themes[this.currentTheme];
    }

    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }

        metaThemeColor.content = theme.colors?.bgPrimary || '#0f172a';
    }

    applyThemeSpecificStyles(theme) {
        // Remove existing theme classes
        document.body.classList.remove('theme-dark', 'theme-light');
        
        // Add current theme class
        document.body.classList.add(`theme-${theme.name.toLowerCase()}`);

        // Apply map theme if map is present
        this.updateMapTheme(theme);
    }

    updateMapTheme(theme) {
        if (window.mapManager && window.mapManager.map) {
            // Update map tile layer based on theme
            const map = window.mapManager.map;
            
            // Remove existing tile layers
            map.eachLayer((layer) => {
                if (layer instanceof L.TileLayer) {
                    map.removeLayer(layer);
                }
            });

            // Add appropriate tile layer
            let tileUrl;
            if (theme.name.toLowerCase() === 'dark') {
                tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
            } else {
                tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            }

            L.tileLayer(tileUrl, {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
        }
    }

    updateThemeToggleButton() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                // Clear all icon classes
                icon.className = '';
                // Add the appropriate icon
                icon.className = this.themes[this.currentTheme].icon;
            }
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getAvailableThemes() {
        return Object.keys(this.themes);
    }

    getThemeInfo(themeName) {
        return this.themes[themeName] || null;
    }

    camelToKebab(str) {
        return str.replace(/([A-Z])/g, '-$1').toLowerCase();
    }

    notifyThemeChange() {
        // Dispatch custom event for theme change
        const event = new CustomEvent('themeChanged', {
            detail: {
                theme: this.currentTheme,
                effectiveTheme: this.getEffectiveTheme()
            }
        });
        window.dispatchEvent(event);
    }

    // Custom theme creation
    createCustomTheme(name, colors) {
        if (this.themes[name]) {
            console.warn(`Theme "${name}" already exists and will be overwritten`);
        }

        this.themes[name] = {
            name: name.charAt(0).toUpperCase() + name.slice(1),
            icon: 'fas fa-palette',
            colors: colors,
            custom: true
        };

        return this.themes[name];
    }

    deleteCustomTheme(name) {
        if (!this.themes[name] || !this.themes[name].custom) {
            return false;
        }

        // If current theme is being deleted, switch to auto
        if (this.currentTheme === name) {
            this.setTheme('auto');
        }

        delete this.themes[name];
        return true;
    }

    // Export theme configuration
    exportTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) {
            return null;
        }

        const exportData = {
            name: themeName,
            theme: theme,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        return JSON.stringify(exportData, null, 2);
    }

    // Import theme configuration
    importTheme(themeData) {
        try {
            const parsed = typeof themeData === 'string' ? JSON.parse(themeData) : themeData;
            
            if (!parsed.name || !parsed.theme) {
                throw new Error('Invalid theme data format');
            }

            this.createCustomTheme(parsed.name, parsed.theme.colors);
            return { success: true, themeName: parsed.name };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Theme presets for quick switching
    getThemePresets() {
        return {
            'ocean': {
                name: 'Ocean',
                icon: 'fas fa-water',
                colors: {
                    ...this.themes.dark.colors,
                    primary: '#0ea5e9',
                    accent: '#06b6d4',
                    bgPrimary: '#0c1e27',
                    bgSecondary: '#134e4a',
                    bgTertiary: '#155e75'
                }
            },
            'forest': {
                name: 'Forest',
                icon: 'fas fa-tree',
                colors: {
                    ...this.themes.dark.colors,
                    primary: '#059669',
                    accent: '#84cc16',
                    bgPrimary: '#0f1f13',
                    bgSecondary: '#1e3a1e',
                    bgTertiary: '#2d5a2d'
                }
            },
            'sunset': {
                name: 'Sunset',
                icon: 'fas fa-sun',
                colors: {
                    ...this.themes.dark.colors,
                    primary: '#f97316',
                    accent: '#f59e0b',
                    bgPrimary: '#1f1408',
                    bgSecondary: '#3a2817',
                    bgTertiary: '#5a3c26'
                }
            },
            'minimal': {
                name: 'Minimal',
                icon: 'fas fa-circle',
                colors: {
                    ...this.themes.light.colors,
                    primary: '#374151',
                    secondary: '#6b7280',
                    accent: '#9ca3af',
                    bgPrimary: '#ffffff',
                    bgSecondary: '#f9fafb',
                    bgTertiary: '#f3f4f6'
                }
            }
        };
    }

    // Apply theme preset
    applyPreset(presetName) {
        const presets = this.getThemePresets();
        const preset = presets[presetName];
        
        if (!preset) {
            return { success: false, error: 'Preset not found' };
        }

        this.createCustomTheme(presetName, preset.colors);
        this.setTheme(presetName);
        
        return { success: true, themeName: presetName };
    }

    // Get system theme preference
    getSystemThemePreference() {
        if (window.matchMedia) {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                return 'light';
            }
        }
        return 'light'; // Default fallback
    }

    // Advanced: Generate theme based on image colors
    async generateThemeFromImage(imageUrl) {
        try {
            // This is a simplified example - in a real app you'd use a color extraction library
            const colors = await this.extractColorsFromImage(imageUrl);
            
            const customTheme = {
                primary: colors.primary,
                accent: colors.accent,
                bgPrimary: colors.dark,
                bgSecondary: colors.medium,
                bgTertiary: colors.light,
                textPrimary: colors.contrast,
                textSecondary: colors.muted,
                textMuted: colors.subtle
            };

            const themeName = `custom_${Date.now()}`;
            this.createCustomTheme(themeName, customTheme);
            
            return { success: true, themeName: themeName };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Helper method for color extraction (simplified)
    async extractColorsFromImage(imageUrl) {
        // This is a placeholder implementation
        // In a real app, you would use libraries like vibrant.js or colorthief
        return {
            primary: '#2563eb',
            accent: '#f59e0b',
            dark: '#1a1a1a',
            medium: '#333333',
            light: '#666666',
            contrast: '#ffffff',
            muted: '#cccccc',
            subtle: '#999999'
        };
    }
}

// Initialize theme manager
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

// Export for other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}