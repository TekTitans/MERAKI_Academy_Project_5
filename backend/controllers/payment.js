const stripe = require("stripe")("sk_test_51QPSRFEnC5NZk9CEFtfy9p6vHSbjvtSRXXW86JUXn1LOj3QJfLiloLrvDksqyvTol1BE2vndEvZCTUtZBWgiUnlt00QUvM0xXJ");



const makeAPayment= async (req, res) => {
  const { paymentMethodId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5000, 
      currency: "usd", 
      payment_method: paymentMethodId,
      confirm: true,
      confirmation_method: 'manual',

    });
    if (paymentIntent.status === 'requires_action' || paymentIntent.status === 'requires_source_action') {
      return res.send({
        requiresAction: true,
        paymentIntentClientSecret: paymentIntent.client_secret,
      });
    }

    res.json({ success: true, paymentIntent });
  } catch (error) {
    res.status(200).json("done" );
  }
};

module.exports = {makeAPayment};
