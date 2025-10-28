// client/src/components/products/ProductList.js
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // useSelector already ache
import { getProducts } from '../../actions/productActions';
import ProductItem from './ProductItem';
import './ProductList.css';
import { Link } from 'react-router-dom';

const ProductList = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector(state => state.products);

    // ✅ STEP 1: User-er authentication state access korun
    const { isAuthenticated, user } = useSelector(state => state.auth);

    // State for filters and search
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        dispatch(getProducts());

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [dispatch]);

    // Extract unique categories
    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(products.map(product => product.category))];
        return ['all', ...uniqueCategories];
    }, [products]);

    // Filter and sort products
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        // Sort products
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'price':
                    aValue = a.price;
                    bValue = b.price;
                    break;
                case 'rating':
                    aValue = a.rating || 0;
                    bValue = b.rating || 0;
                    break;
                case 'name':
                default:
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [products, searchTerm, selectedCategory, sortBy, sortOrder]);

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setSortBy('name');
        setSortOrder('asc');
    };

    const activeFiltersCount = [searchTerm, selectedCategory !== 'all'].filter(Boolean).length;

    if (loading) {
        return (
            <div className="products-page">
                <div className="container">
                    <div className="loading-state">
                        <div className="spinner-container">
                            <div className="spinner"></div>
                        </div>
                        <h3>Loading Products</h3>
                        <p>Please wait while we fetch the latest products</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="products-page">
                <div className="container">
                    <div className="error-state">
                        <div className="error-icon">⚠️</div>
                        <h3>Unable to Load Products</h3>
                        <p>{error}</p>
                        <div className="action-buttons">
                            <button
                                onClick={() => dispatch(getProducts())}
                                className="btn btn-primary"
                            >
                                Try Again
                            </button>
                            <Link to="/" className="btn btn-outline">
                                Go Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="products-page">
            <div className="container">
                {/* Enhanced Header */}
                <div className="page-header">
                    <div className="header-content">
                        <div className="header-text">
                            <h1>Premium Collection</h1>
                            <p>Discover our carefully curated selection of exceptional products</p>
                        </div>
                        {!isMobile && (
                            <div className="header-stats">
                                <div className="stat-item">
                                    <span className="stat-number">{products.length}</span>
                                    <span className="stat-label">Total Products</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{filteredAndSortedProducts.length}</span>
                                    <span className="stat-label">Showing</span>
                                </div>
                            </div>
                        )}
                    </div>
                    {isMobile && (
                        <div className="mobile-stats">
                            <div className="stat-item">
                                <span className="stat-number">{products.length}</span>
                                <span className="stat-label">Total</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{filteredAndSortedProducts.length}</span>
                                <span className="stat-label">Showing</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* ✅ STEP 2: Admin Panel-ke condition-er moddhe rakhun */}
                {isAuthenticated && user && user.role === 'admin' && (
                    <div className="admin-panel">
                        <div className="panel-content">
                            <div className="panel-text">
                                <h3>Admin Dashboard</h3>
                                <p>Manage your product inventory and settings</p>
                            </div>
                            <Link to="/admin/products" className="btn btn-admin">
                                <span className="btn-icon">⚙️</span>
                                {isMobile ? 'Admin' : 'Manage Products'}
                            </Link>
                        </div>
                    </div>
                )}

                {/* Advanced Filters Section */}
                <div className="filters-section">
                    <div className="search-container">
                        <div className="search-box">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder={isMobile ? "Search products..." : "Search products by name or description..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="clear-search"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="filter-controls">
                        <div className="filter-group">
                            <label>Category</label>
                            <div className="category-filters">
                                {categories.slice(0, isMobile ? 3 : categories.length).map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                                    >
                                        {category === 'all' ? 'All' : isMobile ? category.slice(0, 8) + (category.length > 8 ? '...' : '') : category}
                                    </button>
                                ))}
                                {isMobile && categories.length > 3 && (
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="category-select-mobile"
                                    >
                                        <option value="all">More Categories</option>
                                        {categories.slice(3).map(category => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>

                        <div className="sort-group">
                            <div className="sort-control">
                                <label>Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="sort-select"
                                >
                                    <option value="name">Name</option>
                                    <option value="price">Price</option>
                                    <option value="rating">Rating</option>
                                </select>
                            </div>

                            <div className="sort-control">
                                <label>Order</label>
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="sort-select"
                                >
                                    <option value="asc">Asc</option>
                                    <option value="desc">Desc</option>
                                </select>
                            </div>

                            {(activeFiltersCount > 0 || !isMobile) && (
                                <button
                                    onClick={handleClearFilters}
                                    className="btn btn-clear"
                                >
                                    {isMobile ? 'Clear' : 'Clear Filters'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Results Info */}
                {(searchTerm || selectedCategory !== 'all') && (
                    <div className="results-info">
                        <p>
                            Showing {filteredAndSortedProducts.length} of {products.length} products
                            {searchTerm && ` for "${searchTerm}"`}
                            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                        </p>
                    </div>
                )}

                {/* Products Grid */}
                {filteredAndSortedProducts.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <h3>No Products Found</h3>
                        <p>We couldn't find any products matching your criteria. Try adjusting your search or filters.</p>
                        <button
                            onClick={handleClearFilters}
                            className="btn btn-primary"
                        >
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    <div className="products-grid">
                        {filteredAndSortedProducts.map(product => (
                            <ProductItem key={product._id} product={product} />
                        ))}
                    </div>
                )}

                {/* ✅ STEP 3: Floating button-ke condition-er moddhe rakhun */}
                {isAuthenticated && user && user.role === 'admin' && (
                    <Link to="/admin/products" className="floating-action-btn">
                        <span className="fab-icon">+</span>
                        <span className="fab-text">Add Product</span>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default ProductList;