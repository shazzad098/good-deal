// client/src/components/products/ProductList.js
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../actions/productActions';
import { Link } from 'react-router-dom';
import ProductItem from './ProductItem';
import './ProductList.css';

const ProductList = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // ✅ Load products + responsive detection
    useEffect(() => {
        dispatch(getProducts());
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [dispatch]);

    // ✅ Unique categories
    const categories = useMemo(() => {
        const unique = [...new Set(products.map((p) => p.category))];
        return ['all', ...unique];
    }, [products]);

    // ✅ Filter + Sort Logic
    const filteredAndSorted = useMemo(() => {
        const filtered = products.filter((p) => {
            const matchSearch =
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
            return matchSearch && matchCategory;
        });

        const sorted = filtered.sort((a, b) => {
            const getValue = (obj) => {
                switch (sortBy) {
                    case 'price': return obj.price;
                    case 'rating': return obj.rating || 0;
                    default: return obj.name.toLowerCase();
                }
            };
            const aVal = getValue(a);
            const bVal = getValue(b);
            return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
        });

        return sorted;
    }, [products, searchTerm, selectedCategory, sortBy, sortOrder]);

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setSortBy('name');
        setSortOrder('asc');
    };

    // ✅ Loading state
    if (loading)
        return (
            <div className="state-container">
                <div className="spinner"></div>
                <h3>Loading Products...</h3>
                <p>Please wait while we fetch the latest products.</p>
            </div>
        );

    // ✅ Error state
    if (error)
        return (
            <div className="state-container error">
                <h3>⚠️ Unable to Load Products</h3>
                <p>{error}</p>
                <div className="action-buttons">
                    <button onClick={() => dispatch(getProducts())} className="btn btn-primary">
                        Try Again
                    </button>
                    <Link to="/" className="btn btn-outline">Go Home</Link>
                </div>
            </div>
        );

    return (
        <div className="products-page">
            <div className="container">
                {/* Header */}
                <header className="page-header">
                    <div className="header-content">
                        <div>
                            <h1>Premium Collection</h1>
                            <p>Discover our curated selection of high-quality products</p>
                        </div>
                        {!isMobile && (
                            <div className="header-stats">
                                <div className="stat-item">
                                    <span className="stat-number">{products.length}</span>
                                    <span className="stat-label">Total</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{filteredAndSorted.length}</span>
                                    <span className="stat-label">Showing</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {isMobile && (
                        <div className="mobile-stats">
                            <span>{filteredAndSorted.length}/{products.length}</span>
                        </div>
                    )}
                </header>

                {/* Admin Panel */}
                {isAuthenticated && user?.role === 'admin' && (
                    <div className="admin-panel">
                        <h3>Admin Dashboard</h3>
                        <p>Manage your product inventory and settings</p>
                        <Link to="/admin/products" className="btn btn-admin">
                            ⚙️ Manage Products
                        </Link>
                    </div>
                )}

                {/* Filters */}
                <section className="filters-section">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search products by name or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && <button onClick={() => setSearchTerm('')}>✕</button>}
                    </div>

                    <div className="filter-controls">
                        <div className="filter-group">
                            <label>Category</label>
                            <div className="category-filters">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={selectedCategory === cat ? 'active' : ''}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="sort-group">
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="name">Name</option>
                                <option value="price">Price</option>
                                <option value="rating">Rating</option>
                            </select>

                            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                                <option value="asc">Asc</option>
                                <option value="desc">Desc</option>
                            </select>

                            <button onClick={handleClearFilters} className="btn btn-clear">
                                Clear
                            </button>
                        </div>
                    </div>
                </section>

                {/* Product Grid */}
                {filteredAndSorted.length === 0 ? (
                    <div className="empty-state">
                        <h3>No Products Found</h3>
                        <p>Try adjusting your filters or search query.</p>
                        <button onClick={handleClearFilters} className="btn btn-primary">
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="products-grid">
                        {filteredAndSorted.map((p) => (
                            <ProductItem key={p._id} product={p} />
                        ))}
                    </div>
                )}

                {/* Floating Add Button (Admin only) */}
                {isAuthenticated && user?.role === 'admin' && (
                    <Link to="/admin/products" className="floating-action-btn">
                        <span>＋</span>
                        <span>Add Product</span>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default ProductList;
