const { MercadoPagoConfig } = require("mercadopago");

const client = new MercadoPagoConfig({
  accessToken:
    "TEST-5498376668156447-111721-f31d95040d3700baa8a7ea36e0dd7e31-189974964",
});

exports.createOrder = async (req, res) => {
  res.send("creating order");
};

exports.successOrder = async (req, res) => res.send("Success order");

exports.webhook = async (req, res) => res.send("webhook");
