import React, { useEffect, useState } from "react";
import "./Navbar.css"; // We'll define this CSS file later
import images from "../../constants/images";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const Navigate = useNavigate();

  useEffect(() => {
    console.log("window.location.host", window.location.pathname);
  }, []);

  return (
    <nav className="navbar">
      {/* <ul className={menuOpen ? "nav-links open" : "nav-links"}>
        <li
          className="nav-item"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <a href="#" onClick={handleDropdownToggle}>
            What We Treat
          </a>
          <div className="dropdown">
            <div className="dropdown-content">
              <div className="dropdown-section">
                <h3>Men</h3>
                <ul>
                  <li>
                    <a href="#">Acid Reflux</a>
                  </li>
                  <li>
                    <a href="#">Cold Sores</a>
                  </li>
                  <li>
                    <a href="#">Erectile Dysfunction</a>
                  </li>
                  <li>
                    <a href="#">Hair Loss</a>
                  </li>
                  <li>
                    <a href="#">Herpes</a>
                  </li>
                  <li>
                    <a href="#">Premature Ejaculation</a>
                  </li>
                  <li>
                    <a href="#">Stop Smoking</a>
                  </li>
                </ul>
              </div>
              <div className="dropdown-section">
                <h3>Women</h3>
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
            </div>
          </div>
        </li>
        <li className="nav-item">
          <a href="#">FAQ</a>
        </li>
        <li className="nav-item">
          <a href="#">Contact Us</a>
        </li>
      </ul> */}
      <div style={{ flex: "0.3" }} className="nav_eampy_div"></div>
      <div
        className="navbar-brand"
        onClick={() => {
          Navigate("/");
        }}
      >
        <img src={images.logo} alt="idunrx" className="logo" />
      </div>
      <div className="navbar-signin">
        <a
          href="member.vitalmedsrx.com/"
          target="_blank"
          className="product-button"
        >
          Sign In
        </a>
      </div>
      <div className="hamburger" onClick={handleMenuToggle}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
    </nav>
  );
};

export default Navbar;
