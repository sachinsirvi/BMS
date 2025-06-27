import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { message as antdMessage } from 'antd';

const StripeCheckoutForm = ({ clientSecret, onBookingSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      redirect: 'if_required',
    });
    const transactionId = paymentIntent?.id;

    if (error) {
      setMessage(error.message);
      antdMessage.error(error.message);
    } else if (paymentIntent?.status === 'succeeded') {
      setMessage('Payment succeeded!');
      antdMessage.success('Payment successful!');
      onBookingSuccess(transactionId); // Pass transaction ID to BookShow component
    } else {
      setMessage('Unexpected issue. Try again.');
      antdMessage.error('Unexpected error during payment');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || !elements}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#1890ff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor : 'pointer',
          width: '100%',
        }}
      >
      Pay Now
      </button>
      {message && <div style={{ marginTop: '10px', color: 'red' }}>{message}</div>}
    </form>
  );
};

export default StripeCheckoutForm;
