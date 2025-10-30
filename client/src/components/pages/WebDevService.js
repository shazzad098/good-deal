import React from 'react';
import { Link } from 'react-router-dom';
import './WebDevService.css'; // Notun CSS file

const WebDevService = () => {
    return (
        <div className="web-dev-page">
            <div className="container">
                <div className="web-dev-content">
                    <h1 className="web-dev-title">MERN Stack Web Development 🚀</h1>
                    <p className="web-dev-intro">
                        Amra modern, high-performance web application toiri kori MERN stack (MongoDB, Express.js, React.js, Node.js) babohar kore. Apnar next project-er jonno GoodDeal-er expert team-er upor astha rakhun.
                    </p>

                    <h2 className="section-title">Why MERN Stack? 🤔</h2>
                    <p>
                        MERN stack hocche full-stack web development-er jonno sobcheye jonopriyo technology-gular moddhe ekti. Eti shompurno JavaScript-based, ja development process-ke onek beshi efficient o fast kore tole.
                    </p>
                    <ul className="features-list">
                        <li><span className="bullet-icon">🍃</span> <strong>MongoDB:</strong> Ekti flexible, NoSQL database ja bishal poriman data handle korte pare.</li>
                        <li><span className="bullet-icon">⚙️</span> <strong>Express.js:</strong> Node.js-er opor toiri ekti minimal framework ja robust backend API toirite shahajjo kore.</li>
                        <li><span className="bullet-icon">⚛️</span> <strong>React.js:</strong> Ekti powerful JavaScript library ja diye dynamic o interactive User Interface (UI) toiri kora hoy.</li>
                        <li><span className="bullet-icon">⚡</span> <strong>Node.js:</strong> JavaScript-ke server-side-e run korar poribesh toiri kore, ja application-ke fast o scalable banay.</li>
                    </ul>

                    <h2 className="section-title">What We Offer ✨</h2>
                    <p>
                        Amader MERN stack service-er moddhe royeche:
                    </p>
                    <ul className="offer-list">
                        <li><span className="bullet-icon">✅</span> Custom Web Application Development</li>
                        <li><span className="bullet-icon">✅</span> E-commerce Solutions</li>
                        <li><span className="bullet-icon">✅</span> RESTful API Development & Integration</li>
                        <li><span className="bullet-icon">✅</span> Single Page Application (SPA)</li>
                        <li><span className="bullet-icon">✅</span> Real-time Applications (e.g., Chat Apps)</li>
                        <li><span className="bullet-icon">✅</span> Website Maintenance & Support</li>
                    </ul>

                    <h2 className="section-title">Get in Touch 📧</h2>
                    <p>
                        Apnar project-er idea niye alochona korte chan? Amader sathe jogajog korun!
                    </p>
                    <div className="cta-container">
                        <Link to="/contact" className="cta-button">Contact Us Now</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebDevService;