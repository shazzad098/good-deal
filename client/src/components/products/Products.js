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
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

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

            console.log('Fetching product with ID:', id);

            // API endpoint check koren - different possible endpoints
            let res;
            try {
                res = await axios.get(`/api/products/${id}`);
            } catch (apiError) {
                // Alternative endpoint try koren
                console.log('Trying alternative endpoint...');
                res = await axios.get(`/api/product/${id}`);
            }

            console.log('Product data:', res.data);

            // Different response formats handle korar jonno
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
            'Sports': '⚽'
        };
        return icons[category] || '📦';
    };

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

    if (error) {
        return (
            <div className="product-page">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-icon">❌</div>
                        <h3>Error Loading Product</h3>
                        <p>{error}</p>
                        <div className="action-buttons">
                            <button onClick={fetchProduct} className="btn btn-secondary">
                                Try Again
                            </button>
                            <Link to="/products" className="btn btn-primary">
                                Browse All Products
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

                {/* Product Header */}
                <div className="product-header">
                    <h1 className="product-title">{product.name}</h1>
                    <div className="product-meta">
                        <span className="product-category">
                            {getCategoryIcon(product.category)} {product.category}
                        </span>
                        <span className="product-sku">
                            SKU: {product._id ? product._id.slice(-8) : product.id?.slice(-8) || 'N/A'}
                        </span>
                    </div>
                </div>

                {/* Product Content */}
                <div className="product-content">
                    {/* Image Gallery */}
                    <div className="product-gallery">
                        <div className="main-image">
                            <img
                                src={product.images?.[selectedImage] || product.image || '/images/placeholder.jpg'}
                                alt={product.name}
                                onError={(e) => {
                                    e.target.src = '/images/placeholder.jpg';
                                }}
                            />
                            {product.stock === 0 && (
                                <div className="out-of-stock-badge">Out of Stock</div>
                            )}
                        </div>

                        {(product.images && product.images.length > 1) && (
                            <div className="thumbnail-gallery">
                                {product.images.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} thumbnail ${index + 1}`}
                                            onError={(e) => {
                                                e.target.src = '/images/placeholder.jpg';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="product-info">
                        {/* Price Section */}
                        <div className="price-section">
                            <span className="product-price">${product.price?.toFixed(2)}</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="product-original-price">${product.originalPrice?.toFixed(2)}</span>
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
                                <Link to={`/admin/products/edit/${product._id || product.id}`} className="btn btn-secondary">
                                    Edit Product
                                </Link>
                                <button className="btn btn-danger">
                                    Delete Product
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products - Optional Section */}
                <div className="related-products">
                    <h2>You Might Also Like</h2>
                    <div className="products-grid">
                        {/* Related products would go here */}
                        <div className="related-placeholder">
                            <p>More products coming soon...</p>
                            <Link to="/products" className="btn btn-primary">
                                Browse All Products
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;