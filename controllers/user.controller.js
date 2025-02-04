// Importing the necessary modules
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid"); // To generate UUIDs
const bcrypt = require("bcryptjs");
const b2a = require("b2a");
const User = require("../models/user.model"); // Assuming User schema is defined in models/User.js
const tokenSecret = crypto.randomBytes(64).toString("hex");

const signUp = async (req, res) => {
  try {
    const { first_name, last_name, email_address, mobile_number, password } =
      req.body;

    let user = await User.findOne({ email: email_address });
    if (user) return res.status(400).json({ message: "user exists" });

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    // Generate the username by combining first and last name
    const username = `${first_name}${last_name}`;

    const uuid = uuidv4();
    console.log("Generated UUID:", uuid);

    console.log("User Data:", {
      first_name,
      last_name,
      email_address,
      mobile_number,
      hashpassword,
      uuid,
    });

    const newUser = new User({
      first_name,
      last_name,
      username,
      email: email_address,
      contact: mobile_number,
      password: hashpassword,
      role: "user", // Default role can be user or as per requirement
      uuid: uuid,
      accesstoken: " ",
      isLoggedIn: false,
      coupens: [],
      bookingRequests: [],
    });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, tokenSecret, {
      expiresIn: "2h",
    });

    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
      token,
      uuid,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating user" });
  }
};

const login = async (req, res) => {
  try {
    let authorization = req.headers.authorization;
    let userdetail = b2a.atob(authorization.split(" ")[1]);
    const email = userdetail.split(":")[0];
    const password = userdetail.split(":")[1];
    //const { username, password } = req.header;

    // Find the user by username
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ message: "invalid user" });

    const token = jwt.sign({ id: user._id }, tokenSecret, { expiresIn: "2h" });
    //const uuid=user.uuid;
    user.isLoggedIn = true;
    await user.save();
    return res.status(200).json({
      message: "Login successful",
      token,
      uuid: user.uuid,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error during login" });
  }
};

const logout = async (req, res) => {
  try {
    const { username } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Mark the user as logged out
    user.isLoggedIn = false;
    //user.uuid = '';
    //user.accessToken = '';
    req.token = " ";
    req.accesstoken = " ";
    user.token = " ";
    // Save the updated user session
    await user.save();

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error during logout" });
  }
};

const getCouponCode = async (req, res) => {
  try {
    const { uuid, discountValue } = req.body;

    if (!uuid || discountValue === undefined) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const user = await User.findOne({ uuid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a 4-digit coupon ID
    const generateCouponId = () => Math.floor(1000 + Math.random() * 9000);

    const newCoupon = {
      id: generateCouponId(),
      discountValue,
    };

    user.coupens.push(newCoupon);
    await user.save();

    return res.status(201).json({
      message: "Coupon added and retrieved successfully",
      coupons: user.coupons,
    });
  } catch (error) {
    console.error("Error in getCouponCode:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserCoupons = async (req, res) => {
  try {
    ///const { code } = req.query;
    const { couponCode } = req.params;
    if (!couponCode) {
      return res.status(400).json({ message: "Coupon code is required" });
    }

    const user = await User.findOne({ "coupens.id": parseInt(couponCode) });

    if (!user) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    const coupon = await user.coupens.find(
      (coupon) => coupon.id === parseInt(couponCode)
    );

    // Access and return the coupons array
    if (coupon) {
      return res.status(200).json({
        message: "Coupon retrieved successfully",
        coupon,
      });
    }

    return res.status(404).json({ message: "Coupon not found" });
  } catch (error) {
    console.error("Error retrieving user coupons:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const bookShow = async (req, res) => {
  try {
    console.log("Received request:", req.body);

    const { uuid, bookingRequest } = req.body;
    const { show_id, tickets, coupon_code } = bookingRequest;
    // const { uuid, show_id, tickets, coupon_code } = req.body;

    if (!uuid || !show_id || !tickets || !Array.isArray(tickets)) {
      return res.status(400).json({ message: "Invalid requst parameters" });
    }

    const user = await User.findOne({ uuid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let discountValue = 0;
    if (coupon_code) {
      let coupon = user.coupens.find((c) => c.id === Number(coupon_code));

      if (!coupon) {
        // Add new coupon with the given ID and discount value
        coupon = {
          id: Number(coupon_code),
          discountValue: Number(coupon_code),
        };
        user.coupens.push(coupon);
      }

      discountValue = coupon.discountValue;
    }

    const reference_number = Math.floor(100000 + Math.random() * 900000);

    user.bookingRequests.push({
      reference_number,
      coupon_code,
      show_id,
      tickets,
    });

    await user.save();

    return res.status(201).json({
      message: "Booking successful",
      bookingDetails: {
        reference_number,
        show_id,
        tickets,
        discountApplied: discountValue,
      },
    });
  } catch (error) {
    console.error("Error in bookShow:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  signUp,
  login,
  logout,
  getCouponCode,
  getUserCoupons,
  bookShow,
};
