import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* Company Info */}
                    <div className="footer-section">
                        <div className="footer-logo">
                            <span className="logo-icon">🛒</span>
                            <h3>GoodDeal</h3>
                        </div>
                        <p className="footer-description">
                            Your trusted online destination for quality electronics and fashion.
                            We bring you the best deals with excellent customer service.
                        </p>
                        <div className="footer-contact">
                            <div className="contact-item">
                                <span className="contact-icon">📧</span>
                                <a href="mailto:good.deal326@gmail.com" className="contact-link">
                                    good.deal326@gmail.com
                                </a>
                            </div>
                            <div className="contact-item">
                                <span className="contact-icon">📞</span>
                                <span>+880 1XXX-XXXXXX</span>
                            </div>
                            <div className="contact-item">
                                <span className="contact-icon">📍</span>
                                <span>Dhaka, Bangladesh</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h4 className="footer-title">Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/products">Products</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="footer-section">
                        <h4 className="footer-title">Categories</h4>
                        <ul className="footer-links">
                            <li><Link to="/products?category=electronics">Electronics</Link></li>
                            <li><Link to="/products?category=clothing">Clothing</Link></li>
                            <li><Link to="/products?category=electronics&subcategory=mobile">Mobile Phones</Link></li>
                            <li><Link to="/products?category=electronics&subcategory=laptop">Laptops</Link></li>
                            <li><Link to="/products?category=clothing&subcategory=men">Men's Fashion</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="footer-section">
                        <h4 className="footer-title">Customer Service</h4>
                        <ul className="footer-links">
                            <li><Link to="/shipping">Shipping Info</Link></li>
                            <li><Link to="/returns">Returns</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                            <li><Link to="/support">Support</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="footer-section">
                        <h4 className="footer-title">Stay Connected</h4>
                        <p className="newsletter-text">
                            Subscribe to get special offers, free giveaways, and exclusive deals.
                        </p>
                        <div className="newsletter-form">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="newsletter-input"
                            />
                            <button className="newsletter-btn">Subscribe</button>
                        </div>

                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <div className="copyright">
                            <p>&copy; 2024 GoodDeal. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;