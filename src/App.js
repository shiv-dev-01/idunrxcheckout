import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Checkout2,
  ErrorPage,
  // FlowPage,
  PaymentGetways,
  ProductPage,
  SuccessPage,
  TreatementSelection,
  UpdatePayment,
  WeightLoss,
} from "./pages";
import { Footer, Navbar } from "./common";
import NewPage from "./pages/NewPage";
import NewThankyouPage from "./pages/NewThankyouPage";
import ImpactTracking from "./components/ImpactTracking";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <ImpactTracking />
        {/* <Navbar /> */}

        <Routes>
          {/* <Route path="/" element={<WeightLoss />} />
          <Route path="/ProductPage" element={<ProductPage />} />
          <Route path="/PaymentGetways" element={<PaymentGetways />} />
          <Route path="/FlowPage" element={<FlowPage />} />
          <Route
          path="/TreatementSelection"
          element={<TreatementSelection />}
        /> */}
          <Route path="/SuccessPage" element={<SuccessPage />} />
          <Route path="/ErrorPage" element={<ErrorPage />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/" element={<Checkout2 />} />
          <Route path="/UpdatePayment/:id" element={<UpdatePayment />} />
          <Route path="/thankyou-page" element={<NewThankyouPage />} />

          {/* <Route path="/NewPage" element={<NewPage />} /> */}
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </>
  );
};

export default App;
