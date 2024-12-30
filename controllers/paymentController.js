const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
    try {
        const { product, userEmail } = req.body;
        
        if (!product) {
            return res.status(400).json({ error: "Product data is required" });
        }

        const { title, description, price, credits } = product || {};
        if (!title || !description || !price || !credits) {
            return res.status(400).json({ error: "All product fields are required" });
        }

        // Handle price validation
        const unitAmount = Math.round(parseFloat(price) * 100);
        if (isNaN(unitAmount) || unitAmount <= 0) {
            return res.status(400).json({ error: "Invalid price value" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: title,
                            description,
                        },
                        unit_amount: unitAmount,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
            customer_email: userEmail, 
            metadata: {
                credits,
                tokenCount: credits,
            },
        });

        res.status(200).json({ id: session.id });
    } catch (error) {
        console.error("Stripe Checkout Error:", error.stack || error.message);
        res.status(500).json({ 
            error: "Unable to create Stripe checkout session",
            details: error.message,
        });
    }
};


module.exports = { createCheckoutSession };
