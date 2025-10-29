// client/src/components/pages/ShippingInfo.js
import React from 'react';
import './InfoPages.css'; // Amra ekta common CSS use korbo

const ShippingInfo = () => {
    return (
        <div className="info-page">
            <div className="container">
                <div className="info-content">
                    <h1>Shipping Information 🚚</h1>
                    <p className="last-updated">Last updated: October 29, 2025</p>

                    <h2>Shipping Options & Costs</h2>
                    <p>We offer several shipping options to meet your needs:</p>
                    <ul>
                        <li><strong>Standard Shipping (5-7 Business Days):</strong> Costs BDT 60 within Dhaka, BDT 120 outside Dhaka. Free for orders over BDT 2000.</li>
                        <li><strong>Express Shipping (2-3 Business Days):</strong> Costs BDT 100 within Dhaka, BDT 150 outside Dhaka.</li>
                        <li><strong>Next Day Delivery (Dhaka Only):</strong> Costs BDT 150. Order must be placed before 12 PM.</li>
                    </ul>
                    <p>Shipping costs are calculated at checkout based on your location and selected shipping method.</p>

                    <h2>Order Processing Time</h2>
                    <p>Orders are typically processed within 1-2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>

                    <h2>International Shipping</h2>
                    <p>Currently, we only ship within Bangladesh. We are working on expanding our shipping options in the future.</p>

                    <h2>How do I check the status of my order?</h2>
                    <p>When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available.</p>
                    <p>If you haven’t received your order within 7 days of receiving your shipping confirmation email, please contact us at good.deal326@gmail.com with your name and order number, and we will look into it for you.</p>

                    <h2>Shipping Address Issues</h2>
                    <p>Please ensure your shipping address is correct when placing your order. We are not responsible for orders shipped to incorrect addresses provided by the customer.</p>

                </div>
            </div>
        </div>
    );
};

export default ShippingInfo;