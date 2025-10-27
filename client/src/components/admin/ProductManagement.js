// client/src/components/admin/ProductManagement.js
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ProductManagement.css';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Add Product Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        category: 'electronics',
        brand: '',
        stock: '',
        images: [''],
        features: ['']
    });

    const { user, isAuthenticated } = useSelector(state => state.auth);

    // Categories for dropdown
    const categories = [
        'electronics',
        'clothing',
        'books',
        'home',
        'sports',
        'beauty',
        'toys'
    ];

    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') {
            fetchProducts();
        }
    }, [isAuthenticated, user]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/api/admin/products');
            if (res.data.success) {
                setProducts(res.data.products);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Error fetching products');
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

    const handleArrayInputChange = (index, value, field) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => ({
            ...prev,
            [field]: newArray
        }));
    };

    const addArrayField = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeArrayField = (index, field) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            [field]: newArray
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepare data
            const submitData = {
                ...formData,
                price: parseFloat(formData.price),
                originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
                stock: parseInt(formData.stock),
                images: formData.images.filter(img => img.trim() !== ''),
                features: formData.features.filter(feature => feature.trim() !== '')
            };

            if (editingProduct) {
                // Update product
                const res = await axios.put(
                    `http://localhost:5000/api/admin/products/${editingProduct._id}`,
                    submitData
                );
                if (res.data.success) {
                    alert('Product updated successfully!');
                    setEditingProduct(null);
                    resetForm();
                    fetchProducts();
                }
            } else {
                // Add new product
                const res = await axios.post(
                    'http://localhost:5000/api/admin/products',
                    submitData
                );
                if (res.data.success) {
                    alert('Product added successfully!');
                    resetForm();
                    setShowAddForm(false);
                    fetchProducts();
                }
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            originalPrice: '',
            category: 'electronics',
            brand: '',
            stock: '',
            images: [''],
            features: ['']
        });
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            originalPrice: product.originalPrice?.toString() || '',
            category: product.category,
            brand: product.brand || '',
            stock: product.stock.toString(),
            images: product.images.length > 0 ? product.images : [''],
            features: product.features?.length > 0 ? product.features : ['']
        });
        setShowAddForm(true);
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const res = await axios.delete(`http://localhost:5000/api/admin/products/${productId}`);
                if (res.data.success) {
                    alert('Product deleted successfully!');
                    fetchProducts();
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Error deleting product');
            }
        }
    };

    const cancelEdit = () => {
        setEditingProduct(null);
        resetForm();
        setShowAddForm(false);
    };

    // যদি user admin না হয়, তবে access deny message show করুন
    if (!isAuthenticated || user?.role !== 'admin') {
        return (
            <div className="admin-access-denied">
                <div className="container">
                    <div className="access-denied-content">
                        <h1>🚫 Access Denied</h1>
                        <p>You don't have permission to access this page.</p>
                        <p>This page is only available for administrators.</p>
                        <Link to="/" className="btn btn-primary">
                            Go Back Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="product-management">
            <div className="container">
                {/* Header */}
                <div className="admin-header">
                    <div className="header-content">
                        <div className="header-text">
                            <h1>Product Management</h1>
                            <p>Manage your store products</p>
                        </div>
                        <div className="header-actions">
                            <Link to="/products" className="btn btn-outline">
                                ← Back to Products
                            </Link>
                            <button
                                onClick={() => {
                                    setShowAddForm(!showAddForm);
                                    if (editingProduct) {
                                        setEditingProduct(null);
                                        resetForm();
                                    }
                                }}
                                className="btn btn-primary"
                            >
                                {showAddForm ? 'Cancel' : '+ Add New Product'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Add/Edit Product Form */}
                {showAddForm && (
                    <div className="product-form-section">
                        <div className="form-container">
                            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <form onSubmit={handleSubmit} className="product-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Product Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
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
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>
                                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Price ($) *</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Original Price ($)</label>
                                        <input
                                            type="number"
                                            name="originalPrice"
                                            value={formData.originalPrice}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Brand</label>
                                        <input
                                            type="text"
                                            name="brand"
                                            value={formData.brand}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Stock Quantity *</label>
                                        <input
                                            type="number"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleInputChange}
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <label>Description *</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="4"
                                        required
                                    />
                                </div>

                                {/* Images */}
                                <div className="form-group full-width">
                                    <label>Image URLs</label>
                                    {formData.images.map((image, index) => (
                                        <div key={index} className="array-input-group">
                                            <input
                                                type="url"
                                                value={image}
                                                onChange={(e) => handleArrayInputChange(index, e.target.value, 'images')}
                                                placeholder="https://example.com/image.jpg"
                                            />
                                            {formData.images.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeArrayField(index, 'images')}
                                                    className="btn-remove"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addArrayField('images')}
                                        className="btn-add"
                                    >
                                        + Add Image URL
                                    </button>
                                </div>

                                {/* Features */}
                                <div className="form-group full-width">
                                    <label>Features</label>
                                    {formData.features.map((feature, index) => (
                                        <div key={index} className="array-input-group">
                                            <input
                                                type="text"
                                                value={feature}
                                                onChange={(e) => handleArrayInputChange(index, e.target.value, 'features')}
                                                placeholder="Product feature"
                                            />
                                            {formData.features.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeArrayField(index, 'features')}
                                                    className="btn-remove"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addArrayField('features')}
                                        className="btn-add"
                                    >
                                        + Add Feature
                                    </button>
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary">
                                        {editingProduct ? 'Update Product' : 'Add Product'}
                                    </button>
                                    <button type="button" onClick={cancelEdit} className="btn btn-outline">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Products List */}
                <div className="products-list-section">
                    <h2>All Products ({products.length})</h2>

                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading products...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="empty-state">
                            <p>No products found. Add your first product!</p>
                        </div>
                    ) : (
                        <div className="products-table">
                            <table>
                                <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {products.map(product => (
                                    <tr key={product._id}>
                                        <td>
                                            <img
                                                src={product.images?.[0] || '/images/placeholder.jpg'}
                                                alt={product.name}
                                                className="product-thumb"
                                            />
                                        </td>
                                        <td>
                                            <div className="product-info">
                                                <strong>{product.name}</strong>
                                                <small>{product.brand}</small>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="category-badge">{product.category}</span>
                                        </td>
                                        <td>${product.price}</td>
                                        <td>{product.stock}</td>
                                        <td>
                                                <span className={`status-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="btn-edit"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="btn-delete"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductManagement;