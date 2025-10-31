// client/src/components/admin/AdminProducts.js

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminProducts.css';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [stockFilter, setStockFilter] = useState('all');
    const [message, setMessage] = useState({ type: '', text: '' });

    // === PORIBORTON: formData state poriborton (images ekhon file list hobe) ===
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        images: [] // URL string array-er bodole file array hobe
    });

    // === NOTUN: Editing korar somoy purono image URL gulo track korar state ===
    const [existingImages, setExistingImages] = useState([]);
    
    // === NOTUN: Category list-er jonno state ===
    const [categories, setCategories] = useState([]);

    const { user, isAuthenticated } = useSelector(state => state.auth);
    const navigate = useNavigate();

    // Check if user is admin
    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'admin') {
            navigate('/');
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') {
            fetchProducts();
            fetchCategories(); // === NOTUN: Categories fetch kora
        }
    }, [isAuthenticated, user]);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/admin/products', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(res.data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            showMessage('error', 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    // === NOTUN: Category fetch function ===
    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/admin/categories', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(res.data.categories || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Error message na dekhaleo cholbe, just silently fail korbe
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // === NOTUN: File input handle korar function ===
    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            images: [...e.target.files] // FileList object-ke array-te convert kora
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            
            // === PORIBORTON: JSON-er bodole FormData use kora ===
            const productData = new FormData();
            productData.append('name', formData.name);
            productData.append('description', formData.description);
            productData.append('price', parseFloat(formData.price));
            productData.append('stock', parseInt(formData.stock));
            productData.append('category', formData.category);

            // Notun image file-gulo append kora
            formData.images.forEach(imageFile => {
                productData.append('images', imageFile);
            });

            if (editingProduct) {
                // Update-er somoy purono image URL gulo pathano
                existingImages.forEach(imgUrl => {
                    productData.append('existingImages', imgUrl);
                });

                await axios.put(`/api/admin/products/${editingProduct._id}`, productData, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data' // Header set kora
                    }
                });
                showMessage('success', 'Product updated successfully! 🎉');
            } else {
                await axios.post('/api/admin/products', productData, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data' // Header set kora
                    }
                });
                showMessage('success', 'Product created successfully! 🎉');
            }

            // Reset form
            setShowForm(false);
            setEditingProduct(null);
            setFormData({
                name: '', description: '', price: '', category: '', stock: '', images: []
            });
            setExistingImages([]); // Reset existing images
            fetchProducts();
            fetchCategories(); // === NOTUN: Category list update kora
        } catch (error) {
            console.error('Error saving product:', error.response ? error.response.data : error.message);
            const errorMsg = error.response?.data?.message || 'Failed to save product';
            showMessage('error', errorMsg);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
            images: [] // Edit form-e shudhu notun file upload hobe
        });
        // Purono image URL gulo state-e save kora
        setExistingImages(product.images && product.images.length > 0 ? product.images : []);
        setShowForm(true);
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/admin/products/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                showMessage('success', 'Product deleted successfully! 🗑️');
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                const errorMsg = error.response?.data?.message || 'Failed to delete product';
                showMessage('error', errorMsg);
            }
        }
    };

    const cancelEdit = () => {
        setShowForm(false);
        setEditingProduct(null);
        setFormData({
            name: '', description: '', price: '', category: '', stock: '', images: []
        });
        setExistingImages([]); // Reset existing images
    };

    // === NOTUN: Purono image remove korar function ===
    const removeExistingImage = (imgUrl) => {
        setExistingImages(prev => prev.filter(img => img !== imgUrl));
    };

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        // === PORIBORTON: Notun dynamic category list theke filter kora ===
        const dynamicCategories = [...new Set(products.map(p => p.category))];
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        // =============================================================

        const matchesStock = stockFilter === 'all' ||
            (stockFilter === 'in-stock' && product.stock > 0) ||
            (stockFilter === 'out-of-stock' && product.stock === 0) ||
            (stockFilter === 'low-stock' && product.stock > 0 && product.stock < 10);

        return matchesSearch && matchesCategory && matchesStock;
    });

    // === PORIBORTON: Dynamic category list toiri kora ===
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    // ===================================================

    const getStockStatus = (stock) => {
        if (stock === 0) return 'out-of-stock';
        if (stock < 10) return 'low-stock';
        return 'in-stock';
    };

    if (!isAuthenticated || user?.role !== 'admin') {
        // ... (Access Denied JSX)
    }

    return (
        <div className="admin-products-page">
            <div className="admin-products-container">
                
                {/* Message Alert */}
                {message.text && (
                    <div className={`message-alert ${message.type}`}>
                        <span>{message.type === 'success' ? '✅' : '❌'}</span>
                        {message.text}
                    </div>
                )}

                {/* Search and Filters */}
                <div className="products-toolbar">
                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search products by name or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        {/* === PORIBORTON: Dynamic Category Filter === */}
                        <select
                            className="filter-select"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            {uniqueCategories.map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))}
                        </select>
                        {/* ========================================= */}
                        <select
                            className="filter-select"
                            value={stockFilter}
                            onChange={(e) => setStockFilter(e.target.value)}
                        >
                            <option value="all">All Stock</option>
                            <option value="in-stock">In Stock</option>
                            <option value="low-stock">Low Stock</option>
                            <option value="out-of-stock">Out of Stock</option>
                        </select>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowForm(true)}
                        >
                            <span>➕</span> Add New Product
                        </button>
                    </div>
                </div>

                {/* Products Form Modal */}
                {showForm && (
                    <div className="product-form-overlay">
                        <div className="product-form-container">
                            <div className="form-header">
                                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                                <button className="close-btn" onClick={cancelEdit}>×</button>
                            </div>
                            <form onSubmit={handleSubmit} className="product-form">
                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label>Product Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Enter product name"
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Description *</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            required
                                            rows="4"
                                            placeholder="Enter product description"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Price ($) *</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            required
                                            step="0.01"
                                            min="0"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Stock *</label>
                                        <input
                                            type="number"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                            placeholder="0"
                                        />
                                    </div>

                                    {/* === PORIBORTON: Dynamic Category Input === */}
                                    <div className="form-group">
                                        <label>Category *</label>
                                        <input
                                            type="text"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            required
                                            list="category-list" // datalist-er sathe connect kora
                                            placeholder="Select or type a category"
                                        />
                                        {/* Datalist existing category-r suggestion dekhabe */}
                                        <datalist id="category-list">
                                            {categories.map((cat, index) => (
                                                <option key={index} value={cat} />
                                            ))}
                                        </datalist>
                                    </div>
                                    {/* ========================================= */}

                                    {/* === PORIBORTON: Image Input Field === */}
                                    <div className="form-group full-width">
                                        <label>Product Images (Multiple select korun)</label>
                                        <input
                                            type="file"
                                            name="images"
                                            onChange={handleFileChange}
                                            multiple // Multiple file upload allow kora
                                            accept="image/*" // Shudhu image file
                                            style={{
                                                padding: '10px',
                                                background: '#f3f4f6',
                                                border: '1px solid var(--border-medium)',
                                                borderRadius: 'var(--radius-md)'
                                            }}
                                        />
                                    </div>
                                    {/* ======================================= */}

                                    {/* === NOTUN: Purono image gulo show kora (jodi edit mode-e thake) === */}
                                    {editingProduct && existingImages.length > 0 && (
                                        <div className="form-group full-width">
                                            <label>Current Images (Click ⤬ to remove)</label>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '10px', background: '#f3f4f6', borderRadius: '8px' }}>
                                                {existingImages.map((imgUrl, index) => (
                                                    <div key={index} style={{ position: 'relative' }}>
                                                        <img src={imgUrl} alt="product-preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }} />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeExistingImage(imgUrl)}
                                                            style={{
                                                                position: 'absolute', top: '-5px', right: '-5px',
                                                                background: '#DC2626', color: 'white', border: 'none',
                                                                borderRadius: '50%', width: '20px', height: '20px',
                                                                cursor: 'pointer', display: 'grid', placeItems: 'center',
                                                                fontSize: '14px', fontWeight: 'bold'
                                                            }}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {/* =================================================================== */}
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary">
                                        {editingProduct ? '🔄 Update Product' : '✨ Create Product'}
                                    </button>
                                    <button type="button" className="btn btn-outline" onClick={cancelEdit}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading products...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📦</div>
                        <h3>No Products Found</h3>
                        <p>{searchTerm || categoryFilter !== 'all' || stockFilter !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Get started by adding your first product'}</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowForm(true)}
                        >
                            Add Your First Product
                        </button>
                    </div>
                ) : (
                    <div className="products-grid">
                        {filteredProducts.map(product => (
                            <div key={product._id} className="product-card">
                                <div className="product-image">
                                    {product.images && product.images[0] ? (
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div style={{
                                        display: product.images && product.images[0] ? 'none' : 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '100%',
                                        height: '100%',
                                        fontSize: '3rem'
                                    }}>
                                        📦
                                    </div>
                                </div>
                                <div className="product-info">
                                    <div className="product-header">
                                        <h3 className="product-name">{product.name}</h3>
                                        <div className="product-price">${parseFloat(product.price).toFixed(2)}</div>
                                    </div>
                                    <p className="product-description">{product.description}</p>
                                    <div className="product-meta">
                                        <span className="category-badge">{product.category}</span>
                                        <span className={`stock-badge ${getStockStatus(product.stock)}`}>
                                            {getStockStatus(product.stock) === 'in-stock' ? 'In Stock' :
                                                getStockStatus(product.stock) === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                                        </span>
                                    </div>
                                    <div className="product-actions">
                                        <button
                                            className="btn btn-outline"
                                            onClick={() => handleEdit(product)}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(product._id)}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Results Count */}
                {!loading && filteredProducts.length > 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '20px',
                        color: '#6c757d',
                        fontSize: '0.9rem'
                    }}>
                        Showing {filteredProducts.length} of {products.length} products
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProducts;