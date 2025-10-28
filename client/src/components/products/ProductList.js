// client/src/components/products/ProductList.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../actions/productActions';
import ProductItem from './ProductItem'; // আপনার বিদ্যমান ProductItem কম্পোনেন্ট
import './Products.css'; // আপনার বিদ্যমান CSS
import { Link } from 'react-router-dom';

const ProductList = () => {
    const dispatch = useDispatch();
    // Redux store থেকে products, loading, এবং error নিন
    const { products, loading, error } = useSelector(state => state.products);

    useEffect(() => {
        // কম্পোনেন্ট লোড হলে সব প্রোডাক্ট fetch করুন
        dispatch(getProducts());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="products-page">
                <div className="container">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading products...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="products-page">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-icon">❌</div>
                        <h3>Error Loading Products</h3>
                        <p>{error}</p>
                        <Link to="/" className="btn btn-primary">
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="products-page">
            <div className="container">
                {/* পেজের হেডার */}
                <div className="products-header">
                    <div className="header-text">
                        <h1>Our Products</h1>
                        <p>Browse our collection of quality goods</p>
                    </div>
                </div>

                {/* প্রোডাক্ট গ্রিড */}
                {products.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📦</div>
                        <h3>No Products Found</h3>
                        <p>We are working on adding new products. Please check back later.</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map(product => (
                            <ProductItem key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;