import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductManagement.css';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'electronics',
        subcategory: '',
        brand: '',
        stock: '',
        images: [''],
        specifications: {
            'Screen': '',
            'RAM': '',
            'Storage': '',
            'Camera': '',
            'Battery': '',
            'Processor': ''
        },
        features: ['']
    });

    // Fetch products
    const fetchProducts = async () => {
        try {
            const res = await axios.get('/api/products');
            setProducts(res.data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Error loading products');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSpecChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            specifications: {
                ...prev.specifications,
                [key]: value
            }
        }));
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData(prev => ({
            ...prev,
            features: newFeatures
        }));
    };

    const addFeatureField = () => {
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, '']
        }));
    };

    const removeFeatureField = (index) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            features: newFeatures
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Clean up data
            const submitData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                images: formData.images.filter(img => img.trim() !== ''),
                features: formData.features.filter(feature => feature.trim() !== ''),
                specifications: Object.fromEntries(
                    Object.entries(formData.specifications)
                        .filter(([_, value]) => value.trim() !== '')
                )
            };

            if (editingProduct) {
                // Update product
                await axios.put(`/api/products/${editingProduct._id}`, submitData);
                alert('Product updated successfully!');
            } else {
                // Create new product
                await axios.post('/api/products', submitData);
                alert('Product created successfully!');
            }

            // Reset form and refresh products
            setShowForm(false);
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: 'electronics',
                subcategory: '',
                brand: '',
                stock: '',
                images: [''],
                specifications: {
                    'Screen': '',
                    'RAM': '',
                    'Storage': '',
                    'Camera': '',
                    'Battery': '',
                    'Processor': ''
                },
                features: ['']
            });

            fetchProducts();

        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            category: product.category,
            subcategory: product.subcategory || '',
            brand: product.brand || '',
            stock: product.stock.toString(),
            images: product.images.length > 0 ? product.images : [''],
            specifications: product.specifications || {
                'Screen': '',
                'RAM': '',
                'Storage': '',
                'Camera': '',
                'Battery': '',
                'Processor': ''
            },
            features: product.features?.length > 0 ? product.features : ['']
        });
        setShowForm(true);
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.put(`/api/products/${productId}`, { isActive: false });
                alert('Product deleted successfully!');
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Error deleting product');
            }
        }
    };

    return (
        <div className="product-management">
            <div className="management-header">
                <h2>Product Management</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingProduct(null);
                        setShowForm(true);
                    }}
                >
                    Add New Product
                </button>
            </div>

            {showForm && (
                <div className="product-form-overlay">
                    <div className="product-form-container">
                        <div className="form-header">
                            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                            <button
                                className="close-btn"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingProduct(null);
                                }}
                            >
                                ×
                            </button>
                        </div>

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
                                        <option value="electronics">Electronics</option>
                                        <option value="clothing">Clothing</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Brand</label>
                                    <input
                                        type="text"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Samsung, Apple"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Price (USD) *</label>
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

                                <div className="form-group full-width">
                                    <label>Images (URLs)</label>
                                    {formData.images.map((image, index) => (
                                        <input
                                            key={index}
                                            type="url"
                                            value={image}
                                            onChange={(e) => {
                                                const newImages = [...formData.images];
                                                newImages[index] = e.target.value;
                                                setFormData(prev => ({ ...prev, images: newImages }));
                                            }}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    ))}
                                    <button
                                        type="button"
                                        className="btn btn-sm"
                                        onClick={() => setFormData(prev => ({
                                            ...prev,
                                            images: [...prev.images, '']
                                        }))}
                                    >
                                        Add Another Image
                                    </button>
                                </div>

                                {/* Specifications */}
                                <div className="form-group full-width">
                                    <label>Specifications</label>
                                    <div className="specs-grid">
                                        {Object.entries(formData.specifications).map(([key, value]) => (
                                            <div key={key} className="spec-item">
                                                <label>{key}</label>
                                                <input
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) => handleSpecChange(key, e.target.value)}
                                                    placeholder={`Enter ${key}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="form-group full-width">
                                    <label>Features</label>
                                    {formData.features.map((feature, index) => (
                                        <div key={index} className="feature-item">
                                            <input
                                                type="text"
                                                value={feature}
                                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                                placeholder="Enter feature"
                                            />
                                            {formData.features.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => removeFeatureField(index)}
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="btn btn-sm"
                                        onClick={addFeatureField}
                                    >
                                        Add Feature
                                    </button>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingProduct(null);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Products List */}
            <div className="products-table">
                <table>
                    <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map(product => (
                        <tr key={product._id}>
                            <td>
                                <img
                                    src={product.images[0] || '/images/placeholder.jpg'}
                                    alt={product.name}
                                    className="product-thumb"
                                />
                            </td>
                            <td>{product.name}</td>
                            <td>
                  <span className={`category-badge ${product.category}`}>
                    {product.category}
                  </span>
                            </td>
                            <td>${product.price}</td>
                            <td>
                  <span className={`stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.stock}
                  </span>
                            </td>
                            <td>
                                <button
                                    className="btn btn-sm btn-edit"
                                    onClick={() => handleEdit(product)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-sm btn-delete"
                                    onClick={() => handleDelete(product._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {products.length === 0 && (
                    <div className="no-products">
                        <p>No products found. Add your first product!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductManagement;