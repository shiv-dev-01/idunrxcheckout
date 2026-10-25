import React from "react";
import "./WeightLoss.css";
import { Footer, Navbar } from "../../common";
import {
  Compounded,
  FAQList,
  GPL1Medications,
  Glp1,
  MedicalTeam,
  Prescription,
  WeightHero,
  WeightSec2,
} from "../../container";
import images from "../../constants/images";

const WeightLoss = () => {
  return (
    <div>
      <Navbar />
      <WeightHero />
      <WeightSec2 />
      <Glp1 />
      <GPL1Medications />
      <Compounded />
      <Prescription />
      <MedicalTeam />
      <section className="section ws2_main_wrapp section-faq">
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={images.section_images_1} alt="" className="faq_img" />
          <FAQList />
        </div>
      </section>
    </div>
  );
};

export default WeightLoss;
