// client/src/components/pages/ReturnsPolicy.js
import React from 'react';
import './InfoPages.css'; // Common CSS

const ReturnsPolicy = () => {
    return (
        <div className="info-page">
            <div className="container">
                <div className="info-content">
                    <h1>Returns & Exchanges Policy ↩️</h1>
                    <p className="last-updated">Last updated: October 29, 2025</p>

                    <p>We want you to be completely satisfied with your purchase. If you are not happy with your order, you can return most items within 30 days of delivery for a refund or exchange.</p>

                    <h2>Conditions for Returns</h2>
                    <ul>
                        <li>Items must be in original, unused, unworn condition with all tags and packaging intact.</li>
                        <li>Proof of purchase (order number, receipt) is required.</li>
                        <li>Certain items like final sale products, undergarments, or customized items may not be eligible for return. Please check the product description.</li>
                    </ul>

                    <h2>How to Initiate a Return</h2>
                    <ol>
                        <li>Contact our customer support at good.deal326@gmail.com with your order number and reason for return.</li>
                        <li>Our team will provide you with return instructions and a return shipping address (if applicable).</li>
                        <li>Pack the item securely and ship it back to us. Customers are generally responsible for return shipping costs unless the item was damaged or incorrect.</li>
                    </ol>

                    <h2>Refunds</h2>
                    <p>Once we receive and inspect your return, we will notify you about the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 7-10 business days.</p>

                    <h2>Exchanges</h2>
                    <p>If you need to exchange an item for a different size or color, please contact us. Exchanges are subject to product availability.</p>

                    <h2>Damaged or Incorrect Items</h2>
                    <p>If you receive a damaged or incorrect item, please contact us immediately with photos of the issue. We will arrange for a replacement or refund, including any shipping costs.</p>

                </div>
            </div>
        </div>
    );
};

export default ReturnsPolicy;