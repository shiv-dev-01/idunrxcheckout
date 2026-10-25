import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <footer className="footer">
        {/* <div className="section footer-container">
          <div className="footer-column">
            <div className="footer-boldlinks-wrapp">
              <Link>About Us</Link>
              <Link>Contact Us</Link>
              <Link>FAQs</Link>
            </div>
          </div>
          <div className="footer-column">
            <h3>WHAT WE TREAT</h3>
            <ul>
              <li>
                <a href="#">Acid Reflux</a>
              </li>
              <li>
                <a href="#">Birth Control</a>
              </li>
              <li>
                <a href="#">Cold Sores</a>
              </li>
              <li>
                <a href="#">Hair Loss</a>
              </li>
              <li>
                <a href="#">Herpes</a>
              </li>
              <li>
                <a href="#">Stop Smoking</a>
              </li>
              <li>
                <a href="#">Weight Loss</a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>LEGAL</h3>
            <ul>
              <li>
                <a href="#">HIPAA Notice</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Returns & Refund Policy</a>
              </li>
              <li>
                <a href="#">Terms Of Use</a>
              </li>
              <li>
                <a href="#">CCPA Opt-Out</a>
              </li>
            </ul>
          </div>
        </div> */}
        <div className="footer-bottom">
          <p>© idunrx 2024 All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
