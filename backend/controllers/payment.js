const stripe = require("stripe")("sk_test_51QPSRFEnC5NZk9CEFtfy9p6vHSbjvtSRXXW86JUXn1LOj3QJfLiloLrvDksqyvTol1BE2vndEvZCTUtZBWgiUnlt00QUvM0xXJ");



const makeAPayment= async (req, res) => {
  const { paymentMethodId } = req.body;

  try {
    // إنشاء الدفع باستخدام paymentMethodId
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5000, // المبلغ بالدولار سنت
      currency: "usd", // العملة
      payment_method: paymentMethodId,
      confirm: true,
    });

    res.json({ success: true, paymentIntent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {makeAPayment};
