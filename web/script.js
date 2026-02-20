(function () {

    // ────────────────────────────────────────────────
    //  Particle background with mouse repulsion + links
    // ────────────────────────────────────────────────
    class ParticleSystem {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext("2d");
            this.particles = [];
            this.particleCount = 100;
            this.mouse = { x: 0, y: 0 };

            this.resize();
            this.init();
            this.animate();

            window.addEventListener("resize", () => this.resize());

            canvas.addEventListener("mousemove", (e) => {
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
                // Move
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Mouse repulsion
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    const force = (100 - dist) / 100;
                    particle.vx -= (dx / dist) * force * 0.1;
                    particle.vy -= (dy / dist) * force * 0.1;
                }

                // Bounce on edges
                if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

                // Draw circle
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 51, 102, ${particle.opacity})`;
                this.ctx.fill();

                // Draw connections
                this.particles.forEach(other => {
                    const dx = particle.x - other.x;
                    const dy = particle.y - other.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(particle.x, particle.y);
                        this.ctx.lineTo(other.x, other.y);
                        this.ctx.strokeStyle = `rgba(255, 51, 102, ${0.1 * (1 - dist / 150)})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(() => this.animate());
        }
    }

    // ────────────────────────────────────────────────
    //  Fake terminal typing animation
    // ────────────────────────────────────────────────
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
            const cmd = this.commands[this.currentCommand];

            if (this.isDeleting) {
                this.element.textContent = cmd.substring(0, this.currentChar - 1);
                this.currentChar--;
            } else {
                this.element.textContent = cmd.substring(0, this.currentChar + 1);
                this.currentChar++;
            }

            let speed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

            if (!this.isDeleting && this.currentChar === cmd.length) {
                speed = this.pauseTime;
                this.isDeleting = true;
            } else if (this.isDeleting && this.currentChar === 0) {
                this.isDeleting = false;
                this.currentCommand = (this.currentCommand + 1) % this.commands.length;
            }

            setTimeout(() => this.type(), speed);
        }
    }

    // ────────────────────────────────────────────────
    //  Main initialization
    // ────────────────────────────────────────────────
    document.addEventListener("DOMContentLoaded", function () {

        // Particle canvas
        const particlesCanvas = document.getElementById("particles-canvas");
        if (particlesCanvas) {
            new ParticleSystem(particlesCanvas);
        }

        // Typing effect
        const typedText = document.getElementById("typed-text");
        if (typedText) {
            const fakeCommands = [
                "falex --help",
                "falex ping google.com",
                "falex generate uuid",
                "falex encode atob(\"SGVsbG8gV29ybGQ=\")",
                "falex download youtube.com/watch?v=...",
                "falex identity --random"
            ];
            new TerminalTyper(typedText, fakeCommands);
        }

        // Fake terminal output after delay
        const terminalOutput = document.getElementById("terminal-output");
        if (terminalOutput) {
            setTimeout(() => {
                terminalOutput.innerHTML = `
                    <div style="margin-bottom: 0.5rem;">✓ 6 tools available</div>
                    <div style="margin-bottom: 0.5rem;">✓ All systems operational</div>
                    <div style="color: #ff3366;">✓ Ready to use</div>
                `;
            }, 1500);
        }

        // ... (rest of the code continues with counters, GSAP animations, smooth scroll, tab switching, navbar scroll effect, demo tool functions, hover effects, parallax, console messages, Konami code easter egg, ripple buttons, etc.)

    });

})();
