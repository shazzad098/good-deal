import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import './ProductManagement.css';

// Axios instance create korun with base URL এবং interceptor
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 10000,
});

// Request interceptor - প্রতিটি রিকোয়েস্টে token যোগ করে
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token') || localStorage.getItem('user-token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        image: '',
        stock: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    // Fetch products from backend
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get('/products');
            setProducts(res.data.products || res.data);
            setError('');
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to load products. Make sure backend server is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');

            const productData = {
                name: formData.name,
                price: parseFloat(formData.price) || 0,
                description: formData.description,
                category: formData.category,
                images: formData.image ? [formData.image] : [],
                stock: parseInt(formData.stock) || 0
            };

            let res;
            if (editingId) {
                res = await api.put(`/products/${editingId}`, productData);
                setProducts(products.map(p => p._id === editingId ? res.data.product : p));
                setEditingId(null);
            } else {
                res = await api.post('/products', productData);
                setProducts([...products, res.data.product]);
            }

            setShowForm(false);
            setFormData({ name: '', price: '', description: '', category: '', image: '', stock: '' });
            setError('');

        } catch (error) {
            console.error('Error saving product:', error);
            if (error.code === 'ERR_NETWORK') {
                setError('Backend server is not running. Please start the server on port 5000.');
            } else if (error.response?.status === 401) {
                setError('Unauthorized. Please login again.');
            } else {
                setError(error.response?.data?.message || 'Failed to save product');
            }
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            price: product.price.toString(),
            description: product.description,
            category: product.category,
            image: product.images?.[0] || product.image || '',
            stock: product.stock.toString()
        });
        setEditingId(product._id);
        setShowForm(true);
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${productId}`);
                setProducts(products.filter(p => p._id !== productId));
                setError('');
            } catch (error) {
                console.error('Error deleting product:', error);
                if (error.code === 'ERR_NETWORK') {
                    setError('Backend server is not running. Please start the server on port 5000.');
                } else if (error.response?.status === 401) {
                    setError('Unauthorized. Please login again.');
                } else {
                    setError(error.response?.data?.message || 'Failed to delete product');
                }
            }
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setFormData({ name: '', price: '', description: '', category: '', image: '', stock: '' });
        setEditingId(null);
        setError('');
    };

    const getStatusDisplay = (status) => {
        if (!status) return 'unknown';
        return status.replace('-', ' ');
    };

    if (loading && products.length === 0) {
        return (
            <div className="product-management">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="product-management">
            <div className="management-header">
                <h2>Product Management</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingId(null);
                        setShowForm(true);
                    }}
                >
                    + Add New Product
                </button>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                    <button onClick={() => setError('')} className="alert-close">×</button>
                </div>
            )}

            {showForm && (
                <div className="product-form-section">
                    <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                    <form onSubmit={handleSubmit} className="product-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="productName">Product Name *</label>
                                <input
                                    type="text"
                                    id="productName"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="productPrice">Price ($)*</label>
                                <input
                                    type="number"
                                    id="productPrice"
                                    className="form-control"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="productCategory">Category *</label>
                                <select
                                    id="productCategory"
                                    className="form-control"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
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
                            <div className="form-group">
                                <label htmlFor="productStock">Stock Quantity *</label>
                                <input
                                    type="number"
                                    id="productStock"
                                    className="form-control"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                                    min="0"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="productImage">Image URL</label>
                            <input
                                type="text"
                                id="productImage"
                                className="form-control"
                                value={formData.image}
                                onChange={(e) => setFormData({...formData, image: e.target.value})}
                                placeholder="https://example.com/image.jpg"
                            />
                            {formData.image && (
                                <div className="image-preview">
                                    <img src={formData.image} alt="Preview" />
                                </div>
                            )}
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="productDescription">Description *</label>
                            <textarea
                                id="productDescription"
                                className="form-control"
                                rows="4"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                required
                            ></textarea>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                {editingId ? 'Update Product' : 'Add Product'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="products-table">
                {products.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📦</div>
                        <h3>No Products Found</h3>
                        <p>Get started by adding your first product.</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowForm(true)}
                        >
                            Add Your First Product
                        </button>
                    </div>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>
                                    <div className="product-info">
                                        <img
                                            src={product.images?.[0] || product.image || "https://placehold.co/60x60"}
                                            alt={product.name}
                                            className="product-thumb"
                                            onError={(e) => e.target.src = "https://placehold.co/60x60"}
                                        />
                                        <div>
                                            <div className="product-name">{product.name}</div>
                                            <div className="product-description">
                                                {product.description?.substring(0, 50)}...
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>{product.category}</td>
                                <td>${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}</td>
                                <td>{product.stock}</td>
                                <td>
                                        <span className={`status ${product.status || 'unknown'}`}>
                                            {getStatusDisplay(product.status)}
                                        </span>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-edit btn-sm"
                                        onClick={() => handleEdit(product)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-delete btn-sm"
                                        onClick={() => handleDelete(product._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ProductManagement;
