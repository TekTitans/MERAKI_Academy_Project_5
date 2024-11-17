import React, { useState, useEffect } from "react";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";

const AboutPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(false);
    };

    fetchData();

    return () => {
      setIsLoading(false);
    };
  }, [setIsLoading]);

  return (
    <body class="about-page">
      <div className={`about-container`}>
        <section className="hero-section text-center ">
          <h1 className="display-3">Welcome to Our E-Commerce Platform</h1>
          <p className="lead">
            Your one-stop destination for buying and selling products online.
          </p>
        </section>

        <section className="features-section">
          <div className="feature_container">
            <h2 className="text-center mb-4">Why Choose Our Platform?</h2>
            <div className="row">
              <div className="col-md-4 text-center">
                <div className="feature-box">
                  <h4>For Customers</h4>
                  <p>
                    Browse a wide selection of high-quality products, secure
                    payments, and fast delivery.
                  </p>
                </div>
              </div>
              <div className="col-md-4 text-center">
                <div className="feature-box">
                  <h4>For Sellers</h4>
                  <p>
                    Easy product listing, manage inventory, and reach a wide
                    audience of potential customers.
                  </p>
                </div>
              </div>
              <div className="col-md-4 text-center">
                <div className="feature-box">
                  <h4>Customer Support</h4>
                  <p>
                    Our dedicated team is here to assist you with any questions,
                    concerns, or issues.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mission-section">
          <div className="feature_container">
            <h2 className="text-center mb-4">Our Mission</h2>
            <p className="lead text-center">
              We believe in creating a platform that benefits both buyers and
              sellers. Our mission is to provide a seamless and secure
              experience for everyone. Whether you're a customer looking for the
              best deals or a seller seeking to expand your business, we are
              here to make your journey smoother.
            </p>
          </div>
        </section>

        <section className="join-us-section">
          <div className="join_container text-center">
            <h2>Join Our Platform Today</h2>
            <p>
              Whether you're a customer searching for great deals or a seller
              wanting to showcase your products, we invite you to join us today
              and be part of a growing community.
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </section>
      </div>
    </body>
  );
};

export default AboutPage;
