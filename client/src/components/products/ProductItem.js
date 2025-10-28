// Updated ProductItem.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../reducers/cartReducer';
import './ProductItem.css';

const ProductItem = ({ product }) => {
    const dispatch = useDispatch();
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const handleAddToCart = () => {
        setIsAddingToCart(true);
        dispatch(addToCart({
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0],
            quantity: 1,
            stock: product.stock
        }));

        setTimeout(() => {
            setIsAddingToCart(false);
        }, 1000);
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'electronics': return '📱';
            case 'clothing': return '👕';
            default: return '📦';
        }
    };

    return (
        <div className="product-item">
            <div className="product-badges">
                {product.stock === 0 && (
                    <span className="badge out-of-stock">Out of Stock</span>
                )}
                {product.stock > 0 && product.stock < 10 && (
                    <span className="badge low-stock">Low Stock</span>
                )}
                <span className="badge category">{getCategoryIcon(product.category)} {product.category}</span>
            </div>

            <Link to={`/products/${product._id}`} className="product-image-link">
                <div className="product-image">
                    <img
                        src={product.images?.[0] || '/images/placeholder.jpg'}
                        alt={product.name}
                        loading="lazy"
                    />
                    <div className="product-overlay">
                        <span className="view-details">View Details</span>
                    </div>
                </div>
            </Link>

            <div className="product-content">
                <div className="product-header">
                    <span className="product-brand">{product.brand || 'Generic'}</span>
                    <h3 className="product-name">
                        <Link to={`/products/${product._id}`}>{product.name}</Link>
                    </h3>
                    <p className="product-description">
                        {product.description.length > 100
                            ? `${product.description.substring(0, 100)}...`
                            : product.description
                        }
                    </p>
                </div>

                <div className="product-features">
                    {product.features?.slice(0, 2).map((feature, index) => (
                        <span key={index} className="feature-tag">
                            {feature}
                        </span>
                    ))}
                </div>

                <div className="product-footer">
                    <div className="product-pricing">
                        <span className="product-price">${product.price}</span>
                        {product.originalPrice && (
                            <span className="product-original-price">${product.originalPrice}</span>
                        )}
                    </div>

                    <div className="product-actions">
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0 || isAddingToCart}
                            className={`btn btn-add-to-cart ${isAddingToCart ? 'adding' : ''}`}
                        >
                            {isAddingToCart ? (
                                <>
                                    <span className="spinner-small"></span>
                                    Adding...
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

                        <Link
                            to={`/products/${product._id}`}
                            className="btn btn-view-details"
                        >
                            Quick View
                        </Link>
                    </div>
                </div>

                <div className="product-meta">
                    <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                    <span className="product-sku">SKU: {product._id.slice(-8)}</span>
                </div>
            </div>
        </div>
    );
};

export default ProductItem;