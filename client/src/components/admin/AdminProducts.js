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
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        images: ['']
    });
    const [message, setMessage] = useState({ type: '', text: '' });

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                images: formData.images.filter(img => img.trim() !== '')
            };

            if (editingProduct) {
                await axios.put(`/api/admin/products/${editingProduct._id}`, productData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                showMessage('success', 'Product updated successfully! 🎉');
            } else {
                await axios.post('/api/admin/products', productData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                showMessage('success', 'Product created successfully! 🎉');
            }

            setShowForm(false);
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                stock: '',
                images: ['']
            });
            fetchProducts();
        } catch (error) {
            // ✅ FIX: সার্ভার থেকে আসা আসল এরর মেসেজটি লগ করুন
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
            images: product.images && product.images.length > 0 ? product.images : ['']
        });
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
            name: '',
            description: '',
            price: '',
            category: '',
            stock: '',
            images: ['']
        });
    };

    const addImageField = () => {
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, '']
        }));
    };

    const removeImageField = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleImageChange = (index, value) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.map((img, i) => i === index ? value : img)
        }));
    };

    // Filter products based on search and filters
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        const matchesStock = stockFilter === 'all' ||
            (stockFilter === 'in-stock' && product.stock > 0) ||
            (stockFilter === 'out-of-stock' && product.stock === 0) ||
            (stockFilter === 'low-stock' && product.stock > 0 && product.stock < 10);

        return matchesSearch && matchesCategory && matchesStock;
    });

    const getStockStatus = (stock) => {
        if (stock === 0) return 'out-of-stock';
        if (stock < 10) return 'low-stock';
        return 'in-stock';
    };

    if (!isAuthenticated || user?.role !== 'admin') {
        return (
            <div className="admin-products-page">
                <div className="admin-access-denied">
                    <div className="access-denied-content">
                        <div style={{fontSize: '4rem', marginBottom: '20px'}}>🚫</div>
                        <h2>Access Denied</h2>
                        <p>You do not have permission to access this page.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="btn btn-primary"
                            style={{marginTop: '20px'}}
                        >
                            Go to Homepage
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-products-page">
            <div className="admin-products-container">
                {/* Header */}
                <div className="products-header">
                    <div className="header-content">
                        <h1>Product Management</h1>
                        <p>Manage your product inventory efficiently</p>
                    </div>
                    <div className="header-actions">
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowForm(true)}
                        >
                            <span>➕</span> Add New Product
                        </button>
                    </div>
                </div>

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
                        <select
                            className="filter-select"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            <option value="electronics">Electronics</option>
                            <option value="clothing">Clothing</option>
                            <option value="mobile-phones">Mobile Phones</option>
                            <option value="accessories">Accessories</option>
                        </select>
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

                                    <div className="form-group">
                                        <label>Category *</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            <option value="Electronics">Electronics</option>
                                            <option value="Clothing">Clothing</option>
                                            <option value="Books">Books</option>
                                            <option value="Home & Garden">Home & Garden</option>
                                            <option value="Sports">Sports</option>
                                            <option value="Beauty">Beauty</option>
                                            <option value="Toys">Toys</option>
                                            <option value="Automotive">Automotive</option>
                                        </select>
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Product Images</label>
                                        {formData.images.map((image, index) => (
                                            <div key={index} className="image-input-group">
                                                <input
                                                    type="url"
                                                    value={image}
                                                    onChange={(e) => handleImageChange(index, e.target.value)}
                                                    placeholder="https://example.com/image.jpg"
                                                />
                                                {formData.images.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="btn-remove-image"
                                                        onClick={() => removeImageField(index)}
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="btn-add-image"
                                            onClick={addImageField}
                                        >
                                            <span>➕</span> Add Another Image
                                        </button>
                                    </div>
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