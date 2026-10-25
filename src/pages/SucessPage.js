import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Navbar, Navbar2 } from "../common";
import images from "../constants/images";

const SucessPage = () => {
  return (
    <>
      <Navbar2 color="#fff" logo={images.logo} />
      <Wrapper className="page-100" style={{ background: "white" }}>
        <section>
          <h1 className="h3_in_mobile" style={{ color: "black" }}>
            Thank You
          </h1>
          <h3
            style={{
              display: "block",
              textAlign: "center",
              width: "70%",
              // marginBottom: "2rem",
              margin: "2rem auto",
              minWidth: "300px",
            }}
          >
            Thank you for placing your purchase order with us! We are grateful
            for your business and excited to assist you. To ensure a smooth and
            efficient process, please complete the intake form available in your
            member portal at your earliest convenience.
          </h3>
          <h3
            style={{
              display: "block",
              textAlign: "center",
              width: "70%",
              // marginBottom: "2rem",
              margin: "2rem auto",
              minWidth: "300px",
              color: "#000",
              fontSize: "1.2rem",
            }}
          >
            (Your credentials have been sent to the email address you provided.
            Please check your inbox for further instructions.)
          </h3>
          <a
            href="https://member.vitalmedsrx.com/"
            className="product-button"
            style={{ marginTop: "2rem" }}
          >
            Go to Member Portal
          </a>
        </section>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.main`
  background: #ffefba;
  background: -webkit-linear-gradient(to right, #ffefba, #ffffff);
  background: linear-gradient(to right, #ffefba, #ffffff);

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 90vh;
  h1 {
    font-size: 10rem;
    font-weight: 700;
  }
  h3 {
    text-transform: none;
    margin-bottom: 2rem;
  }
  .h3_in_mobile {
    font-size: 9rem;
  }

  @media screen and (max-width: 720px) {
    h1 {
      font-size: 4rem;
    }
    .h3_in_mobile {
      font-size: 5rem;
    }
  }
`;

export default SucessPage;
