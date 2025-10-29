// client/src/components/pages/AboutUs.js
import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
    return (
        <div className="about-us-page">
            <div className="container">
                <div className="about-us-content">
                    <h1 className="about-title">About GoodDeal 🛍️</h1>
                    <p className="about-intro">
                        Welcome to GoodDeal, your trusted online destination for quality electronics and fashion! We are passionate about bringing you the latest trends and best technology at unbeatable prices.
                    </p>

                    <h2 className="section-title">Our Mission ✨</h2>
                    <p>
                        Our mission is simple: to provide a seamless and enjoyable shopping experience, offering a curated selection of high-quality products backed by excellent customer service. We believe that everyone deserves a good deal!
                    </p>

                    <h2 className="section-title">Why Choose Us? 🤔</h2>
                    <ul>
                        <li><span className="bullet-icon">✅</span> **Curated Selection:** We carefully select products to ensure quality and value.</li>
                        <li><span className="bullet-icon">💰</span> **Competitive Prices:** We work hard to offer you the best deals possible.</li>
                        <li><span className="bullet-icon">🤝</span> **Customer Focus:** Your satisfaction is our top priority.</li>
                        <li><span className="bullet-icon">🔒</span> **Secure Shopping:** Shop with confidence using our secure platform.</li>
                    </ul>

                    <h2 className="section-title">Get in Touch 📧</h2>
                    <p>
                        Have questions or feedback? We'd love to hear from you! Visit our <a href="/contact">Contact Page</a> or email us directly at <a href="mailto:good.deal326@gmail.com">good.deal326@gmail.com</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;