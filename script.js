/**
 * ROUSON DAS — CYBERSECURITY PORTFOLIO
 * Complete interactive engine: Terminal loader, Matrix rain,
 * animated stats counters, skills matrix filter, contact form,
 * scroll-spy, and mobile drawer navigation.
 */

// ── 1. EMAILJS CREDENTIALS & INITIALIZATION ────────────────
const EMAILJS_CONFIG = {
  publicKey: "FiRLNBizwblNuRQ0C",
  serviceID: "service_hejc7wo",
  templateID: "template_7s24qht",
};

(function initEmailJS() {
  window.addEventListener("load", () => {
    if (typeof emailjs !== "undefined") {
      try {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        window.emailjsReady = true;
        console.log("[SEC_INIT] EmailJS service connected.");
      } catch (err) {
        console.warn("[SEC_WARN] EmailJS init failed:", err);
        window.emailjsReady = false;
      }
    } else {
      console.warn("[SEC_WARN] EmailJS library not loaded, using mailto fallback.");
      window.emailjsReady = false;
    }
  });
})();

// ── UTILITY HELPERS ─────────────────────────────────────────
const throttle = (func, limit) => {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// ── 2. TERMINAL LOADER ──────────────────────────────────────
class TerminalLoader {
  constructor() {
    this.loader = document.getElementById("terminal-loader");
    this.output = document.getElementById("terminal-output");
    this.skipBtn = document.getElementById("skip-loader");
    this.announcer = document.getElementById("loader-announcer");
    this.isDismissed = false;

    this.bootSteps = [
      { text: "portfolio@root:~$ init-security-suite --audit", delay: 100, class: "cmd" },
      { text: "[+] Verifying integrity of security modules... [OK]", delay: 350, class: "info" },
      { text: "[+] Loading threat intel, CVE audit records & arsenal... [OK]", delay: 700, class: "info" },
      { text: "[+] Initializing terminal UI & operational dossier... [READY]", delay: 1100, class: "success" }
    ];

    this.init();
  }

  init() {
    if (!this.loader) return;

    if (this.skipBtn) {
      this.skipBtn.addEventListener("click", () => this.dismiss());
      this.skipBtn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.dismiss();
        }
      });
    }

    // Run boot sequence
    let currentDelay = 0;
    this.bootSteps.forEach((step) => {
      currentDelay += step.delay;
      setTimeout(() => {
        if (this.isDismissed) return;
        this.appendLine(step.text, step.class);
      }, currentDelay);
    });

    // Auto dismiss after completion
    setTimeout(() => {
      this.dismiss();
    }, currentDelay + 900);
  }

  appendLine(text, className) {
    if (!this.output) return;
    const line = document.createElement("div");
    line.className = `terminal-line ${className || ""}`;
    line.textContent = text;
    this.output.appendChild(line);
  }

  dismiss() {
    if (this.isDismissed || !this.loader) return;
    this.isDismissed = true;
    this.loader.classList.add("fade-out");

    if (this.announcer) {
      this.announcer.textContent = "Portfolio loaded successfully";
    }

    setTimeout(() => {
      this.loader.classList.add("hidden");
      document.dispatchEvent(new CustomEvent("loaderComplete"));
    }, 400);
  }
}

// ── 3. LIVE SYSTEM CLOCK & UPTIME ───────────────────────────
class SystemClock {
  constructor() {
    this.clockElement = document.getElementById("nav-clock");
    this.init();
  }

  init() {
    if (!this.clockElement) return;
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
  }

  updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    this.clockElement.textContent = `${hours}:${minutes}:${seconds} IST`;
  }
}

// ── 4. MATRIX DIGITAL RAIN CANVAS ───────────────────────────
class MatrixRain {
  constructor() {
    this.canvas = document.getElementById("matrixCanvas");
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.characters = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEF0123456789<>/;:+=-*#$@!%&";
    this.fontSize = 14;
    this.columns = 0;
    this.drops = [];
    this.animationFrame = null;
    this.isPaused = false;

    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());

    // Pause when scrolled out of view to preserve 60fps & save CPU
    const heroSection = document.getElementById("home");
    if (heroSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          this.isPaused = !entry.isIntersecting;
          if (!this.isPaused && !this.animationFrame) {
            this.draw();
          }
        });
      }, { threshold: 0.05 });
      observer.observe(heroSection);
    }

    this.draw();
  }

  resizeCanvas() {
    this.canvas.width = this.canvas.parentElement ? this.canvas.parentElement.offsetWidth : window.innerWidth;
    this.canvas.height = this.canvas.parentElement ? this.canvas.parentElement.offsetHeight : window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = [];
    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = Math.floor(Math.random() * -50);
    }
  }

  draw() {
    if (this.isPaused) {
      this.animationFrame = null;
      return;
    }

    this.ctx.fillStyle = "rgba(5, 8, 12, 0.06)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = `${this.fontSize}px 'JetBrains Mono', monospace`;

    for (let i = 0; i < this.drops.length; i++) {
      const char = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
      
      // Leading character is brighter green / white
      if (Math.random() > 0.9) {
        this.ctx.fillStyle = "#ffffff";
      } else if (Math.random() > 0.5) {
        this.ctx.fillStyle = "#00ff66";
      } else {
        this.ctx.fillStyle = "#059669";
      }

      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;

      this.ctx.fillText(char, x, y);

      if (y > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      this.drops[i]++;
    }

    this.animationFrame = requestAnimationFrame(() => this.draw());
  }
}

// ── 5. HERO ROLE TYPING CONTROLLER ──────────────────────────
class HeroTyper {
  constructor() {
    this.textEl = document.getElementById("typing-text");
    this.phrases = [
      "I learn how systems are built — then find how to break them.",
      "Web Application Pentesting & OWASP Top 10 Auditing.",
      "Offensive Tool Engineering in Python & C.",
      "Reverse Engineering, Exploit Analysis & CTF Competitions.",
      "Ethical Hacking & Proactive Threat Defense."
    ];
    this.phraseIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.typeSpeed = 50;
    this.deleteSpeed = 25;
    this.pauseEnd = 2200;
    this.init();
  }

  init() {
    if (!this.textEl) return;
    document.addEventListener("loaderComplete", () => {
      setTimeout(() => this.tick(), 300);
    });

    // Fallback if loader was skipped or already complete
    setTimeout(() => {
      if (this.charIndex === 0 && !this.isDeleting) {
        this.tick();
      }
    }, 2000);
  }

  tick() {
    const currentPhrase = this.phrases[this.phraseIndex];

    if (!this.isDeleting) {
      this.textEl.textContent = currentPhrase.substring(0, this.charIndex + 1);
      this.charIndex++;

      if (this.charIndex === currentPhrase.length) {
        this.isDeleting = true;
        setTimeout(() => this.tick(), this.pauseEnd);
        return;
      }
      setTimeout(() => this.tick(), this.typeSpeed);
    } else {
      this.textEl.textContent = currentPhrase.substring(0, this.charIndex - 1);
      this.charIndex--;

      if (this.charIndex === 0) {
        this.isDeleting = false;
        this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
        setTimeout(() => this.tick(), 400);
        return;
      }
      setTimeout(() => this.tick(), this.deleteSpeed);
    }
  }
}

// ── 6. STATS COUNTER WITH EASING (Goal 5) ───────────────────
class StatsCounter {
  constructor() {
    this.statsContainer = document.getElementById("about-stats");
    this.statNumbers = document.querySelectorAll(".stat-num");
    this.hasAnimated = false;
    this.init();
  }

  init() {
    if (!this.statsContainer || this.statNumbers.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          this.animateCounters();
        }
      });
    }, { threshold: 0.25 });

    observer.observe(this.statsContainer);

    // If already in viewport on load
    const rect = this.statsContainer.getBoundingClientRect();
    if (rect.top >= 0 && rect.bottom <= window.innerHeight && !this.hasAnimated) {
      this.hasAnimated = true;
      this.animateCounters();
    }
  }

  animateCounters() {
    this.statNumbers.forEach((el) => {
      const target = parseInt(el.getAttribute("data-target"), 10) || 0;
      const suffix = el.getAttribute("data-suffix") || "";
      const duration = 1600; // ms
      let startTime = null;

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Cubic ease out
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(ease * target);

        el.textContent = `${currentVal}${progress >= 1 ? suffix : ""}`;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = `${target}${suffix}`;
        }
      };

      requestAnimationFrame(step);
    });
  }
}

// ── 7. ARSENAL (SKILLS) CATEGORY FILTER (Goal 6) ────────────
class SkillsFilter {
  constructor() {
    this.tabs = document.querySelectorAll(".atab");
    this.cards = document.querySelectorAll(".skill-card");
    this.fills = document.querySelectorAll(".sc-fill");
    this.hasAnimatedBars = false;
    this.init();
  }

  init() {
    if (this.tabs.length === 0 || this.cards.length === 0) return;

    this.tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const cat = tab.getAttribute("data-cat");
        this.filterCategory(cat, tab);
      });
    });

    // Animate meter bars once in view
    const skillsSection = document.getElementById("skills");
    if (skillsSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.hasAnimatedBars) {
            this.hasAnimatedBars = true;
            this.animateBars();
          }
        });
      }, { threshold: 0.15 });

      observer.observe(skillsSection);
    }
  }

  filterCategory(category, activeTab) {
    this.tabs.forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    activeTab.classList.add("active");
    activeTab.setAttribute("aria-selected", "true");

    this.cards.forEach((card) => {
      const cardCat = card.getAttribute("data-cat");
      if (category === "all" || cardCat === category) {
        card.classList.remove("filtered-out");
      } else {
        card.classList.add("filtered-out");
      }
    });

    // Re-trigger bar widths for visible cards
    this.animateBars();
  }

  animateBars() {
    this.fills.forEach((fill) => {
      const width = fill.getAttribute("data-width");
      if (width) {
        fill.style.width = width;
      }
    });
  }
}

// ── 8. CONTACT FORM & EMAILJS HANDLER (Goal 9) ──────────────
class ContactFormHandler {
  constructor() {
    this.form = document.getElementById("contact-form");
    this.submitBtn = document.getElementById("contact-submit-btn");
    this.feedback = document.getElementById("contact-feedback");
    this.originalBtnHtml = this.submitBtn ? this.submitBtn.innerHTML : "<span>SEND_MESSAGE</span>";
    this.init();
  }

  init() {
    if (!this.form) return;

    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    // Clear feedback on input
    this.form.querySelectorAll("input, select, textarea").forEach((field) => {
      field.addEventListener("input", () => {
        if (this.feedback) this.feedback.style.display = "none";
      });
    });
  }

  async handleSubmit(e) {
    e.preventDefault();

    const name = (this.form.querySelector("#contact-name")?.value || "").trim();
    const email = (this.form.querySelector("#contact-email")?.value || "").trim();
    const subjectSelect = (this.form.querySelector("#contact-subject")?.value || "").trim();
    const message = (this.form.querySelector("#contact-message")?.value || "").trim();

    // Basic validation
    if (!name || !email || !subjectSelect || !message) {
      this.showFeedback("Error: Please complete all required transmission parameters.", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.showFeedback("Error: Invalid return address (email) format.", "error");
      return;
    }

    this.setLoading(true);

    const payload = {
      from_name: name,
      from_email: email,
      subject: subjectSelect,
      message: message,
    };

    try {
      if (typeof emailjs !== "undefined" && window.emailjsReady) {
        await emailjs.send(
          EMAILJS_CONFIG.serviceID,
          EMAILJS_CONFIG.templateID,
          payload
        );
        this.showFeedback("[TRANSMISSION SUCCESS] Message encrypted and dispatched successfully. Rouson will respond promptly.", "success");
        this.form.reset();
      } else {
        // Safe fallback using mailto
        this.fallbackMailto(payload);
        this.showFeedback("[FALLBACK] Dispatching via system mail client...", "success");
      }
    } catch (error) {
      console.error("[SEC_ERR] Transmission failure:", error);
      this.fallbackMailto(payload);
      this.showFeedback("[NOTICE] Direct API unreachable. Opening local mail client...", "error");
    } finally {
      this.setLoading(false);
    }
  }

  fallbackMailto(payload) {
    const subject = encodeURIComponent(`[Portfolio Inquiry - ${payload.subject}] from ${payload.from_name}`);
    const body = encodeURIComponent(`Operative Name: ${payload.from_name}\nReturn Address: ${payload.from_email}\nClassification: ${payload.subject}\n\nMessage Payload:\n${payload.message}`);
    const mailtoUrl = `mailto:rouson.ece@gmail.com?subject=${subject}&body=${body}`;

    const link = document.createElement("a");
    link.href = mailtoUrl;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  setLoading(isLoading) {
    if (!this.submitBtn) return;
    this.submitBtn.disabled = isLoading;
    if (isLoading) {
      this.submitBtn.innerHTML = `<span class="btn-icon"><i class="fas fa-spinner fa-spin"></i></span><span>ENCRYPTING &amp; TRANSMITTING...</span>`;
    } else {
      this.submitBtn.innerHTML = this.originalBtnHtml;
    }
  }

  showFeedback(msg, type) {
    if (!this.feedback) return;
    this.feedback.textContent = msg;
    this.feedback.className = `contact-feedback ${type}`;
    this.feedback.style.display = "block";
    this.feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

// ── 9. NAVIGATION MANAGER & MOBILE DRAWER (Goal 10) ─────────
class NavigationManager {
  constructor() {
    this.navbar = document.getElementById("navbar");
    this.navLinks = document.querySelectorAll(".nav-link");
    this.sections = document.querySelectorAll("section[id]");
    this.navToggle = document.getElementById("nav-toggle");
    this.navMenu = document.getElementById("nav-menu");
    this.navBackdrop = document.getElementById("nav-backdrop");
    this.progressBar = document.getElementById("nav-progress");

    this.init();
  }

  init() {
    // Nav links smooth scroll & active state
    this.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
            this.closeMobileDrawer();
          }
        }
      });
    });

    // Mobile drawer toggle
    if (this.navToggle && this.navMenu) {
      this.navToggle.addEventListener("click", () => this.toggleMobileDrawer());
    }

    if (this.navBackdrop) {
      this.navBackdrop.addEventListener("click", () => this.closeMobileDrawer());
    }

    // Escape key closes mobile drawer
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.navMenu && this.navMenu.classList.contains("active")) {
        this.closeMobileDrawer();
      }
    });

    // Scroll listeners for navbar shadow, progress bar & scroll-spy
    window.addEventListener(
      "scroll",
      throttle(() => {
        this.handleScroll();
      }, 30)
    );
  }

  toggleMobileDrawer() {
    const isOpen = this.navMenu.classList.contains("active");
    if (isOpen) {
      this.closeMobileDrawer();
    } else {
      this.openMobileDrawer();
    }
  }

  openMobileDrawer() {
    if (this.navMenu) this.navMenu.classList.add("active");
    if (this.navToggle) {
      this.navToggle.classList.add("active");
      this.navToggle.setAttribute("aria-expanded", "true");
    }
    if (this.navBackdrop) this.navBackdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  closeMobileDrawer() {
    if (this.navMenu) this.navMenu.classList.remove("active");
    if (this.navToggle) {
      this.navToggle.classList.remove("active");
      this.navToggle.setAttribute("aria-expanded", "false");
    }
    if (this.navBackdrop) this.navBackdrop.classList.remove("active");
    document.body.style.overflow = "";
  }

  handleScroll() {
    const scrollY = window.scrollY;

    // Navbar scrolled background
    if (this.navbar) {
      this.navbar.classList.toggle("scrolled", scrollY > 40);
    }

    // Scroll progress line
    if (this.progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      this.progressBar.style.width = `${progress}%`;
    }

    // Scroll-spy active section detection
    let currentSectionId = "home";
    this.sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute("id");
      }
    });

    this.navLinks.forEach((link) => {
      const target = link.getAttribute("data-section");
      link.classList.toggle("active", target === currentSectionId);
    });
  }
}

// ── 10. SCROLL REVEALS (Goal 11) ────────────────────────────
class ScrollRevealer {
  constructor() {
    this.items = document.querySelectorAll(".fade-in-up");
    this.init();
  }

  init() {
    if (this.items.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    this.items.forEach((item) => observer.observe(item));
  }
}

// ── 11. QUICK ACTIONS (Resume Download & Floating Contact) ──
function initQuickActions() {
  // Download Resume button
  const resumeBtn = document.getElementById("downloadResumeBtn");
  if (resumeBtn) {
    resumeBtn.addEventListener("click", () => {
      const link = document.createElement("a");
      link.href = "./assets/resume.pdf";
      link.download = "RousonDas_Cybersecurity_Resume.pdf";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Floating contact button
  const floatingBtn = document.getElementById("floating-contact");
  if (floatingBtn) {
    floatingBtn.addEventListener("click", () => {
      const contactSec = document.getElementById("contact");
      if (contactSec) {
        contactSec.scrollIntoView({ behavior: "smooth" });
        const nameInput = document.getElementById("contact-name");
        if (nameInput) setTimeout(() => nameInput.focus(), 600);
      }
    });
  }

  // Footer Year
  const yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// ── 12. BOOTSTRAP ALL SYSTEMS ───────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  new TerminalLoader();
  new SystemClock();
  new MatrixRain();
  new HeroTyper();
  new StatsCounter();
  new SkillsFilter();
  new ContactFormHandler();
  new NavigationManager();
  new ScrollRevealer();
  initQuickActions();

  console.log("[SYSTEM] Rouson Das Portfolio operational // 200 OK");
});
