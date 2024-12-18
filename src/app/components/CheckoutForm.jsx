"use client";

import React from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  LinkAuthenticationElement,
  AddressElement,
} from "@stripe/react-stripe-js";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://example.com/order/123/complete",
      },
    });

    if (error) {
      console.error("Payment error:", error.message);
      // Handle error here
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Contact info</h3>
      <LinkAuthenticationElement />
      <h3>Shipping</h3>
      <AddressElement
        options={{ mode: "shipping", allowedCountries: ["US"] }}
      />
      <h3>Payment</h3>
      <PaymentElement />
      <button type="submit" disabled={!stripe || !elements}>
        Submit
      </button>
    </form>
  );
}
