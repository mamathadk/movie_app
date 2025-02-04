const express = require("express");
const router = express.Router();
const usersControlller = require("../controllers/user.controller");
// Define routes for user authentication
router.post("/auth/signup", usersControlller.signUp);
router.post("/auth/login", usersControlller.login);
router.post("/auth/logout", usersControlller.logout);

router.post("/auth/coupons", usersControlller.getCouponCode);
router.get("/auth/coupons/:couponCode", usersControlller.getUserCoupons);
router.post("/auth/bookings", usersControlller.bookShow);
module.exports = router;
