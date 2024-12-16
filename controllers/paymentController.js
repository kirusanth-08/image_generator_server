const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { model } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const createCheckoutSession = async (req, res) => {
    console.log("hiihhiihihihihi")
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
                        unit_amount: product.price * 100, // Convert to cents
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
  

const paymentController = async (req, res) => {
    const { product, token } = req.body;
    const idempotencyKey = uuidv4();
    

    try {
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id,
        });

        const charge = await stripe.charges.create(
            {
                amount: product.price * 100,
                currency: 'usd',
                customer: customer.id,
                receipt_email: token.email,
                description: product.name,
            },
            { idempotencyKey }
        );

        res.status(200).json(charge);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Payment failed' });
    }
};

module.exports = { paymentController , createCheckoutSession};
