const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { model } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const createCheckoutSession = async (req, res) => {
   

    try {
        const { product } = req.body;
        if (!product) {
            return res.status(400).json({ error: "Product data is required" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: { 
                            name: product.title,
                            description: product.description
                        },
                        unit_amount: product.price * 100, 
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: process.env.SUCCESS_URI,
            cancel_url: process.env.CANCEL_URL,
            metadata: {
                tokenCount: product.tokenCount
            }
        });

        res.status(200).json({ id: session.id });
    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        res.status(500).json({ 
            error: "Unable to create Stripe checkout session",
            details: error.message 
        });
    }
};
  


module.exports = {createCheckoutSession};
