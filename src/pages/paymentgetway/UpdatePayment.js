import React, { useState, useEffect } from "react";
import "./paymentgetway.css";
import axios from "axios";
import { FaCheck } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaTruck } from "react-icons/fa";

import useNotification from "../../utils/useNotification";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Loading, Navbar, Navbar2 } from "../../common";
import {
  add_user_check_product,
  cheke_state,
  get_product_details,
} from "../../utils/Constant";
import images from "../../constants/images";
import { RiContactsFill } from "react-icons/ri";
import { MdOutlinePayment } from "react-icons/md";

const UpdatePayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const name_data = location.state?.name_data;

  const handleGoBack = () => {
    navigate(-1); // This will navigate to the previous page
  };

  const [isloading, setIsLoading] = useState(false);
  const [getdata, setdata] = useState({});
  const [email, setEmail] = useState(name_data?.email);
  const [firstName, setFirstName] = useState(name_data?.first_name);
  const [lastName, setLastName] = useState(name_data?.last_name);
  const [address, setAddress] = useState("");
  const [aptSuite, setAptSuite] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("United States");
  const [getstate, setState] = useState([]);
  const [postalCode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(name_data?.phone);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("FREE SHIPPING");
  const [getcardid, setCardid] = useState(1);
  const [cardNumber, setCardNumber] = useState("");
  const [cardholdername, setcardholdername] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [exMonth, setExMonth] = useState("");
  const [exYear, setExYear] = useState("");
  const [cvv, setCvv] = useState("");
  const validateEmail = (email) => {
    // Basic email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  const { notifySuccess, notifyError } = useNotification();

  const product = location.state?.product;
  const contact_details_id = location.state?.contact_details_id;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
    console.log("location.state", location.state);
    console.log("id", id);
    // FetchProduct(id);
  }, []);

  const [getallCitys, setAllCitys] = useState([]);
  const [getselectedState, setSelectedState] = useState({
    name: "",
    state_code: "",
  });
  const [getselectedStateCode, setSelectedStateCode] = useState({
    name: "",
    state_code: "",
  });

  const checkout_api = async () => {
    if (cardholdername === "" || cardholdername === null) {
      notifyError("Please enter Card holder name.");
      return;
    } else if (cardNumber === "" || cardNumber === null) {
      notifyError("Please enter Card Number.");
      return;
    } else if (cardNumber.length < 16) {
      notifyError("Please enter valid Card Number.");
      return;
    } else if (expiryDate === "" || expiryDate === null) {
      notifyError("Please enter Expiry Date.");
      return;
    } else {
      // Split the expiry date into month and year
      const [month, year] = expiryDate.split("/");

      // Check if the month and year are valid
      if (!month || !year || month.length !== 2 || year.length !== 2) {
        notifyError(
          "Invalid format. Please enter the expiry date in MM/YY format."
        );
        return;
      }

      // Check if the month is valid (between 01 and 12)
      if (parseInt(month, 10) < 1 || parseInt(month, 10) > 12) {
        notifyError("Invalid month. Please enter a valid month (01-12).");
        return;
      }

      // Check if the year is valid (current year or future year)
      const currentYear = new Date().getFullYear() % 100; // Get last 2 digits of current year
      if (parseInt(year, 10) < currentYear) {
        notifyError("Invalid year. Please enter a valid future year.");
        return;
      }
    }

    if (cvv === "" || cvv === null) {
      notifyError("Please enter CVV.");
      return;
    } else if (cvv.length < 3) {
      notifyError("Please enter valid CVV.");
      return;
    } else {
      setIsLoading(true);
      const param = {
        order_id: id,
        creditCardNumber: cardNumber,
        ex_month: exMonth,
        ex_year: exYear,
        CVV: cvv,
        // card_holder_name: cardholdername,
        // zip_code: postalCode,
        // state_name: getselectedStateCode,
        // first_name: firstName,
        // last_name: lastName,
        // product_id: id,
        // form_id: product?.form_id,
        // address: address,
        // city_name: city,
        // phone: phoneNumber,
        // contact_details_id: contact_details_id,
      };

      console.log("123", param);

      await axios
        .post(
          "https://panel.whitelabelmd.com/telehealthmedrx/api/update_order_payment_token",
          param
        )
        .then((Response) => {
          setIsLoading(false);
          if (Response.data.status == 1) {
            setIsLoading(false);
            window.location.assign(`https://mplive.wlmd.dev/member.vitalmedsrx.com/dashboard`);
          } else {
            setIsLoading(false);
          }
          console.log("====================================");
          console.log(
            "club_get_all_partner_with_benifit res =>",
            Response.data
          );
          console.log("====================================");
        })
        .catch((error) => {
          setIsLoading(false);
          console.log("eeror------>", error);
        });
    }
  };

  const handleCardChange = (event) => {
    const cardValue = parseInt(event.target.value);
    setCardid(cardValue);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    // Only set the CVV if the length is 3 or less and it's numeric
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setCvv(value);
    }
  };

  const formatCardNumber = (cardNumber) => {
    // Add spaces every 4 characters
    return cardNumber.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  if (isloading) {
    return (
      <div style={{ height: "97vh" }}>
        <Loading />
      </div>
    );
  }

  return (
    <>
      <Navbar2 color="#fff" logo={images.logo} />
      <div className="payment-container">
        <br />
        <div className="payment-content">
          <div
            className="payment-header_p"
            style={{
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <a
              href="https://mplive.wlmd.dev/member.vitalmedsrx.com/dashboard"
              // style="width: 25px; height: 25px; margin-right: 20px;"
              style={{ width: "25px", height: "25px" }}
            >
              {/* <img style="width: 20px; height: 20px;" src="./left-arrow.png"> */}
              <FaArrowLeftLong size={20} color="#000" />
            </a>
            <p className="paymen_p_tag" style={{ marginBottom: "0px" }}>
              Update Payment Details
            </p>
            {/* <p className="back_menu" onClick={handleGoBack}>
              <FaArrowLeftLong /> back to product
            </p> */}
          </div>
          <div className="payment-content2">
            {/* onSubmit={handleSubmit} */}
            <div className="checkout-form">
              {/* <p>All transactions are secure and encrypted.</p> */}
              <br />
              <div className="payment_card">
                <div className="payment_card_titel">
                  <b>
                    <MdOutlinePayment />
                    Payment Methods
                  </b>
                  <div className="card_icon_div">
                    <img
                      src={images.visa}
                      className="item_img_card"
                      alt="Headphones"
                    />
                    <img
                      src={images.master}
                      className="item_img_card"
                      alt="Headphones"
                    />
                    <img
                      src={images.jcb}
                      className="item_img_card"
                      alt="Headphones"
                    />
                    <img
                      src={images.american}
                      className="item_img_card"
                      alt="Headphones"
                    />
                  </div>
                </div>
                <div className="details-card">
                  <div className="form-group">
                    <select
                      className="card-dropdown"
                      onChange={handleCardChange}
                      value={getcardid}
                    >
                      <option value={1}>Visa</option>
                      <option value={2}>MasterCard</option>
                      <option value={3}>Discover</option>
                      <option value={4}>American Express</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Card holder name"
                      className="card-number"
                      value={cardholdername}
                      onChange={(e) => setcardholdername(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="card-number"
                      value={formatCardNumber(cardNumber)}
                      onChange={(e) => {
                        const input = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                        if (input.length <= 16) {
                          setCardNumber(input);
                        }
                      }}
                    />
                  </div>
                  <div className="form-group-inline">
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="expiry-date"
                        value={expiryDate}
                        onChange={(e) => {
                          let input = e.target.value;
                          // Remove non-numeric characters except "/"
                          input = input.replace(/\D/g, "");

                          // Ensure input is limited to 4 characters (MMYY format)
                          if (input.length > 4) {
                            input = input.slice(0, 4);
                          }

                          // Extract MM and YY
                          const month = input.slice(0, 2);
                          const year = input.slice(2, 4);

                          // Update state for ex_month and ex_year
                          setExMonth(month);
                          setExYear(year);

                          // Format input to display MM/YY in the input field
                          setExpiryDate(
                            month + (year.length > 0 ? "/" + year : "")
                          );
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="CVV"
                        className="cvv"
                        value={cvv}
                        onChange={handleChange}
                        maxLength={3}
                      />
                    </div>
                  </div>
                  <div className="note_titel_">
                    {/* <p>
                      By clicking "Complete Checkout" below, I agree to the{" "}
                      <span className="terms_policy">Terms of Sale</span> and{" "}
                      <span className="terms_policy">Privacy Policy</span>.
                    </p> */}
                  </div>
                  <center>
                    <button className="btn-checkout" onClick={checkout_api}>
                      Update
                    </button>
                  </center>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdatePayment;
