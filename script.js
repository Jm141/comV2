// Form state management
let formSubmitted = false;
let formData = {
    fullName: "",
    email: "",
    mobile: "",
    careers: false,
    school: "",
    city: "",
    consent: false,
};

// DOM elements
const formElement = document.getElementById('signup-form-element');
const formContainer = document.getElementById('form-container');
const successMessage = document.getElementById('success-message');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set up form event listeners
    setupFormListeners();
    
    // Set up smooth scrolling for navigation links
    setupSmoothScrolling();
    
    // Initialize form data binding
    initializeFormDataBinding();
});

// Form submission handler
function handleSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formDataObj = new FormData(formElement);
    const data = Object.fromEntries(formDataObj.entries());
    
    // Update form data state
    formData = {
        ...data,
        consent: formDataObj.has('consent')
    };
    
    // Set form as submitted
    formSubmitted = true;
    
    // Hide form and show success message
    formContainer.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Scroll to success message
    setTimeout(() => {
        successMessage.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }, 100);
    
    // Log form data (in a real app, you'd send this to a server)
    console.log('Form submitted with data:', formData);
}

// Reset form function
function resetForm() {
    formSubmitted = false;
    formData = {
        fullName: "",
        email: "",
        mobile: "",
        careers: false,
        school: "",
        city: "",
        consent: false,
    };
    
    // Clear form inputs
    formElement.reset();
    
    // Show form and hide success message
    formContainer.style.display = 'block';
    successMessage.style.display = 'none';
    
    // Scroll to form
    formElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
}

// Scroll to form function
function scrollToForm() {
    const formSection = document.getElementById('signup-form');
    if (formSection) {
        formSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }
}

// Set up form event listeners
function setupFormListeners() {
    if (formElement) {
        formElement.addEventListener('submit', handleSubmit);
    }
}

// Set up smooth scrolling for navigation
function setupSmoothScrolling() {
    // Handle "Get Started Today" and "Sign Me Up Now" buttons
    const ctaButtons = document.querySelectorAll('.btn-cta');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToForm();
        });
    });
    
    // Handle navigation links (if they point to sections)
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize form data binding for real-time updates
function initializeFormDataBinding() {
    const inputs = formElement.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // Update form data in real-time
            if (this.type === 'checkbox') {
                formData[this.name] = this.checked;
            } else {
                formData[this.name] = this.value;
            }
        });
    });
}

// Form validation helper
function validateForm() {
    const requiredFields = formElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    });
    
    // Check consent checkbox
    const consentCheckbox = document.getElementById('consent');
    if (consentCheckbox && !consentCheckbox.checked) {
        isValid = false;
        consentCheckbox.classList.add('error');
    } else if (consentCheckbox) {
        consentCheckbox.classList.remove('error');
    }
    
    return isValid;
}

// Add error styles to CSS
const errorStyles = `
    .form-input.error,
    .consent-checkbox.error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
`;

// Inject error styles
const styleSheet = document.createElement('style');
styleSheet.textContent = errorStyles;
document.head.appendChild(styleSheet);

// Enhanced form submission with validation
function handleSubmitWithValidation(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        // Scroll to first error
        const firstError = formElement.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
            firstError.focus();
        }
        return;
    }
    
    // Proceed with normal submission
    handleSubmit(e);
}

// Update form submission to use validation
if (formElement) {
    formElement.removeEventListener('submit', handleSubmit);
    formElement.addEventListener('submit', handleSubmitWithValidation);
}

// Add loading state to submit button
function addLoadingState() {
    const submitButton = formElement.querySelector('button[type="submit"]');
    if (submitButton) {
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitButton.disabled = true;
        
        // Reset after 2 seconds (simulate API call)
        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }, 2000);
    }
}

// Update form submission to include loading state
const originalHandleSubmit = handleSubmit;
handleSubmit = function(e) {
    addLoadingState();
    setTimeout(() => {
        originalHandleSubmit(e);
    }, 1000);
};

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Escape key to close success message
    if (e.key === 'Escape' && successMessage.style.display === 'block') {
        resetForm();
    }
    
    // Enter key on form inputs
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        const form = e.target.closest('form');
        if (form) {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
    }
});

// Add focus management for accessibility
function manageFocus() {
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableContent = document.querySelectorAll(focusableElements);
    const firstFocusableElement = focusableContent[0];
    const lastFocusableElement = focusableContent[focusableContent.length - 1];
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Initialize focus management
manageFocus();

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.feature-card, .benefit-card, .qr-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// Add animation styles
const animationStyles = `
    .feature-card,
    .benefit-card,
    .qr-card {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease-out;
    }
    
    .feature-card.animate-in,
    .benefit-card.animate-in,
    .qr-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;

const animationStyleSheet = document.createElement('style');
animationStyleSheet.textContent = animationStyles;
document.head.appendChild(animationStyleSheet);

// Console log for debugging
console.log('SERVIO Community page loaded successfully!');
console.log('Form functionality initialized');
console.log('Smooth scrolling enabled');
console.log('Accessibility features active');
