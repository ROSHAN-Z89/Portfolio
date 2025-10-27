(function () {
    const EMAILJS_PUBLIC_KEY = "FiRLNBizwblNuRQ0C";
    const EMAILJS_SERVICE_ID = "service_hejc7wo";
    const EMAILJS_TEMPLATE_ID = "template_7s24qht";

    window.addEventListener("load", () => {
        if (typeof emailjs !== "undefined") {
            emailjs.init(EMAILJS_PUBLIC_KEY);
            window.emailjsConfig = {
                publicKey: EMAILJS_PUBLIC_KEY,
                serviceID: EMAILJS_SERVICE_ID,
                templateID: EMAILJS_TEMPLATE_ID,
            };
            console.log("EmailJS initialized successfully");
        } else {
            console.warn("EmailJS not loaded - using fallback methods");
            window.emailjsConfig = null;
        }
    });
})();

// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, delay) => {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
};

/* Loader init */
class TerminalLoader {
    constructor() {
        this.element = document.getElementById("terminal-loader");
        this.output = document.getElementById("terminal-output");
        this.announcer = document.getElementById("loader-announcer");
        this.skipButton = document.getElementById("skip-loader");

        this.command = {
            prompt: "portfolio@root:~$",
            text: "init-security-suite --quick",
            output: "[ok] systems secure — ready for deployment",
        };

        this.isComplete = false;
        this.typeSpeed = 60;
        this.maxTimeout = 8000;
        this.pauseAfterOutput = 2000;
        this.reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        this.init();
    }

    init() {
        if (!this.element) return;

        this.pauseMatrixAnimation();
        this.announceToScreenReader("Loading portfolio.");
        this.bindSkipButton();

        if (this.reducedMotion) {
            this.showCommandInstantly();
        } else {
            setTimeout(() => this.startTyping(), 300);
        }

        setTimeout(() => {
            if (!this.isComplete) this.dismissLoader();
        }, this.maxTimeout);
    }

    bindSkipButton() {
        if (this.skipButton) {
            this.skipButton.addEventListener("click", () => this.skipLoader());
            this.skipButton.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    this.skipLoader();
                }
            });
        }
    }

    skipLoader() {
        this.announceToScreenReader("Skipping loader...");
        this.dismissLoader();
    }

    startTyping() {
        if (this.isComplete) return;

        const commandLine = document.createElement("div");
        commandLine.className = "command-line";

        const promptSpan = document.createElement("span");
        promptSpan.className = "command-prompt";
        promptSpan.textContent = this.command.prompt + " ";

        const commandSpan = document.createElement("span");
        commandSpan.className = "command-text";

        const cursor = document.createElement("span");
        cursor.className = "typing-cursor";
        cursor.textContent = "_";

        commandLine.appendChild(promptSpan);
        commandLine.appendChild(commandSpan);
        commandLine.appendChild(cursor);
        this.output.appendChild(commandLine);

        this.typeText(commandSpan, this.command.text, () => {
            cursor.remove();
            this.showOutput();
        });
    }

    typeText(element, text, callback) {
        let charIndex = 0;
        const typeChar = () => {
            if (charIndex < text.length && !this.isComplete) {
                element.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, this.typeSpeed);
            } else {
                callback();
            }
        };
        typeChar();
    }

    showOutput() {
        if (this.isComplete) return;

        const outputLine = document.createElement("div");
        outputLine.className = "command-output success";
        outputLine.textContent = this.command.output;
        this.output.appendChild(outputLine);

        setTimeout(() => this.dismissLoader(), this.pauseAfterOutput);
    }

    showCommandInstantly() {
        const commandLine = document.createElement("div");
        commandLine.className = "command-line";
        commandLine.innerHTML = `
<span class="command-prompt">${this.command.prompt}</span>
<span class="command-text">${this.command.text}</span>
`;
        this.output.appendChild(commandLine);

        const outputLine = document.createElement("div");
        outputLine.className = "command-output success";
        outputLine.textContent = this.command.output;
        this.output.appendChild(outputLine);

        setTimeout(() => this.dismissLoader(), this.pauseAfterOutput);
    }

    dismissLoader() {
        if (this.isComplete) return;
        this.isComplete = true;
        this.announceToScreenReader("Portfolio loaded successfully");

        this.element.classList.add("fade-out");
        setTimeout(() => {
            this.element.classList.add("hidden");
            this.resumeMatrixAnimation();
            if (typeof window.loaderFinished === "function") window.loaderFinished();
            window.dispatchEvent(new CustomEvent("loaderComplete"));
        }, 500);
    }

    pauseMatrixAnimation() {
        if (window.portfolioApp && window.portfolioApp.matrixRain) {
            window.portfolioApp.matrixRain.stop();
        }
    }

    resumeMatrixAnimation() {
        if (window.portfolioApp && window.portfolioApp.matrixRain) {
            if (document.body.classList.contains("dark-theme")) {
                window.portfolioApp.matrixRain.start();
            }
        }
    }

    announceToScreenReader(message) {
        if (this.announcer) this.announcer.textContent = message;
    }
}

// MATRIX RAIN
class MatrixRain {
    constructor() {
        this.canvas = document.getElementById("matrixCanvas");
        this.ctx = null;
        this.characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?";
        this.fontSize = 16;
        this.columns = 0;
        this.drops = [];
        this.animationId = null;
        this.isActive = false;
        this.init();
    }

    init() {
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext("2d");
        this.setupCanvas();
        this.setupDrops();
        window.addEventListener("resize", debounce(() => this.handleResize(), 250));
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
    }

    setupDrops() {
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.floor(Math.random() * -100);
        }
    }

    handleResize() {
        if (this.isActive) {
            this.setupCanvas();
            this.setupDrops();
        }
    }

    draw() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#0f0";
        this.ctx.font = `${this.fontSize}px monospace`;

        for (let i = 0; i < this.drops.length; i++) {
            const character = this.characters.charAt(
                Math.floor(Math.random() * this.characters.length)
            );
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;

            if (Math.random() > 0.98) {
                this.ctx.shadowColor = "#0f0";
                this.ctx.shadowBlur = 10;
            } else {
                this.ctx.shadowBlur = 0;
            }

            this.ctx.fillText(character, x, y);

            if (
                this.drops[i] * this.fontSize > this.canvas.height &&
                Math.random() > 0.975
            ) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
    }

    animate = () => {
        if (!this.isActive) return;
        this.draw();
        this.animationId = requestAnimationFrame(this.animate);
    };

    start() {
        if (this.isActive) return;
        this.isActive = true;
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.setupCanvas();
        this.setupDrops();
        this.animate();
    }

    stop() {
        this.isActive = false;
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.animationId = null;
    }

    destroy() {
        this.stop();
        window.removeEventListener("resize", this.handleResize);
    }
}

// HOME TYPING CONTROLLER - FIXED VERSION
class HomeTypingController {
    constructor() {
        this.textElement = document.getElementById("typing-text");
        this.texts = [
            "Ethical Hacker & Penetration Tester",
            "Electronics and Communication Engineer",
            "Security Researcher",
        ];
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.typeSpeed = 100;
        this.deleteSpeed = 50;
        this.pauseTime = 2000;
        this.isDeleting = false;
        this.isStarted = false;
        this.hasStarted = false;
        this.reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        this.init();
    }

    init() {
        if (!this.textElement) {
            console.warn("typing-text element not found");
            return;
        }

        // Multiple initialization paths
        window.addEventListener("loaderComplete", () => {
            setTimeout(() => this.startTyping(), 500);
        });

        setTimeout(() => {
            if (!this.hasStarted) {
                this.startTyping();
            }
        }, 3000);

        setTimeout(() => {
            const loader = document.getElementById("terminal-loader");
            if (!loader || loader.classList.contains("hidden")) {
                if (!this.hasStarted) {
                    this.startTyping();
                }
            }
        }, 1000);
    }

    startTyping() {
        if (this.hasStarted || !this.textElement) return;

        this.hasStarted = true;

        if (this.reducedMotion) {
            this.textElement.textContent = this.texts[0];
            return;
        }

        this.textElement.textContent = "";
        this.isStarted = true;
        this.type();
    }

    type() {
        if (!this.isStarted || !this.textElement) return;

        const currentText = this.texts[this.currentTextIndex];

        if (this.isDeleting) {
            this.textElement.textContent = currentText.substring(
                0,
                this.currentCharIndex - 1
            );
            this.currentCharIndex--;

            if (this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
                setTimeout(() => this.type(), 500);
                return;
            }

            setTimeout(() => this.type(), this.deleteSpeed);
        } else {
            this.textElement.textContent = currentText.substring(
                0,
                this.currentCharIndex + 1
            );
            this.currentCharIndex++;

            if (this.currentCharIndex === currentText.length) {
                setTimeout(() => {
                    this.isDeleting = true;
                    this.type();
                }, this.pauseTime);
                return;
            }

            setTimeout(() => this.type(), this.typeSpeed);
        }
    }
}

// ABOUT TYPING CONTROLLER - COMPLETE FIXED VERSION
class AboutTypingController {
    constructor() {
        this.textElement = document.getElementById("typing-animation");
        this.aboutContent = document.getElementById("about-content");
        this.hasStarted = false;
        this.isTyping = false;
        this.reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

       this.terminalSequence = [
    { 
        type: "prompt", 
        text: "portfolio@root:~$ ", 
        delay: 0,
        color: "#4ade80", // Green for prompt
        lightColor: "#1e40af" // Blue for light theme
    },
    { 
        type: "typing", 
        text: 'cat "readme.md" | grep -i about', 
        delay: 50,
        color: "#f8fafc", // White for dark theme
        lightColor: "#1e293b" // Dark for light theme
    }
];

        this.currentStep = 0;
        this.currentCharIndex = 0;

        this.init();
    }

    init() {
        if (!this.textElement) {
            console.warn("typing-animation element not found");
            return;
        }

        if (this.reducedMotion) {
            this.showFullTerminal();
        } else {
            this.setupTriggers();
        }
    }

    setupTriggers() {
        document.addEventListener("sectionChanged", (e) => {
            if (e.detail === "about" && !this.hasStarted) {
                setTimeout(() => this.startTerminalAnimation(), 500);
            }
        });
        this.setupIntersectionObserver();
        setTimeout(() => {
            const aboutSection = document.getElementById("about");
            if (aboutSection && aboutSection.classList.contains("active") && !this.hasStarted) {
                this.startTerminalAnimation();
            }
        }, 500);
        window.addEventListener("hashchange", () => {
            if (window.location.hash === "#about" && !this.hasStarted) {
                setTimeout(() => this.startTerminalAnimation(), 500);
            }
        });
    }

    setupIntersectionObserver() {
        const aboutSection = document.getElementById("about");
        if (!aboutSection) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !this.hasStarted) {
                        setTimeout(() => this.startTerminalAnimation(), 500);
                    }
                });
            },
            {
                threshold: 0.3,
                rootMargin: "0px 0px -20% 0px"
            }
        );
        observer.observe(aboutSection);
    }

    startTerminalAnimation() {
        if (this.hasStarted || this.isTyping || !this.textElement) return;
        console.log("Starting terminal-style about animation");
        this.hasStarted = true;
        this.isTyping = true;
        this.textElement.innerHTML = "";
        this.currentStep = 0;
        this.executeTerminalStep();
    }

    executeTerminalStep() {
        if (!this.isTyping || this.currentStep >= this.terminalSequence.length) {
            this.isTyping = false;
            setTimeout(() => this.revealContent(), 1000);
            return;
        }
        const step = this.terminalSequence[this.currentStep];
        setTimeout(() => {
            switch (step.type) {
                case "prompt":
                    this.addPrompt(step.text);
                    break;
                case "typing":
                    this.typeCommand(step.text, step.delay);
                    break;
                case "enter":
                    this.addNewLine();
                    break;
                case "output":
                    this.addOutput(step.text);
                    break;
            }
        }, step.delay);
    }

    addPrompt(text) {
        const promptSpan = document.createElement("span");
        promptSpan.className = "terminal-prompt";
        promptSpan.style.color = "#4ade80";
        promptSpan.style.fontWeight = "bold";
        promptSpan.textContent = text;
        this.textElement.appendChild(promptSpan);
        this.currentStep++;
        this.executeTerminalStep();
    }

    typeCommand(text, typeSpeed) {
        const commandSpan = document.createElement("span");
        commandSpan.className = "terminal-command";
        commandSpan.style.color = "#f8fafc";
        this.textElement.appendChild(commandSpan);

        // Add blinking cursor
        const cursor = document.createElement("span");
        cursor.className = "terminal-cursor";
        cursor.style.cssText = `
color: #4ade80;
animation: blink 1s step-end infinite;
font-weight: bold;
`;
        cursor.textContent = "█";
        this.textElement.appendChild(cursor);
        let charIndex = 0;
        const typeChar = () => {
            if (charIndex < text.length) {
                commandSpan.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, typeSpeed + Math.random() * 50); // Add slight randomness
            } else {
                cursor.remove();
                this.currentStep++;
                this.executeTerminalStep();
            }
        };
        setTimeout(typeChar, 200);
    }
    addNewLine() {
        this.textElement.appendChild(document.createElement("br"));
        this.currentStep++;
        this.executeTerminalStep();
    }
    addOutput(text) {
        const outputSpan = document.createElement("span");
        outputSpan.className = "terminal-output";

        // Style different types of output
        if (text.includes("[INFO]")) {
            outputSpan.style.color = "#60a5fa";
        } else if (text.includes("[OK]")) {
            outputSpan.style.color = "#4ade80";
        } else if (text.includes("─")) {
            outputSpan.style.color = "#4ade80";
            outputSpan.style.fontWeight = "bold";
        } else if (text.includes("ABOUT ROSHAN DAS")) {
            outputSpan.style.color = "#4ade80";
            outputSpan.style.fontWeight = "bold";
            outputSpan.style.fontSize = "1.1em";
        } else if (text === "cybersecurity-enthusiast") {
            outputSpan.style.color = "#fbbf24";
            outputSpan.style.fontWeight = "bold";
        } else {
            outputSpan.style.color = "#d1d5db";
        }

        outputSpan.textContent = text;
        this.textElement.appendChild(outputSpan);
        if (text !== "") {
            this.textElement.appendChild(document.createElement("br"));
        }

        this.currentStep++;
        this.executeTerminalStep();
    }

    showFullTerminal() {
        if (!this.textElement) return;
        this.hasStarted = true;
        this.textElement.innerHTML = `
            <span style="color: #4ade80; font-weight: bold;">portfolio@root:~$ </span>
            <span style="color: #f8fafc;">cat "readme.md" | grep -i about</span><br>
        `;
        this.revealContent();
    }

    revealContent() {
        if (!this.aboutContent) {
            console.warn("about-content element not found");
            return;
        }

        setTimeout(() => {
            console.log("Revealing about content");
            this.aboutContent.style.display = "block";
            this.aboutContent.classList.add("revealed");
        }, 800);
    }

    restart() {
        this.hasStarted = false;
        this.isTyping = false;
        this.currentStep = 0;
        this.currentCharIndex = 0;
        if (this.textElement) this.textElement.innerHTML = "";
        if (this.aboutContent) {
            this.aboutContent.style.display = "none";
            this.aboutContent.classList.remove("revealed");
        }
        this.startTerminalAnimation();
    }
}

class ResumeHandler {
    constructor() {
        this.init();
    }
    init() {
        const downloadBtn = document.getElementById("downloadResumeBtn");
        if (downloadBtn) {
            downloadBtn.addEventListener("click", this.downloadResume);
        }
    }
    downloadResume = () => {
        const link = document.createElement("a");
        link.href = "./assets/resume.pdf";
        link.download = "Roshan.pdf";
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
}

class SkillsAnimationHandler {
    constructor() {
        this.init();
    }
    init() {
        this.setupProgressBarAnimations();
    }
    setupProgressBarAnimations() {
        const observerOptions = { root: null, rootMargin: "0px", threshold: 0.5 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const progressBar =
                        entry.target.querySelector(".proficiency-fill");
                    if (progressBar) {
                        const width = progressBar.getAttribute("data-width");
                        if (width && (!progressBar.style.width || progressBar.style.width === "0px")) {
                            progressBar.style.width = width;
                        }
                    }
                }
            });
        }, observerOptions);
        const skillItems = document.querySelectorAll(".skill-item");
        skillItems.forEach((item) => observer.observe(item));
    }
}

class BlogAnimationHandler {
    constructor() {
        this.init();
    }
    init() {
        this.setupBlogCardAnimations();
        this.setupReadMoreButtons();
    }
    setupBlogCardAnimations() {
        const blogCards = document.querySelectorAll(".blog-card");
        blogCards.forEach((card) => {
            card.addEventListener("mouseenter", (e) =>
                this.enhanceBlogHover(e, true)
            );
            card.addEventListener("mouseleave", (e) =>
                this.enhanceBlogHover(e, false)
            );
        });
    }
    setupReadMoreButtons() {
        const readMoreBtns = document.querySelectorAll(".read-more-btn");
        readMoreBtns.forEach((btn) => {
            btn.addEventListener("mouseenter", (e) =>
                this.enhanceButtonHover(e, true)
            );
            btn.addEventListener("mouseleave", (e) =>
                this.enhanceButtonHover(e, false)
            );
            btn.addEventListener("click", (e) => this.trackBlogClick(e));
        });
    }
    enhanceBlogHover(e, isEntering) {
        const card = e.currentTarget;
        const image = card.querySelector(".blog-image img");
        const category = card.querySelector(".blog-category");
        if (isEntering) {
            if (image) image.style.transform = "scale(1.1) rotate(0.5deg)";
            if (category) category.style.transform = "scale(1.05) translateY(-2px)";
        } else {
            if (image) image.style.transform = "";
            if (category) category.style.transform = "";
        }
    }
    enhanceButtonHover(e, isEntering) {
        const btn = e.currentTarget;
        const icon = btn.querySelector("svg");
        if (isEntering) {
            if (icon) icon.style.transform = "translateX(5px) rotate(45deg)";
        } else {
            if (icon) icon.style.transform = "";
        }
    }
    trackBlogClick(e) {
        const btn = e.currentTarget;
        const card = btn.closest(".blog-card");
        const title = card.querySelector(".blog-title").textContent;
        const href = btn.getAttribute("href");
        btn.style.transform = "translateY(-1px) scale(1.02)";
        setTimeout(() => {
            btn.style.transform = "";
        }, 200);
        console.log(`Blog clicked: ${title} -> ${href}`);
    }
}

class ContactFormHandler {
    constructor() {
        this.form = document.getElementById("contact-form");
        this.submitButton = null;
        this.originalButtonText = "SEND SECURE MESSAGE";
        this.isEmailJSReady = false;
        this.init();
    }
    init() {
        if (this.form) {
            this.submitButton = this.form.querySelector("button[type='submit']");
            this.bindEvents();
            this.checkEmailJSStatus();
        }
    }
    checkEmailJSStatus() {
        const checkInterval = setInterval(() => {
            if (typeof emailjs !== "undefined" && window.emailjsConfig) {
                this.isEmailJSReady = true;
                clearInterval(checkInterval);
                console.log("EmailJS is ready for contact form");
            }
        }, 100);
        setTimeout(() => clearInterval(checkInterval), 10000);
    }
    bindEvents() {
        this.form.addEventListener("submit", (e) => this.handleSubmit(e));
        const inputs = this.form.querySelectorAll("input, select, textarea");
        inputs.forEach((input) => {
            input.addEventListener("blur", () => this.validateField(input));
            input.addEventListener("input", () => this.clearFieldError(input));
        });
    }
    async handleSubmit(e) {
        e.preventDefault();
        if (!this.validateForm()) {
            this.showMessage("Please fill in all required fields correctly.", "error");
            return;
        }
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        this.setLoadingState(true);
        try {
            if (this.isEmailJSReady && window.emailjsConfig) {
                await this.sendWithEmailJS(data);
            } else {
                this.sendWithManualInstructions(data);
            }
        } catch (error) {
            console.error("Email sending failed:", error);
            this.showMessage("Failed to send message. Please see manual instructions.", "error");
            this.sendWithManualInstructions(data);
        }
    }
    validateForm() {
        const inputs = this.form.querySelectorAll("input[required], select[required], textarea[required]");
        let isValid = true;
        inputs.forEach((input) => {
            if (!this.validateField(input)) isValid = false;
        });
        return isValid;
    }
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = "";
        this.clearFieldError(field);
        if (field.hasAttribute("required") && !value) {
            errorMessage = "This field is required";
            isValid = false;
        } else if (field.type === "email" && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = "Please enter a valid email address";
                isValid = false;
            }
        }
        if (!isValid) this.showFieldError(field, errorMessage);
        return isValid;
    }
    showFieldError(field, message) {
        field.classList.add("error");
        this.clearFieldError(field);
        const errorElement = document.createElement("div");
        errorElement.className = "field-error";
        errorElement.style.cssText = `
color: #ef4444;
font-size: 0.875rem;
margin-top: 0.25rem;
display: block;
`;
        errorElement.textContent = message;
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }

    clearFieldError(field) {
        field.classList.remove("error");
        const errors = field.parentNode.querySelectorAll(".field-error");
        errors.forEach((el) => el.remove());
    }
    async sendWithEmailJS(data) {
        try {
            const templateParams = {
                from_name: data.name || "Anonymous",
                from_email: data.email || "",
                message: data.message || "",
            };
            await emailjs.send(
                window.emailjsConfig.serviceID,
                window.emailjsConfig.templateID,
                templateParams
            );
            this.showMessage("Message sent successfully!", "success");
            this.form.reset();
        } catch (err) {
            throw err;
        } finally {
            this.setLoadingState(false);
        }
    }
    sendWithManualInstructions(data) {
        const subject = encodeURIComponent("Contact via Portfolio");
        const body = encodeURIComponent(
            `Name: ${data.name || ""}\nEmail: ${data.email || ""}\n\n${data.message || ""}`
        );
        const mailto = `mailto:rouson.ece@gmail.com?subject=${subject}&body=${body}`;
        const link = document.createElement("a");
        link.href = mailto;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.setLoadingState(false);
    }
    setLoadingState(isLoading) {
        if (this.submitButton) {
            this.submitButton.disabled = isLoading;
            this.submitButton.textContent = isLoading ? "SENDING..." : this.originalButtonText;
        }
    }

    showMessage(message) {
        alert(message);
    }
}

class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll(".fade-in-up");
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.bindScrollEvents();
    }

    setupIntersectionObserver() {
        const options = { root: null, rootMargin: "0px 0px -100px 0px", threshold: 0.1 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) entry.target.classList.add("visible");
            });
        }, options);
        this.elements.forEach((el) => observer.observe(el));
    }

    bindScrollEvents() {
        const navbar = document.querySelector(".navbar");
        if (navbar) {
            const handleScroll = throttle(() => {
                navbar.classList.toggle("scrolled", window.scrollY > 50);
            }, 16);
            window.addEventListener("scroll", handleScroll);
        }
    }
}

class NavigationManager {
    constructor() {
        this.currentSection = "home";
        this.sections = document.querySelectorAll(".section");
        this.navLinks = document.querySelectorAll(".nav-link");
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateActiveLink();
        this.handleInitialRoute();
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.updateActiveSection(entry.target.id);
                    }
                });
            },
            { root: null, rootMargin: "-50% 0px -50% 0px", threshold: 0 }
        );
        this.sections.forEach((s) => observer.observe(s));
    }

    bindEvents() {
        this.navLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                this.navigateToSection(link.getAttribute("data-section"));
            });
        });

        const ctaButtons = document.querySelectorAll("[data-section]");
        ctaButtons.forEach((btn) => {
            if (!btn.classList.contains("nav-link")) {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    this.navigateToSection(btn.getAttribute("data-section"));
                });
            }
        });

        const navToggle = document.getElementById("nav-toggle");
        const navMenu = document.getElementById("nav-menu");

        if (navToggle && navMenu) {
            navToggle.addEventListener("click", () => {
                const willOpen = !navMenu.classList.contains("active");
                navMenu.classList.toggle("active", willOpen);
                this.toggleMobileMenu(willOpen);
            });

            document.addEventListener("click", (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    if (navMenu.classList.contains("active")) {
                        navMenu.classList.remove("active");
                        this.toggleMobileMenu(false);
                    }
                }
            });

            this.navLinks.forEach((link) =>
                link.addEventListener("click", () => {
                    if (navMenu.classList.contains("active")) {
                        navMenu.classList.remove("active");
                        this.toggleMobileMenu(false);
                    }
                })
            );

            navToggle.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navToggle.click();
                }
            });
        }

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                const navMenu = document.getElementById("nav-menu");
                if (navMenu && navMenu.classList.contains("active")) {
                    navMenu.classList.remove("active");
                    const navToggleEl = document.getElementById("nav-toggle");
                    if (navToggleEl) navToggleEl.classList.remove("active");
                    document.body.style.overflow = "";
                }
            }
        });

        const floatingContact = document.getElementById("floating-contact");
        const headerCta = document.getElementById("header-cta");
        if (floatingContact) floatingContact.addEventListener("click", () => this.navigateToSection("contact"));
        if (headerCta) headerCta.addEventListener("click", () => this.navigateToSection("contact"));
    }

    toggleMobileMenu(isOpen) {
        const navToggle = document.getElementById("nav-toggle");
        const navMenu = document.getElementById("nav-menu");
        if (navToggle) navToggle.classList.toggle("active", isOpen);
        document.body.style.overflow = isOpen ? "hidden" : "";
        if (navMenu) void navMenu.offsetHeight;
        if (navMenu) navMenu.style.pointerEvents = isOpen ? "auto" : "";
    }

    navigateToSection(sectionId) {
        console.log(`Navigating to section: ${sectionId}`);
        this.currentSection = sectionId;
        this.sections.forEach((s) => s.classList.remove("active"));
        const target = document.getElementById(sectionId);
        if (target) {
            target.classList.add("active");
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            history.replaceState(null, null, `#${sectionId}`);
            this.updateActiveLink();
            this.triggerSectionAnimations(sectionId);
            if (sectionId === "skills") this.animateSkillBars();
            document.dispatchEvent(new CustomEvent("sectionChanged", { detail: sectionId }));
        }
    }

    updateActiveSection(sectionId) {
        if (sectionId !== this.currentSection) {
            console.log(`Section changed to: ${sectionId}`);
            this.currentSection = sectionId;
            this.updateActiveLink();
            history.replaceState(null, null, `#${sectionId}`);
            document.dispatchEvent(new CustomEvent("sectionChanged", { detail: sectionId }));
        }
    }

    updateActiveLink() {
        this.navLinks.forEach((link) => {
            const section = link.getAttribute("data-section");
            link.classList.toggle("active", section === this.currentSection);
        });
    }

    handleInitialRoute() {
        const hash = window.location.hash.slice(1);
        if (hash && document.getElementById(hash)) {
            this.navigateToSection(hash);
        } else if (this.currentSection === "home") {
            document.dispatchEvent(new CustomEvent("sectionChanged", { detail: "home" }));
        }
    }

    triggerSectionAnimations(sectionId) {
        if (sectionId === "skills") this.animateSkillBars();
        if (sectionId === "blog") this.animateBlogCards();
    }

    animateSkillBars() {
        setTimeout(() => {
            document.querySelectorAll(".proficiency-fill").forEach((bar) => {
                const width = bar.getAttribute("data-width");
                if (width) bar.style.width = width;
            });
        }, 300);
    }

    animateBlogCards() {
        setTimeout(() => {
            document.querySelectorAll(".blog-card").forEach((card, i) => {
                setTimeout(() => {
                    card.style.opacity = "1";
                    card.style.transform = "translateY(0)";
                }, i * 200);
            });
        }, 200);
    }
}

class FooterHandler {
    constructor() {
        this.init();
    }
    init() {
        const yearEl = document.querySelector(".copyright");
        if (yearEl) yearEl.textContent = `© ${new Date().getFullYear()} Roshan Das. All rights reserved.`;
    }
}

class FloatingContact {
    constructor() {
        this.button = document.getElementById("floating-contact");
        this.init();
    }

    init() {
        if (this.button) {
            this.button.addEventListener("click", () => {
                const navManager = window.portfolioApp && window.portfolioApp.navigation;
                if (navManager) navManager.navigateToSection("contact");
                else window.location.hash = "#contact";
            });
        }
    }
}

class ThemeToggle {
    constructor() {
        this.toggleEl = document.getElementById("theme-toggle");
        this.slider = document.querySelector(".theme-toggle-slider");
        this.init();
    }

    init() {
        if (!this.toggleEl) return;
        this.toggleEl.addEventListener("click", () => this.toggleTheme());
    }

    toggleTheme() {
        document.body.classList.toggle("light-theme");
        document.body.classList.toggle("dark-theme");
        localStorage.setItem(
            "theme",
            document.body.classList.contains("light-theme") ? "light" : "dark"
        );
    }

    applyInitialTheme() {
        const stored = localStorage.getItem("theme");
        if (stored === "light") {
            document.body.classList.add("light-theme");
            document.body.classList.remove("dark-theme");
        } else {
            document.body.classList.add("dark-theme");
            document.body.classList.remove("light-theme");
        }
    }
}

class PortfolioApp {
    constructor() {
        this.matrixRain = null;
        this.terminalLoader = null;
        this.navigation = null;
        this.scrollAnimations = null;
        this.skillsHandler = null;
        this.blogHandler = null;
        this.footerHandler = null;
        this.floatingContact = null;
        this.themeToggle = null;
        this.homeTyping = null;
        this.aboutTyping = null;
        this.resumeHandler = null;
        this.contactHandler = null;
    }

    init() {
        console.log("Initializing Portfolio App");
        this.terminalLoader = new TerminalLoader();
        this.matrixRain = new MatrixRain();
        this.navigation = new NavigationManager();
        this.scrollAnimations = new ScrollAnimations();
        this.skillsHandler = new SkillsAnimationHandler();
        this.blogHandler = new BlogAnimationHandler();
        this.footerHandler = new FooterHandler();
        this.floatingContact = new FloatingContact();
        this.themeToggle = new ThemeToggle();
        this.homeTyping = new HomeTypingController();
        this.aboutTyping = new AboutTypingController();
        this.resumeHandler = new ResumeHandler();
        this.contactHandler = new ContactFormHandler();

        this.themeToggle.applyInitialTheme();
        if (document.body.classList.contains("dark-theme")) this.matrixRain.start();

        window.loaderFinished = () => {
            this.scrollAnimations = new ScrollAnimations();
            this.skillsHandler = new SkillsAnimationHandler();
        };

        window.aboutTyping = this.aboutTyping;
        window.portfolioApp = this;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const app = new PortfolioApp();
    app.init();
});
