import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
    // ... (baki state-gulo oporibortito) ...
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        products: 0,
        customers: 0,
        orders: 0
    });
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        // ... (baki useEffect oporibortito) ...
        fetchFeaturedProducts();
        fetchStats();

        let interval;
        if (isAutoPlaying) {
            interval = setInterval(() => {
                nextSlide();
            }, 5000);
        }

        return () => clearInterval(interval);
    }, [currentSlide, isAutoPlaying]);

    const fetchFeaturedProducts = async () => {
        // ... (function oporibortito) ...
        try {
            const res = await axios.get('/api/products?limit=4');
            setFeaturedProducts(res.data.products || []);
        } catch (error) {
            console.error('Error fetching featured products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        // ... (function oporibortito) ...
        setStats({
            products: 1250,
            customers: 8500,
            orders: 12000
        });
    };

    // ... (heroSlides ebong carousel functions oporibortito) ...
    const heroSlides = [
        {
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200",
            badge: "Premium Quality",
            title: "Premium Deals on",
            subtitle: "Discover exceptional products with unbeatable prices. Quality guaranteed, satisfaction assured."
        },
        {
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200",
            badge: "Fast Delivery",
            title: "Lightning-Fast Shipping",
            subtitle: "Get your orders delivered within 24–48 hours across major cities. Track every step in real time."
        },
        {
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200",
            badge: "Customer First",
            title: "Your Satisfaction, Our Priority",
            subtitle: "Dedicated 24/7 support, easy returns, and a seamless shopping experience tailored just for you."
        }
    ];
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    };
    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
    };
    const goToSlide = (index) => {
        setCurrentSlide(index);
    };
    const toggleAutoPlay = () => {
        setIsAutoPlaying(!isAutoPlaying);
    };


    // === PORIBORTON EKHANE ===
    const categories = [
        {
            name: 'Electronics',
            description: 'Latest gadgets and devices',
            image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
            link: '/products?category=electronics',
            icon: '📱'
        },
        {
            name: 'Clothing',
            description: 'Fashion for everyone',
            image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
            link: '/products?category=clothing',
            icon: '👕'
        },
        {
            name: 'Web Development',
            description: 'create stunning websites',
            image: 'https://imgs.search.brave.com/HjllFPYi3dREsUKMm9U5Lb8P3tUJZaSWxZqVMkrP1lk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3Ivd2ViLWRldmVs/b3BtZW50LWlzb21l/dHJpYy13ZWItY29u/Y2VwdC1wZW9wbGUt/Y3JlYXRlLW9wdGlt/aXplLXdlYi1wYWdl/LXdvcmstd2l0aC1j/b2RlXzkyMDktNzEw/MC5qcGc_c2VtdD1h/aXNfaHlicmlkJnc9/NzQwJnE9ODA',
            link: '/services/web-development', // <-- LINK PORIBORTON KORA HOYECHE
            icon: '🌐'
        }
    ];
    // ===========================

    return (
        <div className="homepage">
            {/* === CUSTOM CAROUSEL SECTION === */}
            <section className="hero-section">
                {/* ... (carousel content oporibortito) ... */}
                <div className="custom-carousel">
                    <div className="carousel-container">
                        {heroSlides.map((slide, index) => (
                            <div
                                key={index}
                                className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                            >
                                <div
                                    className="carousel-slide-bg"
                                    style={{ backgroundImage: `url(${slide.image})` }}
                                ></div>
                                <div className="carousel-slide-overlay">
                                    <div className="carousel-slide-content">
                                        <div className="carousel-badge">
                                            <span className="badge-text">{slide.badge}</span>
                                        </div>
                                        <h1 className="carousel-title">
                                            {slide.title}
                                            <span className="brand">Good Deal</span>
                                        </h1>
                                        <p className="carousel-subtitle">
                                            {slide.subtitle}
                                        </p>
                                        <div className="carousel-actions">
                                            <Link to="/products" className="btn btn-primary">
                                                Shop Collection
                                                <span className="btn-icon">→</span>
                                            </Link>
                                            <Link to="/deals" className="btn btn-secondary">
                                                View Special Offers
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Carousel Controls */}
                    <button className="carousel-control prev" onClick={prevSlide}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <button className="carousel-control next" onClick={nextSlide}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>

                    {/* Carousel Indicators */}
                    <div className="carousel-indicators">
                        {heroSlides.map((_, index) => (
                            <button
                                key={index}
                                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => goToSlide(index)}
                            ></button>
                        ))}
                    </div>

                    {/* Auto Play Toggle */}
                    <button className="carousel-autoplay" onClick={toggleAutoPlay}>
                        {isAutoPlaying ? '⏸️' : '▶️'}
                    </button>
                </div>
            </section>

            <section className="categories-section">
                {/* ... (category section oporibortito) ... */}
                <div className="container">
                    <div className="section-header">
                        <h2>Product & Services</h2>

                    </div>
                    <div className="categories-grid">
                        {categories.map((category, index) => (
                            <Link key={index} to={category.link} className="category-card">
                                <div className="category-image">
                                    <img src={category.image} alt={category.name} />
                                    <div className="category-overlay"></div>
                                    <div className="category-icon">{category.icon}</div>
                                </div>
                                <div className="category-content">
                                    <h3>{category.name}</h3>
                                    <p>{category.description}</p>
                                    <span className="category-link">Explore →</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="products-section">
                {/* ... (featured products section oporibortito) ... */}
                <div className="container">
                    <div className="section-header">
                        <h2>Featured Products</h2>
                        <p>Check out our most popular items</p>
                    </div>
                    {loading ? (
                        <div className="loading-products">
                            <div className="spinner"></div>
                            <p>Loading featured products...</p>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {featuredProducts.map(product => (
                                <div key={product._id} className="product-card">
                                    <div className="product-image">
                                        <img
                                            src={product.images?.[0] || '/images/placeholder.jpg'}
                                            alt={product.name}
                                        />
                                        <div className="product-overlay">
                                            <Link to={`/products/${product._id}`} className="btn btn-primary">
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="product-content">
                                        <span className="product-category">{product.category}</span>
                                        <h3 className="product-name">{product.name}</h3>
                                        <p className="product-description">
                                            {product.description.length > 80
                                                ? `${product.description.substring(0, 80)}...`
                                                : product.description
                                            }
                                        </p>
                                        <div className="product-footer">
                                            <span className="product-price">${product.price}</span>
                                            <span className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="section-footer dark">
                        <Link to="/products" className="btn-outline">
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;