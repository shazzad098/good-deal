// client/src/components/pages/ContactUs.js
import React, { useState } from 'react';
import './ContactUs.css'; // Amra ektu styling add korbo

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');

        // --- Backend Integration Placeholder ---
        // Ekhane apnar backend API te data pathanor code likhte hobe.
        // For now, we'll simulate a delay and show a message.
        console.log('Form Data:', formData);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
        // --- End Placeholder ---

        setIsSubmitting(false);
        setSubmitMessage('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
    };

    return (
        <div className="contact-us-page">
            <div className="container">
                <div className="contact-header">
                    <h1>Get In Touch 📞</h1>
                    <p>We'd love to hear from you! Whether you have a question about features, pricing, need a demo, or anything else, our team is ready to answer all your questions.</p>
                </div>

                <div className="contact-grid">
                    {/* Contact Info */}
                    <div className="contact-info">
                        <h2>Contact Information</h2>
                        <p>Fill up the form and our Team will get back to you within 24 hours.</p>
                        <div className="info-item">
                            <span className="info-icon">📧</span>
                            <a href="mailto:good.deal326@gmail.com">good.deal326@gmail.com</a>
                        </div>
                        <div className="info-item">
                            <span className="info-icon">📞</span>
                            <span>+880 1619302150</span>
                        </div>
                        <div className="info-item">
                            <span className="info-icon">📍</span>
                            <span>Dhaka, Bangladesh</span>
                        </div>
                        {/* Add social media links if you have them */}
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-container">
                        <h2>Send Us a Message</h2>
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <label htmlFor="name">Full Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Your Name"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Address *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="your.email@example.com"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="subject">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="How can we help?"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    placeholder="Your message..."
                                ></textarea>
                            </div>
                            <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                            {submitMessage && (
                                <p className="submit-success-message">{submitMessage}</p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;