import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProducts } from '../../actions/productActions';
import ProductItem from './ProductItem';
import './Products.css';

const Products = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector(state => state.products);

    const [filters, setFilters] = useState({
        category: '',
        search: '',
        sort: 'newest',
        priceRange: 'all',
        page: 1
    });

    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        dispatch(getProducts(filters));
    }, [dispatch, filters]);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
            page: 1
        });
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            search: '',
            sort: 'newest',
            priceRange: 'all',
            page: 1
        });
    };

    const priceRanges = [
        { value: 'all', label: 'All Prices' },
        { value: '0-50', label: 'Under $50' },
        { value: '50-100', label: '$50 - $100' },
        { value: '100-200', label: '$100 - $200' },
        { value: '200-500', label: '$200 - $500' },
        { value: '500-1000', label: '$500 - $1000' },
        { value: '1000', label: 'Above $1000' }
    ];

    const categories = [
        { value: '', label: 'All Categories', icon: '📦' },
        { value: 'electronics', label: 'Electronics', icon: '📱' },
        { value: 'clothing', label: 'Clothing', icon: '👕' }
    ];

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'name', label: 'Name: A to Z' }
    ];

    const activeFiltersCount = Object.values(filters).filter(
        value => value && value !== 'all' && value !== 'newest'
    ).length;

    if (loading) {
        return (
            <div className="products-page">
                <div className="container">
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading products...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="products-page">
            <div className="container">
                {/* Page Header */}
                <div className="page-header">
                    <div className="breadcrumb">
                        <Link to="/">Home</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-current">Products</span>
                    </div>
                    <h1 className="page-title">Our Products</h1>
                    <p className="page-subtitle">
                        Discover amazing deals on electronics and fashion
                    </p>
                </div>

                {/* Filters Bar */}
                <div className="filters-bar">
                    <div className="filters-left">
                        <button
                            className={`filter-toggle ${showFilters ? 'active' : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >

                            Filters
                            {activeFiltersCount > 0 && (
                                <span className="filter-badge">{activeFiltersCount}</span>
                            )}
                        </button>

                        <div className="search-box">

                            <input
                                type="text"
                                name="search"
                                placeholder="Search products..."
                                value={filters.search}
                                onChange={handleFilterChange}
                                className="search-input"
                            />
                        </div>
                    </div>

                    <div className="filters-right">
                        <div className="sort-filter">
                            <span className="sort-label">Sort by:</span>
                            <select
                                name="sort"
                                value={filters.sort}
                                onChange={handleFilterChange}
                                className="sort-select"
                            >
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="results-count">
              <span className="results-text">
                {products?.length || 0} products found
              </span>
                        </div>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="filters-panel">
                        <div className="filters-header">
                            <h3>Filter Products</h3>
                            <button className="clear-filters" onClick={clearFilters}>
                                Clear All
                            </button>
                        </div>

                        <div className="filters-grid">
                            {/* Category Filter */}
                            <div className="filter-group">
                                <label className="filter-label">Category</label>
                                <div className="category-filters">
                                    {categories.map(category => (
                                        <button
                                            key={category.value}
                                            className={`category-filter ${filters.category === category.value ? 'active' : ''}`}
                                            onClick={() => setFilters(prev => ({ ...prev, category: category.value }))}
                                        >
                                            <span className="category-icon">{category.icon}</span>
                                            {category.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range Filter */}
                            <div className="filter-group">
                                <label className="filter-label">Price Range</label>
                                <div className="price-filters">
                                    {priceRanges.map(range => (
                                        <button
                                            key={range.value}
                                            className={`price-filter ${filters.priceRange === range.value ? 'active' : ''}`}
                                            onClick={() => setFilters(prev => ({ ...prev, priceRange: range.value }))}
                                        >
                                            {range.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Stock Status Filter */}
                            <div className="filter-group">
                                <label className="filter-label">Availability</label>
                                <div className="stock-filters">
                                    <button
                                        className={`stock-filter ${filters.inStock === 'true' ? 'active' : ''}`}
                                        onClick={() => setFilters(prev => ({
                                            ...prev,
                                            inStock: prev.inStock === 'true' ? '' : 'true'
                                        }))}
                                    >
                                        In Stock
                                    </button>
                                    <button
                                        className={`stock-filter ${filters.inStock === 'false' ? 'active' : ''}`}
                                        onClick={() => setFilters(prev => ({
                                            ...prev,
                                            inStock: prev.inStock === 'false' ? '' : 'false'
                                        }))}
                                    >
                                        Out of Stock
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                <div className="products-section">
                    {products && products.length > 0 ? (
                        <>
                            <div className="products-grid">
                                {products.map(product => (
                                    <ProductItem key={product._id} product={product} />
                                ))}
                            </div>

                            {/* Load More Button */}
                            <div className="load-more-section">
                                <button className="btn btn-outline btn-load-more">
                                    Load More Products
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="no-products">
                            <h3>No products found</h3>
                            <p>Try adjusting your filters or search terms</p>
                            <button className="btn btn-primary" onClick={clearFilters}>
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;