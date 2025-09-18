// MathJax Configuration
window.MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true
    },
    options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
    }
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    initNavigation();
    
    // Smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Interactive features
    initInteractiveFeatures();
    
    // Animation on scroll
    initScrollAnimations();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Update active nav link based on scroll position
    window.addEventListener('scroll', updateActiveNavLink);
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // CTA Button scroll to first section
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            const firstSection = document.querySelector('#algebra');
            if (firstSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = firstSection.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbarHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Interactive features
function initInteractiveFeatures() {
    // Add click-to-highlight functionality for formulas
    const formulas = document.querySelectorAll('.formula');
    
    formulas.forEach(formula => {
        formula.addEventListener('click', function() {
            // Remove highlight from other formulas
            formulas.forEach(f => f.classList.remove('highlighted'));
            
            // Add highlight to clicked formula
            this.classList.add('highlighted');
            
            // Remove highlight after 3 seconds
            setTimeout(() => {
                this.classList.remove('highlighted');
            }, 3000);
        });
    });
    
    // Add copy functionality for formulas
    formulas.forEach(formula => {
        const copyButton = document.createElement('button');
        copyButton.innerHTML = '📋';
        copyButton.className = 'copy-button';
        copyButton.title = 'Copy formula';
        copyButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease;
            font-size: 12px;
        `;
        
        formula.style.position = 'relative';
        formula.appendChild(copyButton);
        
        formula.addEventListener('mouseenter', () => {
            copyButton.style.opacity = '1';
        });
        
        formula.addEventListener('mouseleave', () => {
            copyButton.style.opacity = '0';
        });
        
        copyButton.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Get the LaTeX content
            const mathElements = formula.querySelectorAll('.MathJax');
            let formulaText = '';
            
            if (mathElements.length > 0) {
                // Extract from MathJax rendered elements
                mathElements.forEach(element => {
                    const script = element.previousElementSibling;
                    if (script && script.type === 'math/tex') {
                        formulaText += script.textContent + '\n';
                    }
                });
            } else {
                // Fallback to text content
                formulaText = formula.textContent.trim();
            }
            
            // Copy to clipboard
            navigator.clipboard.writeText(formulaText).then(() => {
                copyButton.innerHTML = '✓';
                copyButton.style.background = '#27ae60';
                
                setTimeout(() => {
                    copyButton.innerHTML = '📋';
                    copyButton.style.background = '#667eea';
                }, 1000);
            }).catch(err => {
                console.log('Copy failed:', err);
            });
        });
    });
    
    // Search functionality
    addSearchFunctionality();
    
    // Theme toggle (optional enhancement)
    addThemeToggle();
}

// Animation on scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe formula cards for animation
    const formulaCards = document.querySelectorAll('.formula-card');
    formulaCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Search functionality
function addSearchFunctionality() {
    // Create search box
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" id="searchInput" placeholder="Search formulas..." />
        <button id="searchButton">🔍</button>
    `;
    
    // Add styles for search
    const searchStyles = `
        .search-container {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 999;
            display: flex;
            background: white;
            border-radius: 25px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        #searchInput {
            border: none;
            padding: 10px 15px;
            width: 200px;
            outline: none;
            font-size: 14px;
        }
        
        #searchButton {
            background: #667eea;
            border: none;
            color: white;
            padding: 10px 15px;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        
        #searchButton:hover {
            background: #5a6fd8;
        }
        
        .formula-card.hidden {
            display: none;
        }
        
        .formula-card.highlighted-search {
            border-left-color: #ff6b6b;
            box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.3);
        }
        
        @media (max-width: 768px) {
            .search-container {
                position: relative;
                top: auto;
                right: auto;
                margin: 20px auto;
                max-width: 300px;
            }
        }
    `;
    
    // Add search styles to document
    const styleSheet = document.createElement('style');
    styleSheet.textContent = searchStyles;
    document.head.appendChild(styleSheet);
    
    // Insert search container
    const hero = document.querySelector('.hero');
    hero.appendChild(searchContainer);
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const formulaCards = document.querySelectorAll('.formula-card');
        
        formulaCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            card.classList.remove('hidden', 'highlighted-search');
            
            if (searchTerm === '') {
                // Show all cards if search is empty
                return;
            }
            
            if (cardText.includes(searchTerm)) {
                card.classList.add('highlighted-search');
            } else {
                card.classList.add('hidden');
            }
        });
    }
    
    searchInput.addEventListener('input', performSearch);
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Theme toggle functionality
function addThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '🌙';
    themeToggle.className = 'theme-toggle';
    themeToggle.title = 'Toggle dark mode';
    
    const toggleStyles = `
        .theme-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .theme-toggle:hover {
            transform: scale(1.1);
            background: #5a6fd8;
        }
        
        body.dark-theme {
            background-color: #1a1a1a;
            color: #e0e0e0;
        }
        
        body.dark-theme .formula-card {
            background: #2d2d2d;
            color: #e0e0e0;
        }
        
        body.dark-theme .formula {
            background: #3a3a3a;
            color: #e0e0e0;
        }
        
        body.dark-theme .math-section:nth-child(even) {
            background-color: #1f1f1f;
        }
        
        body.dark-theme .math-section:nth-child(odd) {
            background-color: #262626;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = toggleStyles;
    document.head.appendChild(styleSheet);
    
    document.body.appendChild(themeToggle);
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            themeToggle.innerHTML = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.innerHTML = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '☀️';
    }
}

// Add CSS for highlighted formulas
const highlightStyles = `
    .formula.highlighted {
        background: linear-gradient(45deg, #ff6b6b, #ffa500) !important;
        color: white !important;
        transform: scale(1.02);
        box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
    }
    
    .formula.highlighted .MathJax {
        color: white !important;
    }
`;

const highlightStyleSheet = document.createElement('style');
highlightStyleSheet.textContent = highlightStyles;
document.head.appendChild(highlightStyleSheet);

// Console welcome message
console.log('🧮 Welcome to AmbatuStudy! Math formulas made easy.');
console.log('✨ Features: Click formulas to highlight, search functionality, and dark mode!');

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`📊 Page loaded in ${loadTime}ms`);
        }, 0);
    });
}