import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Link } from "react-router-dom";
import { Navbar2 } from "../common";
import images from "../constants/images";

// Global styles to remove scroll and fix height/width
const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    height: 100%;
    width: 100%;
  }
`;

const ErrorPage = () => {
  return (
    <>
      <GlobalStyle />
      <Navbar2 color="#fff" logo={images.logo} />
      <Wrapper>
        <section>
          <h1>404</h1>
          <h3>(Page not found)</h3>
          {/* Optional Button */}
          {/* <Link to="/" className="product-button" style={{ marginTop: "2rem" }}>
            Go to Home
          </Link> */}
        </section>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.main`
  background: var(--clr-bg);
  color: var(--clr-text);

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  height: calc(100vh - 80px); /* Adjust if Navbar2 height differs */
  width: 100vw;
  overflow: hidden;

  section {
    width: 100%;
  }

  h1 {
    font-size: 10rem;
    font-weight: 700;
    margin: 0;
    color: var(--clr-text);
  }

  h3 {
    text-transform: none;
    margin: 2rem auto;
    width: 70%;
    min-width: 300px;
    color: var(--clr-text-secondary);
  }

  @media screen and (max-width: 720px) {
    h1 {
      font-size: 4rem;
    }

    h3 {
      width: 90%;
    }
  }
`;

export default ErrorPage;
