/**
 * Veritas AI - Fact-Checking Dashboard JavaScript Router & Engines
 */

class VeritasDashboard {
    constructor() {
        this.API_BASE_URL = 'http://localhost:8080';
        this.isAnalyzing = false;
        
        // Quiz State
        this.triviaQuestions = [
            {
                category: "SCIENCE & TECH",
                headline: '"Breaking: New battery technology discovered using salt water charges smartphones in 3 seconds!"',
                answer: "fake",
                explanation: "Exaggerated claim. While sodium-ion salt batteries are researched, 3-second phone charging violates current physics and electrical safety limits."
            },
            {
                category: "GLOBAL HEALTH",
                headline: '"WHO publishes updated global air quality and health guidance for 2026."',
                answer: "real",
                explanation: "Authentic announcement from official WHO public health communications detailing updated air quality thresholds."
            },
            {
                category: "FINANCE & CRYPTO",
                headline: '"Government secretly signs executive order to ban all paper money starting midnight!"',
                answer: "fake",
                explanation: "Classic viral sensational conspiracy rumor. Currency policy changes require extensive public legislation and treasury notices."
            },
            {
                category: "ASTRONOMY",
                headline: '"NASA space telescope captures unprecedented high-resolution image of distant exoplanet atmosphere."',
                answer: "real",
                explanation: "Authentic scientific report based on Webb telescope spectrographic observations."
            },
            {
                category: "ENVIRONMENT",
                headline: '"Scientists confirm microplastics found in rainwater samples across remote polar ice caps."',
                answer: "real",
                explanation: "Verified environmental research published in peer-reviewed journals documenting global atmospheric microplastic transport."
            }
        ];
        this.currentQuizIndex = 0;
        this.quizScore = 0;

        // Init App Engines
        this.initElements();
        this.initViewRouter();
        this.initSidebarToggle();
        this.initRippleEffects();
        this.initMagneticButtons();
        this.initNewsScanner();
        this.initTriviaEngine();
        this.initDirectorySearch();
        this.checkApiHealth();
    }

    initElements() {
        this.sidebar = document.getElementById('sidebar');
        this.sidebarToggle = document.getElementById('sidebarToggle');
        this.pageTitle = document.getElementById('pageTitle');
        this.pageSubtitle = document.getElementById('pageSubtitle');
        this.apiStatus = document.getElementById('apiStatus');

        // News Scanner Elements
        this.newsTextarea = document.getElementById('newsText');
        this.charCountSpan = document.getElementById('charCount');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.resultsCard = document.getElementById('resultsCard');
        this.loadingState = document.getElementById('loadingState');
        this.resultsContent = document.getElementById('resultsContent');
        this.errorState = document.getElementById('errorState');
        this.predictionBadge = document.getElementById('predictionBadge');
        this.confidenceScore = document.getElementById('confidenceScore');
        this.confidenceBarFill = document.getElementById('confidenceBarFill');
        this.analysisText = document.getElementById('analysisText');
        this.textLength = document.getElementById('textLength');
        this.timestamp = document.getElementById('timestamp');
        this.errorMessage = document.getElementById('errorMessage');
        this.retryBtn = document.getElementById('retryBtn');
    }

    /**
     * View Router for switching Dashboard Views
     */
    initViewRouter() {
        const navItems = document.querySelectorAll('.nav-item[data-view]');
        const viewSections = document.querySelectorAll('.view-section');

        const viewMeta = {
            dashboard: {
                title: "Fact-Checking Dashboard",
                subtitle: "Real-time media analysis, metrics, and fake news mitigation statistics."
            },
            scanner: {
                title: "News Authenticity Scanner",
                subtitle: "Deep learning NLP analysis to inspect articles and rumor claims."
            },
            trivia: {
                title: "Veracity Trivia Challenge",
                subtitle: "Test your headline verification skills against misinformation claims."
            },
            directory: {
                title: "Verified Source Directory",
                subtitle: "Editorial trust indices and bias ratings for international media outlets."
            },
            educate: {
                title: "Educate & Spot Misinformation",
                subtitle: "Key diagnostic rules and red flags to identify unverified claims."
            }
        };

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetView = item.getAttribute('data-view');

                // Update active nav button
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                // Update visible view section
                viewSections.forEach(section => {
                    if (section.id === `view-${targetView}`) {
                        section.classList.add('active');
                    } else {
                        section.classList.remove('active');
                    }
                });

                // Update header text
                if (viewMeta[targetView]) {
                    this.pageTitle.textContent = viewMeta[targetView].title;
                    this.pageSubtitle.textContent = viewMeta[targetView].subtitle;
                }

                // Close mobile sidebar if open
                if (this.sidebar.classList.contains('open')) {
                    this.sidebar.classList.remove('open');
                }
            });
        });
    }

    /**
     * Responsive Sidebar Toggle
     */
    initSidebarToggle() {
        if (this.sidebarToggle) {
            this.sidebarToggle.addEventListener('click', () => {
                this.sidebar.classList.toggle('open');
            });
        }
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
            if (existingRipple) existingRipple.remove();

            rippleTarget.appendChild(circle);
            setTimeout(() => circle.remove(), 650);
        });
    }

    /**
     * Magnetic Button Hover Effect
     */
    initMagneticButtons() {
        const magneticBtns = document.querySelectorAll('.btn-magnetic');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate3d(${x * 0.15}px, ${y * 0.15}px, 0) scale(1.02)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = `translate3d(0, 0, 0) scale(1)`;
            });
        });
    }

    /**
     * News Scanner Engine
     */
    initNewsScanner() {
        if (!this.newsTextarea) return;

        this.newsTextarea.addEventListener('input', () => {
            const text = this.newsTextarea.value;
            const count = text.length;
            this.charCountSpan.textContent = `${count} character${count !== 1 ? 's' : ''}`;
            this.analyzeBtn.disabled = text.trim().length < 10 || this.isAnalyzing;
        });

        this.analyzeBtn.addEventListener('click', () => {
            if (!this.isAnalyzing) this.analyzeNews();
        });

        this.retryBtn.addEventListener('click', () => this.analyzeNews());

        this.newsTextarea.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter' && !this.isAnalyzing) {
                this.analyzeNews();
            }
        });
    }

    async checkApiHealth() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);
            const response = await fetch(`${this.API_BASE_URL}/health`, { method: 'GET', signal: controller.signal });
            clearTimeout(timeoutId);

            if (response.ok) {
                this.setApiStatus('online', '🟢 Backend Online');
            } else {
                this.setApiStatus('offline', '🔴 Server Error');
            }
        } catch (e) {
            this.setApiStatus('offline', '🔴 Backend Offline');
        }
    }

    setApiStatus(status, text) {
        if (!this.apiStatus) return;
        this.apiStatus.className = `status-indicator ${status}`;
        this.apiStatus.textContent = text;
    }

    async analyzeNews() {
        const text = this.newsTextarea.value.trim();
        if (!text || text.length < 10) return;

        try {
            this.setAnalyzing(true);
            this.resultsCard.classList.remove('hidden');
            this.loadingState.classList.remove('hidden');
            this.resultsContent.classList.add('hidden');
            this.errorState.classList.add('hidden');

            const response = await fetch(`${this.API_BASE_URL}/detect`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text })
            });

            if (!response.ok) throw new Error(`Server returned ${response.status}`);
            const result = await response.json();

            this.displayResults(result);
            this.setApiStatus('online', '🟢 Backend Online');
        } catch (error) {
            this.loadingState.classList.add('hidden');
            this.errorState.classList.remove('hidden');
            this.errorMessage.textContent = error.message.includes('fetch') 
                ? 'Unable to connect to backend server at http://localhost:8080. Start the Core Java server via run.ps1 to analyze live.' 
                : error.message;
        } finally {
            this.setAnalyzing(false);
        }
    }

    setAnalyzing(analyzing) {
        this.isAnalyzing = analyzing;
        this.analyzeBtn.disabled = analyzing;
        const btnText = this.analyzeBtn.querySelector('.btn-text');
        if (btnText) btnText.textContent = analyzing ? 'Analyzing...' : 'Analyze Article';
    }

    displayResults(result) {
        this.loadingState.classList.add('hidden');
        this.errorState.classList.add('hidden');
        this.resultsContent.classList.remove('hidden');

        const pred = result.prediction.toLowerCase();
        this.predictionBadge.className = `prediction-badge ${pred}`;
        this.predictionBadge.innerHTML = pred === 'fake' ? `🚨 High Risk: ${result.prediction} News` : `✅ Authenticated: ${result.prediction} News`;

        const conf = Math.round(result.confidence * 100);
        this.confidenceScore.textContent = `${conf}%`;
        if (this.confidenceBarFill) {
            this.confidenceBarFill.style.width = '0%';
            setTimeout(() => this.confidenceBarFill.style.width = `${conf}%`, 100);
        }

        this.analysisText.textContent = result.analysis;
        this.textLength.textContent = `${result.textLength || this.newsTextarea.value.length} chars`;
        this.timestamp.textContent = 'Just now';
    }

    /**
     * Trivia Quiz Engine
     */
    initTriviaEngine() {
        const quizOptions = document.querySelectorAll('.quiz-opt-btn');
        const feedbackBox = document.getElementById('quizFeedback');
        const feedbackBadge = document.getElementById('feedbackBadge');
        const feedbackText = document.getElementById('feedbackText');
        const nextBtn = document.getElementById('nextQuizBtn');
        const scoreSpan = document.getElementById('triviaScore');

        const loadQuestion = () => {
            const q = this.triviaQuestions[this.currentQuizIndex];
            document.getElementById('quizCategory').textContent = q.category;
            document.getElementById('quizNumber').textContent = `Question ${this.currentQuizIndex + 1} of ${this.triviaQuestions.length}`;
            document.getElementById('quizHeadline').textContent = q.headline;
            feedbackBox.classList.add('hidden');
            quizOptions.forEach(btn => btn.disabled = false);
        };

        quizOptions.forEach(btn => {
            btn.addEventListener('click', () => {
                const userAns = btn.getAttribute('data-answer');
                const q = this.triviaQuestions[this.currentQuizIndex];
                quizOptions.forEach(b => b.disabled = true);

                if (userAns === q.answer) {
                    this.quizScore++;
                    feedbackBadge.textContent = "🎉 Correct Assessment!";
                    feedbackBadge.style.color = "#3B6645";
                } else {
                    feedbackBadge.textContent = "❌ Incorrect Verdict";
                    feedbackBadge.style.color = "#D96B6B";
                }

                feedbackText.textContent = q.explanation;
                feedbackBox.classList.remove('hidden');
                scoreSpan.textContent = `${this.quizScore} / ${this.triviaQuestions.length}`;
            });
        });

        nextBtn.addEventListener('click', () => {
            this.currentQuizIndex = (this.currentQuizIndex + 1) % this.triviaQuestions.length;
            loadQuestion();
        });

        loadQuestion();
    }

    /**
     * Directory Search Engine
     */
    initDirectorySearch() {
        const searchInput = document.getElementById('dirSearchInput');
        const sourceCards = document.querySelectorAll('.source-card');

        if (!searchInput) return;

        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();
            sourceCards.forEach(card => {
                const name = card.getAttribute('data-name').toLowerCase();
                const desc = card.textContent.toLowerCase();
                if (name.includes(query) || desc.includes(query)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Initialize Dashboard on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ Veritas AI Fact-Checking Dashboard Initialized');
    new VeritasDashboard();
});
