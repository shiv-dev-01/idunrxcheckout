import React from "react";
import "./Compounded.css";

const Compounded = () => {
  return (
    <section className="section compounded_main_wrapp">
      <div className="compounded_ineer_sec">
        <h4>COMPOUNDED SEMAGLUTIDE DOSING SCHEDULE:</h4>
        <div className="compounded_ineer_sec_graypart">
          <div>
            <div>
              <h5>WEEKS 1-4 (Beginner Dose)</h5>
              <span>0.25 mg Per Week</span>
            </div>
            <h5>Feeling Fuller, Longer</h5>
          </div>
          <div>
            <div>
              <h5>WEEKS 5-8 (Intermediate Dose)</h5>
              <span>0.5 mg Per Week</span>
            </div>
            <h5>Better Appetite Control</h5>
          </div>
          <div>
            <div>
              <h5>
                WEEKS 9-12+ <br /> (Maintenance Dose)
              </h5>
              <span>1.0 mg Per Week</span>
            </div>
            <h5>Noticeable Weight Loss</h5>
          </div>
        </div>
        <p>
          Your doctor will prescribe you a custom dose based on your medical
          history and health after your consultation.
        </p>
      </div>
      <div className="compounded_ineer_sec">
        <h4>COMPOUNDED TIRZEPATIDE DOSING SCHEDULE:</h4>
        <div className="compounded_ineer_sec_graypart">
          <div>
            <div>
              <h5>WEEKS 1-4 (Beginner Dose)</h5>
              <span>2.5mg Per Week</span>
            </div>
            <h5>Feeling Fuller, Longer</h5>
          </div>
          <div>
            <div>
              <h5>WEEKS 5-8 (Intermediate Dose)</h5>
              <span>5.0 mg Per Week</span>
            </div>
            <h5>Better Appetite Control</h5>
          </div>
          <div>
            <div>
              <h5>
                WEEKS 9-12+ <br /> (Maintenance Dose)
              </h5>
              <span>7.5 mg Per Week</span>
            </div>
            <h5>Noticeable Weight Loss</h5>
          </div>
        </div>
        <p>
          Your doctor will prescribe you a custom dose based on your medical
          history and health after your consultation.
        </p>
      </div>
    </section>
  );
};

export default Compounded;
