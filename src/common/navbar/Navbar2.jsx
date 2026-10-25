import React, { useEffect, useState } from "react";
import "./Navbar.css"; // We'll define this CSS file later
import images from "../../constants/images";
import { useNavigate } from "react-router-dom";

const Navbar2 = ({ color, logo }) => {
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
    console.log("window.location.host", window.location.host);
    console.log("logo2", logo);
  }, []);

  return (
    <nav
      className="navbar"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--clr-card-bg)",
        borderBottom: "1px solid var(--clr-border)",
      }}
    >
      <div
        className="navbar-brand"
      >
        <img src={logo} alt="idunrx" className="logo" />
      </div>
    </nav>
  );
};

export default Navbar2;
