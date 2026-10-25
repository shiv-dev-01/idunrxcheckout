import React, { useState, useEffect } from "react";
import "./paymentgetway.css";
import axios from "axios";

import useNotification from "../../utils/useNotification";
import { useLocation, useNavigate } from "react-router-dom";
import { Loading, Navbar, Navbar2 } from "../../common";
import { add_user_check_product, cheke_state } from "../../utils/Constant";

const PaymentGetways = () => {
  const [isloading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [aptSuite, setAptSuite] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("United States");
  const [getstate, setState] = useState([]);
  const [postalCode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
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

  const location = useLocation();
  const Navigate = useNavigate();

  // let { product } = location.state || { from: { pathname: "/" } };

  const product = location.state.product;
  console.log("123product", location.state.product);

  const fetchStates = async () => {
    try {
      const res = await axios.post(
        "https://mpdev-wlmdbackend.wlmd.dev/wlmdbackend/api/get_all_states",
        {
          country: "United States",
        }
      );
      console.log("sfsdcs---->", res.data);
      setState(res.data.data.states);
    } catch (err) {
      console.error("Error fetching states:", err);
    }
  };

  useEffect(() => {
    fetchStates();
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

  const handleStateChange = async (value) => {
    // setIsLoading(true);
    var params = {
      state_name: value,
    };
    await axios
      .post(cheke_state, params)
      .then((res) => {
        // setIsLoading(false);
        const data = res.data;
        if (data.status === 0) {
          setSelectedState({
            name: "",
            state_code: "",
          });
          setSelectedStateCode({
            name: "",
            state_code: "",
          });
          setAllCitys([]);
          notifyError(data.message);
        } else {
          AllCitys(value);
        }
      })
      .catch((err) => {
        console.log("err", err);
        // setIsLoading(false);
      });
  };

  const AllCitys = async (state) => {
    await axios
      .post("https://countriesnow.space/api/v0.1/countries/state/cities", {
        country: "United States",
        state: state,
      })
      .then((res) => {
        const data = res.data.data;
        console.log("citys", res.data.data);
        setAllCitys(data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const checkout_api = async () => {
    if (email === "" || email === null) {
      notifyError("Please enter Email Address.");
      return;
    } else if (!validateEmail(email)) {
      notifyError("Please enter a valid Email Address.");
      return;
    } else if (firstName === "" || firstName === null) {
      notifyError("Please enter First Name.");
      return;
    } else if (lastName === "" || lastName === null) {
      notifyError("Please enter Last Name.");
      return;
    } else if (address === "" || address === null) {
      notifyError("Please enter Address.");
      return;
    } else if (city === "" || city === null) {
      notifyError("Please enter City.");
      return;
    } else if (getselectedStateCode === "" || getselectedStateCode === null) {
      notifyError("Please select State.");
      return;
    } else if (postalCode === "" || postalCode === null) {
      notifyError("Please enter Postal Code.");
      return;
    } else if (phoneNumber === "" || phoneNumber === null) {
      notifyError("Please enter Phone Number.");
      return;
    } else if (phoneNumber.length < 10) {
      notifyError("Please enter valid Phone Number.");
    } else if (cardholdername === "" || cardholdername === null) {
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
    } else if (cvv === "" || cvv === null) {
      notifyError("Please enter CVV.");
      return;
    } else if (cvv.length < 3) {
      notifyError("Please enter valid CVV.");
    } else {
      setIsLoading(true);
      const param = {
        email: email,
        card_type: getcardid,
        card_no: cardNumber,
        ex_month: exMonth,
        ex_year: exYear,
        cvv_no: cvv,
        card_holder_name: cardholdername,
        zip_code: postalCode,
        state_name: getselectedStateCode,
        first_name: firstName,
        last_name: lastName,
        product_id: product.product_id,
        form_id: product.form_id,
        address: address,
        city_name: city,
        phone: phoneNumber,
      };

      console.log("123", param);

      await axios
        .post(add_user_check_product, param)
        .then((Response) => {
          setIsLoading(false);
          if (Response.data.status == 1) {
            setIsLoading(false);
            Navigate("/SuccessPage");
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
  const [validEmail, setValidEmail] = useState(true);

  const handleEmailChange = (e) => {
    const input = e.target.value;
    setEmail(input);

    // Basic email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(input);

    setValidEmail(isValid);
  };

  if (isloading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar2 />
      <div className="payment-container">
        {/* <div className="payment-header">
        <p>Cart &gt; Checkout</p>
      </div> */}

        <div className="payment-content">
          {/* onSubmit={handleSubmit} */}
          <div className="checkout-form">
            <h3>Contact Information</h3>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={handleEmailChange}
                style={{
                  border: validEmail ? "1px solid #ccc" : "1px solid red",
                }}
              />
              {!validEmail && (
                <p style={{ color: "red" }}>
                  Please enter a valid email address.
                </p>
              )}
            </div>

            <h3>Shipping Information</h3>
            <div className="form-group-inline">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="form-group">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option>United States</option>
                {/* Add more country options here */}
              </select>
            </div>

            <div className="form-group-inline">
              <div className="inline_seond">
                <select
                  value={getselectedState.name}
                  // value={JSON.stringify({
                  //   name: getselectedState.name,
                  //   state_code: getselectedState.state_code,
                  // })}
                  onChange={(e) => {
                    const selectedState = JSON.parse(e.target.value);
                    setSelectedState(selectedState.name);
                    setSelectedStateCode(selectedState.state_code);
                    handleStateChange(selectedState.name);
                    console.log("getselectedStateCode", getselectedStateCode);
                  }}
                >
                  <option value={""}>Select state</option>
                  {getstate &&
                    getstate.map((states, index) => {
                      return (
                        <option
                          value={JSON.stringify({
                            name: states.name,
                            state_code: states.state_code,
                          })}
                        >
                          {states.name}
                        </option>
                      );
                    })}
                  {/* Add more state options here */}
                </select>
              </div>
              <div className="inline_seond">
                <select
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                  }}
                >
                  <option value={""}>Select city</option>

                  {getallCitys.map((city, index) => {
                    return <option value={city}>{city}</option>;
                  })}
                  {/* Add more state options here */}
                </select>
              </div>
              <div className="inline_seond">
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>
            <br />

            <div className="form-group">
              <input
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => {
                  const input = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                  if (input.length <= 10) {
                    setPhoneNumber(input);
                  }
                }}
              />
            </div>

            <h3>Payment Methods</h3>
            <p>All transactions are secure and encrypted.</p>
            <br />

            <div className="form-group">
              <select
                className="card-dropdown"
                onChange={handleCardChange}
                value={getcardid}
              >
                <option value={1}>Visa</option>
                <option value={2}>MasterCard</option>
                <option value={3}>Discover</option>
                <option value={4}>RuPay</option>
                <option value={5}>American Express</option>
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
                    setExpiryDate(month + (year.length > 0 ? "/" + year : ""));
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
            <p>
              By clicking "Complete Checkout" below, I agree to the{" "}
              <span className="terms_policy">Terms of Sale</span> and{" "}
              <span className="terms_policy">Privacy Policy</span>.
            </p>
            <button className="btn-checkout" onClick={checkout_api}>
              Complete Checkout
            </button>
          </div>
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="item">
              <div className="img_order">
                <img
                  src={product.product_img[0].img_video}
                  className="item_img"
                  alt="Headphones"
                />
              </div>
              <div className="img_order_del">
                <span>Compounded Semaglutide (2.5 mg/week)</span>
                <br />
                <span>Compounded Semaglutide (5 mg/week)</span>
                <p>Quantity: 1</p>
                <b>Price: $449</b>
              </div>
            </div>
            <hr className="hr" />
            <div className="details_order">
              <div className="total_div">
                <b>Grand Total</b>
                <p>$449</p>
              </div>
              <p>Provider & Medication Included </p>
              <p> On Demand Virtual Doctor Visits </p>
              <p> 30 Days Weight Loss Guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentGetways;
