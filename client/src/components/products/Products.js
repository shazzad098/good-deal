// client/src/components/products/Products.js
import React, {
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback,
} from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addToCart } from "../../reducers/cartReducer";
import "./Products.css";

// --- Helper Functions & Constants ---

const TAB_KEYS = ["description", "specifications", "reviews"];

const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);

const getCategoryIcon = (category) => {
    const icons = {
        Electronics: "⚡", Clothing: "👔", Books: "📖", "Home & Garden": "🏡",
        Sports: "🎯", Beauty: "✨", Toys: "🎮", Food: "🍽️",
    };
    return icons[category] || "📦";
};

// --- Custom Hooks (Logic Abstraction) ---

/**
 * Hook 1: প্রোডাক্ট ডেটা ফেচিং এবং স্টেট পরিচালনা করে
 */
function useProductData(id) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProduct = useCallback(async () => {
        if (!id || id === "undefined") {
            setError("Invalid product ID");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get(`/api/products/${id}`);
            
            // বিভিন্ন API রেসপন্স ফরম্যাট হ্যান্ডেল করা
            const productData = res.data?.product || res.data;
            if (productData) {
                setProduct(productData);
            } else {
                throw new Error("Invalid product data format");
            }
        } catch (err) {
            console.error("Error fetching product:", err);
            setError(err.response?.data?.message || "Failed to fetch product");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    return { product, loading, error, fetchProduct };
}

/**
 * Hook 2: ইমেজ গ্যালারি স্টেট পরিচালনা করে
 */
function useProductGallery(product) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [imageLoading, setImageLoading] = useState(true);

    // প্রোডাক্ট পরিবর্তন হলে প্রথম ছবিতে রিসেট করুন
    useEffect(() => {
        setSelectedImage(0);
        setImageLoading(true);
    }, [product]);

    const handleSelectImage = (index) => {
        setSelectedImage(index);
        setImageLoading(true);
    };

    return { selectedImage, imageLoading, handleSelectImage, setImageLoading };
}

/**
 * Hook 3: প্রোডাক্ট কোয়ান্টিটি পরিচালনা করে
 */
function useProductQuantity(stock) {
    const [quantity, setQuantity] = useState(1);

    const incrementQuantity = () => {
        setQuantity((q) => Math.min(q + 1, stock));
    };
    const decrementQuantity = () => {
        setQuantity((q) => Math.max(q - 1, 1));
    };
    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 1 && value <= stock) {
            setQuantity(value);
        }
    };
    
    // স্টক পরিবর্তন হলে কোয়ান্টিটি অ্যাডজাস্ট করুন
    useEffect(() => {
        if (stock > 0 && quantity > stock) {
            setQuantity(stock);
        } else if (stock === 0) {
            setQuantity(1); // বা 0, আপনার লজিক অনুযায়ী
        }
    }, [stock, quantity]);


    return { quantity, incrementQuantity, decrementQuantity, handleQuantityChange };
}

/**
 * Hook 4: অ্যাক্সেসিবল ট্যাব সিস্টেম পরিচালনা করে
 */
function useProductTabs() {
    const [activeTab, setActiveTab] = useState(TAB_KEYS[0]);
    const tabRefs = {
        description: useRef(null),
        specifications: useRef(null),
        reviews: useRef(null),
    };

    const onTabsKeyDown = useCallback((e) => {
        const currentIndex = TAB_KEYS.indexOf(activeTab);
        let nextIndex = currentIndex;

        if (e.key === "ArrowRight") {
            nextIndex = (currentIndex + 1) % TAB_KEYS.length;
        } else if (e.key === "ArrowLeft") {
            nextIndex = (currentIndex - 1 + TAB_KEYS.length) % TAB_KEYS.length;
        } else if (e.key === "Home") {
            nextIndex = 0;
        } else if (e.key === "End") {
            nextIndex = TAB_KEYS.length - 1;
        }

        if (nextIndex !== currentIndex) {
            const nextTab = TAB_KEYS[nextIndex];
            setActiveTab(nextTab);
            tabRefs[nextTab]?.current?.focus();
            e.preventDefault();
        }
    }, [activeTab]); // tabRefs পরিবর্তন হবে না, তাই re-render হবে না

    return { activeTab, setActiveTab, tabRefs, onTabsKeyDown };
}

/**
 * Hook 5: কার্ট হ্যান্ডলিং এবং নোটিফিকেশন পরিচালনা করে
 */
function useCartHandler(product, quantity, isAuthenticated) {
    const dispatch = useDispatch();
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [liveMessage, setLiveMessage] = useState("");

    // ARIA Live Region এর জন্য নোটিফিকেশন লিসেনার
    useEffect(() => {
        const handler = (evt) => {
            const msg = evt?.detail?.message || "";
            setLiveMessage(msg);
            const t = setTimeout(() => setLiveMessage(""), 2000);
            return () => clearTimeout(t);
        };
        window.addEventListener("cartNotification", handler);
        return () => window.removeEventListener("cartNotification", handler);
    }, []);

    // কার্টে অ্যাড করার হ্যান্ডলার
    const handleAddToCart = useCallback(async () => {
        if (!isAuthenticated) {
            alert("Please login to add items to cart");
            return;
        }
        if (!product || product.stock === 0) return;

        setIsAddingToCart(true);
        try {
            await dispatch(
                addToCart({
                    productId: product._id || product.id,
                    quantity,
                    name: product.name,
                    price: product.price,
                    image: product.images?.[0] || product.image,
                })
            ).unwrap();

            // সফল নোটিফিকেশন
            window.dispatchEvent(new CustomEvent("cartNotification", {
                detail: { message: "Product added to cart!", type: "success" },
            }));
        } catch (error) {
            console.error("Error adding to cart:", error);
            // ব্যর্থ নোটিফিকেশন
            window.dispatchEvent(new CustomEvent("cartNotification", {
                detail: { message: "Failed to add product to cart", type: "error" },
            }));
        } finally {
            setIsAddingToCart(false);
        }
    }, [dispatch, product, quantity, isAuthenticated]);

    return { isAddingToCart, liveMessage, handleAddToCart };
}


// --- 1. Loading/Error Components ---

const ProductLoading = () => (
    <div className="product-page">
        <div className="container">
            <div className="loading-state" role="status" aria-live="polite">
                <div className="pulse-loader" aria-hidden="true">
                    <div className="pulse-dot"></div>
                    <div className="pulse-dot"></div>
                    <div className="pulse-dot"></div>
                </div>
                <p>Loading product details...</p>
            </div>
        </div>
    </div>
);

const ProductError = ({ error, onRetry }) => (
    <div className="product-page">
        <div className="container">
            <div className="empty-state" role="alert">
                <div className="empty-icon" aria-hidden="true">🚫</div>
                <h3>Product Not Available</h3>
                <p>{error}</p>
                <div className="action-buttons">
                    <button onClick={onRetry} className="btn btn-secondary" type="button">
                        Try Again
                    </button>
                    <Link to="/products" className="btn btn-primary">
                        Browse Products
                    </Link>
                </div>
            </div>
        </div>
    </div>
);

const ProductNotFound = () => (
     <div className="product-page">
        <div className="container">
            <div className="empty-state">
                <div className="empty-icon" aria-hidden="true">🔍</div>
                <h3>Product Not Found</h3>
                <p>The product you're looking for doesn't exist or has been removed.</p>
                <Link to="/products" className="btn btn-primary">
                    Discover Products
                </Link>
            </div>
        </div>
    </div>
);


// --- 2. Main Child Components (Memoized) ---

const ProductBreadcrumb = React.memo(({ product }) => (
    <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/" className="breadcrumb-link">
             <svg className="breadcrumb-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            Home
        </Link>
        <span className="breadcrumb-separator" aria-hidden="true">›</span>
        <Link to="/products" className="breadcrumb-link">Products</Link>
        <span className="breadcrumb-separator" aria-hidden="true">›</span>
        <span className="breadcrumb-current" aria-current="page">{product.name}</span>
    </nav>
));

const ProductGallery = React.memo(({ product, selectedImage, imageLoading, handleSelectImage, setImageLoading }) => (
    <div className="product-gallery">
        <div className="main-image-container">
            <div className="main-image">
                {imageLoading && (
                    <div className="image-skeleton" aria-hidden="true">
                        <div className="skeleton-shimmer"></div>
                    </div>
                )}
                <img
                    src={product.images?.[selectedImage] || product.image || "/images/placeholder.jpg"}
                    alt={product.name}
                    className={`product-image ${imageLoading ? "loading" : "loaded"}`}
                    onLoad={() => setImageLoading(false)}
                    onError={(e) => {
                        e.currentTarget.src = "/images/placeholder.jpg";
                        setImageLoading(false);
                    }}
                    loading="eager"
                    decoding="async"
                />
                {product.stock === 0 && (
                    <div className="out-of-stock-overlay" aria-hidden="true">
                        <div className="out-of-stock-badge">
                            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                                <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                            Out of Stock
                        </div>
                    </div>
                )}
                {product.discountPercentage && (
                    <div className="discount-badge" aria-label={`Discount ${product.discountPercentage}%`}>
                        <span className="discount-text">-{product.discountPercentage}%</span>
                    </div>
                )}
            </div>
        </div>

        {product.images && product.images.length > 1 && (
            <div className="thumbnail-gallery" role="list">
                {product.images.map((image, index) => (
                    <button
                        key={index}
                        className={`thumbnail ${selectedImage === index ? "active" : ""}`}
                        onClick={() => handleSelectImage(index)}
                        aria-label={`View image ${index + 1}`}
                        type="button"
                    >
                        <img
                            src={image}
                            alt={`${product.name} view ${index + 1}`}
                            loading="lazy"
                            decoding="async"
                            onError={(e) => { e.currentTarget.src = "/images/placeholder.jpg"; }}
                        />
                    </button>
                ))}
            </div>
        )}
    </div>
));

// =======================================================
// ফিক্সড ProductDetails কম্পোনেন্ট
// =======================================================
const ProductDetails = React.memo(({ product, quantityProps, cartProps }) => (
    <div className="product-details">
        {/* Header */}
        <div className="product-header">
            <div className="category-badge" aria-label={`Category ${product.category}`}>
                {getCategoryIcon(product.category)}
                <span>{product.category}</span>
            </div>
            <h1 className="product-title">{product.name}</h1>
            <div className="product-meta">
                <div className="meta-item">
                    <svg
                        className="meta-icon"
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        aria-hidden="true"
                    >
                        <path
                            fill="currentColor"
                            d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" // Placeholder SKU icon
                        />
                    </svg>
                    <span>SKU: {product._id?.slice(-8).toUpperCase()}</span>
                </div>
                <div className={`stock-badge ${product.stock > 0 ? "in-stock" : "out-of-stock"}`} aria-live="polite">
                    <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        aria-hidden="true"
                    >
                        <path
                            fill="currentColor"
                            d={
                                product.stock > 0
                                ? "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                                : "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                            }
                        />
                    </svg>
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </div>
            </div>
        </div>

        {/* Price */}
        <div className="price-section">
            <div className="price-container">
                <span className="current-price">{formatPrice(product.price)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                    <span className="original-price">{formatPrice(product.originalPrice)}</span>
                )}
            </div>
            {product.discountPercentage && product.originalPrice && (
                <div className="savings-badge">
                    <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        aria-hidden="true"
                    >
                        <path
                            fill="currentColor"
                            d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5s-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-4h4v4z"
                        />
                    </svg>
                    Save {formatPrice(product.originalPrice - product.price)} ({product.discountPercentage}%)
                </div>
            )}
        </div>

        {/* Rating */}
        <div className="rating-section" aria-label="Average rating 4.8 out of 5">
            <div className="stars" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className="star"
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                    >
                        <path
                            fill="currentColor"
                            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                        />
                    </svg>
                ))}
            </div>
            <span className="rating-text">4.8 • 124 reviews</span>
        </div>

        {/* Quantity */}
        <div className="quantity-section">
            <label htmlFor="quantity" className="quantity-label">Quantity</label>
            <div className="quantity-controls">
                <button
                    onClick={quantityProps.decrementQuantity}
                    disabled={quantityProps.quantity <= 1}
                    className="quantity-btn"
                    aria-label="Decrease quantity"
                    type="button"
                >
                    <svg
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        aria-hidden="true"
                    >
                        <path fill="currentColor" d="M19 13H5v-2h14v2z" />
                    </svg>
                </button>
                <input
                    id="quantity"
                    type="number"
                    value={quantityProps.quantity}
                    onChange={quantityProps.handleQuantityChange}
                    min="1"
                    max={product.stock}
                    className="quantity-input"
                    aria-label="Selected quantity"
                    inputMode="numeric"
                    pattern="[0-9]*"
                />
                <button
                    onClick={quantityProps.incrementQuantity}
                    disabled={quantityProps.quantity >= product.stock}
                    className="quantity-btn"
                    aria-label="Increase quantity"
                    type="button"
                >
                    <svg
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        aria-hidden="true"
                    >
                        <path
                            fill="currentColor"
                            d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
                        />
                    </svg>
                </button>
            </div>
             <div className="stock-indicator">
                {product.stock > 0 && <span className="stock-text">{product.stock} units available</span>}
            </div>
        </div>

        {/* Actions */}
        <div className="action-section">
            <button
                onClick={cartProps.handleAddToCart}
                disabled={product.stock === 0 || cartProps.isAddingToCart}
                className={`add-to-cart-btn ${cartProps.isAddingToCart ? "loading" : ""} ${product.stock === 0 ? "out-of-stock" : ""}`}
                type="button"
                aria-live="polite"
            >
                {cartProps.isAddingToCart ? (
                    <><div className="btn-spinner" aria-hidden="true"></div> Adding...</>
                ) : product.stock === 0 ? (
                    "Out of Stock"
                ) : (
                    <>
                        <svg
                            className="cart-icon"
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            aria-hidden="true"
                        >
                            <path
                                fill="currentColor"
                                d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"
                            />
                        </svg>
                        Add to Cart - <span className="cart-total">{formatPrice(product.price * quantityProps.quantity)}</span>
                    </>
                )}
            </button>
            <div className="secondary-actions">
                 <button className="buy-now-btn" type="button">
                    <svg
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        aria-hidden="true"
                    >
                        <path
                            fill="currentColor"
                            d="M13 12h7v1.5h-7zm0-2.5h7V11h-7zm0 5h7V16h-7zM8 11c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0-3c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5z"
                        />
                    </svg>
                    Buy Now
                 </button>
                 <button className="wishlist-btn" aria-label="Add to wishlist" type="button">
                    <svg
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        aria-hidden="true"
                    >
                        <path
                            fill="currentColor"
                            d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"
                        />
                    </svg>
                    Save
                 </button>
            </div>
        </div>

        {/* Trust Features */}
        <div className="features-list">
             <h4 className="features-title">Why shop with us?</h4>
             <div className="feature-item">
                <div className="feature-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path
                            fill="currentColor"
                            d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" // Placeholder icon
                        />
                    </svg>
                </div>
                <div className="feature-content">
                    <strong>Free shipping</strong> on orders over $50
                </div>
            </div>
            <div className="feature-item">
                <div className="feature-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path
                            fill="currentColor"
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                        />
                    </svg>
                </div>
                <div className="feature-content">
                    <strong>30-day</strong> money-back guarantee
                </div>
            </div>
            <div className="feature-item">
                <div className="feature-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path
                            fill="currentColor"
                            d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
                        />
                    </svg>
                </div>
                <div className="feature-content">
                    <strong>Secure</strong> checkout & payment
                </div>
            </div>
        </div>
    </div>
));
// =======================================================
// ফিক্সড ProductDetails কম্পোনেন্ট শেষ
// =======================================================


const ProductTabs = React.memo(({ product, tabProps }) => (
    <div className="product-tabs">
        <div className="tab-headers" role="tablist" aria-label="Product details" onKeyDown={tabProps.onTabsKeyDown}>
            <button
                ref={tabProps.tabRefs.description}
                id="tab-description"
                role="tab"
                aria-selected={tabProps.activeTab === "description"}
                aria-controls="panel-description"
                tabIndex={tabProps.activeTab === "description" ? 0 : -1}
                className={`tab-header ${
                tabProps.activeTab === "description" ? "active" : ""
                }`}
                onClick={() => tabProps.setActiveTab("description")}
                type="button"
            >
                <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                >
                    <path
                        fill="currentColor"
                        d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
                    />
                </svg>
                Description
            </button>
            <button
                ref={tabProps.tabRefs.specifications}
                id="tab-specifications"
                role="tab"
                aria-selected={tabProps.activeTab === "specifications"}
                aria-controls="panel-specifications"
                tabIndex={tabProps.activeTab === "specifications" ? 0 : -1}
                className={`tab-header ${
                tabProps.activeTab === "specifications" ? "active" : ""
                }`}
                onClick={() => tabProps.setActiveTab("specifications")}
                type="button"
            >
                 <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                 >
                    <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                 </svg>
                Specifications
            </button>
            <button
                ref={tabProps.tabRefs.reviews}
                id="tab-reviews"
                role="tab"
                aria-selected={tabProps.activeTab === "reviews"}
                aria-controls="panel-reviews"
                tabIndex={tabProps.activeTab === "reviews" ? 0 : -1}
                className={`tab-header ${
                tabProps.activeTab === "reviews" ? "active" : ""
                }`}
                onClick={() => tabProps.setActiveTab("reviews")}
                type="button"
            >
                <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                >
                    <path
                        fill="currentColor"
                        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                    />
                </svg>
                Reviews (124)
            </button>
        </div>
        <div className="tab-content">
            {/* Description Panel */}
            <section
                id="panel-description"
                role="tabpanel"
                aria-labelledby="tab-description"
                hidden={tabProps.activeTab !== "description"}
                className="tab-panel"
                tabIndex={0}
            >
                <h3>Product Overview</h3>
                <p className="product-description">{product.description}</p>
                {product.features && (
                    <div className="product-features">
                        <h4>Key Features</h4>
                        <div className="features-grid">
                            {product.features.map((feature, index) => (
                                <div key={index} className="feature-card">
                                    <div className="feature-check" aria-hidden="true">
                                        <svg viewBox="0 0 24 24" width="20" height="20">
                                            <path
                                                fill="currentColor"
                                                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                                            />
                                        </svg>
                                    </div>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
            
            {/* Specifications Panel */}
            <section
                id="panel-specifications"
                role="tabpanel"
                aria-labelledby="tab-specifications"
                hidden={tabProps.activeTab !== "specifications"}
                className="tab-panel"
                tabIndex={0}
            >
                <h3>Technical Specifications</h3>
                <div className="specs-grid">
                    <div className="spec-group">
                        <h5>General</h5>
                        <div className="spec-item">
                            <span className="spec-label">Product Name</span>
                            <span className="spec-value">{product.name}</span>
                        </div>
                        <div className="spec-item">
                            <span className="spec-label">Category</span>
                            <span className="spec-value">{product.category}</span>
                        </div>
                        <div className="spec-item">
                            <span className="spec-label">SKU</span>
                            <span className="spec-value">{product._id?.slice(-8).toUpperCase()}</span>
                        </div>
                    </div>

                    <div className="spec-group">
                        <h5>Inventory</h5>
                        <div className="spec-item">
                            <span className="spec-label">Stock Status</span>
                            <span className={`spec-value ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                                {product.stock > 0 ? "In Stock" : "Out of Stock"}
                            </span>
                        </div>
                        <div className="spec-item">
                            <span className="spec-label">Available Units</span>
                            <span className="spec-value">{product.stock}</span>
                        </div>
                    </div>

                    {product.weight && (
                        <div className="spec-group">
                            <h5>Physical</h5>
                            <div className="spec-item">
                                <span className="spec-label">Weight</span>
                                <span className="spec-value">{product.weight}</span>
                            </div>
                            {product.dimensions && (
                                <div className="spec-item">
                                    <span className="spec-label">Dimensions</span>
                                    <span className="spec-value">{product.dimensions}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Reviews Panel */}
            <section
                id="panel-reviews"
                role="tabpanel"
                aria-labelledby="tab-reviews"
                hidden={tabProps.activeTab !== "reviews"}
                className="tab-panel"
                tabIndex={0}
            >
                <div className="reviews-header">
                    <div className="reviews-summary">
                        <div className="overall-rating">
                            <div className="rating-score">4.8</div>
                            <div className="rating-stars" aria-hidden="true">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        className="star filled"
                                        viewBox="0 0 24 24"
                                        width="20"
                                        height="20"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                        />
                                    </svg>
                                ))}
                            </div>
                            <div className="rating-count">Based on 124 reviews</div>
                        </div>
                    </div>
                </div>
                <div className="reviews-placeholder">
                    <div className="reviews-cta">
                        <p>Be the first to share your experience with this product!</p>
                        <button className="btn btn-primary" type="button">
                            <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                aria-hidden="true"
                            >
                                <path
                                    fill="currentColor"
                                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                                />
                            </svg>
                            Write a Review
                        </button>
                    </div>
                </div>
            </section>
        </div>
    </div>
));

const ProductAdminActions = React.memo(({ productId, user }) => {
    if (user?.role !== "admin") return null;
    
    return (
        <div className="admin-actions">
            <div className="admin-header">
                <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    aria-hidden="true"
                >
                    <path
                        fill="currentColor"
                        d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
                    />
                </svg>
                <h3>Admin Controls</h3>
            </div>
            <div className="admin-buttons">
                <Link to={`/admin/products/edit/${productId}`} className="btn btn-secondary">
                    <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        aria-hidden="true"
                    >
                        <path
                            fill="currentColor"
                            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                        />
                    </svg>
                    Edit Product
                </Link>
                <button className="btn btn-danger" type="button">
                    <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        aria-hidden="true"
                    >
                        <path
                            fill="currentColor"
                            d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                        />
                    </svg>
                    Delete Product
                </button>
            </div>
        </div>
    );
});


// --- 3. Main Product Component (Orchestrator) ---

const Products = () => {
    const { id } = useParams();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    // --- Hooks ---
    const { product, loading, error, fetchProduct } = useProductData(id);
    const { selectedImage, imageLoading, handleSelectImage, setImageLoading } = useProductGallery(product);
    const { quantity, ...quantityProps } = useProductQuantity(product?.stock || 0);
    const { activeTab, setActiveTab, tabRefs, onTabsKeyDown } = useProductTabs();
    const { isAddingToCart, liveMessage, handleAddToCart } = useCartHandler(product, quantity, isAuthenticated);

    // --- Render States ---
    if (loading) {
        return <ProductLoading />;
    }
    if (error) {
        return <ProductError error={error} onRetry={fetchProduct} />;
    }
    if (!product) {
        return <ProductNotFound />;
    }
    
    // --- Main Render ---
    return (
        <div className="product-page">
            <div className="container">
                {/* Live region for announcements */}
                <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                    {liveMessage}
                </div>

                <ProductBreadcrumb product={product} />

                <div className="product-grid">
                    <ProductGallery 
                        product={product} 
                        selectedImage={selectedImage}
                        imageLoading={imageLoading}
                        handleSelectImage={handleSelectImage}
                        setImageLoading={setImageLoading}
                    />
                    <ProductDetails 
                        product={product}
                        quantityProps={{ quantity, ...quantityProps }}
                        cartProps={{ isAddingToCart, handleAddToCart }}
                    />
                </div>

                <ProductTabs 
                    product={product}
                    tabProps={{ activeTab, setActiveTab, tabRefs, onTabsKeyDown }}
                />
                
                <ProductAdminActions 
                    productId={product._id || product.id} 
                    user={user} 
                />
            </div>
        </div>
    );
};

export default Products;