import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

function PaymentButton() {
  const handlePayment = async () => {
    try {
      // Create order for entire cart
      const { data: order } = await axios.post(
        `${API_URL}/api/payments/create-order`,
        {},
        { withCredentials: true }
      );

      const options = {
        key: "rzp_test_RXnFCwiIuIU1L8",
        amount: order.amount,
        currency: order.currency,
        name: "LUXEMart",
        description: "Exclusive Purchase - Complete Payment",
        order_id: order.id,
        handler: async function (response) {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
          try {
            await axios.post(
              `${API_URL}/api/payments/verify`,
              {
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                signature: razorpay_signature,
              },
              { withCredentials: true }
            );

            toast.success("Payment successful!");
            window.location.href = `${API_URL}/api/payments/receipt/${razorpay_payment_id}`;
          } catch (err) {
            console.error(err?.response?.data || err.message);
            toast.error("Payment verification failed!");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#ec4899"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err?.response?.data || err.message);
      toast.error(err?.response?.data?.message || "Error creating order");
    }
  };

  return (
    <button 
      onClick={handlePayment} 
      className="w-full luxury-btn py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 text-lg"
    >
      <i className="ri-vip-diamond-line"></i>
      Proceed to Secure Payment
    </button>
  );
}

export default PaymentButton;