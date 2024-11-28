import React, { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import "./CheckoutForm.css";

const CheckoutForm = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.log("[error]", error);
      setIsProcessing(false);
      return;
    }

    try {
      const response = await axios.post("/http://localhost:5000/pay", {
        paymentMethodId: paymentMethod.id,
      });

      if (response.data.error) {
        console.log("Payment Error", response.data.error);
      } else {
        console.log("Payment Success", response.data);
      }
    } catch (error) {
      console.log("Request Error", error);
    }

    setIsProcessing(false);
  };

  return (
    <div className="checkout-container">
      <h2>Enter Card Details</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="card-element-container">
          <CardElement className="card-element" />
        </div>
        <button
          disabled={!stripe || isProcessing}
          type="submit"
          className="submit-btn"
        >
          {isProcessing ? "Processing..." : "Complete Payment"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
