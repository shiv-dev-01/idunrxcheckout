import React, { useEffect, useState } from "react";
import "./ProductPage.css";
import Navbar from "../../common/navbar/Navbar";
import { ProductCard } from "../../components";
import axios from "axios";
import { products_url } from "../../utils/Constant";
import { Loading } from "../../common";
import { Link } from "react-router-dom";

const ProductPage = () => {
  const [data, setData] = useState([]);
  const [getloading, setLoading] = useState(false);

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
  }, []);

  if (getloading) {
    return <Loading />;
  }

  return (
    <div>
      <Navbar />
      <section className="section all_products_wrapp">
        {data && data.length > 0
          ? data.map((item, index) => {
              return (
                <>
                  <div className="product-card" key={item.product_id}>
                    <div className="product-info">
                      <h3
                        className="product-title"
                        style={{ fontWeight: "700", fontSize: "1rem" }}
                      >
                        {item.product_name}
                      </h3>
                      <p
                        className="product-description"
                        style={{ fontSize: "14px" }}
                      >
                        {item.product_description}
                      </p>
                      <div className="product-card-hr"></div>
                      <h2 className="product-price">${item.product_price}</h2>
                      <p className="product-subtext">
                        with {item.product_is_shippable} month shipment
                      </p>
                      <Link
                        // to={'/PaymentGetways',
                        //   state: {
                        //     product: item
                        //   }
                        // }
                        to="/PaymentGetways"
                        state={{ product: item }}
                        className="product-button"
                      >
                        CHECKOUT
                      </Link>
                    </div>
                    <div className="product-image-container">
                      <img
                        src={item.product_img[0]?.img_video}
                        alt="Valacyclovir Bottle"
                        className="product-image"
                      />
                    </div>
                  </div>
                </>
              );
            })
          : null}
      </section>
    </div>
  );
};

export default ProductPage;
