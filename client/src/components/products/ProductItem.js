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

    // ডেমো ছবির কালার সোয়াচ দেখানোর জন্য (যদি থাকে)
    const colors = product.features?.filter(f => f.startsWith('#')) || [];

    return (
        <div className="product-item">
            {/* ব্যাজগুলো এখন আর ব্যবহার হচ্ছে না, তাই হাইড করা হলো */}
            {/* <div className="product-badges">
                {product.stock === 0 && (
                    <span className="badge out-of-stock">Out of Stock</span>
                )}
                {product.stock > 0 && product.stock < 10 && (
                    <span className="badge low-stock">Low Stock</span>
                )}
            </div>
            */}

            <Link to={`/products/${product._id}`} className="product-image-link">
                <div className="product-image">
                    <img
                        src={product.images?.[0] || 'https://placehold.co/300x300/FDFCEE/C7A9A9?text=Product'}
                        alt={product.name}
                        loading="lazy"
                    />
                    {/* ওভারলে হাইড করা হলো
                    <div className="product-overlay">
                        <span className="view-details">View Details</span>
                    </div>
                    */}
                </div>
            </Link>

            <div className="product-content">
                <div className="product-header">
                    {/* <span className="product-brand">{product.brand || 'Generic'}</span> */}
                    <h3 className="product-name">
                        <Link to={`/products/${product._id}`}>{product.name}</Link>
                    </h3>
                    <p className="product-description">
                        {product.description.length > 80
                            ? `${product.description.substring(0, 80)}...`
                            : product.description
                        }
                    </p>
                </div>

                {/* ডেমোর মতো কালার সোয়াচ */}
                {colors.length > 0 && (
                    <div className="product-features">
                        {colors.map((color, index) => (
                            <span 
                                key={index} 
                                className="feature-tag"
                                style={{ backgroundColor: color }}
                                title={color}
                            >
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* === পরিবর্তন: ফুটার লেআউট === */}
            <div className="product-footer">
                <div className="product-pricing">
                    <span className="product-price">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                        <span className="product-original-price">${product.originalPrice.toFixed(2)}</span>
                    )}
                </div>

                <div className="product-actions">
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0 || isAddingToCart}
                        className={`btn btn-add-to-cart ${isAddingToCart ? 'adding' : ''}`}
                    >
                        {isAddingToCart ? (
                            <span className="spinner-small"></span>
                        ) : product.stock === 0 ? (
                            'Out of Stock'
                        ) : (
                            'ADD TO CART'
                        )}
                    </button>

                    {/* "Quick View" বাটনটি রিমুভ করা হয়েছে */}
                </div>
            </div>

            {/* মেটা ইনফো (SKU, Stock) হাইড করা হলো */}
        </div>
    );
};

export default ProductItem;
