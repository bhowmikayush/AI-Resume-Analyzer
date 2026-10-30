 
const express = require("express");
const adminRouter = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const {
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
} = require("../controllers/admin.controller");

// Every route below requires login AND role === "admin".
adminRouter.use(authMiddleware.authUser, adminMiddleware);

adminRouter.get("/users", getAllUsersController);
adminRouter.get("/users/:userId", getUserByIdController);
adminRouter.patch("/users/:userId", updateUserController);
adminRouter.delete("/users/:userId", deleteUserController);

module.exports = adminRouter;
 