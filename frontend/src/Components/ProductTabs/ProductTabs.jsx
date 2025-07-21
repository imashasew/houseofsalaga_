import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import './ProductTabs.css';

const ProductTabs = () => {
  const { id } = useParams();

  return (
    <div className="tabs-container">
      <div className="product-tabs">
        <NavLink
          to={`/product/${id}`}
          end
          className={({ isActive }) => isActive ? "tab active" : "tab"}
        >
          Description
        </NavLink>
        <NavLink
          to={`/product/${id}/review`}
          className={({ isActive }) => isActive ? "tab active" : "tab"}
        >
          Reviews
        </NavLink>
        <NavLink
          to={`/product/${id}/returns`}
          className={({ isActive }) => isActive ? "tab active" : "tab"}
        >
          Returns
        </NavLink>
      </div>
    </div>
  );
};

export default ProductTabs;