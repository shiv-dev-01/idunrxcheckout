import React from "react";
import "./Glp1.css";
import images from "../../constants/images";

const Glp1 = () => {
  return (
    <section className="section glp1_main_wrapp">
      <h2>GLP-1's have benn featured in</h2>
      <div className="glp1_logos_wrapp">
        <img src={images.Forbes_logo} alt="" />
        <img src={images.NBC_logo} alt="" />
        <img src={images.fox_logo} alt="" />
        <img src={images.wsj_logo} alt="" />
        <img src={images.yahoo_logo} alt="" />
        <img src={images.The_New_York_Times_logo} alt="" />
      </div>
    </section>
  );
};

export default Glp1;
