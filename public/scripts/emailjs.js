/**
 * EmailJS Integration Script
 * Handles form submissions using EmailJS service
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://dashboard.emailjs.com/admin/integration
 * 2. Copy your Public Key and paste it in the EMAILJS_CONFIG.publicKey field below
 * 3. Go to https://dashboard.emailjs.com/admin/template
 * 4. Create a new email template (or use an existing one)
 * 5. In your template, use variables like {{name}}, {{email}}, {{phone}}, {{service}}, {{message}}
 *    These should match the form field names (name, email, phone, service, message)
 * 6. Copy the Template ID and paste it in the EMAILJS_CONFIG.templateId field below
 * 7. Make sure your EmailJS service (service_mkrs66a) is connected to an email account
 * 
 * The form will automatically send emails when submitted with the following fields:
 * - name (required)
 * - email (required)
 * - phone (optional)
 * - service (optional)
 * - message (required)
 * - timestamp (automatically added)
 * - page_url (automatically added)
 */

// EmailJS Configuration
const EMAILJS_CONFIG = {
  serviceId: 'service_mkrs66a', // Your EmailJS Service ID
  publicKey: 'enEsmLLLmetOUq4Sw', // EmailJS Public Key
  templateId: 'template_j23m67n' // Contact Us template - notifications to business owner
};

/**
 * Initialize EmailJS SDK
 * @returns {Promise} - Promise that resolves when EmailJS is ready
 */
function initEmailJS() {
  return new Promise((resolve, reject) => {
    // If EmailJS is already loaded, just initialize it
    if (typeof emailjs !== 'undefined') {
      if (EMAILJS_CONFIG.publicKey) {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        resolve();
      } else {
        reject(new Error('EmailJS Public Key is not configured'));
      }
      return;
    }

    // Load EmailJS SDK
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = () => {
      // Initialize EmailJS with public key
      if (EMAILJS_CONFIG.publicKey) {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        resolve();
      } else {
        reject(new Error('EmailJS Public Key is not configured. Please add it to emailjs.js'));
      }
    };
    script.onerror = () => {
      reject(new Error('Failed to load EmailJS SDK'));
    };
    document.head.appendChild(script);
  });
}

// Store initialization promise
let emailJSReady = null;

/**
 * Ensure EmailJS is initialized and ready
 * @returns {Promise} - Promise that resolves when EmailJS is ready
 */
async function ensureEmailJSReady() {
  if (emailJSReady === null) {
    emailJSReady = initEmailJS();
  }
  return emailJSReady;
}

/**
 * Send email using EmailJS
 * @param {Object} formData - Form data object with field names and values
 * @param {string} templateId - EmailJS template ID (optional, uses config if not provided)
 * @returns {Promise} - Promise that resolves when email is sent
 */
async function sendEmail(formData, templateId = null) {
  // Ensure EmailJS is ready
  await ensureEmailJSReady();

  // Use provided template ID or fall back to config
  const template = templateId || EMAILJS_CONFIG.templateId;
  
  if (!template) {
    throw new Error('EmailJS Template ID is not configured. Please add it to emailjs.js');
  }

  if (!EMAILJS_CONFIG.publicKey) {
    throw new Error('EmailJS Public Key is not configured. Please add it to emailjs.js');
  }

  // Send email
  try {
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      template,
      formData
    );
    console.log('Email sent successfully!', response.status, response.text);
    return response;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

/**
 * Handle contact form submission
 * @param {HTMLFormElement} form - The form element
 * @param {Object} options - Options for form handling
 */
async function handleContactForm(form, options = {}) {
  const {
    successMessage = 'Thank you for your message! We will get back to you soon.',
    errorMessage = 'Sorry, there was an error sending your message. Please try again later.',
    loadingText = 'Sending...',
    buttonSelector = 'button[type="submit"]'
  } = options;

  // Ensure EmailJS is ready before setting up the form handler
  try {
    await ensureEmailJSReady();
  } catch (error) {
    console.warn('EmailJS not ready, but form handler will still be set up:', error.message);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitButton = form.querySelector(buttonSelector);
    const originalButtonText = submitButton ? submitButton.textContent : '';
    
    // Disable submit button and show loading state
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = loadingText;
    }

    try {
      // Ensure EmailJS is ready
      await ensureEmailJSReady();

      // Collect form data
      const formData = new FormData(form);
      const emailData = {};
      
      // Convert FormData to object for EmailJS
      for (const [key, value] of formData.entries()) {
        emailData[key] = value;
      }

      // Add timestamp and page URL for context
      emailData.timestamp = new Date().toISOString();
      emailData.page_url = window.location.href;

      // Send email
      await sendEmail(emailData);

      // Show success message
      alert(successMessage);
      
      // Reset form
      form.reset();
    } catch (error) {
      // Show error message
      alert(errorMessage);
      console.error('Form submission error:', error);
    } finally {
      // Re-enable submit button
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}

// Initialize EmailJS when script loads (but don't wait for it)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    ensureEmailJSReady().catch(err => {
      console.warn('EmailJS initialization warning:', err.message);
    });
  });
} else {
  ensureEmailJSReady().catch(err => {
    console.warn('EmailJS initialization warning:', err.message);
  });
}

