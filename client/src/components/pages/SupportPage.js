// client/src/components/pages/SupportPage.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './InfoPages.css'; // Common CSS

const SupportPage = () => {
    return (
        <div className="info-page">
            <div className="container">
                <div className="info-content">
                    <h1>Customer Support 🆘</h1>
                    <p>We're here to help! Find the best way to get support below.</p>

                    <h2>Frequently Asked Questions (FAQ)</h2>
                    <p>Many common questions are already answered in our FAQ section. Please check there first!</p>
                    <p><Link to="/faq" className="support-link">Visit FAQ Page</Link></p> {/* Link to FAQ */}

                    <h2>Contact Us Directly</h2>
                    <p>If you can't find your answer in the FAQ, feel free to reach out:</p>
                    <ul>
                        <li><strong>Email Support:</strong> For general inquiries, order issues, or feedback, email us at <a href="mailto:good.deal326@gmail.com" className="support-link">good.deal326@gmail.com</a>. We aim to respond within 24 business hours.</li>
                        <li><strong>Phone Support:</strong> Call us at +880 1619302150 during our business hours (Sunday - Thursday, 10 AM - 6 PM BDT).</li>
                        <li><strong>Contact Form:</strong> You can also send us a message through our <Link to="/contact" className="support-link">Contact Page</Link>.</li> {/* Link to Contact */}
                    </ul>

                    <h2>Order Issues</h2>
                    <p>For problems with an existing order (tracking, returns, damages), please include your order number in your communication for faster assistance.</p>
                    <ul>
                        <li><Link to="/shipping" className="support-link">Shipping Information</Link></li>
                        <li><Link to="/returns" className="support-link">Returns Policy</Link></li>
                    </ul>

                    <h2>Business Hours</h2>
                    <p>Our customer support team is available:</p>
                    <p><strong>Sunday - Thursday:</strong> 10:00 AM - 6:00 PM (Bangladesh Standard Time)</p>
                    <p>We are closed on Fridays, Saturdays, and public holidays.</p>

                </div>
            </div>
        </div>
    );
};

export default SupportPage;