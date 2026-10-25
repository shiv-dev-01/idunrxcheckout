// src/components/ProductCard.js
import React from "react";
import "./ProductCard.css";
import { Link } from "react-router-dom";

const ProductCard = () => {
  return (
    <div className="product-card">
      <div className="product-info">
        <h3 className="product-title">Weight Loss</h3>
        <p className="product-description">
          Level Up Meds offer affordable GLP-1 treatment options to help you
          control your weight.
        </p>
        {/* <div className="product-card-hr"></div> */}
        {/* <h2 className="product-price">$60.00</h2> */}
        {/* <p className="product-subtext">with 3 month shipment</p> */}
        <Link to="/FlowPage" className="product-button">
          START YOUR FREE VISIT
        </Link>
      </div>
      <div className="product-image-container">
        <img
          src="https://levelupmeds.com/wp-content/uploads/2024/01/Image-23-copy-1.png"
          alt="Valacyclovir Bottle"
          className="product-image"
        />
      </div>
    </div>
  );
};

export default ProductCard;
