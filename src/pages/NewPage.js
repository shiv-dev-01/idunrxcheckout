import React, { useEffect, useState } from "react";

const NewPage = () => {
  const [paymentToken, setPaymentToken] = useState("");
  const [isCardValid, setIsCardValid] = useState(false);
  const [isSdkReady, setIsSdkReady] = useState(false);

  // Initialize the Sticky.io SDK after component mounts
  const initializeStickyIO = () => {
    const appId = "whitelabelmd"; // Replace with your actual appId

    if (window.stickyio) {
      window.stickyio.creditCardForm(
        appId,
        handleTokenSuccess,
        handleCardValidation,
        {
          formSelector: "#stickyio_card", // ID of the div where the card form will be rendered
        }
      );

      setIsSdkReady(true); // Set SDK as ready
    } else {
      console.error("Sticky.io SDK is not defined.");
    }
  };

  // Tokenization success handler
  const handleTokenSuccess = (card) => {
    setPaymentToken(card.payment_token);
    console.log("Token received:", card.payment_token);
    alert("Payment successfully completed");
  };

  // Tokenization error handler
  const handleTokenError = (errors) => {
    console.error("Tokenization error:", errors);
    alert(
      "Payment processing failed. Please check your card details and try again."
    );
  };

  // Card validation handler
  const handleCardValidation = (valid) => {
    console.log("Card validation status:", valid);
    setIsCardValid(valid);
  };

  // Form submission handler
  const paymentSubmit = () => {
    if (window.stickyio && isSdkReady) {
      console.log("Attempting to tokenize card");
      // Check if tokenizeCard function exists before calling it
      if (typeof window.stickyio.tokenizeCard === "function") {
        window.stickyio.tokenizeCard(); // Trigger tokenization when the user submits the form
      } else {
        console.error("tokenizeCard function is not available.");
      }
    } else {
      alert("Sticky.io SDK is not ready yet. Please try again later.");
    }
  };

  // Initialize SDK after component and #stickyio_card div is rendered
  useEffect(() => {
    const checkStickyIoReady = setInterval(() => {
      if (window.stickyio) {
        initializeStickyIO();
        clearInterval(checkStickyIoReady); // Stop checking once the SDK is ready
      }
    }, 100); // Check every 100ms

    // Cleanup the interval on component unmount
    return () => clearInterval(checkStickyIoReady);
  }, []);

  return (
    <div>
      <style>
        {`
          /* Custom CSS rules for the payment form */
          #stickyio_cc_number {
            color: blue;
          }
          #stickyio_cc_expiry {
            color: green;
          }
          #stickyio_cc_cvv {
            color: red;
          }
        `}
      </style>
      <h1>Sticky.io Payment Integration</h1>

      {/* Payment form */}
      <form id="stickyio_order_form" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label>Token: </label>
          <input
            type="text"
            name="payment_token"
            id="stickyio_payment_token"
            value={paymentToken}
            readOnly
          />
        </div>

        {/* Include the sticky.io card form container */}
        <div id="stickyio_card"></div>

        {/* Payment submission button */}
        <button
          className="stickyio-btn"
          id="stickyio_submit"
          onClick={paymentSubmit}
          disabled={!isCardValid} // Disable button if card is not valid
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
};

// The self-executing function for stickyio
const stickyio = (function () {
  const iframeUrl = `https://cdn.sticky.io/jssdk/iframe/index.html?appKey=whitelabelmd`;

  const creditCardForm = function (
    appId,
    cardCallback,
    cardValidationCallback
  ) {
    const cardContainer = document.getElementById("stickyio_card");
    const submitButton = document.getElementById("stickyio_submit");

    // Create an iframe only if it doesn't already exist
    let iframe = cardContainer.querySelector("iframe");
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.setAttribute("src", iframeUrl);
      iframe.className = "stickyio-iframe";
      cardContainer.appendChild(iframe); // Append the iframe to the existing #stickyio_card div
    }

    const readOnly = function (container = true, button = true) {
      cardContainer.className = container ? "read-only" : "";
      submitButton.className = button
        ? "stickyio-btn read-only"
        : "stickyio-btn";
    };

    // Submit button functionality for tokenization
    if (submitButton) {
      submitButton.className = "stickyio-btn read-only";
      submitButton.onclick = () => {
        readOnly();
        console.log("Sending tokenize request to iframe");
        iframe.contentWindow.postMessage(
          {
            app_id: appId,
            tokenize: true,
          },
          "*"
        );
      };
    }

    // Iframe onload event to initialize card form
    iframe.onload = () => {
      console.log("Iframe loaded");
      iframe.contentWindow.postMessage({ app_id: appId }, "*");
    };

    // Listen for postMessage from iframe (for card token and validation)
    window.addEventListener(
      "message",
      (e) => {
        if (e.data) {
          console.log("Message received from iframe:", e.data);

          // Handle card token received from iframe
          if (e.data.card !== undefined) {
            readOnly(false, true);
            cardCallback(e.data.card);
          }

          // Handle card validation status received from iframe
          if (e.data.valid !== undefined) {
            readOnly(false, !e.data.valid);
            cardValidationCallback(e.data.valid);
          }
        }
      },
      false
    );
  };

  // Append custom styles for the sticky.io iframe and buttons
  function appendStyles() {
    const style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = `
      .stickyio-btn {
        margin: 0;
        padding: 1em 2em;
        font-size: 14px;
        border: none;
        background-color: #3cb4e5;
        border-radius: 4px;
        cursor: pointer;
        color: white;
        box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.25);
        font-weight: bold;
      }

      .stickyio-btn:hover {
        background-color: #2ca4d5;
      }

      .stickyio-btn:active {
        box-shadow: none;
      }

      .stickyio-iframe {
        border: 0;
        width: 420px;
        height: 115px;
      }

      .read-only {
        opacity: 0.5;
        pointer-events: none;
      }
    `;
    document.getElementsByTagName("head")[0].appendChild(style);
  }

  appendStyles();

  return {
    version: "1.0.0.3",
    creditCardForm: creditCardForm,
  };
})();

// Expose stickyio globally
window.stickyio = stickyio;

export default NewPage;
