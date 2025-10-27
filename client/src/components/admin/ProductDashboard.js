import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../actions/productActions';
import './ProductManagement.css';

const ProductManagement = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector(state => state.products);

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

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
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
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

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    if (loading) return (
        <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading products...</p>
        </div>
    );

    return (
        <div className="product-management">
            <div className="management-header">
                <div>
                    <h2>Product Management</h2>
                    <p style={{color: '#6c757d', margin: '5px 0 0 0'}}>
                        Manage your product catalog efficiently
                    </p>
                </div>
                <button className="btn btn-primary" onClick={handleCreate}>
                    <span>➕</span> Add New Product
                </button>
            </div>

            {/* Search and Filter */}
            <div className="products-toolbar">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search products..."
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
                </div>
            </div>

            {/* Products Table */}
            <div className="products-table">
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
                    {filteredProducts.map(product => (
                        <tr key={product._id}>
                            <td>
                                <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                                    <img
                                        src={product.images?.[0] || '/placeholder-image.jpg'}
                                        alt={product.name}
                                        className="product-thumb"
                                        onError={(e) => {
                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik0zMCAzNUMzMi43NjE0IDM1IDM1IDMyLjc2MTQgMzUgMzBDMzUgMjcuMjM4NiAzMi43NjE0IDI1IDMwIDI1QzI3LjIzODYgMjUgMjUgMjcuMjM4NiAyNSAzMEMyNSAzMi43NjE0IDI3LjIzODYgMzUgMzAgMzVaIiBmaWxsPSIjQ0RDRENEIi8+CjxwYXRoIGQ9Ik0zNy41IDIyLjVIMjIuNUMxOS4xODYzIDIyLjUgMTYuNSAyNS4xODYzIDE2LjUgMjguNVY0MS41QzE2LjUgNDQuODEzNyAxOS4xODYzIDQ3LjUgMjIuNSA0Ny41SDM3LjVDNDAuODEzNyA0Ny41IDQzLjUgNDQuODEzNyA0My41IDQxLjVWMjguNUM0My41IDI1LjE4NjMgNDAuODEzNyAyMi41IDM3LjUgMjIuNVpNMzAgMzVDMzIuNzYxNCAzNSAzNSAzMi43NjE0IDM1IDMwQzM1IDI3LjIzODYgMzIuNzYxNCAyNSAzMCAyNUMyNy4yMzg2IDI1IDI1IDI3LjIzODYgMjUgMzBDMjUgMzIuNzYxNCAyNy4yMzg2IDM1IDMwIDM1WiIgZmlsbD0iI0NEQ0RDRCIvPgo8L3N2Zz4K';
                                        }}
                                    />
                                    <div>
                                        <div style={{fontWeight: '600', color: '#2b2d42'}}>
                                            {product.name}
                                        </div>
                                        <div style={{
                                            color: '#6c757d',
                                            fontSize: '0.8rem',
                                            marginTop: '2px'
                                        }}>
                                            {product.description.substring(0, 50)}...
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span className="category-badge">
                                    {product.category}
                                </span>
                            </td>
                            <td style={{fontWeight: '700', color: '#4361ee'}}>
                                ${parseFloat(product.price).toFixed(2)}
                            </td>
                            <td>
                                <span style={{
                                    fontWeight: '600',
                                    color: product.stock > 10 ? '#28a745' : product.stock > 0 ? '#ffc107' : '#dc3545'
                                }}>
                                    {product.stock}
                                </span>
                            </td>
                            <td>
                                <span className={`status ${product.stock > 0 ? 'active' : 'inactive'}`}>
                                    {product.stock > 0 ? 'Active' : 'Out of Stock'}
                                </span>
                            </td>
                            <td>
                                <div style={{display: 'flex', gap: '8px'}}>
                                    <button
                                        className="btn btn-sm btn-edit"
                                        onClick={() => handleEdit(product)}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-delete"
                                        onClick={() => handleDelete(product._id)}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <h3>No Products Found</h3>
                    <p>
                        {searchTerm || categoryFilter !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Get started by adding your first product'
                        }
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={handleCreate}
                    >
                        Add Your First Product
                    </button>
                </div>
            )}

            {/* Results Count */}
            {filteredProducts.length > 0 && (
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
    );
};

export default ProductManagement;