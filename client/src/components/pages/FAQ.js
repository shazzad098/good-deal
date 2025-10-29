// client/src/components/pages/FAQ.js
import React, { useState } from 'react';
import './FAQ.css'; // Amra ektu styling add korbo

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`faq-item ${isOpen ? 'open' : ''}`}>
            <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
                <span>{question}</span>
                <span className="faq-icon">{isOpen ? '-' : '+'}</span>
            </button>
            {isOpen && <div className="faq-answer">{answer}</div>}
        </div>
    );
};

const FAQ = () => {
    const faqs = [
        {
            question: 'How do I place an order?',
            answer: 'Placing an order is easy! Simply browse our products, add the items you want to your cart, and proceed to checkout. Follow the instructions to enter your shipping details and payment information.'
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept various payment methods including major credit cards (Visa, MasterCard, American Express), debit cards, and sometimes other options like mobile banking depending on your region.'
        },
        {
            question: 'How can I track my order?',
            answer: 'Once your order is shipped, you will receive an email with a tracking number and a link to track your package. You can also check your order status in your account section if you are registered.'
        },
        {
            question: 'What is your return policy?',
            answer: 'We offer a 30-day return policy for most items. Please visit our Returns page for detailed information on eligibility, process, and conditions.'
        },
        {
            question: 'How do I contact customer support?',
            answer: 'You can contact our customer support team via email at good.deal326@gmail.com, or by visiting our Contact Us page for more options.'
        },
        {
            question: 'Is my personal information secure?',
            answer: 'Yes, we take your privacy and security very seriously. We use industry-standard encryption and security protocols to protect your personal information.'
        }
    ];

    return (
        <div className="faq-page">
            <div className="container">
                <div className="faq-header">
                    <h1>Frequently Asked Questions</h1>
                    <p>Find answers to common questions about shopping with GoodDeal.</p>
                </div>
                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ;