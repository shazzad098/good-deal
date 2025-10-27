// Updated Products.js (individual product detail page)
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
    const [error, setError] = useState(null); // এটা add করুন
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [showGallery, setShowGallery] = useState(false);

    useEffect(() => {
        // Check করুন id আছে কিনা
        if (id && id !== 'undefined') {
            fetchProduct();
        } else {
            setError('Invalid product ID');
            setLoading(false);
        }
    }, [id]); // এখানে id dependency add করতে হবে

    const fetchProduct = async () => {
        try {
            setLoading(true);
            setError(null); // Error reset করুন

            console.log('Fetching product with ID:', id); // Debug করার জন্য

            const res = await axios.get(`/api/products/${id}`);

            console.log('Product data:', res.data); // Response check করুন

            setProduct(res.data.product);
        } catch (error) {
            console.error('Error fetching product:', error);
            setError(error.response?.data?.message || 'Failed to fetch product');
        } finally {
            setLoading(false);
        }
    };

    // বাকি code একই থাকবে...

    if (loading) {
        return (
            <div className="product-page">
                <div className="container">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading product...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state add করুন
    if (error) {
        return (
            <div className="product-page">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-icon">❌</div>
                        <h3>Error</h3>
                        <p>{error}</p>
                        <Link to="/products" className="btn btn-primary">
                            Browse All Products
                        </Link>
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
                        <div className="empty-icon">❌</div>
                        <h3>Product Not Found</h3>
                        <p>The product you're looking for doesn't exist or has been removed.</p>
                        <Link to="/products" className="btn btn-primary">
                            Browse All Products
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
                <div className="breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="breadcrumb-separator">/</span>
                    <Link to="/products">Products</Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">{product.name}</span>
                </div>

                {/* Products Header */}
                <div className="product-header">
                    <h1 className="product-title">{product.name}</h1>
                    <div className="product-meta">
                        <span className="product-category">
                            {getCategoryIcon(product.category)} {product.category}
                        </span>
                        <span className="product-sku">SKU: {product._id.slice(-8)}</span>
                    </div>
                </div>

                {/* Products Content */}
                <div className="product-content">
                    {/* Image Gallery */}
                    <div className="product-gallery">
                        <div className="main-image">
                            <img
                                src={product.images?.[selectedImage] || '/images/placeholder.jpg'}
                                alt={product.name}
                                onError={(e) => {
                                    e.target.src = '/images/placeholder.jpg';
                                }}
                            />
                            {product.stock === 0 && (
                                <div className="out-of-stock-badge">Out of Stock</div>
                            )}
                        </div>

                        {product.images && product.images.length > 1 && (
                            <div className="thumbnail-gallery">
                                {product.images.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img src={image} alt={`Product thumbnail ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Products Info */}
                    <div className="product-info">
                        {/* Price Section */}
                        <div className="price-section">
                            <span className="product-price">${product.price}</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="product-original-price">${product.originalPrice}</span>
                            )}
                            {product.discountPercentage && (
                                <span className="discount-badge">
                                    {product.discountPercentage}% OFF
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <div className="product-description">
                            <h3>Description</h3>
                            <p>{product.description}</p>
                        </div>

                        {/* Features */}
                        {product.features && product.features.length > 0 && (
                            <div className="product-features">
                                <h3>Features</h3>
                                <ul>
                                    {product.features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Specifications */}
                        {product.specifications && Object.keys(product.specifications).length > 0 && (
                            <div className="product-specs">
                                <h3>Specifications</h3>
                                <div className="specs-grid">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="spec-item">
                                            <span className="spec-label">{key}:</span>
                                            <span className="spec-value">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div className="quantity-selector">
                            <label>Quantity:</label>
                            <div className="quantity-controls">
                                <button
                                    onClick={decrementQuantity}
                                    disabled={quantity <= 1}
                                    className="quantity-btn"
                                >
                                    -
                                </button>
                                <span className="quantity-value">{quantity}</span>
                                <button
                                    onClick={incrementQuantity}
                                    disabled={quantity >= product.stock}
                                    className="quantity-btn"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <div className="product-actions">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0 || isAddingToCart}
                                className={`btn btn-primary ${isAddingToCart ? 'adding' : ''}`}
                            >
                                {isAddingToCart ? (
                                    <>
                                        <span className="spinner-small"></span>
                                        Adding to Cart...
                                    </>
                                ) : product.stock === 0 ? (
                                    'Out of Stock'
                                ) : (
                                    <>
                                        <span className="cart-icon">🛒</span>
                                        Add to Cart
                                    </>
                                )}
                            </button>

                            <Link to="/cart" className="btn btn-outline">
                                View Cart
                            </Link>
                        </div>

                        {/* Stock Status */}
                        <div className="stock-status">
                            <span className={`status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </span>
                        </div>

                        {/* Admin Actions */}
                        {isAuthenticated && user?.role === 'admin' && (
                            <div className="admin-actions">
                                <Link to={`/admin/products/${product._id}/edit`} className="btn btn-secondary">
                                    Edit Product
                                </Link>
                                <button className="btn btn-danger">
                                    Delete Product
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                <div className="related-products">
                    <h2>Related Products</h2>
                    <div className="products-grid">
                        {/* This would be populated with related products */}
                        {[1, 2, 3].map(i => (
                            <div key={i} className="product-card">
                                <div className="product-image">
                                    <img
                                        src="/images/placeholder.jpg"
                                        alt="Related product"
                                    />
                                    <div className="product-overlay">
                                        <Link to={`/products/${i}`} className="btn btn-primary">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                                <div className="product-content">
                                    <span className="product-category">electronics</span>
                                    <h3 className="product-name">Related Product {i}</h3>
                                    <p className="product-description">This is a related product description.</p>
                                    <div className="product-footer">
                                        <div className="price-section">
                                            <span className="product-price">$99.99</span>
                                        </div>
                                        <span className="product-stock in-stock">10 in stock</span>
                                    </div>
                                    <div className="product-actions">
                                        <Link to={`/products/${i}`} className="btn btn-outline">
                                            View Product
                                        </Link>
                                        <button className="btn btn-primary">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;