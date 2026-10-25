import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { Elements } from "@stripe/react-stripe-js";
import "./paymentgetway.css";
import "./rightside.css";
import axios from "axios";
import { FaAngleDown, FaAngleUp, FaCheck, FaLock } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaTruck } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";

import useNotification from "../../utils/useNotification";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Loading, Navbar, Navbar2 } from "../../common";
import {
  add_user_check_product,
  check_coupons,
  checkout_site_id,
  cheke_state,
  createOrder_test,
  createOrder_test_new,
  createOrder_stripe,
  get_checkout_link_data,
  get_product_details,
  get_product_details_v3,
  get_url_data,
  member_view,
  get_all_product_details_2,
} from "../../utils/Constant";
import images from "../../constants/images";
import { RiContactsFill, RiDiscountPercentLine } from "react-icons/ri";
import { MdOutlineCelebration, MdOutlinePayment } from "react-icons/md";
import { CiStar } from "react-icons/ci";
// import { loadGoogleTag } from "../../utils/gtag";
import { Stethoscope, Truck } from "lucide-react";
import {
  captureGoAffProReferrer,
  saveGoAffProOrderContext,
} from "../../utils/goaffpro";
import {
  extractCustomerIdFromApiResponse,
  extractOrderIdsFromApiResponse,
  identifyImpactUser,
  resolveImpactCustomerId,
} from "../../utils/impactCom";
import StripeCheckoutForm from "../../components/StripeCheckoutForm";
import {
  createStripePaymentIntent,
  resolveStripeRedirectFailureMessage,
  stripeAppearance,
  stripePromise,
  verifyStripePaymentSucceeded,
} from "../../utils/stripe";
import { buildCreateOrderStripeBody } from "../../utils/createOrderStripe";
import {
  parseCreateOrderResult,
  registerYourCoachAfterOrder,
} from "../../utils/yourCoachRegister";
import {
  cleanStripeReturnParamsFromUrl,
  clearCheckoutSnapshot,
  clearStripePaymentFailure,
  getStripeReturnParams,
  isPaymentIntentProcessed,
  isStripeReturnHandled,
  loadCheckoutSnapshot,
  loadStripePaymentFailure,
  markPaymentIntentProcessed,
  markStripeReturnHandled,
  persistStripePaymentFailure,
  saveCheckoutSnapshot,
} from "../../utils/stripeCheckoutSession";

/** API amounts may arrive as "1,008.00"; parseFloat("1,008.00") === 1. */
const parseMoneyAmount = (value) => {
  if (value == null || value === "") return 0;
  const n = parseFloat(String(value).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const calcDiscountedTotal = (price, discountPercent, discountAmount) => {
  const base = parseMoneyAmount(price);
  const percent = parseMoneyAmount(discountPercent);
  const amount = parseMoneyAmount(discountAmount);
  const total =
    discountPercent && String(discountPercent) !== "0.00" && percent > 0
      ? base - (base * percent) / 100
      : base - amount;
  return parseFloat(Math.max(0, total).toFixed(2));
};

const calcCouponSavings = (price, discountPercent, discountAmount) => {
  const base = parseMoneyAmount(price);
  return parseFloat(
    Math.max(0, base - calcDiscountedTotal(price, discountPercent, discountAmount)).toFixed(2)
  );
};

const Checkout2 = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };
  const navigate = useNavigate();
  const location = useLocation();
  const { ID } = useParams();
  console.log('id' , ID);

  const name_data = location.state?.name_data;

  const handleGoBack = () => {
    navigate(-1); // This will navigate to the previous page
  };

  const [isloading, setIsLoading] = useState(false);
  const [isemailLoading, setIsEmailLoading] = useState(false);
  const [iscityloading, setIsCityLoading] = useState(false);
  const [getdata, setdata] = useState({});
  const [getproducts, setProducts] = useState([]); // New state for multiple products
  const [getproductPrice, setProductPrice] = useState("");
  const [getcdata, setCdata] = useState({});
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
  const [id, setId] = useState(null);
  const [price, setPrice] = useState(null);
  const [getcampaignID, setCampaignID] = useState("");
  const [uniqueId, setUniqueId] = useState(null);
  const [defaultQuantity, setDefaultQuantity] = useState(1);
  const [getorder_id, setorder_id] = useState(null);
  const [getskipModel, setSkipModel] = useState(false);
  const [getthankyouURL, setThankyouURL] = useState("");
  const [orderSuccessModal, setOrderSuccessModal] = useState(null);

  const [discount_percent, setdiscount_percent] = useState(null);
  const [discount_amount, setdiscount_amount] = useState(null);
  const [ref, setRef] = useState(null);

  // section 2 conditions
  const [getsection2, setSection2] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true); // Default to same address

  //billing address start
  const [country2, setCountry2] = useState("");
  const [firstName2, setFirstName2] = useState("");
  const [lastName2, setLastName2] = useState("");
  const [address2, setAddress2] = useState("");
  const [city2, setCity2] = useState("");
  const [getselectedState2, setSelectedState2] = useState({
    name: "",
    state_code: "",
  });
  const [getselectedStateCode2, setSelectedStateCode2] = useState({
    name: "",
    state_code: "",
  });
  const [postalCode2, setPostalCode2] = useState("");
  const [phoneNumber2, setPhoneNumber2] = useState("");

  // promocode
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [error, setError] = useState("");
  
  // URL hash fragment (for affiliate tracking)
  const [urlHashFragment, setUrlHashFragment] = useState("");

  const handleApplyDiscount = async () => {
    setError(""); // Clear previous errors
    setApplyLoading(true); // Start loading
    try {
      const primary = getproducts[0] || {};
      const urlParams = new URLSearchParams(window.location.search);
      const productIdForCoupon = String(
        primary.product_id ||
          urlParams.get("product_ids")?.split(",")[0]?.trim() ||
          "",
      ).trim();

      if (!email?.trim()) {
        setApplyLoading(false);
        notifyError("Please enter your email before applying a promo code.");
        return;
      }
      if (!productIdForCoupon) {
        setApplyLoading(false);
        notifyError("Product not loaded. Please wait and try again.");
        return;
      }

      const response = await axios.post(check_coupons, {
        site_id: checkout_site_id,
        promo_codes: discountCode,
        product_id: productIdForCoupon,
        email: email.trim(),
      });

      // Check the API response status
      if (response.data.status == 1 || response.data.status === true) {
        setApplyLoading(false);
        console.log("responce.data", response.data);
        const couponData = response.data.data || {};
        setAppliedDiscount(couponData.code || discountCode); // Store applied code
        setdiscount_percent(
          response.data.discount_percent ??
            couponData.discount_percent ??
            0
        );
        setdiscount_amount(
          parseMoneyAmount(
            response.data.discount_amount ?? couponData.discount_amount
          )
        );
      } else {
        setApplyLoading(false);
        setAppliedDiscount(null);
        // setError("Invalid code");
        notifyError("Invalid code");
      }
    } catch (err) {
      setApplyLoading(false);

      setError("Something went wrong. Please try again.");
    }
  };
  // Remove discount handler
  const handleRemoveDiscount = () => {
    setDiscountCode(""); // Clear the discount code input
    setAppliedDiscount(null); // Reset applied discount state
    setdiscount_percent(0); // Reset discount percent
    setdiscount_amount(0); // Reset discount amount
  };

  // promocode end

  // Determine if a discount is applied
  const isDiscountApplied =
    parseMoneyAmount(discount_percent) > 0 ||
    parseMoneyAmount(discount_amount) > 0;

  // Total text logic
  const totalText = isDiscountApplied ? "Latest price" : "Your total";

  const [applyLoading, setApplyLoading] = useState(false);

  // Stripe payment
  const [stripeClientSecret, setStripeClientSecret] = useState(null);
  const [isCreatingPaymentIntent, setIsCreatingPaymentIntent] = useState(false);
  const [stripePaymentError, setStripePaymentError] = useState(null);
  const [showPaymentFailedModal, setShowPaymentFailedModal] = useState(false);
  const [paymentFailedMessage, setPaymentFailedMessage] = useState("");

  // check terms start
  const [isChecked, setIsChecked] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleCheckboxChange2 = () => {
    setIsChecked2(!isChecked2);
  };

  const smsConsentCheckboxStyle = {
    marginTop: "4px",
    marginRight: "8px",
    width: "12px",
    height: "12px",
    minWidth: "12px",
    padding: 0,
    cursor: "pointer",
    appearance: "auto",
    accentColor: "var(--clr-main)",
    flexShrink: 0,
  };

  const smsConsentLabelStyle = {
    fontSize: "14px",
    lineHeight: "1.5",
    fontWeight: "300",
  };

  // check terms end

  const validateEmail = (email) => {
    // Basic email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const { notifySuccess, notifyError } = useNotification();

  const product = location.state?.product;
  const contact_details_id = location.state?.contact_details_id;

  const fetchStates = async () => {
    try {
      const res = await axios.post(
        "https://panel.whitelabelmd.com/wlmdbackend/api/get_all_states",
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

  const FetchProduct = async (id, quantity = defaultQuantity) => {
    setIsLoading(true);
    console.log("FetchProduct called with id:", id);

    // Split product IDs if comma-separated
    const productIds = id.includes(",") ? id.split(",") : [id];
    console.log("Product IDs after splitting:", productIds);

    try {
      // Fetch details for each product
      const productPromises = productIds.map(async (productId) => {
        console.log("Fetching product details for ID:", productId);
        const params = {
          // product_id: productId.trim(),
          product_sku: productId.trim(),
        };

        const response = await axios.post(get_product_details_v3, params);
        console.log("Product API response for", productId, ":", response.data);
        if (response.data.status == 1) {
          return response.data.product_data;
        } else {
          console.error(`Failed to fetch product ${productId}`);
          return null;
        }
      });

      // Wait for all product details to be fetched
      const productDetails = await Promise.all(productPromises);
      console.log("All product details:", productDetails);

      // Filter out null results and set state
      const validProducts = productDetails.filter(
        (product) => product !== null
      );
      console.log("Valid products:", validProducts);

      if (validProducts.length > 0) {
        const qty = Math.max(1, parseInt(quantity, 10) || 1);
        const productsWithQty = validProducts.map((product) => ({
          ...product,
          quantity: product.quantity || qty,
        }));
        setProducts(productsWithQty);
        setdata(productsWithQty[0]); // Set first product as main data

        // Calculate total price
        const totalPrice = productsWithQty.reduce((sum, product) => {
          const lineQty = parseInt(product.quantity, 10) || 1;
          return sum + parseFloat(product.product_price || 0) * lineQty;
        }, 0);
        setProductPrice(totalPrice.toString());

        console.log("Products fetched and set:", validProducts);
        console.log("Total price:", totalPrice);
      } else {
        setdata({});
        setProducts([]);
        setProductPrice("");
        console.log("No valid products found");
        navigate("/ErrorPage");
      }

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log("FetchProduct error:", err);
    }
  };

  const FetchCdata = async (cdata) => {
    setIsLoading(true);
    await axios
      .post(get_url_data, {
        data: cdata,
      })
      .then((Response) => {
        setIsLoading(false);
        if (Response.data.status == 1) {
          setIsLoading(false);
          console.log("Response.data.decoded_data", Response.data.decoded_data);
          const data = Response.data.decoded_data;
          // console.log("data", data);

          setEmail(data?.email);
          setFirstName(data?.fname);
          setLastName(data?.lname);
          setPhoneNumber(data?.phone);
          const cdataCustomerId =
            data?.unique_id ||
            data?.uniqueId ||
            data?.customer_id ||
            data?.user_id ||
            data?.id;
          if (cdataCustomerId) setUniqueId(String(cdataCustomerId));
        } else {
          setIsLoading(false);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("eeror------>", error);
      });
  };

  useEffect(() => {
    const currentUrl = window.location.href;

    // Parse the URL to extract query parameters
    const params = new URLSearchParams(new URL(currentUrl).search);

    // Get the 'uniqueId' parameter (also accept unique_id alias)
    const id = params.get("uniqueId") || params.get("unique_id");
    const campionid = params.get("campaign_id");
    const qtyParam = params.get("qty");
    const parsedQty = qtyParam ? Math.max(1, parseInt(qtyParam, 10) || 1) : 1;
    setDefaultQuantity(parsedQty);

    const cdata = params.get("cdata");

    console.log("campionid", campionid);
    console.log("cdata", cdata);
    // Set the extracted 'uniqueId' to state
    setUniqueId(id);
    setCampaignID(campionid);

    const urlParams = new URLSearchParams(window.location.search);
    const idValue = urlParams.get("sku");
    const emailValue = urlParams.get("email");
    const ref = params.get('ref');

    // Extract hash fragment (e.g., #a_aid=wlmd_gokul) and store exactly as-is
    const hash = window.location.hash;
    if (hash) {
      // Store the hash fragment exactly as it appears in URL (including #)
      setUrlHashFragment(hash);
      console.log("URL hash fragment:", hash);
    }

    // Set the extracted ID and email in the state
    if (idValue) {
      setId(idValue);
    }
    if (emailValue) {
      setEmail(emailValue);
    }

    console.log("idValue", idValue);
    console.log("emailValue", emailValue);
    console.log(
      "URL format check - idValue type:",
      typeof idValue,
      "emailValue type:",
      typeof emailValue
    );

    // Fetch checkout link data and prefill form fields
    if (emailValue && idValue) {
      console.log("Both email and id present - calling get_checkout_link_data");
      // If both id and email are present, send both
      axios
        .post(get_checkout_link_data, { id: idValue, email: emailValue })
        .then((res) => {
          if (
            res.data.status === 1 &&
            res.data.data &&
            res.data.data.user_data
          ) {
            const user = res.data.data.user_data;
            const userCustomerId =
              user.unique_id ||
              user.uniqueId ||
              user.customer_id ||
              user.user_id ||
              user.id ||
              user.contact_details_id;
            if (userCustomerId) setUniqueId(String(userCustomerId));
            setEmail(user.email || "");
            setFirstName(user.first_name || "");
            setLastName(user.last_name || "");
            setPhoneNumber(user.phone || "");
            setAddress(user.address || "");
            setCity(user.city_name || "");
            setPostalCode(user.zip_code || "");
            // Set shipping state if present
            if (user.state_name) {
              // Check if states are loaded
              if (getstate.length > 0) {
                // Find the matching state in the states list
                const matchingState = getstate.find(
                  (state) =>
                    state.state_code === user.state_name ||
                    state.name === user.state_name
                );

                if (matchingState) {
                  setSelectedState({
                    name: matchingState.name,
                    state_code: matchingState.state_code,
                  });
                  setSelectedStateCode({
                    name: matchingState.name,
                    state_code: matchingState.state_code,
                  });
                  handleStateChange(matchingState.name);
                } else {
                  // Fallback if state not found in list
                  setSelectedState({
                    name: user.state_name,
                    state_code: user.state_name,
                  });
                  setSelectedStateCode({
                    name: user.state_name,
                    state_code: user.state_name,
                  });
                }
              } else {
                // If states not loaded yet, retry after a short delay
                setTimeout(() => {
                  const matchingState = getstate.find(
                    (state) =>
                      state.state_code === user.state_name ||
                      state.name === user.state_name
                  );

                  if (matchingState) {
                    setSelectedState({
                      name: matchingState.name,
                      state_code: matchingState.state_code,
                    });
                    setSelectedStateCode({
                      name: matchingState.name,
                      state_code: matchingState.state_code,
                    });
                    handleStateChange(matchingState.name);
                  }
                }, 1000);
              }
            }
            // Map card_type string to dropdown value (adjust as needed)
            let cardTypeValue = 1;
            if (user.card_type) {
              const type = user.card_type.toLowerCase();
              if (type === "visa") cardTypeValue = 1;
              else if (type === "mastercard") cardTypeValue = 2;
              else if (type === "discover") cardTypeValue = 3;
              else if (type === "american express" || type === "amex")
                cardTypeValue = 4;
            }
            setCardid(cardTypeValue);
            setCardNumber(user.card_no || "");
            setExMonth(user.ex_month || "");
            setExYear(user.ex_year || "");
            setExpiryDate(
              user.ex_month && user.ex_year
                ? `${user.ex_month}/${user.ex_year}`
                : ""
            );
            setCvv(user.cvv_no || "");
            setcardholdername(user.card_holder_name || "");
            // Products and prices
            if (user.product_id && Array.isArray(user.product_id)) {
              // Call FetchProduct to get detailed product information
              FetchProduct(user.product_id.join(","), parsedQty);
            }
            // Billing address (if present)
            if (user.billingSameAsShipping === "NO") {
              setSameAsShipping(false);
              // Set billing fields if you have them in your state
              setFirstName2(user.billingFirstName || "");
              setLastName2(user.billingLastName || "");
              setAddress2(user.billingAddress || "");
              setCity2(user.billingCity || "");
              setPostalCode2(user.billingZip || "");
              setPhoneNumber2(user.billingPhone || "");
              setSelectedState2({
                name: user.billingState || "",
                state_code: user.billingState || "",
              });
              setSelectedStateCode2({
                name: user.billingState || "",
                state_code: user.billingState || "",
              });
            } else {
              setSameAsShipping(true);
            }
          }
        })
        .catch((err) => {
          console.error("Failed to fetch checkout link data", err);
        });
    } else if (emailValue) {
      console.log(
        "Only email present - calling get_checkout_link_data with email only"
      );
      // If only email is present, send only email
      axios
        .post(get_checkout_link_data, { email: emailValue })
        .then((res) => {
          if (
            res.data.status === 1 &&
            res.data.data &&
            res.data.data.user_data
          ) {
            const user = res.data.data.user_data;
            const userCustomerId =
              user.unique_id ||
              user.uniqueId ||
              user.customer_id ||
              user.user_id ||
              user.id ||
              user.contact_details_id;
            if (userCustomerId) setUniqueId(String(userCustomerId));
            setEmail(user.email || "");
            setFirstName(user.first_name || "");
            setLastName(user.last_name || "");
            setPhoneNumber(user.phone || "");
            setAddress(user.address || "");
            setCity(user.city_name || "");
            setPostalCode(user.zip_code || "");
            // Set shipping state if present
            if (user.state_name) {
              // Check if states are loaded
              if (getstate.length > 0) {
                // Find the matching state in the states list
                const matchingState = getstate.find(
                  (state) =>
                    state.state_code === user.state_name ||
                    state.name === user.state_name
                );

                if (matchingState) {
                  setSelectedState({
                    name: matchingState.name,
                    state_code: matchingState.state_code,
                  });
                  setSelectedStateCode({
                    name: matchingState.name,
                    state_code: matchingState.state_code,
                  });
                  handleStateChange(matchingState.name);
                } else {
                  // Fallback if state not found in list
                  setSelectedState({
                    name: user.state_name,
                    state_code: user.state_name,
                  });
                  setSelectedStateCode({
                    name: user.state_name,
                    state_code: user.state_name,
                  });
                }
              } else {
                // If states not loaded yet, retry after a short delay
                setTimeout(() => {
                  const matchingState = getstate.find(
                    (state) =>
                      state.state_code === user.state_name ||
                      state.name === user.state_name
                  );

                  if (matchingState) {
                    setSelectedState({
                      name: matchingState.name,
                      state_code: matchingState.state_code,
                    });
                    setSelectedStateCode({
                      name: matchingState.name,
                      state_code: matchingState.state_code,
                    });
                    handleStateChange(matchingState.name);
                  }
                }, 1000);
              }
            }
            // Map card_type string to dropdown value (adjust as needed)
            let cardTypeValue = 1;
            if (user.card_type) {
              const type = user.card_type.toLowerCase();
              if (type === "visa") cardTypeValue = 1;
              else if (type === "mastercard") cardTypeValue = 2;
              else if (type === "discover") cardTypeValue = 3;
              else if (type === "american express" || type === "amex")
                cardTypeValue = 4;
            }
            setCardid(cardTypeValue);
            setCardNumber(user.card_no || "");
            setExMonth(user.ex_month || "");
            setExYear(user.ex_year || "");
            setExpiryDate(
              user.ex_month && user.ex_year
                ? `${user.ex_month}/${user.ex_year}`
                : ""
            );
            setCvv(user.cvv_no || "");
            setcardholdername(user.card_holder_name || "");
            // Products and prices
            if (user.product_id && Array.isArray(user.product_id)) {
              // Call FetchProduct to get detailed product information
              FetchProduct(user.product_id.join(","), parsedQty);
            }
            // Billing address (if present)
            if (user.billingSameAsShipping === "NO") {
              setSameAsShipping(false);
              // Set billing fields if you have them in your state
              setFirstName2(user.billingFirstName || "");
              setLastName2(user.billingLastName || "");
              setAddress2(user.billingAddress || "");
              setCity2(user.billingCity || "");
              setPostalCode2(user.billingZip || "");
              setPhoneNumber2(user.billingPhone || "");
              setSelectedState2({
                name: user.billingState || "",
                state_code: user.billingState || "",
              });
              setSelectedStateCode2({
                name: user.billingState || "",
                state_code: user.billingState || "",
              });
            } else {
              setSameAsShipping(true);
            }
          }
        })
        .catch((err) => {
          console.error("Failed to fetch checkout link data", err);
        });
    } else if (idValue) {
      // If only id is present, call FetchProduct directly with the id
      console.log("Only ID present, calling FetchProduct with:", idValue);
      FetchProduct(idValue, parsedQty);
    }

    // Handle multiple product IDs if passed as comma-separated values
    const productIds = urlParams.get("product_ids");
    if (productIds) {
      // If product_ids parameter exists, use it instead of single id
      setId(productIds);
    }

    // set c data with api
    if (cdata) {
      FetchCdata(cdata);
    }

    fetchStates();

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
    console.log("location.state", location.state);
    console.log("idValue", idValue);
    // FetchProduct is now called from the API response, not here
    const currentDomain = window.location.hostname;
    console.log("12122", currentDomain);

    // Click Tracking Script
    // const script1 = document.createElement("script");
    // script1.type = "text/javascript";
    // script1.id = "pap_x2s6df8d";
    // script1.src = "https://idunrx.postaffiliatepro.com/scripts/5ogv666ehj";
    // document.head.appendChild(script1);

    // script1.onload = () => {
    //   const script2 = document.createElement("script");
    //   script2.type = "text/javascript";
    //   script2.innerHTML = `
    //     PostAffTracker.setAccountId('default1');
    //     window.CampaignID='14e7b018';
    //     try {
    //       PostAffTracker.track();
    //     } catch (err) { }
    //   `;
    //   document.head.appendChild(script2);
    // };

    return () => {
      // Cleanup scripts when component unmounts
      const script1Element = document.getElementById("pap_x2s6df8d");
      if (script1Element) {
        script1Element.remove();
      }
    };
  }, []);

  // Helper to read a cookie value by name
  const getCookieValue = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  };

  // Capture GoAffPro referral (?ref=, ?a_aid=, or #a_aid=) on mount
  useEffect(() => {
    const refValue = captureGoAffProReferrer();
    if (refValue) {
      console.log("[GoAffPro] ref:", refValue);
      setRef(refValue);
    }
  }, []);

  // impact.com identify when shopper provides email (custid is order id on conversion only)
  useEffect(() => {
    if (!email) return;
    identifyImpactUser({
      customerEmail: email,
    });
  }, [email]);

  const [getallCitys, setAllCitys] = useState([]);
  const [getselectedState, setSelectedState] = useState({
    name: "",
    state_code: "",
  });
  const [getselectedStateCode, setSelectedStateCode] = useState({
    name: "",
    state_code: "",
  });

  // google map start
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);

  var initializeAutocomplete = () => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error("Google Maps API not available.");
      setIsLoading(false);
      return;
    }

    const parseAddressComponents = (place) => {
      let stateName = "";
      let stateCode = "";
      let city = "";
      let postalCode = "";

      if (place && place.address_components) {
        // Loop through address components to extract desired fields
        place.address_components.forEach((component) => {
          const types = component.types;
          if (types.includes("administrative_area_level_1")) {
            // State Name and Code
            stateName = component.long_name;
            stateCode = component.short_name; // Short name is usually the state code
          }
          if (types.includes("locality")) {
            // City
            city = component.long_name;
          }
          if (types.includes("postal_code")) {
            // Postal Code
            postalCode = component.long_name;
          }
        });
      }

      return { stateName, stateCode, city, postalCode };
    };

    const cleanAddress = (formattedAddress, componentsToRemove) => {
      // let cleanedAddress = formattedAddress;

      // componentsToRemove.forEach((component) => {
      //   if (component) {
      //     cleanedAddress = cleanedAddress
      //       .replace(component, "")
      //       .replace(/,\s*,/, ",")
      //       .trim();
      //   }
      // });

      // // Remove trailing commas and extra spaces
      // cleanedAddress = cleanedAddress
      //   .replace(/(^,)|(,$)/g, "")
      //   .replace(/\s{2,}/g, " ")
      //   .trim();

      // return cleanedAddress;

      // Split the address by commas and take only the first part
      const addressParts = formattedAddress.split(",");
      return addressParts[0].trim(); // Extracts only the first part (like "Tennessee")
    };

    // Initialize Autocomplete for the first input
    if (inputRef1.current) {
      const autocomplete1 = new window.google.maps.places.Autocomplete(
        inputRef1.current,
        {
          types: ["geocode"], // Restrict to address-type predictions
          componentRestrictions: { country: "us" },
        }
      );

      autocomplete1.addListener("place_changed", () => {
        const place = autocomplete1.getPlace();
        console.log("Place details (input 1):", place);

        if (place) {
          const { stateName, stateCode, city, postalCode } =
            parseAddressComponents(place);

          const cleanedAddress = cleanAddress(place.formatted_address, [
            city,
            stateName,
            postalCode,
          ]);

          console.log("stateName", stateName);
          console.log("stateCode", stateCode);
          console.log("postalCode", postalCode);
          console.log("city-->sZ", city);

          if (stateName && stateCode) {
            setSelectedState({ name: stateName, state_code: stateCode });
            setSelectedStateCode({ name: stateName, state_code: stateCode });
            // AllCitys(stateName);
          }

          if (city) {
            console.log("city---->", city);
            setCity(city); // Assuming you still need city
            setPostalCode("");
          }

          if (postalCode) {
            setPostalCode(postalCode); // Assuming you still need postal code
          }

          setAddress(cleanedAddress); // Set full address
          // setAddress(place.formatted_address); // Set full address
        }
      });
    }

    // Initialize Autocomplete for the second input
    if (inputRef2.current) {
      const autocomplete2 = new window.google.maps.places.Autocomplete(
        inputRef2.current,
        {
          types: ["geocode"], // Restrict to address-type predictions
          componentRestrictions: { country: "us" },
        }
      );

      autocomplete2.addListener("place_changed", () => {
        const place = autocomplete2.getPlace();
        console.log("Place details (input 2):", place);

        if (place) {
          const { stateName, stateCode, city, postalCode } =
            parseAddressComponents(place);

          const cleanedAddress = cleanAddress(place.formatted_address, [
            city,
            stateName,
            postalCode,
          ]);

          if (stateName && stateCode) {
            setSelectedState2({ name: stateName, state_code: stateCode });
            setSelectedStateCode2({ name: stateName, state_code: stateCode });
            // AllCitys(stateName);
          }

          if (city) {
            setCity2(city); // Assuming you need city for second input
            setPostalCode2("");
          }

          if (postalCode) {
            setPostalCode2(postalCode); // Assuming you need postal code for second input
          }

          // setAddress2(place.formatted_address); // Set full address for second input
          setAddress2(cleanedAddress);
        }
      });
    }

    setIsLoading(false);
  };

  // use Effects for checking gmap

  useEffect(() => {
    if (!getsection2 && inputRef1.current) {
      initializeAutocomplete();
    }
  }, [getsection2, inputRef1]);
  useEffect(() => {
    if (getsection2 && inputRef2.current) {
      initializeAutocomplete();
    }
  }, [getsection2, inputRef2]);
  useEffect(() => {
    if (!sameAsShipping && inputRef2.current) {
      initializeAutocomplete();
    }
  }, [sameAsShipping, inputRef2]);
  useEffect(() => {
    if (!isloading && inputRef2.current) {
      initializeAutocomplete();
    }
  }, [isloading, inputRef2]);
  useEffect(() => {
    if (!isloading && inputRef1.current) {
      initializeAutocomplete();
    }
  }, [isloading, inputRef1]);

  useEffect(() => {
    console.log("Updated state code:", getselectedStateCode);
  }, [getselectedStateCode]);

  useEffect(() => {
    const loadScript = (url, callback) => {
      const existingScript = document.querySelector(`script[src="${url}"]`);

      if (!existingScript) {
        const script = document.createElement("script");
        script.src = url;
        script.async = true;
        script.onload = callback;
        script.onerror = () => {
          console.error("Google Maps script failed to load.");
          setIsLoading(false);
        };
        document.body.appendChild(script);
      } else {
        callback();
      }
    };

    // Load Google Maps API script
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=AIzaSyDqypMXRxstlMdPZ-LUGWb4w36I0ENsu9U&libraries=places`,
      initializeAutocomplete
    );
  }, []);
  // google map end

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
          // setAllCitys([]);
          setCity("");
          notifyError(data.message);
        }
        // else {
        //   AllCitys(value);
        // }
      })
      .catch((err) => {
        console.log("err", err);
        // setIsLoading(false);
      });
  };

  const handleStateChange2 = async (value) => {
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
          setSelectedState2({
            name: "",
            state_code: "",
          });
          setSelectedStateCode2({
            name: "",
            state_code: "",
          });
          // setAllCitys([]);
          setCity2("");
          notifyError(data.message);
        }
        // else {
        //   AllCitys(value);
        // }
      })
      .catch((err) => {
        console.log("err", err);
        // setIsLoading(false);
      });
  };

  const AllCitys = async (state) => {
    setIsCityLoading(true);
    await axios
      .post("https://countriesnow.space/api/v0.1/countries/state/cities", {
        country: "United States",
        state: state,
      })
      .then((res) => {
        setIsCityLoading(false);
        const data = res.data.data;
        console.log("citys", res.data.data);
        setAllCitys(data);
      })
      .catch((err) => {
        console.log("err", err);
        setIsCityLoading(false);
      });
  };

  // page 1 validation

  const Page1Validate = () => {
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
      // } else if (address.length > 34) {
      //   notifyError("Address cannot exceed 34 characters.");
      //   return;
    } else if (
      getselectedStateCode.name === "" ||
      getselectedStateCode.name === null
    ) {
      notifyError("Please select State.");
      return;
    } else if (city === "" || city === null) {
      notifyError("Please select City.");
      return;
      // } else if (getallCitys.includes(city) == false) {
      //   notifyError("Please select City.");
      //   return;
    } else if (postalCode === "" || postalCode === null) {
      notifyError("Please enter Postal Code.");
      return;
    } else if (phoneNumber === "" || phoneNumber === null) {
      notifyError("Please enter Phone Number.");
      return;
    } else if (phoneNumber.length < 10) {
      notifyError("Please enter valid Phone Number.");
      return;
    } else {
      setSection2(true);
    }
  };

  const getCheckoutTotalDollars = useCallback(() => {
    if (getproductPrice == null || getproductPrice === "") return 0;
    return calcDiscountedTotal(
      getproductPrice,
      discount_percent,
      discount_amount
    );
  }, [getproductPrice, discount_percent, discount_amount]);

  const getCheckoutAmountCents = useCallback(() => {
    const dollars = getCheckoutTotalDollars();
    return Math.max(50, Math.floor(dollars * 100));
  }, [getCheckoutTotalDollars]);

  const getStripePaymentPayload = useCallback(
    (amountCentsOverride) => {
      const primary = getproducts[0] || getdata || {};
      const urlSku = new URLSearchParams(window.location.search).get("sku");

      const stateCode = getselectedStateCode?.state_code || "";

      return {
        email,
        phone: phoneNumber || "",
        // Validated promo code from check_coupons (same value as order API promo_codes)
        promoCode: appliedDiscount || "",
        firstName: firstName || "",
        lastName: lastName || "",
        address: address || "",
        address2: aptSuite || "",
        city: city || "",
        state: stateCode,
        zip: postalCode || "",
        productName: primary.product_name || "plan",
        sku: String(
          primary.product_sku || urlSku || primary.product_id || "PLAN-01"
        ),
        amount:
          amountCentsOverride !== undefined
            ? amountCentsOverride
            : getCheckoutAmountCents(),
        currency: "usd",
        productId: String(primary.product_id || ""),
      };
    },
    [
      email,
      phoneNumber,
      appliedDiscount,
      firstName,
      lastName,
      address,
      aptSuite,
      city,
      postalCode,
      getselectedStateCode,
      getproducts,
      getdata,
      getCheckoutAmountCents,
    ]
  );

  const initStripePaymentIntent = useCallback(async () => {
    if (!email || !email.includes("@")) return;
    const payload = getStripePaymentPayload();
    if (!payload.amount || payload.amount < 50) return;

    try {
      setIsCreatingPaymentIntent(true);
      setStripePaymentError(null);
      const secret = await createStripePaymentIntent(payload);
      setStripeClientSecret(secret);
    } catch (err) {
      setStripeClientSecret(null);
      setStripePaymentError(
        err instanceof Error ? err.message : "Failed to initialize payment"
      );
    } finally {
      setIsCreatingPaymentIntent(false);
    }
  }, [email, getStripePaymentPayload]);

  useEffect(() => {
    if (getsection2 && email && getCheckoutTotalDollars() >= 0.5) {
      initStripePaymentIntent();
    } else if (getCheckoutTotalDollars() < 0.5) {
      setStripeClientSecret(null);
      setStripePaymentError(null);
    }
  }, [
    getsection2,
    email,
    getCheckoutTotalDollars,
    initStripePaymentIntent,
    discount_percent,
    discount_amount,
    getproducts,
  ]);

  useEffect(() => {
    if (!getsection2) {
      setStripeClientSecret(null);
      setStripePaymentError(null);
    }
  }, [getsection2]);

  const validateBillingAddress = () => {
    if (!sameAsShipping && (firstName2 === "" || firstName2 === null)) {
      notifyError("Please enter First Name.");
      return false;
    } else if (!sameAsShipping && (lastName2 === "" || lastName2 === null)) {
      notifyError("Please enter Last Name.");
      return false;
    } else if (!sameAsShipping && (address2 === "" || address2 === null)) {
      notifyError("Please enter Address.");
      return false;
      // } else if (!sameAsShipping && address2.length > 34) {
      //   notifyError("Address cannot exceed 34 characters.");
      //   return;
    } else if (
      !sameAsShipping &&
      (getselectedStateCode2.name === "" || getselectedStateCode2.name === null)
    ) {
      notifyError("Please select State.");
      return false;
    } else if (!sameAsShipping && (city2 === "" || city2 === null)) {
      notifyError("Please select City.");
      return false;
      // } else if (!sameAsShipping && getallCitys.includes(city2) == false) {
      //   notifyError("Please select City.");
      //   return;
    } else if (
      !sameAsShipping &&
      (postalCode2 === "" || postalCode2 === null)
    ) {
      notifyError("Please enter Postal Code.");
      return false;
    } else if (
      !sameAsShipping &&
      (phoneNumber2 === "" || phoneNumber2 === null)
    ) {
      notifyError("Please enter Phone Number.");
      return false;
    } else if (!sameAsShipping && phoneNumber2.length < 10) {
      notifyError("Please enter valid Phone Number.");
      return false;
    }
    return true;
  };

  const showStripePaymentFailure = useCallback(
    (message) => {
      const text =
        message || "Payment failed. Please try again or use a different payment method.";
      setStripePaymentError(text);
      setPaymentFailedMessage(text);
      setShowPaymentFailedModal(true);
      notifyError(text);
    },
    [notifyError]
  );

  const restoreCheckoutFromSnapshot = useCallback((snapshot) => {
    if (!snapshot) return;

    if (snapshot.email) setEmail(snapshot.email);
    if (snapshot.firstName) setFirstName(snapshot.firstName);
    if (snapshot.lastName) setLastName(snapshot.lastName);
    if (snapshot.phoneNumber) setPhoneNumber(snapshot.phoneNumber);
    if (snapshot.address) setAddress(snapshot.address);
    if (snapshot.aptSuite) setAptSuite(snapshot.aptSuite);
    if (snapshot.city) setCity(snapshot.city);
    if (snapshot.postalCode) setPostalCode(snapshot.postalCode);
    if (snapshot.sameAsShipping !== undefined) {
      setSameAsShipping(snapshot.sameAsShipping);
    }
    if (snapshot.address2) setAddress2(snapshot.address2);
    if (snapshot.city2) setCity2(snapshot.city2);
    if (snapshot.postalCode2) setPostalCode2(snapshot.postalCode2);
    if (snapshot.phoneNumber2) setPhoneNumber2(snapshot.phoneNumber2);
    if (snapshot.appliedDiscount) setAppliedDiscount(snapshot.appliedDiscount);
    if (snapshot.getproductPrice) setProductPrice(snapshot.getproductPrice);
    if (snapshot.discount_percent) setdiscount_percent(snapshot.discount_percent);
    if (snapshot.discount_amount !== undefined) {
      setdiscount_amount(parseMoneyAmount(snapshot.discount_amount));
    }
    if (snapshot.uniqueId) setUniqueId(snapshot.uniqueId);
    if (snapshot.ref) setRef(snapshot.ref);
    if (snapshot.urlHashFragment) setUrlHashFragment(snapshot.urlHashFragment);
    if (snapshot.products?.length) setProducts(snapshot.products);
    if (snapshot.stateName && snapshot.stateCode) {
      setSelectedStateCode({
        name: snapshot.stateName,
        state_code: snapshot.stateCode,
      });
      setSelectedState({
        name: snapshot.stateName,
        state_code: snapshot.stateCode,
      });
    }
    if (snapshot.billingStateCode) {
      setSelectedStateCode2({
        name: snapshot.billingStateCode,
        state_code: snapshot.billingStateCode,
      });
      setSelectedState2({
        name: snapshot.billingStateCode,
        state_code: snapshot.billingStateCode,
      });
    }
    setSection2(true);
  }, []);

  const getCheckoutSnapshot = useCallback(() => {
    const primary = getproducts[0] || getdata || {};
    return {
      email,
      firstName,
      lastName,
      phoneNumber,
      address,
      aptSuite,
      city,
      stateCode: getselectedStateCode.state_code,
      stateName: getselectedStateCode.name,
      postalCode,
      sameAsShipping,
      address2,
      city2,
      billingStateCode: getselectedStateCode2.state_code,
      postalCode2,
      appliedDiscount,
      productId: parseInt(primary.product_id, 10) || primary.product_id,
      products: getproducts,
      getproductPrice,
      discount_percent,
      discount_amount,
      uniqueId,
      contactDetailsId: contact_details_id || "",
      ref,
      urlHashFragment,
      startUrl: window.location.href,
    };
  }, [
    email,
    firstName,
    lastName,
    phoneNumber,
    address,
    aptSuite,
    city,
    getselectedStateCode,
    postalCode,
    sameAsShipping,
    address2,
    city2,
    getselectedStateCode2,
    appliedDiscount,
    getproducts,
    getdata,
    getproductPrice,
    discount_percent,
    discount_amount,
    uniqueId,
    contact_details_id,
    ref,
    urlHashFragment,
  ]);

  const handleStripePaymentSuccess = async (paymentToken, clientSecret) => {
    await finalizeStripeOrder(paymentToken, clientSecret);
  };

  const finalizeStripeOrder = async (paymentToken, clientSecret) => {
    if (!paymentToken || !clientSecret) {
      showStripePaymentFailure("Payment verification failed. Please try again.");
      return;
    }

    if (isPaymentIntentProcessed(paymentToken)) {
      console.log("[stripe] order already created for", paymentToken);
      return;
    }

    try {
      await verifyStripePaymentSucceeded(paymentToken, clientSecret);
    } catch (error) {
      console.log("[stripe] payment verification error:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Payment verification failed. Please try again.";
      persistStripePaymentFailure(message, paymentToken);
      restoreCheckoutFromSnapshot(loadCheckoutSnapshot());
      showStripePaymentFailure(message);
      cleanStripeReturnParamsFromUrl();
      throw error;
    }

    setIsLoading(true);

    try {
      const snapshot = loadCheckoutSnapshot() || getCheckoutSnapshot();
      await submitCreateOrderStripe(paymentToken, snapshot);

      markPaymentIntentProcessed(paymentToken);
      clearCheckoutSnapshot();
      clearStripePaymentFailure();
      cleanStripeReturnParamsFromUrl();
    } catch (error) {
      console.log("[stripe] finalize order error:", error);
      setIsLoading(false);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to complete order after payment.";
      persistStripePaymentFailure(message, paymentToken);
      showStripePaymentFailure(message);
      throw error;
    }
  };

  const submitCreateOrderStripe = async (paymentToken, snapshot) => {
    const productId = snapshot?.productId;

    if (!productId) {
      notifyError("No products found. Please try again.");
      setIsLoading(false);
      throw new Error("Missing product");
    }

    const orderBody = buildCreateOrderStripeBody({
      email: snapshot.email,
      firstName: snapshot.firstName,
      lastName: snapshot.lastName,
      phoneNumber: snapshot.phoneNumber,
      address: snapshot.address,
      aptSuite: snapshot.aptSuite,
      city: snapshot.city,
      stateCode: snapshot.stateCode,
      postalCode: snapshot.postalCode,
      sameAsShipping: snapshot.sameAsShipping,
      address2: snapshot.address2,
      city2: snapshot.city2,
      billingStateCode: snapshot.billingStateCode,
      postalCode2: snapshot.postalCode2,
      appliedDiscount: snapshot.appliedDiscount,
      productId,
      paymentToken,
      uniqueId: snapshot.uniqueId,
      contactDetailsId: snapshot.contactDetailsId,
    });

    if (snapshot.startUrl) {
      orderBody.start_url = snapshot.startUrl;
    }

    console.log("[createOrder_stripe] payload:", orderBody);

    const Response = await axios.post(createOrder_stripe, orderBody, {
      headers: { "Content-Type": "application/json" },
    });

    const success = handleCreateOrderResponse(Response, snapshot);
    if (!success) {
      throw new Error(Response.data?.message || "Order creation failed");
    }
  };

  // Amazon Pay / Klarna redirect return — verify Stripe then create order
  useLayoutEffect(() => {
    const handleStripeRedirectReturn = async () => {
      const snapshot = loadCheckoutSnapshot();
      const persistedFailure = loadStripePaymentFailure();

      if (persistedFailure?.message) {
        restoreCheckoutFromSnapshot(snapshot);
        setStripePaymentError(persistedFailure.message);
        setPaymentFailedMessage(persistedFailure.message);
        setShowPaymentFailedModal(true);
      }

      const { paymentIntentId, clientSecret, redirectStatus } =
        getStripeReturnParams();

      if (!paymentIntentId || !clientSecret) return;
      if (isStripeReturnHandled(paymentIntentId)) return;

      markStripeReturnHandled(paymentIntentId);
      restoreCheckoutFromSnapshot(snapshot);

      const isExplicitFailure =
        redirectStatus === "failed" || redirectStatus === "canceled";

      if (isExplicitFailure) {
        const message = await resolveStripeRedirectFailureMessage(
          clientSecret,
          redirectStatus
        );
        persistStripePaymentFailure(message, paymentIntentId);
        showStripePaymentFailure(message);
        cleanStripeReturnParamsFromUrl();
        return;
      }

      if (redirectStatus === "succeeded") {
        try {
          await finalizeStripeOrder(paymentIntentId, clientSecret);
        } catch {
          /* finalizeStripeOrder notifies and shows modal */
        }
        return;
      }

      try {
        await finalizeStripeOrder(paymentIntentId, clientSecret);
      } catch {
        /* finalizeStripeOrder notifies and shows modal */
      }
    };

    handleStripeRedirectReturn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateOrderResponse = (Response, snapshot = null) => {
    console.log("API Response:", Response);
    console.log("Response Data:", Response.data);

    setIsLoading(false);

    const orderIds = extractOrderIdsFromApiResponse(Response.data);
    const isMultipleOrders = Array.isArray(Response.data);

    if (orderIds.length > 0) {
      if (isMultipleOrders) {
        const allSucceeded = Response.data.every((order) => order.status === 1);
        if (!allSucceeded) {
          notifyError("Some orders failed to process");
          return false;
        }
      } else if (Response.data.status != null && Response.data.status != 1) {
        if (Response.data.status == 5) {
          notifyError(Response.data.message);
          return false;
        }
        if (Response.data.error_details) {
          notifyError(Response.data.error_details.message);
          return false;
        }
        notifyError(Response.data.message || "Order creation failed");
        return false;
      }

      processOrderSuccess(orderIds, snapshot, Response.data);
      return true;
    }

    if (Response.data.status == 5) {
      notifyError(Response.data.message);
      return false;
    }
    if (Response.data.error_details) {
      notifyError(Response.data.error_details.message);
      return false;
    }
    notifyError(Response.data.message || "Order creation failed");
    return false;
  };

  const processOrderSuccess = (orderIds, snapshot = null, apiData = null) => {
    setorder_id(orderIds[0]);

    const priceVal = snapshot?.getproductPrice ?? getproductPrice;
    const discountPct = snapshot?.discount_percent ?? discount_percent;
    const discountAmt = snapshot?.discount_amount ?? discount_amount;
    const emailVal = snapshot?.email ?? email;
    const firstNameVal = snapshot?.firstName ?? firstName;
    const lastNameVal = snapshot?.lastName ?? lastName;
    const phoneVal = snapshot?.phoneNumber ?? phoneNumber;
    const couponVal = snapshot?.appliedDiscount ?? appliedDiscount;
    const referrerVal = snapshot?.ref ?? ref;
    const customerIdVal = resolveImpactCustomerId({
      uniqueId: snapshot?.uniqueId ?? uniqueId,
      contactDetailsId: snapshot?.contactDetailsId ?? contact_details_id,
      apiCustomerId: extractCustomerIdFromApiResponse(apiData),
    });
    const productsVal =
      snapshot?.products?.length > 0 ? snapshot.products : getproducts;
    const stateNameVal =
      snapshot?.stateName ?? getselectedStateCode.name;
    const stateCodeVal =
      snapshot?.stateCode ?? getselectedStateCode.state_code;
    const hashFragment = snapshot?.urlHashFragment ?? urlHashFragment ?? "";

    const orderTotal =
      priceVal != null && priceVal !== ""
        ? calcDiscountedTotal(priceVal, discountPct, discountAmt).toFixed(2)
        : "0";

    const goaffProTracking = {
      orderId: orderIds[0],
      total: orderTotal,
      products: productsVal,
      email: emailVal,
      firstName: firstNameVal,
      lastName: lastNameVal,
      phone: phoneVal,
      coupon: couponVal || "",
      referrer: referrerVal || "",
    };
    saveGoAffProOrderContext(goaffProTracking);

    const zipVal = snapshot?.postalCode ?? postalCode;
    const orderResult = parseCreateOrderResult(apiData, orderIds[0]);
    registerYourCoachAfterOrder(
      orderResult,
      {
        first_name: firstNameVal,
        last_name: lastNameVal,
        email: emailVal,
        phone: String(phoneVal || "").replace(/\D/g, ""),
        state_name: stateCodeVal || stateNameVal || "",
        zip_code: zipVal || "",
      },
      productsVal[0],
    ).catch((err) => console.error("[YourCoach register] failed", err));

    if (window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-11515103107",
        transaction_id: orderIds[0],
      });
    }
    if (window.fbq) {
      window.fbq("track", "Purchase", {
        value: orderTotal,
        currency: "USD",
      });
    }

    setOrderSuccessModal({
      orderId: String(orderIds[0]),
      path: `/thankyou-page${hashFragment}`,
      state: {
        email: emailVal,
        phoneNumber: phoneVal,
        orderId: orderIds[0],
        orderIds,
        firstName: firstNameVal,
        lastName: lastNameVal,
        stateName: stateNameVal,
        stateCode: stateCodeVal,
        productTotal: orderTotal,
        productId: productsVal[0]?.product_id,
        goaffProTracking,
        impactTracking: {
          orderId: orderIds[0],
          total: orderTotal,
          coupon: couponVal || "",
          email: emailVal,
          customerId: customerIdVal,
          products: productsVal,
          discountPercent: discountPct,
          discountAmount: discountAmt,
        },
      },
    });
  };

  const continueAfterOrderSuccess = () => {
    if (!orderSuccessModal) return;
    const { path, state } = orderSuccessModal;
    setOrderSuccessModal(null);
    navigate(path, { state });
  };

  const checkout_api = async () => {
    setIsLoading(true);

    // Prepare product data arrays
    const productIds = getproducts.map((product) => product.product_id);
    const productPrices = getproducts.map((product) => product.product_price);
    const originalPrices = getproducts.map((product) => product.product_price); // Using same as product_price for now
    const gatewayIds = getproducts.map(() => "1"); // Default gateway_id
    const billingModelIds = getproducts.map(() => "3"); // Default billing_model_id
    const promoCodes = getproducts.map(() => "0"); // Default promoCodes

    console.log("Product IDs before sending:", productIds);
    console.log("Product Prices before sending:", productPrices);

    // Validate product IDs
    if (!productIds || productIds.length === 0) {
      notifyError("No products found. Please try again.");
      setIsLoading(false);
      return;
    }

    // Check for empty product IDs
    const invalidProductIds = productIds.filter((id) => !id || id === "");
    if (invalidProductIds.length > 0) {
      notifyError("Invalid product data. Please refresh and try again.");
      setIsLoading(false);
      return;
    }

    // Create FormData for proper array handling
    const formData = new FormData();

    // Add basic parameters
    formData.append("billingSameAsShipping", sameAsShipping ? "YES" : "NO");
    formData.append("email", email);
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("phone", phoneNumber);
    formData.append("address", address);
    formData.append("city_name", city);
    formData.append("state_name", getselectedStateCode.state_code);
    formData.append("zip_code", postalCode);
    formData.append(
      "card_type",
      getcardid === 1
        ? "visa"
        : getcardid === 2
        ? "mastercard"
        : getcardid === 3
        ? "discover"
        : "american express"
    );
    formData.append("card_no", cardNumber);
    formData.append("ex_month", exMonth);
    formData.append("ex_year", exYear);
    formData.append("cvv_no", cvv);
    formData.append("card_holder_name", cardholdername);
    formData.append("start_url", window.location.href);
    formData.append("contact_details_id", contact_details_id);
    formData.append("promo_codes", appliedDiscount);
    formData.append("campaign_id", getcampaignID);
    if (uniqueId) formData.append("unique_id", uniqueId);

    // Add billing address fields if different from shipping
    if (!sameAsShipping) {
      formData.append("billingFirstName", firstName2);
      formData.append("billingLastName", lastName2);
      formData.append("billingAddress", address2);
      formData.append("billingCity", city2);
      formData.append("billingState", getselectedStateCode2.state_code);
      formData.append("billingZip", postalCode2);
      formData.append("billingCountry", "US");
    }

    // Add product arrays with proper array notation
    productIds.forEach((productId, index) => {
      formData.append("product_id[]", productId);
      formData.append("product_price[]", productPrices[index]);
      formData.append("original_price[]", originalPrices[index]);
      formData.append("gateway_id[]", gatewayIds[index]);
      formData.append("billing_model_id[]", billingModelIds[index]);
      formData.append("promoCodes[]", promoCodes[index]);
    });

    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const Response = await axios.post(createOrder_test_new, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      handleCreateOrderResponse(Response);
      console.log("createOrder_test res =>", Response.data);
    } catch (error) {
      console.log("API Call Error:", error);
      console.log("Error Response:", error.response);
      console.log("Error Message:", error.message);
      setIsLoading(false);
      notifyError("Failed to create order. Please try again.");
    }
  };

  const handleCardChange = (event) => {
    const cardValue = parseInt(event.target.value);
    setCardid(cardValue);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    // Only set the CVV if the length is 3 or less and it's numeric
    if (value.length <= 4 && /^\d*$/.test(value)) {
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

  const productChange = (id) => {
    console.log("e.targate.value", id);
    navigate(`/${id}`);
    // FetchProduct is now called from the API response, not here
  };

  const [countdown, setCountdown] = useState(3); // Timer for 3 seconds

  // useEffect for close modal after 3 secound
  useEffect(() => {
    if (getskipModel) {
      console.log("getdata?.offer_id", getdata?.offer_id);

      let timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      // const timer = setTimeout(() => {
      //   setSkipModel(false);
      //   window.location.assign(targetUrl);
      // }, 3000); // Delay to ensure the script has loaded

      const redirectTimer = setTimeout(() => {
        setSkipModel(false);
        window.location.assign(memberPortalUrl);
      }, 3000);

      return () => {
        clearInterval(timer);
        clearTimeout(redirectTimer);
      };
    }
  }, [getskipModel]);

  // memberportel redire url
  const currentDomain = window.location.hostname;

  let memberPortalUrl = "https://member.idunrx.com/"; // Default URL

  if (currentDomain === "checkout.idunrx.com") {
    memberPortalUrl = "https://member.idunrx.com/";
  } else if (currentDomain === "checkoutdev-idunrx.wlmd.dev") {
    memberPortalUrl = "https://mpdev-idunrx.wlmd.dev/";
  }

  console.log("currentDomain", currentDomain);
  console.log("memberPortalUrl", memberPortalUrl);

  // const targetUrl = getdata.is_intake === "0"
  //   ? `https://idunrx.co/weight-loss-order-first/?order_id=${getorder_id}&unique_id=${uniqueId}&op=intake`
  //   : memberPortalUrl;
  const targetUrl = memberPortalUrl;

  // after email api

  const handleEmailBlur = async () => {
    if (validEmail && email.trim() !== "") {
      setIsEmailLoading(true); // Start loading only if email is valid

      try {
        // Use the first product ID for member view API (or you might need to modify this API to handle multiple products)
        const firstProductId =
          getproducts.length > 0 ? getproducts[0].product_id : id;

        const response = await axios.post(member_view, {
          email: email,
          product_id: firstProductId,
          campaign_id: getcampaignID,
        });
        console.log("API Response:", response.data);
        if (response.data.status === 1) {
          setProductPrice(response.data?.m_price);
        }
      } catch (error) {
        console.error("Error sending email:", error);
      } finally {
        setIsEmailLoading(false); // Ensure loading state resets even if API fails
      }
    }
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
      {/* <Navbar2 color="#fff" logo={images.logo} /> */}
      <div className="payment-container" style={{ position: "relative" }}>
        {/* <div className="payment-content">
          <div className="payment-header_p">
            <p className="paymen_p_tag">Checkout</p>
          </div>
        </div> */}
        <div className="payment-content2 payment-column-reverse">
          {/* onSubmit={handleSubmit} */}
          <div className="checkout-form-wrapp">
            <div className="checkout_logo_wrapp headline_for_mob2">
              <img
                src={images.logo}
                className="my_logo"
                alt=""
                style={{ marginBottom: "20px" }}
              />

              <div className="checkout_head_name_wrapp">
                <p>Shipping</p>
                <FiChevronRight size={20} style={{ display: "block" }} />
                <p>Payment</p>
              </div>
            </div>

            {!getsection2 ? (
              <div className="checkout-form">
                {/* contect info */}
                <h3>Contact</h3>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder={
                      isemailLoading ? "Verifying..." : "Email Address"
                    }
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur} // Call API when moving away
                    style={{
                      border: validEmail ? "" : "1px solid red",
                      // backgroundColor: isemailLoading ? "#f5f5f5" : "white", // Light gray when verifying
                      // color: isemailLoading ? "#888" : "black",
                      cursor: isemailLoading ? "not-allowed" : "text",
                    }}
                    disabled={isemailLoading}
                  />
                  {isemailLoading && (
                    <p style={{ color: "blue", fontSize: "12px" }}>
                      Verifying...
                    </p>
                  )}
                  {!validEmail && (
                    <p style={{ color: "red", marginTop: "2px" }}>
                      Please enter a valid email address.
                    </p>
                  )}
                </div>
                <h3>Shipping Address</h3>
                {/* <div className="form-group"> */}
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option>United States</option>
                  {/* Add more country options here */}
                </select>
                {/* </div> */}
                <div className="form-group-inline">
                  <div className="form-group min-width-50">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="form-group min-width-50">
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
                    ref={inputRef1}
                    type="text"
                    placeholder="Address"
                    value={address}
                    // onChange={(e) => setAddress(e.target.value)}
                    onChange={(e) => {
                      if (e.target.value.length == 0) {
                        setSelectedState({
                          name: "",
                          state_code: "",
                        });
                        setSelectedStateCode({
                          name: "",
                          state_code: "",
                        });
                        setCity("");
                        setPostalCode("");
                      }
                      setAddress(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group-inline">
                  <div className="inline_seond">
                    <select
                      value={JSON.stringify({
                        name: getselectedState.name,
                        state_code: getselectedState.state_code,
                      })}
                      onChange={(e) => {
                        const selectedState = JSON.parse(e.target.value);

                        console.log("getselectedStateCode1", selectedState);

                        setSelectedState({
                          name: selectedState.name,
                          state_code: selectedState.state_code,
                        });
                        setSelectedStateCode({
                          name: selectedState.name,
                          state_code: selectedState.state_code,
                        });
                        // setSelectedStateCode(selectedState.state_code);
                        handleStateChange(selectedState.name); // Optional: If you have additional logic
                        console.log(
                          "getselectedStateCode",
                          selectedState.state_code
                        );
                      }}
                    >
                      <option
                        value={JSON.stringify({ name: "", state_code: "" })}
                      >
                        Select state
                      </option>
                      {getstate.map((state) => (
                        <option
                          key={state.state_code}
                          value={JSON.stringify({
                            name: state.name,
                            state_code: state.state_code,
                          })}
                        >
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="inline_seond">
                    {iscityloading ? (
                      <div
                        style={{
                          marginTop: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "1rem",
                        }}
                      >
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            border: "3px solid #e0e0e0",
                            borderTop: "3px solid #f39322",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                          }}
                        ></div>
                      </div>
                    ) : (
                      // <select
                      //   value={city} // Use city directly
                      //   onChange={(e) => {
                      //     setCity(e.target.value);
                      //     setPostalCode("");
                      //   }} // Update city state on selection
                      //   disabled={iscityloading}
                      // >
                      //   <option value="">Select city</option>
                      //   {getallCitys.map((city, index) => (
                      //     <option key={index} value={city}>
                      //       {city}
                      //     </option>
                      //   ))}
                      // </select>
                      <div className="form-group" style={{ width: "100%" }}>
                        <input
                          type="text"
                          placeholder="City"
                          value={city}
                          // onChange={(e) => setFirstName(e.target.value)}
                          onChange={(e) => {
                            setCity(e.target.value);
                            setPostalCode("");
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Postal Code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                </div>
                {/* <br /> */}
                {/* phone number start */}
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={phoneNumber}
                    onChange={(e) => {
                      const input = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                      if (input.length <= 10) {
                        setPhoneNumber(input);
                      }
                    }}
                  />
                </div>
                {/* phone number end */}
                {/* <p>All transactions are secure and encrypted.</p> */}
                <br />
                <div className="sms-consent-section">
                  <div className="sms-consent-row">
                    <input
                      type="checkbox"
                      id="smsNonMarketingConsent"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                      style={smsConsentCheckboxStyle}
                    />
                    <label
                      htmlFor="smsNonMarketingConsent"
                      style={smsConsentLabelStyle}
                    >
                      I consent to receive non-marketing text messages from idunrx
                      regarding order updates, shipping notifications, and doctor
                      communication. Message frequency varies. Message &amp; data
                      rates may apply. Reply HELP for assistance, reply STOP to opt
                      out.
                    </label>
                  </div>
                  <div className="sms-consent-row">
                    <input
                      type="checkbox"
                      id="smsMarketingConsent"
                      checked={isChecked2}
                      onChange={handleCheckboxChange2}
                      style={smsConsentCheckboxStyle}
                    />
                    <label
                      htmlFor="smsMarketingConsent"
                      style={smsConsentLabelStyle}
                    >
                      I consent to receive marketing text messages from idunrx
                      regarding promotions and special offers. Message frequency
                      varies. Message &amp; data rates may apply. Reply HELP for
                      assistance, reply STOP to opt out.
                    </label>
                  </div>
                  <p className="sms-consent-disclaimer">
                    Mobile information will not be sold or shared with third
                    parties.
                  </p>
                </div>

                {/* Submit btn start */}
                <br />
                {/* Submit btn end */}
                {/* promo code start*/}
                {/* <div className="payment_card">
              <div className="payment_card_titel">
                <b>
                  <RiDiscountPercentLine />
                  Promo Code
                </b>
              </div>

              <div className="form-group-inline">
                <div
                  className="inline_seond promo_input"
                >
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Enter Promo Code"
                  />
                </div>
                <div
                  className="inline_seond"
                  style={{ width: "30%", minWidth: "100px" }}
                >
                  <button className="btn" onClick={handleApplyDiscount}>
                    Apply
                  </button>
                </div>
              </div>
            </div> */}
                {/* Display error message */}

                {/* promo code end */}
                <br />
                {/* <br /> */}
                {/* payment details */}
                {/* <div className="payment_card">
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
                
                </div>
                <center>
                  <button className="btn-checkout" onClick={checkout_api}>
                    Complete Checkout
                  </button>
                </center>
              </div>
            </div> */}
                <button
                  className="apply-button"
                  style={{ width: "100%" }}
                  onClick={Page1Validate}
                >
                  CONTINUE TO PAYMENT
                </button>
                <div className="sms-consent-links sms-consent-links--below-btn">
                  <a
                    href="https://www.idunrx.com/privacy/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                  <span>|</span>
                  <a
                    href="https://www.idunrx.com/terms/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms &amp; Conditions
                  </a>
                </div>
              </div>
            ) : (
              <div className="checkout-form">
                {/* contect box start */}
                <div className="sec2_checkout_box_wrapp">
                  <div>
                    <p>Contact</p>
                    <p>{email}</p>
                    <button
                      onClick={() => {
                        setSection2(false);
                      }}
                    >
                      Change
                    </button>
                  </div>
                  <div style={{ borderBottom: "none" }}>
                    <p>Ship to</p>
                    <p>{address}</p>
                    <button
                      onClick={() => {
                        setSection2(false);
                      }}
                    >
                      Change
                    </button>
                  </div>
                  {/* <div style={{borderBottom:"none"}}>
                    <p>Shipping method</p>
                    <p>Standard</p>
                    <button
                      onClick={() => {
                        setSection2(false);
                      }}
                    >
                      Change
                    </button>
                  </div> */}
                </div>
                {/* contect box end */}
                <br />

                {/* billing address start */}

                <p className="pg2_heading">Billing address</p>
                <p className="pg2_des">
                  Select the address that matches your card or payment method.
                </p>

                <div className="paymentbox_main_wrapp">
                  <div
                    className="addressbox_header"
                    onClick={() => setSameAsShipping(true)}
                  >
                    <input
                      type="radio"
                      name="addressOption"
                      value="same"
                      checked={sameAsShipping}
                      onChange={() => setSameAsShipping(true)}
                      className="address_box_radio"
                    />
                    <p className="pg2_heading">Same as shipping address</p>
                  </div>
                  <div
                    className="addressbox_header"
                    onClick={() => setSameAsShipping(false)}
                  >
                    <input
                      type="radio"
                      name="addressOption"
                      value="different"
                      checked={!sameAsShipping}
                      onChange={() => setSameAsShipping(false)}
                      className="address_box_radio"
                    />
                    <p className="pg2_heading">
                      Use a different billing address
                    </p>
                  </div>
                  {/* Billing Address Form (conditionally rendered) */}
                  {!sameAsShipping && (
                    <div className="same_as_shipping_form-2">
                      <select
                        value={country2}
                        onChange={(e) => setCountry2(e.target.value)}
                      >
                        <option>United States</option>
                        {/* Add more country options here */}
                      </select>
                      <div className="form-group-inline">
                        <div className="form-group min-width-50">
                          <input
                            type="text"
                            placeholder="First Name"
                            value={firstName2}
                            onChange={(e) => setFirstName2(e.target.value)}
                          />
                        </div>
                        <div className="form-group min-width-50">
                          <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName2}
                            onChange={(e) => setLastName2(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <input
                          ref={inputRef2}
                          type="text"
                          placeholder="Address"
                          value={address2}
                          // onChange={(e) => setAddress2(e.target.value)}
                          onChange={(e) => {
                            if (e.target.value.length == 0) {
                              setSelectedState2({
                                name: "",
                                state_code: "",
                              });
                              setSelectedStateCode2({
                                name: "",
                                state_code: "",
                              });
                              setCity2("");
                              setPostalCode2("");
                            }
                            setAddress2(e.target.value);
                          }}
                        />
                      </div>
                      <div className="form-group-inline">
                        <div className="inline_seond">
                          <select
                            value={JSON.stringify({
                              name: getselectedState2.name,
                              state_code: getselectedState2.state_code,
                            })}
                            onChange={(e) => {
                              console.log("getselectedStateCode-----", e);
                              const selectedState = JSON.parse(e.target.value);
                              // setSelectedState2(selectedState.name);
                              // setSelectedStateCode2(selectedState.state_code);
                              setSelectedState2({
                                name: selectedState.name,
                                state_code: selectedState.state_code,
                              });
                              setSelectedStateCode2({
                                name: selectedState.name,
                                state_code: selectedState.state_code,
                              });
                              handleStateChange2(selectedState.name);
                              console.log(
                                "getselectedStateCode111",
                                getselectedStateCode
                              );
                            }}
                          >
                            <option
                              value={JSON.stringify({
                                name: "",
                                state_code: "",
                              })}
                            >
                              Select state
                            </option>{" "}
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
                          {iscityloading ? (
                            <div
                              style={{
                                marginTop: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "1rem",
                              }}
                            >
                              <div
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  border: "3px solid #e0e0e0",
                                  borderTop: "3px solid #f39322",
                                  borderRadius: "50%",
                                  animation: "spin 1s linear infinite",
                                }}
                              ></div>
                            </div>
                          ) : (
                            // <select
                            //   value={city2}
                            //   onChange={(e) => {
                            //     setCity2(e.target.value);
                            //     setPostalCode2("");
                            //   }}
                            // >
                            //   <option value={""}>Select city</option>

                            //   {getallCitys.map((city, index) => {
                            //     return <option value={city}>{city}</option>;
                            //   })}
                            //   {/* Add more state options here */}
                            // </select>
                            <div
                              className="form-group"
                              style={{ width: "100%" }}
                            >
                              <input
                                type="text"
                                placeholder="City"
                                value={city2}
                                onChange={(e) => {
                                  setCity2(e.target.value);
                                  setPostalCode2("");
                                }}
                              />
                            </div>
                          )}
                        </div>

                        <div className="inline_seond">
                          <input
                            type="text"
                            placeholder="Postal Code"
                            value={postalCode2}
                            onChange={(e) => setPostalCode2(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Phone number"
                          value={phoneNumber2}
                          onChange={(e) => {
                            const input = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                            if (input.length <= 10) {
                              setPhoneNumber2(input);
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {/* payment (Stripe) — after billing, same as myfastrx flow */}
                <br />
                <p className="pg2_heading">Payment</p>
                <p className="pg2_des">
                  All transactions are secure and encrypted.
                </p>
                <div className="paymentbox_main_wrapp">
                  <div className="paymentbox_header">
                    <p className="pg2_heading">Pay with card or wallet</p>
                    <div className="card_icon_div">
                      <img
                        src={images.visa}
                        className="item_img_card"
                        alt="Visa"
                      />
                      <img
                        src={images.master}
                        className="item_img_card"
                        alt="Mastercard"
                      />
                      <img
                        src={images.american}
                        className="item_img_card"
                        alt="Amex"
                      />
                    </div>
                  </div>


                  {stripePaymentError && (
                    <div className="stripe-checkout-error">{stripePaymentError}</div>
                  )}

                  {isCreatingPaymentIntent && (
                    <p className="stripe-payment-loading">
                      Initializing secure payment…
                    </p>
                  )}

                  {stripeClientSecret && stripePromise && (
                    <Elements
                      stripe={stripePromise}
                      options={{
                        clientSecret: stripeClientSecret,
                        appearance: stripeAppearance,
                      }}
                    >
                      <StripeCheckoutForm
                        amountInCents={getCheckoutAmountCents()}
                        onValidateBilling={validateBillingAddress}
                        onPersistCheckoutSnapshot={() =>
                          saveCheckoutSnapshot(getCheckoutSnapshot())
                        }
                        onPaymentSuccess={handleStripePaymentSuccess}
                        onRecreatePaymentIntent={async (amountInCents) => {
                          const secret = await createStripePaymentIntent(
                            getStripePaymentPayload(amountInCents)
                          );
                          setStripeClientSecret(secret);
                        }}
                        disabled={isloading}
                      />
                    </Elements>
                  )}

                  {!stripeClientSecret &&
                    !isCreatingPaymentIntent &&
                    !stripePaymentError &&
                    stripePromise && (
                      <p className="stripe-payment-hint">
                        Complete billing above to load payment options.
                      </p>
                    )}
                </div>

                <div className="features">
                  <ul style={{}}>
                    <li style={{ fontSize: "14px" }}>
                      Free online medical consultation.
                    </li>
                    <li style={{ fontSize: "14px" }}>
                      24/7 support via email or phone.
                    </li>
                    <li style={{ fontSize: "14px" }}>
                      100% refund if you are not prescribed.
                    </li>
                  </ul>
                </div>
                <br />

                <center>
                  <div className="ssl-secured-payment">
                    <FaLock />
                    <p
                      style={{
                        marginLeft: "5px",
                        fontSize: "16px",
                        color: "var(--clr-text)",
                        fontWeight: "400",
                      }}
                    >
                      SSL SECURED PAYMENT
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        marginLeft: "5px",
                        fontSize: "16px",
                        color: "var(--clr-text)",
                        fontWeight: "400",
                      }}
                    >
                      {" "}
                      Your information is protected by 256-bit SSL encryption
                    </p>
                  </div>
                </center>
              </div>
            )}
          </div>
          <div className="center_line"></div>
          <div className="order-summary2">
            <div className="checkout_logo_wrapp headline_for_mob">
              <img src={images.logo} className="" alt="" />

              <div className="checkout_head_name_wrapp">
                <p>Shipping</p>
                <FiChevronRight size={20} style={{ display: "block" }} />
                <p>Payment</p>
              </div>
            </div>
            <div
              className="product-info-right mb-2 mb:mt-0"
              // style={{ marginTop: "0px", marginBottom: "10px" }}
            >
              {getproducts.length === 1 ? (
                // Single product display
                <>
                  <div className="product-image">
                    {getproducts[0].product_img &&
                    getproducts[0].product_img.length > 0 ? (
                      <img
                        src={getproducts[0].product_img[0]?.img_video}
                        alt="product-img"
                      />
                    ) : (
                      <img src={images.bottel_img} alt="product-img" />
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "80%",
                      alignItems: "center",
                    }}
                  >
                    <div className="product-details">
                      <h4>{getproducts[0]?.product_name}</h4>
                    </div>
                    <div style={{}} className="product-price">
                      <span className="discounted-price">
                        ${getproductPrice}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                // Multiple products display
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      // marginBottom: "12px",
                      maxHeight: "130px",
                      overflow: "auto",
                    }}
                  >
                    {getproducts.map((product, index) => (
                      <div
                        key={product.product_id || index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          // backgroundColor: "#f8f9fa",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          border: "1px solid #e9ecef",
                          width: "100%",
                        }}
                      >
                        <img
                          src={
                            product?.product_img &&
                            product.product_img.length > 0
                              ? product.product_img[0]?.img_video
                              : images.bottel_img
                          }
                          alt="product"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "contain",
                            borderRadius: "6px",
                            marginRight: "12px",
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              fontSize: "13px",
                              fontWeight: "500",
                              margin: 0,
                              color: "#000",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {product.product_name}
                          </p>
                          <p
                            style={{
                              fontSize: "11px",
                              margin: "2px 0 0 0",
                              color: "#000",
                              fontWeight: "600",
                            }}
                          >
                            ${product.product_price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: "1px solid #e9ecef",
                      paddingTop: "8px",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          margin: 0,
                          color: "#495057",
                        }}
                      >
                        {getproducts.length} items in cart
                      </p>
                    </div>
                    <div style={{}} className="product-price">
                      <span className="discounted-price">
                        ${getproductPrice}
                      </span>
                    </div>
                  </div> */}
                </div>
              )}
            </div>
            {/* Discount Code */}
            <div className="discount-code-section">
              <label className="discount-code-label" htmlFor="discount-code-input">
                Coupon code
              </label>
              <div className="discount-code-row">
                <input
                  id="discount-code-input"
                  type="text"
                  placeholder="Enter coupon code"
                  className="input-field discount-code-input"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
                <button
                  onClick={handleApplyDiscount}
                  className="apply-button discount-code-apply"
                >
                  Apply
                </button>
              </div>
            </div>
            {/* Display error message */}
            {error && (
              <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
            )}
            {applyLoading && (
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    border: "3px solid #e0e0e0",
                    borderTop: "3px solid var(--clr-main)",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                ></div>
              </div>
            )}
            {/* Display discount badge on success */}
            {appliedDiscount && (
              <div
                style={{
                  marginTop: "10px",
                  backgroundColor: "#e0f7fa",
                  padding: "5px 10px",
                  display: "inline-block",
                  borderRadius: "5px",
                  width: "fit-content",
                  display: "flex",
                }}
              >
                <span style={{ color: "#00796b" }}>
                  ✅ {appliedDiscount} Applied
                </span>
                <button
                  onClick={handleRemoveDiscount}
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "#230359",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                  className="remove_coupen_btn"
                >
                  <IoCloseOutline />
                </button>
              </div>
            )}

            {/* Order Summary */}
            <div
              style={{
                marginTop: "10px",
                backgroundColor: "var(--clr-card-bg)",
              }}
              className="order-summary2"
            >
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "500",
                  marginTop: "0px",
                  color: "var(--clr-text)",
                }}
                className="order-summary-title"
              >
                Order Summary
              </p>
              <hr className="order_summery_hr" />

              {/* Render all products */}
              <>
                <>
                  {(getproducts?.length > 0 ? getproducts : [getdata]).map(
                    (product, index) => (
                      <div key={product.product_id || index} className="item">
                        <img
                          src={
                            product?.product_img &&
                            product.product_img.length > 0
                              ? product.product_img[0]?.img_video
                              : images.bottel_img
                          }
                          className="order_summary_img"
                          alt="your medication"
                        />
                        <div className="div_card">
                          <p>{product?.product_name}</p>
                          <div className="product-price">
                            {/* Optional: Show original price if different */}
                            {/* {parseFloat(product.product_price) !== parseFloat(getproductPrice) && (
                            <span className="original-price" style={{ marginRight: "10px" }}>
                              ${parseFloat(product.product_price).toFixed(2)}
                            </span>
                          )} */}
                            <span className="discounted-price">
                              {/* {product.product_price != null &&
                              !isNaN(product.product_price)
                                ? discount_percent &&
                                  discount_percent !== "0.00"
                                  ? "$" +
                                    (
                                      parseFloat(product.product_price) -
                                      (parseFloat(product.product_price) *
                                        (parseFloat(discount_percent) || 0)) /
                                        100
                                    ).toFixed(2)
                                  : "$" +
                                    (
                                      parseFloat(product.product_price) -
                                      (parseFloat(discount_amount) || 0)
                                    ).toFixed(2)
                                : "$" + product.product_price} */}
                                ${getproductPrice}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </>
              </>
              <div className="item">
                <div
                  style={{
                    padding: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "70px",
                    border: "1px solid var(--clr-border)",
                    borderRadius: "5px",
                  }}
                >
                  <Stethoscope size={30} color="#000" />
                </div>
                <div className="div_card">
                  <p>Doctor Support and Monitoring</p>
                  <div style={{}} className="product-price">
                    <span
                      style={{ marginRight: "10px" }}
                      className="original-price"
                    >
                      $99
                    </span>
                    <span className="discounted-price">free</span>
                  </div>
                </div>
              </div>

              <div className="item">
                <div
                  style={{
                    padding: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "70px",
                    border: "1px solid var(--clr-border)",
                    borderRadius: "5px",
                  }}
                >
                  <Truck size={30} color="#000" />
                </div>
                <div className="div_card">
                  <p>Overnight Shipping </p>
                  <div style={{}} className="product-price">
                    <span
                      style={{ marginRight: "10px" }}
                      className="original-price"
                    >
                      $40
                    </span>
                    <span className="discounted-price">free</span>
                  </div>
                </div>
              </div>

              {appliedDiscount && (
                <div className="savings-banner">
                  <MdOutlineCelebration size={25} />
                  <span>
                    You saved{" "}
                    {parseMoneyAmount(discount_percent) > 0
                      ? `${Math.trunc(parseMoneyAmount(discount_percent))}%`
                      : `$${calcCouponSavings(getproductPrice, discount_percent, discount_amount).toFixed(2)}`}{" "}
                    on your order
                  </span>
                </div>
              )}
              <div
                className="your-total-div"
                style={{
                  borderRadius: "5px",
                  border: isExpanded ? "1px solid var(--clr-border)" : "",
                }}
              >
                <div
                  style={{
                    borderRadius: "5px",
                    border: isExpanded ? "" : "1px solid var(--clr-border)",
                  }}
                  className={`total-section ${isExpanded ? "expanded" : ""}`}
                  onClick={handleExpandClick}
                >
                  <div className="total-details">
                    <CiStar
                      size={25}
                      color="var(--clr-main)"
                      className="star_icon"
                    />
                    <span style={{ color: "var(--clr-main)" }}>
                      {totalText}{" "}
                      {getproductPrice != null && getproductPrice !== ""
                        ? "$" + getCheckoutTotalDollars().toFixed(2)
                        : ""}
                    </span>
                    <div className="expand-button">
                      <span>
                        {isExpanded ? <FaAngleUp /> : <FaAngleDown />}
                      </span>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ margin: "10px" }} className="expanded-content">
                    {/* Add your expanded content here */}
                    <div
                      style={{
                        borderTop: "0.5px solid var(--clr-border)",
                        marginTop: "-10px",
                        marginBottom: "20px",
                      }}
                    />
                    {appliedDiscount && (
                      <div className="div_card" style={{ width: "100%" }}>
                        <p
                          style={{
                            fontWeight: "600",
                            color: "var(--clr-text)",
                          }}
                        >
                          Your Coupon Savings
                        </p>
                        <div style={{}} className="product-price">
                          <span
                            style={{ marginRight: "10px", color: "#4caf50" }}
                            className="originsal-price"
                          >
                            {parseMoneyAmount(discount_percent) > 0
                              ? `${Math.trunc(parseMoneyAmount(discount_percent))}%`
                              : `$${calcCouponSavings(getproductPrice, discount_percent, discount_amount).toFixed(2)}`}
                          </span>
                        </div>
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "10px",
                      }}
                    >
                      <p style={{ color: "var(--clr-text)", fontSize: "15px" }}>
                        Subtotal
                      </p>
                      <div style={{}} className="product-price">
                        <span
                          style={{
                            marginRight: "10px",
                            color: "var(--clr-text)",
                            fontSize: "15px",
                          }}
                          className="originsal-price"
                        >
                          {getproductPrice != null && getproductPrice !== ""
                            ? "$" + getCheckoutTotalDollars().toFixed(2)
                            : ""}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "10px",
                      }}
                    >
                      <p style={{ color: "var(--clr-text)", fontSize: "15px" }}>
                        Estimated Tax
                      </p>
                      <div style={{}} className="product-price">
                        <span
                          style={{
                            marginRight: "10px",
                            color: "var(--clr-text)",
                            fontSize: "15px",
                          }}
                          className="originsal-price"
                        >
                          ---
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "10px",
                      }}
                    >
                      <p style={{ color: "var(--clr-text)", fontSize: "15px" }}>
                        Shipping
                      </p>
                      <div style={{}} className="product-price">
                        <span
                          style={{
                            marginRight: "10px",
                            color: "var(--clr-text)",
                            fontSize: "15px",
                          }}
                          className="originsal-price"
                        >
                          $0
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        borderTop: "0.5px solid var(--clr-border)",
                        marginTop: "10px",
                        marginBottom: "10px",
                        // width: "90%",
                      }}
                    />
                    <div
                      className="div_card"
                      style={{ width: "100%", alignItems: "center" }}
                    >
                      <p
                        style={{
                          fontWeight: "600",
                          fontSize: "15px",
                          color: "var(--clr-text)",
                        }}
                      >
                        Total
                      </p>
                      <div style={{}} className="product-price">
                        <span
                          style={{
                            marginRight: "10px",
                            color: "var(--clr-text)",
                            fontWeight: "600",
                            fontSize: "15px",
                          }}
                          className="originsal-price"
                        >
                          {getproductPrice != null && getproductPrice !== ""
                            ? "$" + getCheckoutTotalDollars().toFixed(2)
                            : ""}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        marginTop: "20px",
                        borderRadius: "5px",
                        border: "1px solid var(--clr-main)",
                        padding: "20px",
                        backgroundColor: "rgba(99, 243, 255, 0.1)",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "10px",
                          lineHeight: "22px",
                          color: "var(--clr-text)",
                        }}
                      >
                        By clicking the "Checkout Now" button above, your card
                        will be billed the discounted price of{" "}
                        {"$" + getCheckoutTotalDollars().toFixed(2)}{" "}
                        today to reserve your 1 month supply of your medication.
                        After you complete the order by clicking the secure
                        "Checkout Now" button above, your information will be
                        securely saved. You will then be asked to complete a
                        short medical history intake and verify your identity. A
                        idunrx medical professional will review your
                        information, and, if appropriate, prescribe your
                        medication. If you are not eligible for your medication
                        for ANY reason, you will receive a full refund of your
                        purchase price. You have selected the monthly package,
                        which includes a 1 month starter kit. The starter kit
                        includes your medication and detailed instructions on
                        how to properly administer the medication. Each month,
                        you will need to update your prescribing doctor on your
                        progress and they will have the ability to adjust your
                        dosage as needed. Your new billing will continue at $
                        {getdata.product_price} per month after the first 21
                        days. It will include your medication, unlimited doctor
                        support, and prescription covered. If at anytime you
                        decide not to continue, simply contect us
                        support@idunrx.com. You will not be billed further.
                        While you are a member, you will have access to chat
                        with your doctor or customer support for any needed
                        assistance.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {showPaymentFailedModal && (
          <div className="skip_modal_main_wrapp payment-failed-modal">
            <div className="skip_white_part_wrapp">
              <p className="f-16 fw-500" style={{ marginBottom: "10px" }}>
                Payment failed
              </p>
              <p className="f-16 fw-500 mb-2" style={{ color: "#b91c1c" }}>
                {paymentFailedMessage ||
                  "Your payment could not be completed. Please try again or choose another payment method."}
              </p>
              <div>
                <button
                  type="button"
                  className="btn skip_modal_btn1"
                  style={{ width: "120px" }}
                  onClick={() => {
                    setShowPaymentFailedModal(false);
                    clearStripePaymentFailure();
                    if (getsection2 && email) {
                      initStripePaymentIntent();
                    }
                  }}
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {orderSuccessModal && (
          <div className="skip_modal_main_wrapp order-success-modal">
            <div className="skip_white_part_wrapp order-success-modal__card">
              <div className="order-success-modal__icon" aria-hidden>
                ✓
              </div>
              <p className="f-16 fw-500 order-success-modal__title">
                Order Successful!
              </p>
              <p className="f-14 fw-400 order-success-modal__subtitle">
                Your payment was processed and your order has been confirmed.
              </p>
              <div className="order-success-modal__order-id">
                <span className="order-success-modal__label">Order ID</span>
                <strong>{orderSuccessModal.orderId}</strong>
              </div>
              <button
                className="btn"
                style={{ width: "100%", marginTop: "8px" }}
                onClick={continueAfterOrderSuccess}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {getskipModel && (
          <div className="skip_modal_main_wrapp">
            <div className="skip_white_part_wrapp">
              <p className="f-16 fw-500" style={{ marginBottom: "10px" }}>
                Thank you for your order
              </p>
              {/* {getdata.is_intake === "0" ?  <p className="f-16 fw-500 mb-2">
               You are now being redirected to the Medical Intake form to complete process
              </p> :
           } */}{" "}
              <p className="f-16 fw-500 mb-2">
                You are now being redirected to your Member Portal
              </p>
              <div>
                <button
                  className="btn"
                  style={{ width: "100px" }}
                  onClick={() => {
                    // SkipNextMonth();
                    setSkipModel(false);
                    window.location.assign(memberPortalUrl);
                  }}
                >
                  OK
                </button>
                {/* <p className="f-14 fw-400">Redirecting in {countdown} seconds...</p> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Checkout2;
