const express = require("express");
const {
  register,
  getUser,
  //   login,
  //   updatePassword,
  //   updateEmail,
  //   updatePhoneNumber,
  //   deleteAccount,
} = require("../controllers/userController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.post("/", authenticate, register);
router.get("/:email", authenticate, getUser);

module.exports = router;
