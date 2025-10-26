// components/Products.js
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Products.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [searchTerm, setSearchTerm] = useState('');

    const { user, isAuthenticated } = useSelector(state => state.auth);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterAndSortProducts();
    }, [products, selectedCategory, sortBy, searchTerm]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('/api/products');
            setProducts(res.data.products || []);

            // Extract unique categories
            const uniqueCategories = [...new Set(res.data.products.map(product => product.category))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortProducts = () => {
        let filtered = products;

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort products
        switch (sortBy) {
            case 'price-low':
                filtered = [...filtered].sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered = [...filtered].sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'newest':
            default:
                filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
        }

        setFilteredProducts(filtered);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const clearFilters = () => {
        setSelectedCategory('all');
        setSortBy('newest');
        setSearchTerm('');
    };

    return (
        <div className="products-page">
            <div className="container">
                {/* Admin Banner - শুধু admin দেখতে পাবে */}
                {isAuthenticated && user?.role === 'admin' && (
                    <div className="admin-banner">
                        <div className="admin-banner-content">
                            <div className="banner-text">
                                <h3>Product Management</h3>
                                <p>Add, edit, or manage products in your store</p>
                            </div>
                            <Link to="/admin/products" className="btn btn-primary">
                                Manage Products
                            </Link>
                        </div>
                    </div>
                )}

                {/* Page Header */}
                <div className="products-header">
                    <div className="header-content">
                        <div className="header-text">
                            <h1>Our Products</h1>
                            <p>Discover amazing deals on quality products</p>
                        </div>
                        {isAuthenticated && user?.role === 'admin' && (
                            <Link to="/admin/products" className="btn btn-primary desktop-only">
                                ➕ Add New Product
                            </Link>
                        )}
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="products-filters">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="search-input"
                        />

                    </div>

                    <div className="filter-controls">
                        <div className="category-filters">
                            <button
                                className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                                onClick={() => handleCategoryChange('all')}
                            >
                                All Products
                            </button>
                            {categories.map(category => (
                                <button
                                    key={category}
                                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                                    onClick={() => handleCategoryChange(category)}
                                >
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </button>
                            ))}
                        </div>

                        <div className="sort-controls">
                            <select value={sortBy} onChange={handleSortChange} className="sort-select">
                                <option value="newest">Newest First</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="name">Name: A to Z</option>
                            </select>

                            {(selectedCategory !== 'all' || searchTerm || sortBy !== 'newest') && (
                                <button className="btn-clear" onClick={clearFilters}>
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading products...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <h3>No Products Found</h3>
                        <p>
                            {searchTerm || selectedCategory !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'No products available at the moment'
                            }
                        </p>
                        {(searchTerm || selectedCategory !== 'all') && (
                            <button className="btn btn-primary" onClick={clearFilters}>
                                Show All Products
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="products-info">
                            <p>Showing {filteredProducts.length} of {products.length} products</p>
                        </div>

                        <div className="products-grid">
                            {filteredProducts.map(product => (
                                <div key={product._id} className="product-card">
                                    <div className="product-image">
                                        <img
                                            src={product.images?.[0] || '/images/placeholder.jpg'}
                                            alt={product.name}
                                            onError={(e) => {
                                                e.target.src = '/images/placeholder.jpg';
                                            }}
                                        />
                                        <div className="product-overlay">
                                            <Link to={`/products/${product._id}`} className="btn btn-primary">
                                                View Details
                                            </Link>
                                        </div>
                                        {product.stock === 0 && (
                                            <div className="out-of-stock-badge">Out of Stock</div>
                                        )}
                                    </div>
                                    <div className="product-content">
                                        <span className="product-category">{product.category}</span>
                                        <h3 className="product-name">{product.name}</h3>
                                        <p className="product-description">
                                            {product.description.length > 100
                                                ? `${product.description.substring(0, 100)}...`
                                                : product.description
                                            }
                                        </p>
                                        <div className="product-footer">
                                            <div className="price-section">
                                                <span className="product-price">${product.price}</span>
                                                {product.originalPrice && (
                                                    <span className="product-original-price">${product.originalPrice}</span>
                                                )}
                                            </div>
                                            <span className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                            </span>
                                        </div>
                                        <div className="product-actions">
                                            <Link to={`/products/${product._id}`} className="btn btn-outline">
                                                View Product
                                            </Link>
                                            <button
                                                className="btn btn-primary"
                                                disabled={product.stock === 0}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Floating Action Button for Mobile */}
                {isAuthenticated && user?.role === 'admin' && (
                    <Link to="/admin/products" className="floating-admin-btn">

                        <span className="btn-text">Add Product</span>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Products;