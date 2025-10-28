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

            alert('Product added to cart successfully!');
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add product to cart');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'Electronics': '📱',
            'Clothing': '👕',
            'Books': '📚',
            'Home & Garden': '🏠',
            'Sports': '⚽',
            'Beauty': '💄',
            'Toys': '🧸',
            'Food': '🍎'
        };
        return icons[category] || '📦';
    };

    if (loading) {
        return (
            <div className="product-page">
                <div className="container">
                    <div className="loading-state">
                        <div className="spinner"></div>
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
                        <div className="empty-icon">⚠️</div>
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
                {/* Breadcrumb */}
                <nav className="breadcrumb" aria-label="Breadcrumb">
                    <Link to="/" className="breadcrumb-link">Home</Link>
                    <span className="breadcrumb-separator">/</span>
                    <Link to="/products" className="breadcrumb-link">Products</Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">{product.name}</span>
                </nav>

                {/* Main Product Grid */}
                <div className="product-grid">
                    {/* Image Gallery */}
                    <div className="product-gallery">
                        <div className="main-image-container">
                            <div className="main-image">
                                <img
                                    src={product.images?.[selectedImage] || product.image || '/images/placeholder.jpg'}
                                    alt={product.name}
                                    className="product-image"
                                    onError={(e) => {
                                        e.target.src = '/images/placeholder.jpg';
                                    }}
                                />
                                {product.stock === 0 && (
                                    <div className="out-of-stock-overlay">
                                        <span className="out-of-stock-text">Out of Stock</span>
                                    </div>
                                )}
                                {product.discountPercentage && (
                                    <div className="discount-badge">
                                        -{product.discountPercentage}%
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
                                        onClick={() => setSelectedImage(index)}
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
                            <span className="product-category">
                                {getCategoryIcon(product.category)} {product.category}
                            </span>
                            <h1 className="product-title">{product.name}</h1>
                            <div className="product-meta">
                                <span className="product-sku">SKU: {product._id?.slice(-8).toUpperCase()}</span>
                                <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                    {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                                </span>
                            </div>
                        </div>

                        {/* Price Section */}
                        <div className="price-section">
                            <div className="price-container">
                                <span className="current-price">${product.price?.toFixed(2)}</span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <span className="original-price">${product.originalPrice?.toFixed(2)}</span>
                                )}
                            </div>
                            {product.discountPercentage && product.originalPrice && (
                                <div className="savings">
                                    You save ${(product.originalPrice - product.price).toFixed(2)}
                                    ({product.discountPercentage}%)
                                </div>
                            )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="quantity-section">
                            <label htmlFor="quantity" className="quantity-label">Quantity</label>
                            <div className="quantity-controls">
                                <button
                                    onClick={decrementQuantity}
                                    disabled={quantity <= 1}
                                    className="quantity-btn"
                                    aria-label="Decrease quantity"
                                >
                                    −
                                </button>
                                <input
                                    id="quantity"
                                    type="text"
                                    value={quantity}
                                    readOnly
                                    className="quantity-input"
                                    aria-label="Selected quantity"
                                />
                                <button
                                    onClick={incrementQuantity}
                                    disabled={quantity >= product.stock}
                                    className="quantity-btn"
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
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
                                        Add to Cart
                                    </>
                                )}
                            </button>

                            <div className="secondary-actions">
                                <Link to="/cart" className="view-cart-btn">
                                    View Cart
                                </Link>
                                <button className="wishlist-btn" aria-label="Add to wishlist">
                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                        <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Features List */}
                        <div className="features-list">
                            <div className="feature-item">
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                    <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                </svg>
                                Free shipping on orders over $50
                            </div>
                            <div className="feature-item">
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                                30-day money-back guarantee
                            </div>
                            <div className="feature-item">
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                    <path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                                </svg>
                                Secure checkout
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Tabs */}
                <div className="product-tabs">
                    <div className="tab-headers">
                        <button
                            className={`tab-header ${activeTab === 'description' ? 'active' : ''}`}
                            onClick={() => setActiveTab('description')}
                        >
                            Description
                        </button>
                        <button
                            className={`tab-header ${activeTab === 'specifications' ? 'active' : ''}`}
                            onClick={() => setActiveTab('specifications')}
                        >
                            Specifications
                        </button>
                        <button
                            className={`tab-header ${activeTab === 'reviews' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Reviews
                        </button>
                    </div>

                    <div className="tab-content">
                        {activeTab === 'description' && (
                            <div className="tab-panel">
                                <h3>Product Description</h3>
                                <p>{product.description}</p>
                                {product.features && (
                                    <div className="product-features">
                                        <h4>Key Features</h4>
                                        <ul>
                                            {product.features.map((feature, index) => (
                                                <li key={index}>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'specifications' && (
                            <div className="tab-panel">
                                <h3>Technical Specifications</h3>
                                <div className="specs-grid">
                                    <div className="spec-item">
                                        <span className="spec-label">Category</span>
                                        <span className="spec-value">{product.category}</span>
                                    </div>
                                    <div className="spec-item">
                                        <span className="spec-label">SKU</span>
                                        <span className="spec-value">{product._id?.slice(-8).toUpperCase()}</span>
                                    </div>
                                    <div className="spec-item">
                                        <span className="spec-label">Stock</span>
                                        <span className="spec-value">{product.stock} units</span>
                                    </div>
                                    {product.weight && (
                                        <div className="spec-item">
                                            <span className="spec-label">Weight</span>
                                            <span className="spec-value">{product.weight}</span>
                                        </div>
                                    )}
                                    {product.dimensions && (
                                        <div className="spec-item">
                                            <span className="spec-label">Dimensions</span>
                                            <span className="spec-value">{product.dimensions}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="tab-panel">
                                <h3>Customer Reviews</h3>
                                <div className="reviews-placeholder">
                                    <p>No reviews yet. Be the first to review this product!</p>
                                    <button className="btn btn-primary">Write a Review</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Admin Actions */}
                {isAuthenticated && user?.role === 'admin' && (
                    <div className="admin-actions">
                        <h3>Admin Actions</h3>
                        <div className="admin-buttons">
                            <Link to={`/admin/products/edit/${product._id || product.id}`} className="btn btn-secondary">
                                Edit Product
                            </Link>
                            <button className="btn btn-danger">
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