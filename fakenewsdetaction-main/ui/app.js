/**
 * Veritas AI - Fake News Detection API Frontend JavaScript
 * Controls tactile interactions, fluid micro-animations, dynamic glassmorphism, and API state
 */

class FakeNewsDetector {
    constructor() {
        this.API_BASE_URL = 'http://localhost:8080';
        this.isAnalyzing = false;
        
        // Initialize DOM elements
        this.initElements();
        
        // Bind core event listeners & interaction dynamics
        this.bindEvents();
        this.initScrollNavbar();
        this.initScrollReveal();
        this.initMagneticButtons();
        this.initRippleEffects();
        
        // Check API health status on load
        this.checkApiHealth();
    }

    /**
     * Initialize DOM element references
     */
    initElements() {
        // Navigation & Layout
        this.navbar = document.getElementById('navbar');
        
        // Input elements
        this.newsTextarea = document.getElementById('newsText');
        this.charCountSpan = document.getElementById('charCount');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        
        // Results elements
        this.resultsCard = document.getElementById('resultsCard');
        this.loadingState = document.getElementById('loadingState');
        this.resultsContent = document.getElementById('resultsContent');
        this.errorState = document.getElementById('errorState');
        
        // Result content elements
        this.predictionBadge = document.getElementById('predictionBadge');
        this.confidenceScore = document.getElementById('confidenceScore');
        this.confidenceBarFill = document.getElementById('confidenceBarFill');
        this.analysisText = document.getElementById('analysisText');
        this.textLength = document.getElementById('textLength');
        this.timestamp = document.getElementById('timestamp');
        
        // Error elements
        this.errorMessage = document.getElementById('errorMessage');
        this.retryBtn = document.getElementById('retryBtn');
        
        // API status elements
        this.apiStatus = document.getElementById('apiStatus');
    }

    /**
     * Dynamic Glassmorphism Floating Nav contraction on scroll
     */
    initScrollNavbar() {
        if (!this.navbar) return;

        const handleScroll = () => {
            if (window.scrollY > 25) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    /**
     * Staggered Spring Entrance Animations on Scroll using IntersectionObserver
     */
    initScrollReveal() {
        const revealElements = document.querySelectorAll('.section-reveal');
        
        if (!('IntersectionObserver' in window)) {
            revealElements.forEach(el => el.classList.add('revealed'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger reveal animation slightly
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, index * 120);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    }

    /**
     * Soft Magnetic Pull effect on Hover for Buttons
     */
    initMagneticButtons() {
        const magneticBtns = document.querySelectorAll('.btn-magnetic');
        
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Gentle magnetic pull calculation
                btn.style.transform = `translate3d(${x * 0.15}px, ${y * 0.15}px, 0) scale(1.02)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = `translate3d(0, 0, 0) scale(1)`;
            });
        });
    }

    /**
     * Soft Water Ripple Effect on Click Interactions
     */
    initRippleEffects() {
        document.addEventListener('click', (e) => {
            const rippleTarget = e.target.closest('.ripple-container');
            if (!rippleTarget) return;

            const rect = rippleTarget.getBoundingClientRect();
            const circle = document.createElement('span');
            const diameter = Math.max(rect.width, rect.height);
            const radius = diameter / 2;

            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - rect.left - radius}px`;
            circle.style.top = `${e.clientY - rect.top - radius}px`;
            circle.classList.add('ripple-effect');

            const existingRipple = rippleTarget.querySelector('.ripple-effect');
            if (existingRipple) {
                existingRipple.remove();
            }

            rippleTarget.appendChild(circle);

            setTimeout(() => {
                circle.remove();
            }, 650);
        });
    }

    /**
     * Bind core event listeners
     */
    bindEvents() {
        // Character count update & validation
        this.newsTextarea.addEventListener('input', () => {
            this.updateCharCount();
            this.validateInput();
        });

        // Analyze button click
        this.analyzeBtn.addEventListener('click', () => {
            if (!this.isAnalyzing) {
                this.analyzeNews();
            }
        });

        // Retry button click
        this.retryBtn.addEventListener('click', () => {
            this.analyzeNews();
        });

        // Ctrl+Enter shortcut in textarea
        this.newsTextarea.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                if (!this.isAnalyzing) {
                    this.analyzeNews();
                }
            }
        });
    }

    /**
     * Update character count display
     */
    updateCharCount() {
        const text = this.newsTextarea.value;
        const count = text.length;
        this.charCountSpan.textContent = `${count} character${count !== 1 ? 's' : ''}`;
        
        if (count < 10 && count > 0) {
            this.charCountSpan.style.color = 'var(--accent-amber)';
        } else if (count > 5000) {
            this.charCountSpan.style.color = 'var(--accent-terracotta)';
        } else {
            this.charCountSpan.style.color = 'var(--text-body)';
        }
    }

    /**
     * Validate input and update button state
     */
    validateInput() {
        const text = this.newsTextarea.value.trim();
        const isValid = text.length >= 10;
        
        this.analyzeBtn.disabled = !isValid || this.isAnalyzing;
        
        const btnText = this.analyzeBtn.querySelector('.btn-text');
        if (!isValid && text.length > 0) {
            btnText.textContent = 'Text too short (min 10 chars)';
        } else if (this.isAnalyzing) {
            btnText.textContent = 'Analyzing content...';
        } else {
            btnText.textContent = 'Analyze Article';
        }
    }

    /**
     * Check API health status
     */
    async checkApiHealth() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);

            const response = await fetch(`${this.API_BASE_URL}/health`, {
                method: 'GET',
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (response.ok) {
                this.setApiStatus('online', '🟢 Backend Online');
            } else {
                this.setApiStatus('offline', '🔴 Server Error');
            }
        } catch (error) {
            this.setApiStatus('offline', '🔴 Backend Offline');
            console.warn('API health check info:', error.message);
        }
    }

    /**
     * Set API status indicator pill
     */
    setApiStatus(status, text) {
        if (!this.apiStatus) return;
        this.apiStatus.className = `status-indicator ${status}`;
        this.apiStatus.textContent = text;
    }

    /**
     * Main analysis function
     */
    async analyzeNews() {
        const text = this.newsTextarea.value.trim();
        
        if (!text || text.length < 10) {
            this.showError('Please enter at least 10 characters of news text to analyze.');
            return;
        }

        try {
            this.setAnalyzing(true);
            this.showResults();
            this.showLoading();

            const response = await fetch(`${this.API_BASE_URL}/detect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text })
            });

            if (!response.ok) {
                let errorMessage = `Server returned ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {}
                throw new Error(errorMessage);
            }

            const result = await response.json();
            
            if (!this.validateApiResponse(result)) {
                throw new Error('Invalid response format from API');
            }

            this.displayResults(result);
            this.setApiStatus('online', '🟢 Backend Online');

        } catch (error) {
            console.error('Analysis failed:', error);
            let userMessage;
            if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
                userMessage = 'Unable to connect to http://localhost:8080. Start the backend server via script (run.ps1) to analyze articles live.';
                this.setApiStatus('offline', '🔴 Server Connection Failed');
            } else {
                userMessage = error.message;
            }
            this.showError(userMessage);
        } finally {
            this.setAnalyzing(false);
        }
    }

    /**
     * Validate API response structure
     */
    validateApiResponse(response) {
        return response && 
               typeof response.prediction === 'string' &&
               typeof response.confidence === 'number' &&
               typeof response.analysis === 'string';
    }

    /**
     * Set analyzing state
     */
    setAnalyzing(analyzing) {
        this.isAnalyzing = analyzing;
        this.validateInput();
        
        const btnIcon = this.analyzeBtn.querySelector('.btn-icon');
        if (analyzing) {
            btnIcon.textContent = '⏳';
        } else {
            btnIcon.textContent = '🚀';
        }
    }

    /**
     * Show results card and smooth scroll
     */
    showResults() {
        this.resultsCard.classList.remove('hidden');
        
        setTimeout(() => {
            this.resultsCard.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    }

    /**
     * Show loading state
     */
    showLoading() {
        this.loadingState.classList.remove('hidden');
        this.resultsContent.classList.add('hidden');
        this.errorState.classList.add('hidden');
    }

    /**
     * Display analysis results with tactile animations
     */
    displayResults(result) {
        this.loadingState.classList.add('hidden');
        this.errorState.classList.add('hidden');
        this.resultsContent.classList.remove('hidden');

        const prediction = result.prediction.toLowerCase();
        this.predictionBadge.className = `prediction-badge ${prediction}`;
        
        if (prediction === 'fake') {
            this.predictionBadge.innerHTML = `🚨 High Risk: ${result.prediction} News`;
        } else {
            this.predictionBadge.innerHTML = `✅ Authenticated: ${result.prediction} News`;
        }

        const confidencePercent = Math.round(result.confidence * 100);
        this.confidenceScore.textContent = `${confidencePercent}%`;
        
        // Animate confidence bar
        if (this.confidenceBarFill) {
            this.confidenceBarFill.style.width = '0%';
            setTimeout(() => {
                this.confidenceBarFill.style.width = `${confidencePercent}%`;
            }, 150);
        }

        this.analysisText.textContent = result.analysis;
        this.textLength.textContent = `${result.textLength || this.newsTextarea.value.length} chars`;
        
        let displayTime = 'Just now';
        if (result.timestamp) {
            try {
                const date = new Date(result.timestamp);
                displayTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } catch (e) {
                displayTime = result.timestamp;
            }
        }
        this.timestamp.textContent = displayTime;

        // Fluid entrance curve
        this.resultsContent.style.opacity = '0';
        this.resultsContent.style.transform = 'translateY(15px)';
        
        setTimeout(() => {
            this.resultsContent.style.transition = 'opacity 0.5s var(--ease-fluid), transform 0.5s var(--ease-fluid)';
            this.resultsContent.style.opacity = '1';
            this.resultsContent.style.transform = 'translateY(0)';
        }, 50);
    }

    /**
     * Show error state
     */
    showError(message) {
        this.loadingState.classList.add('hidden');
        this.resultsContent.classList.add('hidden');
        this.errorState.classList.remove('hidden');
        this.errorMessage.textContent = message;
        
        if (this.resultsCard.classList.contains('hidden')) {
            this.showResults();
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ Veritas AI Soft Organic Interface Initialized');
    new FakeNewsDetector();
});

window.FakeNewsDetector = FakeNewsDetector;