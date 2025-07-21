import React, { useState } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import Sidebar from "../../Components/Sidebar/Sidebar";
import OrderTabs from "../../Components/OrderTabs/OrderTabs";
import OrderList from "../../Components/OrderList/OrderList";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import ReviewModal from "../../Components/ReviewModal/ReviewModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Package,
  CalendarDays,
  Truck,
  DollarSign,
  Hash,
  X,
  CheckSquare,
} from "lucide-react";

import "./Dashboard.css";

export default function Dashboard() {
  const [selectedStatus, setSelectedStatus] = useState("In Process");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState("productName");

  const [showModal, setShowModal] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null);

  const handleSortChange = (type) => {
    setFilterType(type);
    setShowFilter(false);
  };

  const handleOpenModal = (order) => {
    setReviewProduct(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setReviewProduct(null);
  };

const handleSubmitReview = async (formData) => {
  try {
    const data = new FormData();
    data.append("productId", formData.orderId);      // ✅ Backend expects `productId`
    data.append("rating", formData.rating);
    data.append("review", formData.review);
    data.append("productName", formData.productName); // ✅ Include product name

    data.append("user", "guest");                    // Optional but included for consistency

    if (formData.image) {
      data.append("image", formData.image);
    }

    const res = await fetch("http://localhost:5000/api/order-reviews", {

      method: "POST",
      body: data,
    });

    if (res.ok) {
      toast.success("Review submitted successfully!");
    } else {
      const errText = await res.text();
      console.error("Server error:", errText);
      toast.error("❌ Failed to submit review");
    }
  } catch (err) {
    console.error("Review submit error:", err);
    toast.error("⚠️ Error submitting review");
  }
};


  return (
    <>
      <Header showUserMenu={showUserMenu} setShowUserMenu={setShowUserMenu} />

      <div className="dashboard">
        <Sidebar onMyAccountClick={() => setShowUserMenu(true)} />

        <div className="main-content">
          <div className="orders-headers">
            <h2>My Orders</h2>

            <div className="search-filter">
              <div className="search-wrapper">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder={`Search by ${filterType}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filter-container">
                <button
                  className="filter-btn"
                  onClick={() => setShowFilter(!showFilter)}
                >
                  Filter <FiFilter />
                </button>

                {showFilter && (
                  <div className="filter-dropdown animated-dropdown">
                    <div className="dropdown-header">
                      <span>Sort Options</span>
                      <button
                        className="close-btn"
                        onClick={() => setShowFilter(false)}
                      >
                        <X size={18} strokeWidth={2} />
                      </button>
                    </div>

                    <div
                      onClick={() => handleSortChange("productName")}
                      className="filter-option"
                    >
                      <div className="icon-text">
                        <Package size={18} strokeWidth={2} />
                        <span>Product Name</span>
                      </div>
                      {filterType === "productName" && (
                        <CheckSquare size={18} strokeWidth={2} />
                      )}
                    </div>

                    <div
                      onClick={() => handleSortChange("orderNumber")}
                      className="filter-option"
                    >
                      <div className="icon-text">
                        <Hash size={18} strokeWidth={2} />
                        <span>Order Number</span>
                      </div>
                      {filterType === "orderNumber" && (
                        <CheckSquare size={18} strokeWidth={2} />
                      )}
                    </div>

                    <div
                      onClick={() => handleSortChange("date")}
                      className="filter-option"
                    >
                      <div className="icon-text">
                        <CalendarDays size={18} strokeWidth={2} />
                        <span>Order Date</span>
                      </div>
                      {filterType === "date" && (
                        <CheckSquare size={18} strokeWidth={2} />
                      )}
                    </div>

                    <div
                      onClick={() => handleSortChange("price")}
                      className="filter-option"
                    >
                      <div className="icon-text">
                        <DollarSign size={18} strokeWidth={2} />
                        <span>Price</span>
                      </div>
                      {filterType === "price" && (
                        <CheckSquare size={18} strokeWidth={2} />
                      )}
                    </div>

                    <div
                      onClick={() => handleSortChange("deliveryDate")}
                      className="filter-option"
                    >
                      <div className="icon-text">
                        <Truck size={18} strokeWidth={2} />
                        <span>Estimated Delivery</span>
                      </div>
                      {filterType === "deliveryDate" && (
                        <CheckSquare size={18} strokeWidth={2} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <OrderTabs
            selectedStatus={selectedStatus}
            onChangeStatus={setSelectedStatus}
          />

          <OrderList
            selectedStatus={selectedStatus}
            searchQuery={searchQuery}
            filterType={filterType}
            onWriteReview={handleOpenModal} // ✅ Pass modal trigger
          />

          {showModal && reviewProduct && (
  <ReviewModal
    product={reviewProduct}
    onClose={handleCloseModal}
    onSubmit={handleSubmitReview} // ✅ add this here
  />
)}

        </div>
      </div>

      <Footer />
      <ToastContainer position="top-center" autoClose={1000} />

    </>
  );
}
