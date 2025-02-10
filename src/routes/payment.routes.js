const { Router } = require("express");
const paymentController = require("../controllers/paymentController.js");

const router = Router();

router.get("/create-order", paymentController.createOrder);

router.get("/success", paymentController.successOrder);

router.get("/webhook", paymentController.webhook);

module.exports = router;
