import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addToCart } from '../../reducers/cartReducer';
import './Products.css';

const Products = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector(state => state.auth);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [imageLoading, setImageLoading] = useState(true);

    useEffect(() => {
        if (id && id !== 'undefined') {
            fetchProduct();
        } else {
            setError('Invalid product ID');
            setLoading(false);
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await axios.get(`/api/products/${id}`);

            if (res.data.product) {
                setProduct(res.data.product);
            } else if (res.data) {
                setProduct(res.data);
            } else {
                throw new Error('Invalid product data format');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            setError(error.response?.data?.message || 'Failed to fetch product');
        } finally {
            setLoading(false);
        }
    };

    const incrementQuantity = () => {
        if (product && quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 1 && value <= product.stock) {
            setQuantity(value);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            alert('Please login to add items to cart');
            return;
        }

        if (!product || product.stock === 0) return;

        try {
            setIsAddingToCart(true);
            await dispatch(addToCart({
                productId: product._id || product.id,
                quantity,
                name: product.name,
                price: product.price,
                image: product.images?.[0] || product.image
            })).unwrap();

            // Show success feedback
            const event = new CustomEvent('cartNotification', {
                detail: {
                    message: 'Product added to cart!',
                    type: 'success',
                    product: product.name
                }
            });
            window.dispatchEvent(event);
        } catch (error) {
            console.error('Error adding to cart:', error);
            const event = new CustomEvent('cartNotification', {
                detail: {
                    message: 'Failed to add product to cart',
                    type: 'error'
                }
            });
            window.dispatchEvent(event);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'Electronics': '⚡',
            'Clothing': '👔',
            'Books': '📖',
            'Home & Garden': '🏡',
            'Sports': '🎯',
            'Beauty': '✨',
            'Toys': '🎮',
            'Food': '🍽️'
        };
        return icons[category] || '📦';
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    if (loading) {
        return (
            <div className="product-page">
                <div className="container">
                    <div className="loading-state">
                        <div className="pulse-loader">
                            <div className="pulse-dot"></div>
                            <div className="pulse-dot"></div>
                            <div className="pulse-dot"></div>
                        </div>
                        <p>Loading product details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-page">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-icon">🚫</div>
                        <h3>Product Not Available</h3>
                        <p>{error}</p>
                        <div className="action-buttons">
                            <button onClick={fetchProduct} className="btn btn-secondary">
                                Try Again
                            </button>
                            <Link to="/products" className="btn btn-primary">
                                Browse Products
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-page">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <h3>Product Not Found</h3>
                        <p>The product you're looking for doesn't exist or has been removed.</p>
                        <Link to="/products" className="btn btn-primary">
                            Discover Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="product-page">
            <div className="container">
                {/* Enhanced Breadcrumb */}
                <nav className="breadcrumb" aria-label="Breadcrumb">
                    <Link to="/" className="breadcrumb-link">
                        <svg className="breadcrumb-icon" viewBox="0 0 24 24" width="16" height="16">
                            <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                        </svg>
                        Home
                    </Link>
                    <span className="breadcrumb-separator">›</span>
                    <Link to="/products" className="breadcrumb-link">Products</Link>
                    <span className="breadcrumb-separator">›</span>
                    <span className="breadcrumb-current">{product.name}</span>
                </nav>

                {/* Enhanced Product Grid */}
                <div className="product-grid">
                    {/* Image Gallery */}
                    <div className="product-gallery">
                        <div className="main-image-container">
                            <div className="main-image">
                                {imageLoading && (
                                    <div className="image-skeleton">
                                        <div className="skeleton-shimmer"></div>
                                    </div>
                                )}
                                <img
                                    src={product.images?.[selectedImage] || product.image || '/images/placeholder.jpg'}
                                    alt={product.name}
                                    className={`product-image ${imageLoading ? 'loading' : 'loaded'}`}
                                    onLoad={() => setImageLoading(false)}
                                    onError={(e) => {
                                        e.target.src = '/images/placeholder.jpg';
                                        setImageLoading(false);
                                    }}
                                />
                                {product.stock === 0 && (
                                    <div className="out-of-stock-overlay">
                                        <div className="out-of-stock-badge">
                                            <svg viewBox="0 0 24 24" width="20" height="20">
                                                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                            </svg>
                                            Out of Stock
                                        </div>
                                    </div>
                                )}
                                {product.discountPercentage && (
                                    <div className="discount-badge">
                                        <span className="discount-text">-{product.discountPercentage}%</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {(product.images && product.images.length > 1) && (
                            <div className="thumbnail-gallery">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                        onClick={() => {
                                            setSelectedImage(index);
                                            setImageLoading(true);
                                        }}
                                        aria-label={`View image ${index + 1}`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} view ${index + 1}`}
                                            onError={(e) => {
                                                e.target.src = '/images/placeholder.jpg';
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Information */}
                    <div className="product-details">
                        <div className="product-header">
                            <div className="category-badge">
                                {getCategoryIcon(product.category)}
                                <span>{product.category}</span>
                            </div>
                            <h1 className="product-title">{product.name}</h1>
                            <div className="product-meta">
                                <div className="meta-item">
                                    <svg className="meta-icon" viewBox="0 0 24 24" width="16" height="16">
                                        <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                                    </svg>
                                    <span>SKU: {product._id?.slice(-8).toUpperCase()}</span>
                                </div>
                                <div className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                    <svg viewBox="0 0 24 24" width="16" height="16">
                                        <path fill="currentColor" d={
                                            product.stock > 0
                                                ? "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                                                : "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                                        }/>
                                    </svg>
                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Price Section */}
                        <div className="price-section">
                            <div className="price-container">
                                <span className="current-price">{formatPrice(product.price)}</span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <span className="original-price">{formatPrice(product.originalPrice)}</span>
                                )}
                            </div>
                            {product.discountPercentage && product.originalPrice && (
                                <div className="savings-badge">
                                    <svg viewBox="0 0 24 24" width="16" height="16">
                                        <path fill="currentColor" d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5s-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-4h4v4z"/>
                                    </svg>
                                    Save {formatPrice(product.originalPrice - product.price)} ({product.discountPercentage}%)
                                </div>
                            )}
                        </div>

                        {/* Product Rating */}
                        <div className="rating-section">
                            <div className="stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className="star" viewBox="0 0 24 24" width="20" height="20">
                                        <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                    </svg>
                                ))}
                            </div>
                            <span className="rating-text">4.8 • 124 reviews</span>
                        </div>

                        {/* Enhanced Quantity Selector */}
                        <div className="quantity-section">
                            <label htmlFor="quantity" className="quantity-label">Quantity</label>
                            <div className="quantity-controls">
                                <button
                                    onClick={decrementQuantity}
                                    disabled={quantity <= 1}
                                    className="quantity-btn"
                                    aria-label="Decrease quantity"
                                >
                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                        <path fill="currentColor" d="M19 13H5v-2h14v2z"/>
                                    </svg>
                                </button>
                                <input
                                    id="quantity"
                                    type="number"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    min="1"
                                    max={product.stock}
                                    className="quantity-input"
                                    aria-label="Selected quantity"
                                />
                                <button
                                    onClick={incrementQuantity}
                                    disabled={quantity >= product.stock}
                                    className="quantity-btn"
                                    aria-label="Increase quantity"
                                >
                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                    </svg>
                                </button>
                            </div>
                            <div className="stock-indicator">
                                {product.stock > 0 && (
                                    <span className="stock-text">
                                        {product.stock} units available
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Enhanced Action Buttons */}
                        <div className="action-section">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0 || isAddingToCart}
                                className={`add-to-cart-btn ${isAddingToCart ? 'loading' : ''} ${product.stock === 0 ? 'out-of-stock' : ''}`}
                            >
                                {isAddingToCart ? (
                                    <>
                                        <div className="btn-spinner"></div>
                                        Adding to Cart...
                                    </>
                                ) : product.stock === 0 ? (
                                    'Out of Stock'
                                ) : (
                                    <>
                                        <svg className="cart-icon" viewBox="0 0 24 24" width="20" height="20">
                                            <path fill="currentColor" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                                        </svg>
                                        Add to Cart - {formatPrice(product.price * quantity)}
                                    </>
                                )}
                            </button>

                            <div className="secondary-actions">
                                <button className="buy-now-btn">
                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                        <path fill="currentColor" d="M13 12h7v1.5h-7zm0-2.5h7V11h-7zm0 5h7V16h-7zM8 11c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0-3c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5z"/>
                                    </svg>
                                    Buy Now
                                </button>
                                <button className="wishlist-btn" aria-label="Add to wishlist">
                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                        <path fill="currentColor" d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/>
                                    </svg>
                                    Save
                                </button>
                            </div>
                        </div>

                        {/* Enhanced Features List */}
                        <div className="features-list">
                            <h4 className="features-title">Why shop with us?</h4>
                            <div className="feature-item">
                                <div className="feature-icon">
                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                        <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                                    </svg>
                                </div>
                                <div className="feature-content">
                                    <strong>Free shipping</strong> on orders over $50
                                </div>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">
                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                </div>
                                <div className="feature-content">
                                    <strong>30-day</strong> money-back guarantee
                                </div>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">
                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                        <path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                                    </svg>
                                </div>
                                <div className="feature-content">
                                    <strong>Secure</strong> checkout & payment
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Product Tabs */}
                <div className="product-tabs">
                    <div className="tab-headers">
                        <button
                            className={`tab-header ${activeTab === 'description' ? 'active' : ''}`}
                            onClick={() => setActiveTab('description')}
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                            </svg>
                            Description
                        </button>
                        <button
                            className={`tab-header ${activeTab === 'specifications' ? 'active' : ''}`}
                            onClick={() => setActiveTab('specifications')}
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path fill="currentColor" d="M7 14h10v2H7zm0-4h10v2H7zm0-4h10v2H7zm12-4h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-.14 0-.27.01-.4.04-.39.08-.74.28-1.01.55-.18.18-.33.4-.43.64-.1.23-.16.49-.16.77v14c0 .27.06.54.16.78s.25.45.43.64c.27.27.62.47 1.01.55.13.02.26.03.4.03h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-7-.25c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zM19 20H5V6h14v14z"/>
                            </svg>
                            Specifications
                        </button>
                        <button
                            className={`tab-header ${activeTab === 'reviews' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                            Reviews (124)
                        </button>
                    </div>

                    <div className="tab-content">
                        {activeTab === 'description' && (
                            <div className="tab-panel">
                                <h3>Product Overview</h3>
                                <p className="product-description">{product.description}</p>
                                {product.features && (
                                    <div className="product-features">
                                        <h4>Key Features</h4>
                                        <div className="features-grid">
                                            {product.features.map((feature, index) => (
                                                <div key={index} className="feature-card">
                                                    <div className="feature-check">
                                                        <svg viewBox="0 0 24 24" width="20" height="20">
                                                            <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                                        </svg>
                                                    </div>
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'specifications' && (
                            <div className="tab-panel">
                                <h3>Technical Specifications</h3>
                                <div className="specs-grid">
                                    <div className="spec-group">
                                        <h5>General</h5>
                                        <div className="spec-item">
                                            <span className="spec-label">Product Name</span>
                                            <span className="spec-value">{product.name}</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-label">Category</span>
                                            <span className="spec-value">{product.category}</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-label">SKU</span>
                                            <span className="spec-value">{product._id?.slice(-8).toUpperCase()}</span>
                                        </div>
                                    </div>
                                    <div className="spec-group">
                                        <h5>Inventory</h5>
                                        <div className="spec-item">
                                            <span className="spec-label">Stock Status</span>
                                            <span className={`spec-value ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-label">Available Units</span>
                                            <span className="spec-value">{product.stock}</span>
                                        </div>
                                    </div>
                                    {product.weight && (
                                        <div className="spec-group">
                                            <h5>Physical</h5>
                                            <div className="spec-item">
                                                <span className="spec-label">Weight</span>
                                                <span className="spec-value">{product.weight}</span>
                                            </div>
                                            {product.dimensions && (
                                                <div className="spec-item">
                                                    <span className="spec-label">Dimensions</span>
                                                    <span className="spec-value">{product.dimensions}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="tab-panel">
                                <div className="reviews-header">
                                    <div className="reviews-summary">
                                        <div className="overall-rating">
                                            <div className="rating-score">4.8</div>
                                            <div className="rating-stars">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <svg key={star} className="star filled" viewBox="0 0 24 24" width="20" height="20">
                                                        <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                                    </svg>
                                                ))}
                                            </div>
                                            <div className="rating-count">Based on 124 reviews</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="reviews-placeholder">
                                    <div className="reviews-cta">
                                        <p>Be the first to share your experience with this product!</p>
                                        <button className="btn btn-primary">
                                            <svg viewBox="0 0 24 24" width="18" height="18">
                                                <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                            </svg>
                                            Write a Review
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Enhanced Admin Actions */}
                {isAuthenticated && user?.role === 'admin' && (
                    <div className="admin-actions">
                        <div className="admin-header">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                            </svg>
                            <h3>Admin Controls</h3>
                        </div>
                        <div className="admin-buttons">
                            <Link to={`/admin/products/edit/${product._id || product.id}`} className="btn btn-secondary">
                                <svg viewBox="0 0 24 24" width="18" height="18">
                                    <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                </svg>
                                Edit Product
                            </Link>
                            <button className="btn btn-danger">
                                <svg viewBox="0 0 24 24" width="18" height="18">
                                    <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                </svg>
                                Delete Product
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;