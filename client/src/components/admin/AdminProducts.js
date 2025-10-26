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
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
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
                stock: parseInt(formData.stock)
            };

            if (editingProduct) {
                // Update product
                await axios.put(`/api/admin/products/${editingProduct._id}`, productData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                showMessage('success', 'Product updated successfully!');
            } else {
                // Create new product
                await axios.post('/api/admin/products', productData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                showMessage('success', 'Product created successfully!');
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
            console.error('Error saving product:', error);
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
            images: product.images || ['']
        });
        setShowForm(true);
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/admin/products/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                showMessage('success', 'Product deleted successfully!');
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

    if (!isAuthenticated || user?.role !== 'admin') {
        return (
            <div className="admin-products-page">
                <div className="container">
                    <div className="access-denied">
                        <h2>Access Denied</h2>
                        <p>You do not have permission to access this page.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-products-page">
            <div className="container">
                <div className="admin-header">
                    <div className="header-content">
                        <h1>Product Management</h1>
                        <p>Manage your products inventory</p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(true)}
                    >
                        + Add New Product
                    </button>
                </div>

                {/* Message Alert */}
                {message.text && (
                    <div className={`message-alert ${message.type}`}>
                        {message.text}
                    </div>
                )}

                {/* Product Form */}
                {showForm && (
                    <div className="product-form-overlay">
                        <div className="product-form">
                            <div className="form-header">
                                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                                <button className="close-btn" onClick={cancelEdit}>×</button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
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

                                <div className="form-group">
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

                                <div className="form-row">
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
                                        <option value="electronics">Electronics</option>
                                        <option value="clothing">Clothing</option>
                                        <option value="mobile-phones">Mobile Phones</option>
                                        <option value="accessories">Accessories</option>
                                    </select>
                                </div>

                                <div className="form-group">
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
                                                    className="remove-image"
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
                                        + Add Another Image
                                    </button>
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary">
                                        {editingProduct ? 'Update Product' : 'Create Product'}
                                    </button>
                                    <button type="button" className="btn btn-outline" onClick={cancelEdit}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Products List */}
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading products...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📦</div>
                        <h3>No Products Found</h3>
                        <p>Get started by adding your first product</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowForm(true)}
                        >
                            Add Your First Product
                        </button>
                    </div>
                ) : (
                    <div className="products-table-container">
                        <div className="table-header">
                            <span>Total Products: {products.length}</span>
                        </div>
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
                                                onError={(e) => {
                                                    e.target.src = '/images/placeholder.jpg';
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <div className="product-name">
                                                <strong>{product.name}</strong>
                                                <small>{product.description.substring(0, 50)}...</small>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="category-badge">{product.category}</span>
                                        </td>
                                        <td className="price">${parseFloat(product.price).toFixed(2)}</td>
                                        <td>
                                            <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${product.stock > 0 ? 'active' : 'inactive'}`}>
                                                {product.stock > 0 ? 'Active' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td className="actions">
                                            <button
                                                className="btn-action btn-edit"
                                                onClick={() => handleEdit(product)}
                                                title="Edit Product"
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className="btn-action btn-delete"
                                                onClick={() => handleDelete(product._id)}
                                                title="Delete Product"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProducts;