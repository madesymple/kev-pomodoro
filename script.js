class PomodoroTimer {
    constructor() {
        this.timeLeft = 25 * 60; // 25 minutes in seconds
        this.timerId = null;
        this.isRunning = false;
        
        // DOM elements
        this.timeDisplay = document.querySelector('.time-display');
        this.startBtn = document.getElementById('start');
        this.pauseBtn = document.getElementById('pause');
        this.resetBtn = document.getElementById('reset');
        this.modeButtons = document.querySelectorAll('.mode-btn');
        
        // Add new elements
        this.toggleViewBtn = document.getElementById('toggleView');
        this.timerView = document.getElementById('timerView');
        this.settingsView = document.getElementById('settingsView');
        
        // Add to existing constructor
        this.breakTimeSelect = document.getElementById('breakTime');
        this.breakTime = parseInt(this.breakTimeSelect.value);
        
        // Add to existing constructor after other element selections
        this.closeSettingsBtn = document.getElementById('closeSettings');
        
        // Add after other element selections
        this.showQuotesToggle = document.getElementById('showQuotes');
        
        // Add at the beginning of constructor
        this.quotes = [
            "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
            "The only way to do great work is to love what you do. - Steve Jobs",
            "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
            "Success seems to be connected with action. Successful people keep moving. - Conrad Hilton",
            "The future depends on what you do today. - Mahatma Gandhi",
            "The difference between try and triumph is just a little umph! - Marvin Phillips",
            "The only place where success comes before work is in the dictionary. - Vidal Sassoon",
            "Don't wish it were easier. Wish you were better. - Jim Rohn",
            "Success is walking from failure to failure with no loss of enthusiasm. - Winston Churchill",
            "The harder you work for something, the greater you'll feel when you achieve it. - Anonymous",
            "Dreams don't work unless you do. - John C. Maxwell",
            "Focus on being productive instead of busy. - Tim Ferriss",
            "The way to get started is to quit talking and begin doing. - Walt Disney",
            "Your talent determines what you can do. Your motivation determines how much you're willing to do. - Lou Holtz",
            "The only way to achieve the impossible is to believe it is possible. - Charles Kingsleigh",
            "Don't stop when you're tired. Stop when you're done. - Anonymous",
            "Success isn't always about greatness. It's about consistency. - Dwayne Johnson",
            "The expert in anything was once a beginner. - Helen Hayes",
            "What you do today can improve all your tomorrows. - Ralph Marston",
            "The only bad workout is the one that didn't happen. - Anonymous"
        ];
        
        // Add after other element selections
        this.quoteContainer = document.querySelector('.quote-container');
        
        // Add after other element selections
        this.playChimeToggle = document.getElementById('playChime');
        this.testSoundBtn = document.getElementById('testSound');
        
        // Event listeners
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.modeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchMode(e));
        });
        this.toggleViewBtn.addEventListener('click', () => this.toggleView());
        this.closeSettingsBtn.addEventListener('click', () => this.toggleView());
        
        // Add new event listener
        this.breakTimeSelect.addEventListener('change', (e) => {
            const newBreakTime = e.target.value;
            this.breakTime = parseInt(newBreakTime);
            this.saveBreakTimePreference(newBreakTime);
        });
        
        // Add to constructor after other event listeners
        this.showQuotesToggle.addEventListener('change', (e) => {
            const showQuotes = e.target.checked;
            this.saveQuotePreference(showQuotes);
            if (showQuotes) {
                this.displayRandomQuote();
            } else {
                this.quoteContainer.textContent = '';
            }
        });

        this.loadQuotePreference();
        this.loadBreakTimePreference();

        // Add with other event listeners
        this.playChimeToggle.addEventListener('change', (e) => {
            this.saveChimePreference(e.target.checked);
        });

        this.testSoundBtn.addEventListener('click', () => this.playAlarm());

        // Add with other preference loads
        this.loadChimePreference();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update the display on the page
        this.timeDisplay.textContent = timeString;
        
        // Update the browser tab title
        document.title = `${timeString} - Get Sh*t Done`;
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timerId = setInterval(() => {
                this.timeLeft--;
                this.updateDisplay();
                
                if (this.timeLeft === 0) {
                    this.playAlarm();
                    this.pause();
                    this.reset();
                }
            }, 1000);
        }
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.timerId);
    }

    reset() {
        this.pause();
        const activeMode = document.querySelector('.mode-btn.active');
        this.timeLeft = parseInt(activeMode.dataset.time) * 60;
        this.updateDisplay();
        this.displayRandomQuote();
    }

    switchMode(e) {
        const button = e.target;
        const isBreakMode = button.textContent === 'Take a Break';
        
        if (isBreakMode) {
            button.textContent = 'Get Back to Work';
            this.timeLeft = this.breakTime * 60;
        } else {
            button.textContent = 'Take a Break';
            this.timeLeft = 25 * 60; // 25 minutes for work
        }
        
        this.pause();
        this.updateDisplay();
    }

    playAlarm() {
        const alarm = document.getElementById('alarmSound');
        
        // First, load the audio
        alarm.load();
        
        // Set volume to make sure it's audible
        alarm.volume = 1.0;
        
        // Play the sound with error handling
        alarm.play()
            .then(() => {
                console.log('Playing sound successfully');
            })
            .catch(error => {
                console.error('Error playing sound:', error);
                // Try alternative method for older browsers
                try {
                    alarm.currentTime = 0;
                    alarm.play();
                } catch (fallbackError) {
                    console.error('Fallback also failed:', fallbackError);
                }
            });
    }

    toggleView() {
        const isTimerView = this.timerView.classList.contains('active');
        
        if (isTimerView) {
            this.timerView.classList.remove('active');
            this.settingsView.classList.add('active');
            this.toggleViewBtn.classList.remove('fa-cog');
            this.toggleViewBtn.classList.add('fa-times');
        } else {
            this.settingsView.classList.remove('active');
            this.timerView.classList.add('active');
            this.toggleViewBtn.classList.remove('fa-times');
            this.toggleViewBtn.classList.add('fa-cog');
        }
    }

    // Add these new methods
    getRandomQuote() {
        const randomIndex = Math.floor(Math.random() * this.quotes.length);
        return this.quotes[randomIndex];
    }

    displayRandomQuote() {
        if (this.showQuotesToggle.checked) {
            this.quoteContainer.textContent = this.getRandomQuote();
        }
    }

    saveQuotePreference(showQuotes) {
        localStorage.setItem('showQuotes', showQuotes);
    }

    loadQuotePreference() {
        const savedPreference = localStorage.getItem('showQuotes');
        if (savedPreference !== null) {
            const showQuotes = savedPreference === 'true';
            this.showQuotesToggle.checked = showQuotes;
            if (showQuotes) {
                this.displayRandomQuote();
            }
        }
    }

    saveBreakTimePreference(breakTime) {
        localStorage.setItem('breakTime', breakTime);
    }

    loadBreakTimePreference() {
        const savedBreakTime = localStorage.getItem('breakTime');
        if (savedBreakTime !== null) {
            this.breakTime = parseInt(savedBreakTime);
            this.breakTimeSelect.value = savedBreakTime;
        }
    }

    saveChimePreference(playChime) {
        localStorage.setItem('playChime', playChime);
    }

    loadChimePreference() {
        const savedPreference = localStorage.getItem('playChime');
        if (savedPreference !== null) {
            this.playChimeToggle.checked = savedPreference === 'true';
        }
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const timer = new PomodoroTimer();
}); 