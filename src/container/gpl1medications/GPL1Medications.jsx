import React from "react";
import "./GPL1Medications.css";
import images from "../../constants/images";
import { Link } from "react-router-dom";

const GPL1Medications = () => {
  return (
    <section className="section gpl_medications_section">
      <div className="content-container">
        <div className="text-content">
          <h2>What are GLP-1 Medications?</h2>
          <p>
            Semaglutide and Tirzepatide are prescription medications that are
            prescribed for weight loss and Type 2 Diabetes. They belong to a
            class of drugs called glucagon-like peptide-1 (GLP-1) receptor
            agonists. They mimic the action of GLP-1, a hormone that stimulates
            the release of insulin and reduces the amount of glucose produced by
            the liver. This helps lower blood sugar levels in people with
            diabetes. Semaglutide and Tirzepatide also reduce the speed at which
            food passes through the digestive system. Semaglutide and
            Tirzepatide prolong digestion, helping to maintain your feeling of
            fullness for a longer period. Therefore, when you take Semaglutide
            and Tirzepatide injections, you feel fuller faster and are less
            likely to overeat. This allows most people to lose up to 15% of
            their bodyweight or more over a number of months.
          </p>

          <Link to="/FlowPage" className="product-button">START YOUR FREE VISIT</Link>
        </div>
        <div className="image-content">
          <h2>What are GLP-1 Medications?</h2>

          <img src={images.gpl_girl_img} alt="GLP-1 Medication" />
        </div>
      </div>
    </section>
  );
};

export default GPL1Medications;
