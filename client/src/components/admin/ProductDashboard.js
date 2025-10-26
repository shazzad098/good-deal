// client/src/components/admin/ProductManagement.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../actions/productActions';
import ProductForm from './ProductForm';
import './ProductManagement.css';

const ProductManagement = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector(state => state.products);

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        dispatch(getProducts({}));
    }, [dispatch]);

    const handleCreate = () => {
        setEditingProduct(null);
        setShowForm(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleDelete = (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(productId));
        }
    };

    const handleSubmit = (productData) => {
        if (editingProduct) {
            dispatch(updateProduct(editingProduct._id, productData));
        } else {
            dispatch(createProduct(productData));
        }
        setShowForm(false);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="product-management">
            <div className="management-header">
                <h2>Product Management</h2>
                <button className="btn btn-primary" onClick={handleCreate}>
                    Add New Product
                </button>
            </div>

            {showForm && (
                <ProductForm
                    product={editingProduct}
                    onSubmit={handleSubmit}
                    onCancel={() => setShowForm(false)}
                />
            )}

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
                                    src={product.images[0] || '/placeholder-image.jpg'}
                                    alt={product.name}
                                    className="product-thumb"
                                />
                            </td>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>${product.price}</td>
                            <td>{product.stock}</td>
                            <td>
                  <span className={`status ${product.isActive ? 'active' : 'inactive'}`}>
                    {product.isActive ? 'Active' : 'Inactive'}
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
            </div>
        </div>
    );
};

export default ProductManagement;