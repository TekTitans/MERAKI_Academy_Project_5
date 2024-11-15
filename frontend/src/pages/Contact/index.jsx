import React, { useState, useEffect } from "react";
import "./style.css";
import Alert from "react-bootstrap/Alert";

const Contact = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState({ message: "", type: "" });

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(false);
    };

    fetchData();
  }, [setIsLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {};

  return (
    <div className="contact-root-container">
      <section className="contact-hero-section">
        <h1>Get in Touch with Us</h1>
        <p>
          We’d love to hear from you. Reach out with any questions or comments!
        </p>
      </section>

      <section className="contact-form-section">
        <div className="contact-form-card">
          <h2>Contact Us</h2>
          <p>
            Please fill out the form below and we’ll get back to you as soon as
            possible.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>

          {submitStatus.message && (
            <Alert
              variant={submitStatus.type === "success" ? "success" : "danger"}
              className="alert"
            >
              {submitStatus.message}
            </Alert>
          )}
        </div>
      </section>
    </div>
  );
};

export default Contact;
