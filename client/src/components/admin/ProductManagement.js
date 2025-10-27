// client/src/components/admin/ProductManagement.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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

    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add product logic here
        console.log('Adding product:', formData);
        setShowForm(false);
        setFormData({ name: '', price: '', description: '', category: '', image: '', stock: '' });
    };

    const handleDelete = (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            // Delete product logic
            console.log('Deleting product:', productId);
        }
    };

    return (
        <div>
            <div className="admin-table-header">
                <h2>Product Management</h2>
                <button
                    className="admin-btn"
                    onClick={() => setShowForm(true)}
                >
                    + Add New Product
                </button>
            </div>

            {showForm && (
                <div className="admin-form">
                    <h3>Add New Product</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Product Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Price</label>
                            <input
                                type="number"
                                className="form-control"
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                required
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label>Stock Quantity</label>
                            <input
                                type="number"
                                className="form-control"
                                value={formData.stock}
                                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="admin-btn">
                                Add Product
                            </button>
                            <button
                                type="button"
                                className="admin-btn danger"
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="admin-table">
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                    <tr style={{background: '#f8f9fa'}}>
                        <th style={{padding: '15px', textAlign: 'left'}}>Product</th>
                        <th style={{padding: '15px', textAlign: 'left'}}>Price</th>
                        <th style={{padding: '15px', textAlign: 'left'}}>Stock</th>
                        <th style={{padding: '15px', textAlign: 'left'}}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr style={{borderBottom: '1px solid #ecf0f1'}}>
                        <td style={{padding: '15px'}}>Sample Product</td>
                        <td style={{padding: '15px'}}>$99.99</td>
                        <td style={{padding: '15px'}}>25</td>
                        <td style={{padding: '15px'}}>
                            <button className="admin-btn" style={{marginRight: '10px'}}>
                                Edit
                            </button>
                            <button
                                className="admin-btn danger"
                                onClick={() => handleDelete(1)}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductManagement;