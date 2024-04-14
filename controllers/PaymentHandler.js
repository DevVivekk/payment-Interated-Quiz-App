const { Cashfree } = require("cashfree-pg");
const crypto = require("crypto");
const paymentHandler = async (req, res) => {
    try {
        // Function to generate unique order ID
        async function generateOrderId() {
            const uniqueId = crypto.randomBytes(16).toString("hex");
            const hash = crypto.createHash('sha256');
            hash.update(uniqueId);
            const order_id = hash.digest("hex");
            return order_id.slice(0, 12);
        }

        var request = {
            "order_amount": 10,
            "order_currency": "INR",
            "order_id": await generateOrderId(),
            "customer_details": {
                "customer_id": "vivekbh",
                "customer_phone": "9999999999",
                "customer_email":"vivek@gmail.com"
            }
        };
        Cashfree.PGCreateOrder("2023-08-01", request).then((response) => {
            console.log('Order Created successfully:',response.data);res.send(response.data);
        }).catch((error) => {
            console.error('Error:', error.response.data.message);res.send(error.response.data.message)
        });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data.message : error.message);
        // Respond with error message
        res.status(500).json({ error: "Payment server error" });
    }
};
module.exports = paymentHandler;
