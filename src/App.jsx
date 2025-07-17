import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import './App.css';
import './components/Profile.css';

// ====================================================
// THEME UTILITY FUNCTIONS
// ====================================================

/**
 * Detects the user's preferred color scheme from system settings
 * @returns {string} 'dark' or 'light'
 */
const getSystemTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

/**
 * Gets the user's saved theme preference or falls back to system preference
 * @returns {boolean} true for dark mode, false for light mode
 */
const getInitialTheme = () => {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    return savedTheme === 'dark';
  }
  
  // Fall back to system preference
  return getSystemTheme() === 'dark';
};

/**
 * Applies theme classes to HTML elements and updates meta tags
 * @param {boolean} isDarkMode - Whether dark mode is active
 */
const applyTheme = (isDarkMode) => {
  const html = document.documentElement;
  const body = document.body;
  
  // Remove preload class to enable transitions
  html.classList.remove('preload');
  body.classList.remove('preload');
  
  // Apply theme classes
  if (isDarkMode) {
    html.classList.add('dark-mode');
    html.classList.remove('light-mode');
    body.classList.add('dark-mode');
    body.classList.remove('light-mode');
    
    // Update theme-color meta tag for mobile browsers
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#111827');
  } else {
    html.classList.add('light-mode');
    html.classList.remove('dark-mode');
    body.classList.add('light-mode');
    body.classList.remove('dark-mode');
    
    // Update theme-color meta tag for mobile browsers
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#ffffff');
  }
  
  // Save preference to localStorage
  localStorage.setItem('portfolio-theme', isDarkMode ? 'dark' : 'light');
};

const certificates = [
  { 
    src: '/AFRINIC ipv6 certification.jpg', 
    alt: 'AFRINIC IPv6 Deep-Dive Masterclass Certification',
    title: 'AFRINIC IPv6 Certification',
    description: 'Advanced networking and IPv6 implementation certification',
    category: 'Networking',
    verificationMethod: 'email',
    email: 'training@afrinic.net',
    verificationMessage: 'To verify this certificate, please send an email to training@afrinic.net with enquiry about this certification.'
  },
  { 
    src: '/google cybersucurity certificate.jpg', 
    alt: 'Google Cybersecurity Certificate',
    title: 'Google Cybersecurity Certificate',
    description: 'Advanced cybersecurity and information protection',
    category: 'Cybersecurity',
    verificationMethod: 'link',
    verificationLink: 'https://coursera.org/verify/professional-cert/FHSM9ZCT6PIV'
  },
  { 
    src: '/google cloud certificate.jpg', 
    alt: 'Google Cloud Certificate',
    title: 'Google Cloud Certificate',
    description: 'Cloud computing and infrastructure expertise',
    category: 'Cloud Computing',
    verificationMethod: 'link',
    verificationLink: 'https://www.coursera.org/account/accomplishments/records/0USE1SD4TGE5'
  },
  { 
    src: '/dhis2-certificate.jpg', 
    alt: 'DHIS2 Certificate',
    title: 'Introduction to DHIS2',
    description: 'Health Information Systems and DHIS2 platform certification',
    category: 'Health Information Systems',
    verificationMethod: 'link',
    verificationLink: 'https://academy.dhis2.org/certificates/24773cbc32b749a881b4062edbf6be01'
  },
  { 
    src: '/transcript-placeholder.jpg', 
    alt: 'BSc Computer Network Engineering Transcript',
    title: 'BSc Computer Network Engineering Transcript',
    description: 'University of Malawi (UNIMA) - Official Academic Transcript',
    category: 'Education',
    verificationMethod: 'email',
    email: 'kenkandojemw@gmail.com',
    requestMessage: 'This transcript is available upon request. Please contact kenkandojemw@gmail.com to request a copy.',
    blurred: true
  },
  { 
    src: '/cert one_page-0001.jpg', 
    alt: 'MSCE ',
    title: 'MSCE',
    description: 'Malawi School Certificate of Education',
    category: 'Professional Development',
    verificationMethod: 'email',
    email: 'kenkandojemw@gmail.com',
    requestMessage: 'This certificate is available upon request. Please contact kenkandojemw@gmail.com to request a copy.',
    blurred: true
  },
];

function App() {
  const [selectedCert, setSelectedCert] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  
  // ====================================================
  // THEME STATE MANAGEMENT
  // ====================================================
  
  // Enhanced theme state with intelligent initialization
  const [darkMode, setDarkMode] = useState(() => getInitialTheme());
  
  // Track system theme preference changes
  const [systemTheme, setSystemTheme] = useState(() => getSystemTheme());

  // Function to scroll to contact section
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      setSelectedCert(null); // Close modal
    }
  };

  // Contact form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setSubmitStatus('error');
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
      return;
    }

    try {
      // EmailJS configuration - you'll need to replace these with your actual values
      // See EMAILJS_SETUP.md for detailed setup instructions
      const serviceId = 'service_e5bbvza'; // Your EmailJS service ID
      const templateId = 'template_rzn9pr2'; // Your EmailJS template ID
      const publicKey = 'Pxpe1bTp7navFqEWk'; // Your EmailJS public key

      // Validate that EmailJS is configured
      if (serviceId === 'YOUR_SERVICE_ID' || templateId === 'YOUR_TEMPLATE_ID' || publicKey === 'YOUR_PUBLIC_KEY') {
        throw new Error('EmailJS not configured. Please check EMAILJS_SETUP.md for setup instructions.');
      }

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: 'kenkandojemw@gmail.com', // Your email address
        reply_to: formData.email
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
      
    } catch (error) {
      console.error('Email sending failed:', error);
      setSubmitStatus('error');
      
      // Auto-hide error message after 8 seconds (longer for error)
      setTimeout(() => setSubmitStatus(null), 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedCert) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCert]);

  useEffect(() => {
    const handleSmoothScroll = (e) => {
      const targetId = e.currentTarget.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const offset = window.innerWidth <= 768 ? 80 : 60; // More offset on mobile
          window.scrollTo({
            top: targetElement.offsetTop - offset,
            behavior: 'smooth'
          });
        }
      }
    };

    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', handleSmoothScroll);
    });

    // Close mobile menu when clicking outside
    const handleClickOutside = (e) => {
      if (menuOpen && !e.target.closest('.nav-content')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      navLinks.forEach(link => {
        link.removeEventListener('click', handleSmoothScroll);
      });
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuOpen]);

  // ====================================================
  // THEME EFFECTS
  // ====================================================
  
  // Apply theme changes with enhanced functionality
  useEffect(() => {
    applyTheme(darkMode);
    
    // Update CSS custom properties for smooth transitions
    const root = document.documentElement;
    root.style.setProperty('--theme-transition', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)');
    
    // Log theme change for debugging (remove in production)
    console.log(`🎨 Theme switched to: ${darkMode ? 'dark' : 'light'} mode`);
    
  }, [darkMode]);
  
  // Listen for system theme preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);
      
      // Only auto-switch if user hasn't manually set a preference
      const savedTheme = localStorage.getItem('portfolio-theme');
      if (!savedTheme) {
        setDarkMode(e.matches);
        console.log(`🔄 System theme changed to: ${newSystemTheme}, auto-switching theme`);
      } else {
        console.log(`🔄 System theme changed to: ${newSystemTheme}, but user preference (${savedTheme}) maintained`);
      }
    };
    
    // Add listener for system theme changes
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    // Cleanup listener on component unmount
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);
  
  // ====================================================
  // THEME TOGGLE FUNCTIONS
  // ====================================================
  
  // Enhanced theme toggle with smooth transitions and accessibility
  const toggleTheme = () => {
    // Add transition class for smooth animation
    document.documentElement.classList.add('theme-transitioning');
    
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Log the manual theme change
    console.log(`🎯 User manually switched to: ${newDarkMode ? 'dark' : 'light'} mode`);
    
    // Remove transition class after animation completes
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 300);
    
    // Optional: Add haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };
  
  // Keyboard shortcut for theme toggle (Ctrl/Cmd + Shift + T)
  useEffect(() => {
    const handleKeyboardShortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        toggleTheme();
        console.log('🎹 Theme toggled via keyboard shortcut');
      }
    };
    
    document.addEventListener('keydown', handleKeyboardShortcut);
    
    return () => {
      document.removeEventListener('keydown', handleKeyboardShortcut);
    };
  }, [darkMode]);

  return (
    <div className="App">
      {/* Mobile menu overlay */}
      <div 
        className={`nav-overlay ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
      />
      
      <nav className="nav-bar" role="navigation" aria-label="Main navigation">
        <div className="nav-content">
          {/* Brand/Logo Section */}
          <div className="nav-brand">
            <a href="#about" className="brand-link" onClick={() => setMenuOpen(false)}>
              <h1 className="brand-name">Ken Junior Kandoje</h1>
              <span className="brand-tagline">Network Engineer & Tech Enthusiast</span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="hamburger" 
            onClick={() => setMenuOpen(!menuOpen)} 
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
            aria-controls="main-navigation"
          >
            <span className="hamburger-icon">
              <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </span>
          </button>

          {/* Navigation Links */}
          <div 
            id="main-navigation"
            className={`nav-links ${menuOpen ? 'open' : ''}`}
            role="menubar"
            aria-hidden={!menuOpen}
          >
            {/* Primary Navigation */}
            <div className="nav-section primary-nav">
              {[
                { href: '#about', label: 'About', icon: 'fa-user' },
                { href: '#education', label: 'Education', icon: 'fa-graduation-cap' },
                { href: '#experience', label: 'Experience', icon: 'fa-briefcase' },
                { href: '#projects', label: 'Projects', icon: 'fa-code' }
              ].map((item) => (
                <a 
                  key={item.href}
                  href={item.href}
                  className="nav-link primary-link"
                  onClick={() => setMenuOpen(false)}
                  role="menuitem"
                  aria-label={`Navigate to ${item.label} section`}
                >
                  <i className={`fas ${item.icon}`} aria-hidden="true"></i>
                  <span>{item.label}</span>
                </a>
              ))}
            </div>

            {/* Secondary Navigation */}
            <div className="nav-section secondary-nav">
              {[
                { href: '#certificates', label: 'Certificates', icon: 'fa-certificate' },
                { href: '#skills', label: 'Skills', icon: 'fa-cogs' },
                { href: '#contact', label: 'Contact', icon: 'fa-envelope' }
              ].map((item) => (
                <a 
                  key={item.href}
                  href={item.href}
                  className="nav-link secondary-link"
                  onClick={() => setMenuOpen(false)}
                  role="menuitem"
                  aria-label={`Navigate to ${item.label} section`}
                >
                  <i className={`fas ${item.icon}`} aria-hidden="true"></i>
                  <span>{item.label}</span>
                </a>
              ))}
            </div>

            {/* Utility Navigation */}
            <div className="nav-section utility-nav">
              {/* Theme Toggle */}
              <button 
                className="theme-toggle nav-utility-btn"
                onClick={toggleTheme}
                aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
                title={`Currently in ${darkMode ? 'dark' : 'light'} mode. Click to switch or use Ctrl+Shift+T`}
                role="button"
              >
                <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`} aria-hidden="true"></i>
                <span className="utility-label">
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </span>
                <span className="sr-only">
                  {darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                </span>
              </button>

              {/* Optional: Quick Contact CTA */}
              {/* */}
            </div>
          </div>
        </div>
      </nav>

      <section className="profile-section" id="about">
        <div className="profile-container">
          <div className="profile-image-container">
            <div className="image-frame">
              <img 
                src="/ken.jpg"
                alt="Ken Junior Kandoje - Network Engineer & Tech Innovator" 
                className="profile-image"
              />
              <div className="frame-decoration"></div>
            </div>
            <div className="floating-badges">
              <span className="tech-badge">Tech Enthusiast</span>
              <span className="tech-badge">Network Engineer</span>
              <span className="tech-badge">Cybersecurity Specialist</span>
            </div>
          </div>

          <div className="profile-text">
            <div className="name-title-container">
              <h1 className="profile-name">Ken Junior Kandoje</h1>
              <h2 className="profile-title">Network Engineering · Cybersecurity · Digital Innovation</h2>
            </div>
            <p className="professional-summary">
             Award-winning Network Engineer with a BSc in Computer Network Engineering from the University of Malawi.
             Champion of the 2025 Southern Africa Digital ID Hackathon, where I led the development of 
              UmodziRx, bringing innovative solutions to complex security challenges.
               Skilled in networking and security, cybersecurity, digital identity systems, and programming. Passionate about
                leveraging technology to solve real-world problems and drive impactful change.
            </p>
            <div className="contact-badges">
              <span className="contact-badge">
                <i className="fas fa-map-marker-alt"></i>
                <span className="badge-text">Malawi, Blantyre</span>
              </span>
              <span className="contact-badge">
                <i className="fas fa-globe"></i>
                <span className="badge-text">Open to Global Opportunities</span>
              </span>
            </div>
            <div className="profile-actions">
              <a href="/Ken_Junior_Kandoje_CV.pdf" download className="cv-link">
                <i className="fas fa-download"></i>
                <span>Download CV</span>
              </a>
              <div className="social-links">
                <a href="https://linkedin.com/in/kenkandojemw" className="social-link" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="https://github.com/kenkandojemw" className="social-link" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-github"></i>
                </a>    
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="education" id="education">
        <h2>Education</h2>
        <div className="education-content">
          <div className="degree-card">
            <h3>BSc in Computer Network Engineering</h3>
            <div className="university-details">
              <p className="university-name">University of Malawi (UNIMA)</p>
              <div className="education-highlights">
                <span className="highlight-badge">2025</span>
              </div>
            </div>
            <div className="degree-details">
              <div className="key-courses">
                <h4>Key Focus Areas</h4>
                <div className="course-tags">
                  <span>Wireless and Mobile Networks</span>
                   <span>Network Designing and Simulation</span>
                  <span>Network Routing and Switching</span>
                   <span>Network Monitoring and Optimisation</span>
                  <span>Network Security</span>
                   <span>Artificial Intelligence and Machine Learning</span>
                    <span>Algorithms and Data Structures</span>
                     <span>Project Management</span>
                    <span>Linux Systems Administration</span>
                     <span>Cloud Computing and Infrastructure</span>
                     <span>Database Systems</span>
                     <span>Operating Systems</span>
                     <span>Advanced Programming</span>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="certificates" id="certificates">
        <h2>Certifications</h2>
        <div className="cert-grid">
          {certificates.map((cert, idx) => (
            <div 
              key={idx} 
              className="cert-item"
              onClick={() => setSelectedCert(cert)}
            >
              <div className="cert-image-container">
                <img src={cert.src} alt={cert.alt} />
              </div>
              <h3>{cert.title}</h3>
              <p>{cert.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="experience" id="experience">
        <h2>Professional Experience</h2>
        <div className="experience-grid">
          <div className="experience-item">
            <h3>Election Device Management Operator</h3>
            <p className="company">Malawi Electoral Commission</p>
            <ul>
              <li>Operated and maintained biometric registration devices</li>
              <li>Managed sensitive election materials and equipment</li>
              <li>Ensured proper setup and timely closure of registration centers</li>
            </ul>
          </div>
          <div className="experience-item">
            <h3>Computer & Electronics Repair Specialist</h3>
            <p className="company">Self-Employed</p>
            <ul>
              <li>Diagnosed and resolved hardware/software issues</li>
              <li>Streamlined service processes to enhance efficiency</li>
              <li>Provided upgrade advice and technical consultations</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="projects" id="projects">
        <h2>Projects</h2>
        <div className="project-grid">
          <div className="project-item">
            <h3>UmodziRx</h3>
            <p className="project-highlight">Grand Winner - 2025 Southern Africa Digital ID Hackathon</p>
            <div className="project-content">
              <p>A blockchain and MOSIP based digital prescription platform</p>
              <div className="project-details">
                <h4>Key Achievements:</h4>
                <ul>
                  <li>Led development team of four members</li>
                  <li>Integrated Hyperledger Fabric with MOSIP for secure digital ID authentication</li>
                  <li>Implemented tamper-proof prescription tracking system</li>
                  <li>Won 1st place among 100+ participants across Southern Africa</li>
                </ul>
              </div>
              <div className="tech-stack">
                <span>Hyperledger Fabric</span>
                <span>MOSIP</span>
                <span>Blockchain</span>
                <span>Digital Identity</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="skills" id="skills">
        <h2>Expertise</h2>
        <div className="experience-grid">
          <div className="experience-item">
            <h3>Networking & Cybersecurity</h3>
            <p className="company">Core Competencies</p>
            <ul>
              <li>Network Design & Simulation</li>
              <li>Monitoring & Optimization</li>
              <li>Routing & Switching</li>
              <li>Intrusion Detection Systems (IDS)</li>
              <li>Firewall Configuration</li>
              <li>Risk & Incident Management</li>
              <li>Hardening</li>
            </ul>
          </div>
          <div className="experience-item">
            <h3>Software Development</h3>
            <p className="company">Technical Skills</p>
            <ul>
              <li>Full-Stack: Node.js, React.js</li>
              <li>Languages: Java, Python, JavaScript, C++</li>
              <li>RESTful API Development</li>
              <li>Digital Identity Integration</li>
              <li>Hyperledger Fabric</li>
            </ul>
          </div>
          <div className="experience-item">
            <h3>Leadership & Soft Skills</h3>
            <p className="company">Professional Skills</p>
            <ul>
              <li>Team Leadership & Mentoring</li>
              <li>Cross-functional Collaboration</li>
              <li>Problem Solving</li>
              <li>Time Management</li>
              <li>Effective Communication</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="contact-container">
          <div className="section-header">
            <h2 className="section-title">Get In Touch</h2>
            <div className="title-underline"></div>
          </div>
          
          <div className="contact-content">
            {/* Left Column - Contact Info */}
            <div className="contact-info">
              <div style={{ marginBottom: '1.5rem', fontWeight: '600', fontSize: '1.3rem', color: 'var(--primary-color)' }}>
                Contact Information
              </div>
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="contact-text">
                    <h3>Email</h3>
                    <a href="mailto:kenkandojemw@gmail.com">kenkandojemw@gmail.com</a>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="contact-text">
                    <h3>Phone</h3>
                <a href="https://wa.me/265991600060" target="_blank" rel="noopener noreferrer">+265 991 600 060</a>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="contact-text">
                    <h3>Location</h3>
                    <span>Malawi, Blantyre</span>
                  </div>
                </div>
                <div style={{ marginTop: '1.5rem', fontWeight: '600', fontSize: '1.1rem', color: 'var(--primary-color)', textAlign: 'center' }}>
                  Connect With Me
                </div>
                <div className="social-buttons" style={{ marginTop: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
                  <a 
                    href="https://linkedin.com/in/kenkandojemw" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link linkedin"
                    aria-label="LinkedIn Profile"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a 
                    href="https://github.com/kenkandojemw" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link github"
                    aria-label="GitHub Profile"
                  >
                    <i className="fab fa-github"></i>
                  </a>
                  <a 
                    href="https://twitter.com/kenkandojemw" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link twitter"
                    aria-label="Twitter Profile"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Right Column - Contact Form */}
            <div>
              <div style={{ marginBottom: '1.5rem', fontWeight: '600', fontSize: '1.3rem', color: 'var(--primary-color)' }}>
                Send Me a Message
              </div>
              <div className="contact-form">
                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="form-status success">
                    <i className="fas fa-check-circle"></i>
                    <span>Message sent successfully! I'll get back to you soon.</span>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="form-status error">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>Failed to send message. Please check all fields are filled and try again, or contact me directly at kenkandojemw@gmail.com</span>
                  </div>
                )}

                <form className="contact-form-container" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group half-width">
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Your full name"
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div className="form-group half-width">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your.email@example.com"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="What's this about?"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="5"
                      placeholder="Tell me about your project or how I can help..."
                      disabled={isSubmitting}
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedCert && (
        <div 
          className="modal-overlay" 
          onClick={() => setSelectedCert(null)}
          onTouchStart={(e) => e.preventDefault()} // Prevent mobile scroll
        >
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button 
              className="close-button" 
              onClick={() => setSelectedCert(null)}
              aria-label="Close certificate modal"
            >
              ×
            </button>
            
            <div className="certificate-image-container">
              <img 
                src={selectedCert.src} 
                alt={selectedCert.alt} 
                className={selectedCert.blurred ? 'certificate-blurred' : ''}
              />
            </div>
            
            <h3>{selectedCert.title}</h3>
            <p>{selectedCert.description}</p>
            
            <div className="verification-actions">
              {selectedCert.verificationMethod === 'link' && (
                <a 
                  href={selectedCert.verificationLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="verify-button"
                >
                  <i className="fas fa-external-link-alt"></i>
                  Verify Certificate
                </a>
              )}
              
              {selectedCert.verificationMethod === 'email' && selectedCert.verificationMessage && (
                <div className="email-verification">
                  <p className="availability-notice">
                    <i className="fas fa-info-circle"></i>
                    Certificate verification is available upon request
                  </p>
                  <button 
                    onClick={scrollToContact}
                    className="email-button"
                  >
                    <i className="fas fa-envelope"></i>
                    Request This
                  </button>
                </div>
              )}
              
              {selectedCert.requestMessage && (
                <div className="certificate-request">
                  <p className="availability-notice">
                    <i className="fas fa-info-circle"></i>
                    Certificate copy is available upon request
                  </p>
                  <button 
                    onClick={scrollToContact}
                    className="request-button"
                  >
                    <i className="fas fa-envelope"></i>
                    Request This
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer>
        <p>&copy; 2025 Ken Junior Kandoje. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;