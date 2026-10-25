import React, { useRef, useState } from "react";
import "./home.css";
import { Link } from "react-router-dom";
import FAQList from "../faq/Faq";
import images from "../../constants/images";
import Medicalteam from "../medicalteam/MedicalTeam";

const Home = () => {
  return (
    <div className="home-container">
      <Medicalteam></Medicalteam>
      <br /> <br /> <br />
      <div className="faq_tag">
        <img src={images.section_images_1} alt="" width="95%" />
        <FAQList></FAQList>
        <h2 className="add_res">Additional Resources</h2>
        <hr width="30%" />
        <p>FDA LABEL:</p>
        <a
          href="https://www.accessdata.fda.gov/drugsatfda_docs/label/2023/215256s007lbl.pdf"
          target="_blank"
          className="link_tag"
        >
          FDA PRESCRIBING LABEL-SEMAGLUTIDE
        </a>
        <br />
        <a
          href="https://pi.lilly.com/us/zepbound-uspi.pdf"
          target="_blank"
          className="link_tag"
        >
          FDA PRESCRIBING LABEL-TIRZEPATIDE
        </a>
        <p>MEDLINE PLUS:</p>
        <a
          href="https://medlineplus.gov/druginfo/meds/a618008.html"
          target="_blank"
          className="link_tag"
        >
          MEDLINE PLUS-SEMAGLUTIDE
        </a>{" "}
        <br />
        <a
          href="https://medlineplus.gov/druginfo/meds/a622044.html?utm_source=mplusconnect&utm_medium=application"
          target="_blank"
          className="link_tag"
        >
          MEDLINE PLUS-TIRZEPATIDE
        </a>
        <br /> <br /> <br />
        <a
          href="https://levelupmeds.com/women/intake-weight-loss/"
          target="_blank"
          className="start_visit"
        >
          Start your free visit
        </a>
      </div>
    </div>
  );
};

export default Home;
