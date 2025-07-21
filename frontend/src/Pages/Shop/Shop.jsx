import "./Shop.css";
import Footer from "../../Components/Footer/Footer";
import Header from "../../Components/Header/Header";
import ShopHeader from "./shop-header";
import ShopFooter from "./shop-footer";
import FilterSidebar from "./filter-sidebar";
import ProductCard from "../../Components/ProductCard/ProductCard";
import Pagination from "./pagination";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";

const PRODUCTS_PER_PAGE = 12;
const DEFAULT_FILTERS = {
  minPrice: 0,
  maxPrice: 50000,
  category: [],
  sizes: [],
  colors: [],
  sort: "Newest",
};

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function ShopPage() {
  const [productData, setProductData] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const abortControllerRef = useRef(null);

  const totalPages = useMemo(
    () => Math.ceil(totalProducts / PRODUCTS_PER_PAGE),
    [totalProducts]
  );

  const buildQueryParams = useCallback((filterParams, page = 1) => {
    const queryParams = new URLSearchParams();

    queryParams.append("page", page.toString());
    queryParams.append("limit", PRODUCTS_PER_PAGE.toString());

    if (Array.isArray(filterParams.category) && filterParams.category.length > 0) {
      queryParams.append("category", filterParams.category.join(","));
    }
    if (Array.isArray(filterParams.sizes) && filterParams.sizes.length > 0) {
      queryParams.append("sizes", filterParams.sizes.join(","));
    }
    if (Array.isArray(filterParams.colors) && filterParams.colors.length > 0) {
      queryParams.append("colors", filterParams.colors.join(","));
    }
    if (filterParams.minPrice > DEFAULT_FILTERS.minPrice) {
      queryParams.append("minPrice", filterParams.minPrice.toString());
    }
    if (filterParams.maxPrice < DEFAULT_FILTERS.maxPrice) {
      queryParams.append("maxPrice", filterParams.maxPrice.toString());
    }
    if (filterParams.sort) {
      queryParams.append("sort", filterParams.sort);
    }

    queryParams.append("inStock", "true");

    return queryParams;
  }, []);

  const fetchProducts = useCallback(
    async (filterParams, page) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      setLoading(true);
      setError(null);

      try {
        const queryParams = buildQueryParams(filterParams, page);
        const url = `${API_BASE_URL}/api/products?${queryParams.toString()}`;

        const controller = new AbortController();
        abortControllerRef.current = controller;
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(url, {
          signal: controller.signal,
          headers: { "Content-Type": "application/json" },
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if (data.success) {
          let fetchedProducts = data.data || [];

          // Normalize image paths for each product
          fetchedProducts = fetchedProducts.map(product => ({
            ...product,
            images: Array.isArray(product.images)
              ? product.images.map(img => {
                  if (typeof img !== 'string') return '';
                  if (img.startsWith('http') || img.startsWith('/images/')) return img;
                  return `/images/${img}`;
                })
              : [],
          }));

          // Fallback client-side sorting
          if (filterParams.sort === "Price: Low to High") {
            fetchedProducts.sort((a, b) => a.price - b.price);
          } else if (filterParams.sort === "Price: High to Low") {
            fetchedProducts.sort((a, b) => b.price - a.price);
          } else if (filterParams.sort === "Newest") {
            fetchedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          } else if (filterParams.sort === "Most Popular") {
            fetchedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          }

          setProductData(fetchedProducts);
          setTotalProducts(data.pagination?.totalProducts || data.count || 0);
        } else {
          throw new Error(data.message || "Failed to fetch products");
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(
            error.message.includes("Failed to fetch")
              ? "Network error. Check your connection."
              : error.message
          );
          setProductData([]);
          setTotalProducts(0);
        }
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [buildQueryParams]
  );

  useEffect(() => {
    fetchProducts(filters, currentPage);
  }, [filters, currentPage, fetchProducts]);

  const handleApplyFilter = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback(
    (page) => {
      if (page < 1 || page > totalPages) return;
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [totalPages]
  );

  const handleRetry = () => fetchProducts(filters, currentPage);

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem('token');
    if (token) {
      // LOGGED IN: Add to backend cart
      try {
        const res = await fetch('http://localhost:5000/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            productId: product._id,
            quantity: 1,
            size: product.size || (product.sizes && product.sizes[0]) || null,
            color: product.color || (product.colors && product.colors[0]) || null
          })
        });
        if (!res.ok) {
          alert('Failed to add to cart');
          return;
        }
        window.dispatchEvent(new Event('cart-updated'));
        alert(`${product.name} added to cart!`);
      } catch (err) {
        alert('Network error while adding to cart');
      }
    } else {
      // GUEST: Add to localStorage
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find(
      (item) => item._id === product._id || item.id === product.id
    );
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
        // Find the first non-empty image
        let imageToSave = product.image;
        if (!imageToSave && Array.isArray(product.images)) {
          imageToSave = product.images.find(img => img && img !== '');
        }
        if (!imageToSave) {
          imageToSave = '/images/placeholder.png';
        }
        console.log('Add to cart product:', product);
        console.log('Add to cart product.images:', product.images);
        cart.push({
          ...product,
          image: imageToSave,
          quantity: 1
        });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event('cart-updated'));
    alert(`${product.name} added to cart!`);
    }
  };

  const products = useMemo(() => {
    return productData.map((item, index) => {
      const productId = item._id || item.id || `product-${index}`;
      const productImages =
        item.images?.length > 0
          ? item.images
          : item.image
          ? [item.image]
          : ["/placeholder.svg"];

      return {
        _id: productId,
        id: productId,
        name: item.name || `Product ${index + 1}`,
        price: item.price || 0,
        originalPrice: item.originalPrice,
        images: productImages,
        image: productImages[0],
        averageRating: item.rating || 0,
        rating: Math.round(item.rating || 0),
        reviewCount: item.numReviews || 0,
        isNew: item.isNew || false,
        category: Array.isArray(item.category)
          ? item.category
          : [item.category].filter(Boolean),
        size: Array.isArray(item.size)
          ? item.size
          : [item.size].filter(Boolean),
        color: Array.isArray(item.color)
          ? item.color
          : [item.color].filter(Boolean),
        description: item.description || "Product description",
        inStock: item.inStock !== false,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });
  }, [productData]);

  return (
    <>
      <Header />
      <div className="page-container">
        <ShopHeader onApplyEdits={handleApplyFilter} />
        <div className="px-4 py-6 mx-auto max-w-7xl">
          {loading && (
            <div className="centered">
              <div>
                <div className="spinner"></div>
                <p className="loading-text">Loading products...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="error-box">
              <p className="font-bold">Error:</p>
              <p>{error}</p>
              <div className="mt-4 space-x-2">
                <button onClick={handleRetry} className="retry-btn">
                  Retry
                </button>
                <button onClick={handleResetFilters} className="retry-btn">
                  Reset Filters
                </button>
              </div>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="mb-6">
                <h2 className="section-heading">Products</h2>
                <p className="subtext">
                  {totalProducts} product{totalProducts !== 1 ? "s" : ""} found
                  (Page {currentPage} of {totalPages})
                </p>
              </div>

              <div className="gap-1 desktop-grid">
                <div className="col-span-2">
                  <FilterSidebar
                    onApplyFilter={handleApplyFilter}
                    currentFilters={filters}
                    totalProducts={totalProducts}
                  />
                </div>
                <div className="col-span-3">
                  <div className="product-grid-3">
                    {products.map((product, index) => (
                      <ProductCard
                        key={`grid-${index}`}
                        product={product}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="xl:hidden">
                <div className="mb-4 flex items-center justify-between">
                  <button className="mobile-toggle-btn" onClick={toggleSidebar}>
                    {isSidebarOpen ? "Hide Filters" : "Show Filters"}
                  </button>
                  <span className="text-sm text-gray-600">
                    {totalProducts} product{totalProducts !== 1 ? "s" : ""}
                  </span>
                </div>
                {isSidebarOpen && (
                  <div className="sidebar-wrapper mb-6">
                    <FilterSidebar
                      onApplyFilter={handleApplyFilter}
                      currentFilters={filters}
                      totalProducts={totalProducts}
                    />
                  </div>
                )}
                <div className="mobile-grid">
                  {products.map((product, index) => (
                    <div key={`mobile-${index}`} className="flex justify-center">
                      <ProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {totalPages > 1 && (
                <div className="pagination-container">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
        <ShopFooter />
      </div>
      <Footer />
    </>
  );
}
