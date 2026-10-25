import React from "react";
import "./prescription.css";
import { Link } from "react-router-dom";
import { PiTruckLight } from "react-icons/pi";
import { FaThumbsUp, FaUserDoctor } from "react-icons/fa6";
import images from "../../constants/images";

const Prescription = () => {
  return (
    <section className="section ws2_main_wrapp prescription">
      <div className="prescription-container">
        <div className="steps">
          <div className="prescription-titel">
            <h1>Get your new prescription in</h1>
            <h1 className="steps-highlight">3 easy steps</h1>
          </div>
          <div className="step">
            <div className="step_img">
              <svg
                id="brxe-aavaso"
                xmlns="http://www.w3.org/2000/svg"
                className="brxe-svg step-box--icon brxe-svg step-box--icon"
                width="48.349"
                height="46.318"
                viewBox="0 0 48.349 46.318"
              >
                <g
                  id="Group_2423"
                  data-name="Group 2423"
                  transform="translate(1.132 1)"
                >
                  <path
                    id="Path_15982"
                    data-name="Path 15982"
                    d="M952.193,4467.141l-6.937-.082"
                    transform="translate(-942.109 -4424.05)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                  <path
                    id="Path_15983"
                    data-name="Path 15983"
                    d="M973.209,4465.783s-11.284.186-13.894,0-5.371-1.638-5.875-4.663"
                    transform="translate(-945.541 -4421.56)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                  <path
                    id="Path_15984"
                    data-name="Path 15984"
                    d="M950.9,4421.044s-1.008-4.071,3.677-8.741c2.894-2.886,4.1-4.286,4.85-7.37a58.683,58.683,0,0,0,.84-9.321,1.79,1.79,0,0,1,2.423-1.678c2.33.563,4.288,2.892,4.288,6.156s-.094,8.67,0,9.135.148,2.247,3.973,3.833"
                    transform="translate(-944.437 -4393.354)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                  <path
                    id="Path_15985"
                    data-name="Path 15985"
                    d="M939.838,4434.186l6.81-.976"
                    transform="translate(-939.838 -4409.858)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                  <path
                    id="Path_15977"
                    data-name="Path 15977"
                    d="M1006.02,4401.429c.3.441.883,1.266,1.01,1.423a1.234,1.234,0,0,0,.238.284c.081.07.052-.012.093-.093a5.85,5.85,0,0,1,.825-1.173,22.492,22.492,0,0,1,1.545-1.69,8.066,8.066,0,0,1,.935-.9"
                    transform="translate(-967.585 -4395.633)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                  <rect
                    id="Rectangle_4235"
                    data-name="Rectangle 4235"
                    width="11.676"
                    height="11.676"
                    rx="5.838"
                    transform="translate(34.541)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></rect>
                  <path
                    id="Path_15978"
                    data-name="Path 15978"
                    d="M991.765,4426.99H980.68a2.774,2.774,0,0,0-2.774,2.776v.36a2.77,2.77,0,0,0,2.774,2.77h11.085a2.771,2.771,0,0,0,2.776-2.77v-.36A2.775,2.775,0,0,0,991.765,4426.99Z"
                    transform="translate(-955.798 -4407.25)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                  <path
                    id="Path_15979"
                    data-name="Path 15979"
                    d="M991.382,4437.24h-13.47a3.063,3.063,0,1,0,0,6.126h13.47a3.063,3.063,0,1,0,0-6.126Z"
                    transform="translate(-954.516 -4411.548)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                  <path
                    id="Path_15980"
                    data-name="Path 15980"
                    d="M991.283,4448.18h-13.47a3.063,3.063,0,1,0,0,6.127h13.47a3.063,3.063,0,1,0,0-6.127Z"
                    transform="translate(-954.474 -4416.134)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                  <path
                    id="Path_15981"
                    data-name="Path 15981"
                    d="M991.172,4458.75H980.68a2.773,2.773,0,0,0-2.774,2.77v.586a2.77,2.77,0,0,0,2.774,2.77h10.493a2.771,2.771,0,0,0,2.776-2.77v-.586A2.775,2.775,0,0,0,991.172,4458.75Z"
                    transform="translate(-955.798 -4420.566)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                </g>
              </svg>
            </div>
            <div className="step_del">
              <p>Complete a simple medical history form</p>
            </div>
          </div>
          <div className="step">
            <div className="step_img">
              <svg
                id="brxe-kmkvli"
                xmlns="http://www.w3.org/2000/svg"
                className="brxe-svg step-box--icon brxe-svg step-box--icon"
                width="51.397"
                height="54.785"
                viewBox="0 0 51.397 54.785"
              >
                <g
                  id="Group_2308"
                  data-name="Group 2308"
                  transform="translate(1.092 1.004)"
                >
                  <path
                    id="Path_15955"
                    data-name="Path 15955"
                    d="M442.439,4409.017s-1.318-5.326-.23-8.254a14.6,14.6,0,0,1,3.669-5.729c.744-.517,3.553-.229,3.553-.229a7.276,7.276,0,0,1,4.354-1.831,11.237,11.237,0,0,1,8.425,3.094c2.406,2.462,2.521,6.475,2.637,7.846a27.47,27.47,0,0,1-.4,5.5c-.231,1.034-2.693-1.263-3.039-2.691s-2.063.287-5.844-1.206-7.851-3.782-8.309-4.357.287.976-.916,3.273A19.255,19.255,0,0,1,442.439,4409.017Z"
                    transform="translate(-428.626 -4392.962)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                  <path
                    id="Path_15956"
                    data-name="Path 15956"
                    d="M437.525,4449.36a12.194,12.194,0,0,0,1.427,4.536"
                    transform="translate(-427.086 -4413.384)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                  <path
                    id="Path_15957"
                    data-name="Path 15957"
                    d="M439.556,4462.192a2.861,2.861,0,1,0-2.862-2.864A2.862,2.862,0,0,0,439.556,4462.192Z"
                    transform="translate(-426.785 -4415.958)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                  <path
                    id="Path_15958"
                    data-name="Path 15958"
                    d="M482.392,4448.9a22.5,22.5,0,0,1,.269,5.122"
                    transform="translate(-443.332 -4413.217)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                  <path
                    id="Path_15959"
                    data-name="Path 15959"
                    d="M475.206,4465.544l-.813,1.43a1.53,1.53,0,0,1-1.475-1.736c.1-1.678,2.231-7.081,3.053-7.833.778-.715,1.28-1.256,3.677-.465s1.836,3.865,1.836,3.865l-.946,6.208s-.154,1.607-2.108.791l.154-1.486"
                    transform="translate(-439.9 -4415.987)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                  <path
                    id="Path_15960"
                    data-name="Path 15960"
                    d="M470.375,4463.85s-1.049-10.9-2.726-12.721-14.26-7.553-15.1-7.9-6.707,12.165-6.707,12.165-6.012-12.51-6.852-12.165-13.423,6.085-15.1,7.9-2.732,12.721-2.732,12.721"
                    transform="translate(-421.16 -4411.161)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                  <path
                    id="Path_15961"
                    data-name="Path 15961"
                    d="M464.559,4416.72a.557.557,0,0,1,.2.134,3.441,3.441,0,0,1,.349,2.864c-.278,1.046-1.537,2.8-2.235,2.935a15.558,15.558,0,0,1-.63,2.66,37.242,37.242,0,0,1-3.29,3.566,7.741,7.741,0,0,1-1.744,1.4,10.041,10.041,0,0,1-3.813.7m0,0c-.012,0-.021-.006-.033-.006h.065A.157.157,0,0,1,453.4,4430.977Zm0,0a10.032,10.032,0,0,1-3.813-.7,9,9,0,0,1-1.963-1.607,35.715,35.715,0,0,1-3.072-3.355,15.258,15.258,0,0,1-.63-2.66c-.7-.134-1.956-1.888-2.237-2.935a3.449,3.449,0,0,1,.352-2.864.489.489,0,0,1,.133-.1"
                    transform="translate(-428.54 -4401.565)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                  <path
                    id="Path_15962"
                    data-name="Path 15962"
                    d="M444.175,4416.88h0"
                    transform="translate(-429.492 -4401.623)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                  <path
                    id="Path_15963"
                    data-name="Path 15963"
                    d="M468.838,4435.78a28.692,28.692,0,0,0,.586,5"
                    transform="translate(-438.424 -4408.466)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                  <path
                    id="Path_15964"
                    data-name="Path 15964"
                    d="M450.053,4440.923a28.316,28.316,0,0,0,.65-5.473"
                    transform="translate(-431.622 -4408.347)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                  <path
                    id="Path_15965"
                    data-name="Path 15965"
                    d="M454.612,4451.88a6.785,6.785,0,0,0,3.408.785,7.8,7.8,0,0,0,3.086-.581h0"
                    transform="translate(-433.273 -4414.296)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                </g>
              </svg>
            </div>
            <div className="step_del">
              <p>A doctor will review your answers within 24 hours</p>
            </div>
          </div>
          <div className="step">
            <div className="step_img">
              <svg
                id="brxe-nmiyhs"
                xmlns="http://www.w3.org/2000/svg"
                className="brxe-svg step-box--icon brxe-svg step-box--icon"
                width="70.806"
                height="48.556"
                viewBox="0 0 70.806 48.556"
              >
                <g
                  id="Group_2310"
                  data-name="Group 2310"
                  transform="translate(1 1)"
                >
                  <path
                    id="Path_16007"
                    data-name="Path 16007"
                    d="M1213.1,4442.244h21.99v-36.718a5.058,5.058,0,0,0-5.057-5.056h-33.508a5.053,5.053,0,0,0-5.057,5.056v33.662a3.057,3.057,0,0,0,3.055,3.056h7.873"
                    transform="translate(-1191.47 -4400.47)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                  <path
                    id="Path_16008"
                    data-name="Path 16008"
                    d="M1274.565,4447.82h1.882a2.314,2.314,0,0,0,2.318-2.311v-12.4l-8.47-9.488-4-4.488H1253.58v28.69h10.289"
                    transform="translate(-1209.959 -4406.025)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                  <path
                    id="Path_16009"
                    data-name="Path 16009"
                    d="M1273.57,4462.193a5.386,5.386,0,1,0-5.38-5.387A5.392,5.392,0,0,0,1273.57,4462.193Z"
                    transform="translate(-1214.308 -4415.637)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                  <path
                    id="Path_16010"
                    data-name="Path 16010"
                    d="M1212.37,4462.193a5.386,5.386,0,1,0-5.38-5.387A5.387,5.387,0,0,0,1212.37,4462.193Z"
                    transform="translate(-1196.09 -4415.637)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                  <path
                    id="Path_16011"
                    data-name="Path 16011"
                    d="M1281.65,4435.016h-16.188a2.194,2.194,0,0,1-2.191-2.191v-5.113a2.194,2.194,0,0,1,2.191-2.191h7.789"
                    transform="translate(-1212.844 -4407.927)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                  <path
                    id="Path_16012"
                    data-name="Path 16012"
                    d="M1239.332,4444.3H1206"
                    transform="translate(-1195.795 -4423.413)"
                    fill="none"
                    stroke="#112b53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></path>
                </g>
              </svg>
            </div>
            <div className="step_del">
              <p>Free delivery if you are given a prescription</p>
            </div>
          </div>
          <div className="stepbtn">
            <Link to="/FlowPage" className="product-button">
              START YOUR FREE VISIT
            </Link>
          </div>
        </div>
        <div className="prescription_bg">
          <img src={images.prescription_bg} alt="" />
        </div>
      </div>
    </section>
  );
};

export default Prescription;
