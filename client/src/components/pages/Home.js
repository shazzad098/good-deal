import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Home.css';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        products: 0,
        customers: 0,
        orders: 0
    });

    useEffect(() => {
        fetchFeaturedProducts();
        fetchStats();
    }, []);

    const fetchFeaturedProducts = async () => {
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
        // Mock stats for demo
        setStats({
            products: 1250,
            customers: 8500,
            orders: 12000
        });
    };

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
        }
    ];

    const features = [
        {
            icon: '🚚',
            title: 'Free Shipping',
            description: 'Free delivery on orders over $50'
        },
        {
            icon: '🔒',
            title: 'Secure Payment',
            description: '100% secure payment processing'
        },
        {
            icon: '↩️',
            title: 'Easy Returns',
            description: '30-day return policy'
        },
        {
            icon: '💝',
            title: '24/7 Support',
            description: 'Round-the-clock customer service'
        }
    ];

    return (
        <div className="homepage">
            <section className="hero-section">
                <div className="hero-background">
                    <div className="hero-overlay"></div>
                </div>
                <div className="hero-content">
                    <div className="hero-grid">
                        {/* Left: Text */}
                        <div className="hero-text">
                            <div className="hero-badge">
                                <span className="badge-text">Premium Quality</span>
                            </div>
                            <h1 className="hero-title">
                                Premium Deals on
                                <span className="brand">Good Deal</span>
                            </h1>
                            <p className="hero-subtitle">
                                Discover exceptional products with unbeatable prices.
                                Quality guaranteed, satisfaction assured.
                            </p>
                            <div className="hero-actions">
                                <Link to="/products" className="btn btn-primary">
                                    Shop Collection
                                    <span className="btn-icon">→</span>
                                </Link>
                                <Link to="/deals" className="btn btn-secondary">
                                    View Special Offers
                                </Link>
                            </div>
                        </div>

                        {/* Right: Stats */}
                        <div className="hero-stats">
                            <div className="stat-item">
                                <div className="stat-number">{stats.products}+</div>
                                <div className="stat-label">Products</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">{stats.customers}+</div>
                                <div className="stat-label">Happy Customers</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">{stats.orders}+</div>
                                <div className="stat-label">Orders Delivered</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Why Choose GoodDeal?</h2>
                        <p>We provide the best shopping experience for our customers</p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">{feature.icon}</div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="categories-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Shop by Category</h2>
                        <p>Explore our wide range of products</p>
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

            {/* Featured Products Section */}
            <section className="products-section">
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

            {/* Newsletter Section */}
            <section className="newsletter-section">
                <div className="container">
                    <div className="newsletter-content">
                        <div className="newsletter-text">
                            <h2>Stay Updated</h2>
                            <p>Subscribe to our newsletter for the latest deals and offers</p>
                        </div>
                        <div className="newsletter-form">
                            <div className="input-group">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="newsletter-input"
                                />
                                <button className="btn btn-primary">Subscribe</button>
                            </div>
                            <p className="newsletter-note">
                                We respect your privacy. Unsubscribe at any time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;