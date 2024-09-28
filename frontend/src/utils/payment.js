// import axios from "axios";
// import Razorpay from 'razorpay';

// export const handlePayNow = async (document) => {
//     const confirmPay = window.confirm(`Do you want to proceed with payment for ${document.title}?`);

//     if (confirmPay) {
//         try {
//             const response = await axios.post(`http://localhost:8000/create-order/`);

//             const { orderId, amount } = response.data;

//             const options = {
//                 key: "rzp_test_FQzlH7whPNyTpw", // Your Razorpay key
//                 amount: amount, // Amount in paise (e.g., 100 = ₹1)
//                 currency: "INR",
//                 name: "PrimeTransfer",
//                 description: `Payment for ${document.title}`,
//                 order_id: orderId,
//                 handler: function (response) {
//                     alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
//                 },
//                 theme: {
//                     color: "#F37254",
//                 },
                
//             };

//             // Create an instance of Razorpay and open the payment modal
//             const razorpay = new Razorpay(options);
//             razorpay.open();
//         } catch (error) {
//             console.error("Error initiating payment:", error);
//         }
//     }
// };
