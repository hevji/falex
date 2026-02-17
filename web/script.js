// Particle System for Canvas
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 100;
        this.mouse = { x: 0, y: 0 };
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
    }
    
    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }
    
    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Move particle
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx -= (dx / distance) * force * 0.1;
                particle.vy -= (dy / distance) * force * 0.1;
            }
            
            // Boundary check
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 51, 102, ${particle.opacity})`;
            this.ctx.fill();
            
            // Draw connections
            this.particles.forEach(other => {
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = `rgba(255, 51, 102, ${0.1 * (1 - distance / 150)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Terminal Typing Effect
class TerminalTyper {
    constructor(element, commands) {
        this.element = element;
        this.commands = commands;
        this.currentCommand = 0;
        this.currentChar = 0;
        this.isDeleting = false;
        this.typeSpeed = 100;
        this.deleteSpeed = 50;
        this.pauseTime = 2000;
        
        this.type();
    }
    
    type() {
        const current = this.commands[this.currentCommand];
        
        if (this.isDeleting) {
            this.element.textContent = current.substring(0, this.currentChar - 1);
            this.currentChar--;
        } else {
            this.element.textContent = current.substring(0, this.currentChar + 1);
            this.currentChar++;
        }
        
        let timeout = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
        
        if (!this.isDeleting && this.currentChar === current.length) {
            timeout = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentChar === 0) {
            this.isDeleting = false;
            this.currentCommand = (this.currentCommand + 1) % this.commands.length;
        }
        
        setTimeout(() => this.type(), timeout);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Particle System
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        new ParticleSystem(canvas);
    }
    
    // Initialize Terminal Typer
    const typedTextElement = document.getElementById('typed-text');
    if (typedTextElement) {
        const commands = [
            'falex --help',
            'falex ping google.com',
            'falex generate uuid',
            'falex encode "Hello World"',
            'falex download youtube.com/watch?v=...',
            'falex identity --random'
        ];
        new TerminalTyper(typedTextElement, commands);
    }
    
    // Terminal Output Animation
    const terminalOutput = document.getElementById('terminal-output');
    if (terminalOutput) {
        setTimeout(() => {
            terminalOutput.innerHTML = `
                <div style="margin-bottom: 0.5rem;">✓ 6 tools available</div>
                <div style="margin-bottom: 0.5rem;">✓ All systems operational</div>
                <div style="color: #ff3366;">✓ Ready to use</div>
            `;
        }, 1500);
    }
    
    // Animated Counter for Stats
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + (counter.textContent.includes('%') ? '' : '');
            }
        };
        
        // Start counter when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(counter);
    });
    
    // GSAP Scroll Animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Feature Cards Animation
        gsap.utils.toArray('.feature-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                delay: index * 0.1
            });
        });
        
        // Section Headers Animation
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 30,
                opacity: 0,
                duration: 1
            });
        });
        
        // Demo Section Animation
        gsap.from('.demo-container', {
            scrollTrigger: {
                trigger: '.demo-container',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            scale: 0.95,
            opacity: 0,
            duration: 1
        });
        
        // Download Card Animation
        gsap.from('.download-card', {
            scrollTrigger: {
                trigger: '.download-card',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 1
        });
    }
    
    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Demo Tab Switching
    const demoTabs = document.querySelectorAll('.demo-tab');
    const demoPanels = document.querySelectorAll('.demo-panel');
    
    demoTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetDemo = tab.getAttribute('data-demo');
            
            // Remove active class from all tabs and panels
            demoTabs.forEach(t => t.classList.remove('active'));
            demoPanels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            tab.classList.add('active');
            document.getElementById(`demo-${targetDemo}`).classList.add('active');
        });
    });
    
    // Navbar scroll effect
    let lastScroll = 0;
    const nav = document.querySelector('.nav');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.style.background = 'rgba(10, 10, 10, 0.95)';
            nav.style.boxShadow = '0 2px 10px rgba(255, 51, 102, 0.1)';
        } else {
            nav.style.background = 'rgba(10, 10, 10, 0.9)';
            nav.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
});

// Demo Tool Functions

// UUID Generator
function generateDemoUUID() {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    
    const outputElement = document.getElementById('uuid-value');
    outputElement.textContent = uuid;
    outputElement.style.color = '#00ffff';
    
    // Add copy functionality
    outputElement.style.cursor = 'pointer';
    outputElement.title = 'Click to copy';
    outputElement.onclick = () => {
        navigator.clipboard.writeText(uuid);
        const originalText = outputElement.textContent;
        outputElement.textContent = '✓ Copied!';
        setTimeout(() => {
            outputElement.textContent = originalText;
        }, 2000);
    };
}

// Base64 Encoder
function encodeDemoBase64() {
    const input = document.getElementById('base64-input').value;
    if (!input) {
        alert('Please enter text to encode');
        return;
    }
    
    const encoded = btoa(input);
    const outputElement = document.getElementById('base64-value');
    outputElement.textContent = encoded;
    outputElement.style.color = '#00ffff';
    
    // Add copy functionality
    outputElement.style.cursor = 'pointer';
    outputElement.title = 'Click to copy';
    outputElement.onclick = () => {
        navigator.clipboard.writeText(encoded);
        const originalText = outputElement.textContent;
        outputElement.textContent = '✓ Copied!';
        setTimeout(() => {
            outputElement.textContent = originalText;
        }, 2000);
    };
}

// Website Pinger (Simulated)
function pingDemoWebsite() {
    const input = document.getElementById('pinger-input').value;
    if (!input) {
        alert('Please enter a URL');
        return;
    }
    
    const outputElement = document.getElementById('pinger-value');
    outputElement.textContent = 'Pinging...';
    outputElement.style.color = '#ffaa00';
    
    // Simulate ping delay
    setTimeout(() => {
        const responseTime = Math.floor(Math.random() * 100) + 20;
        outputElement.textContent = `✓ ${input} is reachable (${responseTime}ms)`;
        outputElement.style.color = '#00ff00';
    }, 1000);
}

// Feature Card Hover Effects
document.addEventListener('DOMContentLoaded', () => {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add subtle glow effect
            card.style.boxShadow = '0 20px 60px rgba(255, 51, 102, 0.4)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '';
        });
    });
});

// Add parallax effect to hero section (only when hero is visible)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero && scrolled < hero.offsetHeight) {
        const parallaxElements = document.querySelectorAll('.hero-content');
        parallaxElements.forEach(element => {
            const speed = 0.3;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
});

// Console log welcome message
console.log('%c Welcome to FALEX ', 'background: #ff3366; color: #0a0a0a; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c The Ultimate Developer Multitool Suite ', 'background: #0a0a0a; color: #ff3366; font-size: 14px; padding: 5px;');
console.log('%c Check out our GitHub: https://github.com ', 'color: #00ffff; font-size: 12px;');

// Easter egg - konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Activate easter egg
        document.body.style.animation = 'rainbow 2s infinite';
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 10000);
        
        console.log('%c 🎉 KONAMI CODE ACTIVATED! 🎉 ', 'background: #ff3366; color: #0a0a0a; font-size: 20px; font-weight: bold; padding: 10px;');
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Enhance demo panels with syntax highlighting
document.addEventListener('DOMContentLoaded', () => {
    const codeLines = document.querySelectorAll('.code-line');
    codeLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            line.style.transition = 'all 0.5s ease';
            line.style.opacity = '1';
            line.style.transform = 'translateX(0)';
        }, index * 100);
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.demo-button, .cta-button, .download-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add CSS for ripple effect
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    button {
        position: relative;
        overflow: hidden;
    }
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);
