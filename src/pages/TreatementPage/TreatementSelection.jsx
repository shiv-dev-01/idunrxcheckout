import React, { useEffect, useState } from "react";
import "./treatement_selection.css";
import images from "../../constants/images";
import { Navbar2 } from "../../common";
import { products_url } from "../../utils/Constant";
import axios from "axios";
import { Loading } from "../../common";
import { Link, useLocation } from "react-router-dom";

const TreatementSelection = () => {
  const [data, setData] = useState([]);
  const [getloading, setLoading] = useState(false);

  const location = useLocation();
  const contact_details_id = location.state.contact_details_id;
  const name_data = location.state.data;
  // console.log("contact_details_id", contact_details_id);

  const AllProducts = async () => {
    setLoading(true);
    await axios
      .get(products_url)
      .then((response) => {
        setLoading(false);
        if (response.data.status == 1) {
          setData(response.data.product);
        }
      })
      .catch((err) => {
        console.log("err", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    AllProducts();

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    console.log("location.state", location.state);
  }, []);

  if (getloading) {
    return (
      <div style={{ height: "95vh" }}>
        <Loading />
      </div>
    );
  }

  return (
    <>
      <Navbar2 />
      <div className="treatment_main_wrapp">
        <div className="treatment_base_wrapp">
          <div className="treatment_1st_div">
            <div className="treat_1st_left">
              <h1 style={{ color: "#000" }}>
                Your medical weight loss program is pre-approved!
              </h1>
              <h3 style={{ color: "#000" }}>Your Program Includes:</h3>
              <div className="tret_flex">
                <div className="treat_pro_list">
                  <div>
                    <img src={images.treat_med} alt="" />
                  </div>
                  <p>Prescription to GLP-1 Medication like Ozempic</p>
                </div>
                <div className="treat_pro_list">
                  <div>
                    <img src={images.treat_lock} alt="" />
                  </div>
                  <p>Price Lock Guarantee: One price. No Hidden Fees</p>
                </div>
                <div className="treat_pro_list">
                  <div>
                    <img src={images.treat_doctor} alt="" />
                  </div>
                  <p>Unlimited Doctor’s Visits</p>
                </div>
              </div>
            </div>
            <div className="treat_1st_right">
              <img src={images.treatment_doctor_img} alt="" />
            </div>
          </div>

          <div className="treatment_med_flex_div">
            {data && data.length > 0
              ? data
                  .slice()
                  .reverse()
                  .map((item, index) => {
                    return (
                      <div className="treat_med_card" key={item.product_id}>
                        <div className="treat_med_card_content_div">
                          <h4>{item.product_name}</h4>
                          <p className="treat_prescription_text">
                            {item.product_description}
                          </p>
                          <div className="treat_med_card_img_div">
                            <img src={images.levelup_med_img} alt="" />
                          </div>
                          <div className="treat_med_des_div">
                            <ul>
                              <li>Medication & Provider Included</li>
                              <li>
                                The same active ingredient in
                                <span className="med-bold-text"> Wegovy</span>,
                                and{" "}
                                <span className="med-bold-text">Ozempic</span>.
                              </li>
                              <li>Virtual Doctor Visits</li>
                              <li>30 Day Weight Loss Guarantee</li>
                            </ul>
                          </div>
                          <p className="treat_amount">${item.product_price}</p>
                          {/* <p className="treat_exp_text">For first month only</p> */}
                          {/* <p className="treat_exp_text">($399/mo thereafter)</p> */}
                          <div className="treat_med_btn_div">
                            <Link
                              to="/PaymentGetways"
                              state={{
                                product: item,
                                contact_details_id: contact_details_id,
                                name_data: name_data,
                              }}
                              className="product-button"
                            >
                              Select
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
              : null}
            {/* <div className="treat_med_card">
              <div className="treat_med_card_content_div">
                <h4>Trizepatide</h4>
                <p className="treat_prescription_text">
                  Weekly Weight Loss Injection
                </p>
                <div className="treat_med_card_img_div">
                  <img src={images.levelup_med_img} alt="" />
                </div>
                <div className="treat_med_des_div">
                  <ul>
                    <li>Medication & Provider Included</li>
                    <li>
                      The same active ingredient in
                      <span className="med-bold-text"> Wegovy</span>, and{" "}
                      <span className="med-bold-text">Ozempic</span>.
                    </li>
                    <li>Virtual Doctor Visits</li>
                    <li>30 Day Weight Loss Guarantee</li>
                  </ul>
                </div>
                <p className="treat_amount">$199</p>
                <p className="treat_exp_text">For first month only</p>
                <p className="treat_exp_text">($449/mo thereafter)</p>
                <div className="treat_med_btn_div">
                  <button>Select</button>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default TreatementSelection;
