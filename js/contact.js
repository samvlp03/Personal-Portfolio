// Updated contact.js with Formspree integration
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const formMessage = document.getElementById('form-message');
        
        // Simple validation
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        if (!name || !email || !subject || !message) {
            showFormMessage(formMessage, 'Please fill in all fields.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormMessage(formMessage, 'Please enter a valid email address.', 'error');
            return;
        }
        
        try {
            // Using Formspree for form submission
            const response = await fetch('https://formspree.io/f/xyzpbkky', {
                method: 'POST',
                body: new URLSearchParams(formData),
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showFormMessage(formMessage, 'Thank you for your message! I will get back to you soon.', 'success');
                contactForm.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
            showFormMessage(formMessage, 'There was an error sending your message. Please try again later.', 'error');
        }
    });
    
    function showFormMessage(element, message, type) {
        element.textContent = message;
        element.className = type;
        element.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
});