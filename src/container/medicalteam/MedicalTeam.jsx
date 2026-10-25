import React, { useState } from "react";
import "./medicalteam.css";
import images from "../../constants/images";

const MedicalTeam = ({ question, answer, isOpen, toggleAnswer }) => {
  return (
    <section className="section ws2_main_wrapp">
      <div className="medical-team-container">
        <h2>We Have a Medical Team You Can Trust</h2>
        <div className="medical-team-images">
          <div className="image-item">
            <img
              src={images.medicalTeam1}
              alt="Real doctors, real medication"
            />
            <p>Real doctors, real medication</p>
          </div>
          <div className="image-item">
            <img
              src={images.medicalTeam2}
              alt="Proven treatments high-quality medications"
            />
            <p>Proven treatments high-quality medications</p>
          </div>
          <div className="image-item">
            <img
              src={images.medicalTeam3}
              alt="Fast free delivery if approved for a prescription"
            />
            <p>Fast free delivery if approved for a prescription</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MedicalTeam;
